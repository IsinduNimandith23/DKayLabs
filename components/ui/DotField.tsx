"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Full-bleed interactive halftone field.
 *
 * A port of the dot-matrix canvas in op.al's footer, decompiled from their
 * production bundle (`/_next/static/chunks/0t--kh~gs~nhp.js`) rather than
 * reverse-engineered by eye. Every constant in the FEEL block below is theirs
 * verbatim - those numbers are what make the trail read the way it does, so
 * they are quoted, not guessed.
 *
 * Two things differ from the original, both forced by the setting:
 *
 * 1. op.al masks the field to a wordmark (it rasterises an SVG and keeps only
 *    the cells whose centre pixel is opaque). Here the field is FULL-BLEED, so
 *    the cell count is ~18,700 at 1920x1080 instead of their ~8,000. 18,700
 *    `fillText` calls per frame will not hold 60fps, hence the base-layer +
 *    dirty-rect + glyph-atlas architecture described at `frame()`.
 *
 * 2. op.al listens on the canvas itself. This canvas sits BEHIND a headline
 *    that covers most of the hero, so canvas-level listeners would kill the
 *    trail the moment the cursor crossed the type. Listeners go on `window`
 *    and coordinates are mapped through the canvas rect instead.
 *
 * Not ported (declined): op.al also spawns a rotating square/rect/circle/ovoid
 * every ~4s that drifts down the field forcing influence to 1 on contact.
 */

/* ---------------------------------------------------------------- feel ---
   op.al's numbers. Change these to retune; everything else is mechanism. */

/** Density ramp, coldest to hottest. U+00B7, U+25E6, U+2022, U+25CF. */
const GLYPHS = ["·", "◦", "•", "●"] as const;

/** Influence at which a cell steps up to the next glyph. */
const T_WARM = 0.7; // -> ●
const T_COOL = 0.35; // -> •
const T_FAINT = 0.12; // -> ◦
/** Below this a cell is indistinguishable from rest, so it is dropped. */
const T_MIN = 0.02;

const DECAY_S = 3.2; // influence 1 -> 0, linear. The length of the trail.
const POINTER_SMOOTH = 7; // g += (p - g) * (1 - exp(-k*dt))
const VEL_KEEP = 0.82; // velocity EMA, retained fraction
const VEL_MIX = 0.18; // velocity EMA, new fraction
const VEL_DECAY = 3; // v *= exp(-k*dt) once the pointer goes quiet
const IDLE_S = 0.04; // "quiet" threshold

/** sigma = min(MAX, BASE + SPEED * |v|) * cell - the reveal grows with speed.
 *  op.al runs 3 -> 10 cells; ours is ~30% tighter. Saturates at
 *  (7-2)/0.012 = 417 px/s, i.e. below any real mouse movement, so in practice
 *  this reads as 2 cells at rest and 7 the moment you move. */
const SIGMA_BASE = 2;
const SIGMA_SPEED = 0.012;
const SIGMA_MAX = 7;

const MAX_DT = 0.1; // frame clamp, so a stalled tab does not jump the trail

/* ------------------------------------------------------------- chosen ---
   Ours, not op.al's. */

/**
 * Cell size, and with it the grain of the whole thing. op.al computes
 *   cell = max(4, round(0.06 * imgH * 0.15))   with imgH = width / 2.1009
 * which reduces to max(4, round(width * 0.0042839)) - 8px across their 1856px
 * footer. Driven off WIDTH, not the short side: keying it to min(w,h) makes a
 * tall phone viewport come out far denser than a desktop one.
 */
const CELL_RATIO = 0.0042839;
const CELL_MIN = 4;

/**
 * One grey per step of the ramp, coldest to hottest. op.al uses a single flat
 * grey; here the resting field (·) is pushed right down toward the ground so
 * it reads as texture, and the cursor trail only climbs a few steps above it
 * (well short of op.al's #777), so the whole field stays quiet behind the copy.
 * Dark ground is #131313, light is #f2f0ef.
 */
const RAMP_DARK = ["#242424", "#2e2e2e", "#3b3b3b", "#4a4a4a"] as const;
const RAMP_LIGHT = ["#e0dedd", "#d4d2d1", "#c6c4c3", "#b6b4b3"] as const;

/** Set to a palette token to tint from the brand instead of op.al's neutral -
 *  "--c-primary" for orange, "--c-ink" to follow the text colour. */
const TINT_TOKEN: string | null = null;
const TINT_ALPHA = 0.45; // what #777 works out to over #131313

/** Scroll handoff. Both are written to `style`, never into the draw. */
const PARALLAX = 0.12; // canvas lags the page by this fraction of scroll
const FADE_END = 0.85; // opacity hits 0 at this fraction of hero height

/** 3x Windows panels would otherwise triple the blit area for no gain. */
const MAX_DPR = 2;

const FONT_STACK =
  '"Helvetica Neue", Helvetica, Arial, "Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2", sans-serif';

/* -------------------------------------------------------------------- */

/**
 * Theme tokens in globals.css are bare `R G B` triplets ("19 19 19") so
 * Tailwind's <alpha-value> slot works - they are NOT valid CSS colours and
 * cannot be handed to fillStyle as-is.
 */
function readToken(
  name: string,
  fallback: [number, number, number],
): [number, number, number] {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const parts = raw.split(/[\s,/]+/).slice(0, 3).map(Number);
  if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
    return parts as [number, number, number];
  }
  return fallback;
}

export default function DotField({
  className = "",
  scrollHandoff = true,
}: {
  className?: string;
  /** Parallax + fade out as the parent scrolls away. Turn off for a
   *  position:fixed field that stays behind the whole page. */
  scrollHandoff?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* The resting field: every cell as its coldest glyph, rendered once per
       resize. Each frame blits back from this instead of re-drawing 18,700
       glyphs, so per-frame cost is proportional to the lit area, not the
       canvas area. */
    const base = document.createElement("canvas");
    const baseCtx = base.getContext("2d");

    /* The four glyphs pre-rasterised into one strip. drawImage from this beats
       fillText per cell by a wide margin - no text shaping in the hot loop. */
    const atlas = document.createElement("canvas");
    const atlasCtx = atlas.getContext("2d", { willReadFrequently: true });

    if (!baseCtx || !atlasCtx) return;

    let dpr = 1;
    let cssW = 0;
    let cssH = 0;
    let cell = CELL_MIN;
    let cols = 0;
    let rows = 0;
    let ox = 0; // grid origin, centred on the leftover remainder
    let oy = 0;
    let tileDev = 0; // atlas tile size in device px
    let tileCss = 0; // ...as requested in CSS px
    let tileDraw = 0; // ...and what it actually maps back to, exactly 1:1

    let isDark = false;

    /** cell index -> influence. Entries are deleted at T_MIN, so iteration is
     *  O(lit cells), unlike op.al's map which only ever grows. */
    const active = new Map<number, number>();

    const pointer = { cx: 0, cy: 0, x: 0, y: 0, live: false, seen: false };
    const smooth = { x: 0, y: 0, init: false };
    const vel = { x: 0, y: 0 };
    let lastMoveT = 0;

    /* Cells drawn last frame must be blitted back over before this frame's are
       drawn, or the trail smears. Tracked as a single union rect. */
    let prevX0 = 0;
    let prevY0 = 0;
    let prevX1 = 0;
    let prevY1 = 0;
    let prevAny = false;

    const drawKeys: number[] = [];
    const drawGlyph: number[] = [];

    /* --------------------------------------------------------- atlas --- */

    function buildAtlas() {
      if (!atlasCtx) return;

      let fills: readonly string[];
      if (TINT_TOKEN) {
        const [r, g, b] = readToken(TINT_TOKEN, [19, 19, 19]);
        fills = GLYPHS.map(() => `rgba(${r}, ${g}, ${b}, ${TINT_ALPHA})`);
      } else {
        fills = isDark ? RAMP_DARK : RAMP_LIGHT;
      }

      const fontCss = Math.max(6, Math.round(1.1 * cell));
      tileCss = Math.max(4, Math.ceil(cell * 2));
      tileDev = Math.max(4, Math.round(tileCss * dpr));
      tileDraw = tileDev / dpr;

      atlas.width = tileDev * GLYPHS.length;
      atlas.height = tileDev;
      atlasCtx.setTransform(1, 0, 0, 1, 0, 0);
      atlasCtx.clearRect(0, 0, atlas.width, atlas.height);
      atlasCtx.textAlign = "center";
      atlasCtx.textBaseline = "middle";

      const fontDev = fontCss * dpr;
      atlasCtx.font = `700 ${fontDev}px ${FONT_STACK}`;

      /* U+25E6 is absent from Arial, which is what "Helvetica" resolves to on
         Windows. A missing glyph draws as tofu (visibly wrong) rather than
         nothing, so blankness alone will not catch it - compare the advance
         against a guaranteed-absent codepoint instead. The vector fallbacks
         below are sized off Helvetica's real metrics, so a false positive here
         is invisible either way. */
      const notdefW = atlasCtx.measureText("￿").width;

      for (let i = 0; i < GLYPHS.length; i++) {
        atlasCtx.fillStyle = fills[i];
        atlasCtx.strokeStyle = fills[i];
        const cx = i * tileDev + tileDev / 2;
        const cy = tileDev / 2;
        const advance = atlasCtx.measureText(GLYPHS[i]).width;
        const missing = advance === 0 || Math.abs(advance - notdefW) < 0.01;

        if (missing) {
          atlasCtx.beginPath();
          if (i === 1) {
            // ◦ - hollow ring, 0.38em outer with a 0.055em stroke
            const w = 0.055 * fontDev;
            atlasCtx.lineWidth = w;
            atlasCtx.arc(cx, cy, 0.19 * fontDev - w / 2, 0, Math.PI * 2);
            atlasCtx.stroke();
          } else {
            const r = (i === 0 ? 0.05 : i === 2 ? 0.115 : 0.28) * fontDev;
            atlasCtx.arc(cx, cy, r, 0, Math.PI * 2);
            atlasCtx.fill();
          }
        } else {
          atlasCtx.fillText(GLYPHS[i], cx, cy);
        }
      }
    }

    /* ---------------------------------------------------------- grid --- */

    /**
     * Cell centres land on fractional CSS px (the grid is centred on the
     * leftover remainder), which would resample every tile and leave the dots
     * soft. Snapping the destination to a whole device pixel keeps the blit
     * 1:1 - and because the base layer goes through this same function, the
     * resting and lit glyphs stay in exact register.
     */
    function blit(
      target: CanvasRenderingContext2D,
      glyph: number,
      x: number,
      y: number,
    ) {
      target.drawImage(
        atlas,
        glyph * tileDev,
        0,
        tileDev,
        tileDev,
        Math.round((x - tileDraw / 2) * dpr) / dpr,
        Math.round((y - tileDraw / 2) * dpr) / dpr,
        tileDraw,
        tileDraw,
      );
    }

    function rebuild() {
      if (!baseCtx) return;
      const rect = canvas!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      cssW = rect.width;
      cssH = rect.height;
      dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);

      canvas!.width = Math.round(cssW * dpr);
      canvas!.height = Math.round(cssH * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cell = Math.max(CELL_MIN, Math.round(cssW * CELL_RATIO));
      cols = Math.max(1, Math.floor(cssW / cell));
      rows = Math.max(1, Math.floor(cssH / cell));
      ox = (cssW - cols * cell) / 2;
      oy = (cssH - rows * cell) / 2;

      buildAtlas();

      base.width = canvas!.width;
      base.height = canvas!.height;
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      baseCtx.clearRect(0, 0, cssW, cssH);
      for (let r = 0; r < rows; r++) {
        const y = oy + (r + 0.5) * cell;
        for (let c = 0; c < cols; c++) {
          blit(baseCtx, 0, ox + (c + 0.5) * cell, y);
        }
      }

      active.clear();
      prevAny = false;
      paintBase(0, 0, cssW, cssH);
    }

    /**
     * Restores the resting field over a rect. Snapped to whole device pixels
     * on both sides so the blit is a straight copy with no resampling seam.
     *
     * The clearRect is load-bearing, not tidiness. drawImage composites under
     * the default source-over, and the base layer has a transparent ground, so
     * blitting it over a lit cell paints a faint · UNDER the bright ● that is
     * already there instead of replacing it. Without the clear the field only
     * ever accumulates: influence decays on schedule and the pixels never go
     * back. op.al sidesteps this by clearing the whole canvas every frame;
     * redrawing only the dirty rect means clearing only the dirty rect.
     */
    function paintBase(x0: number, y0: number, x1: number, y1: number) {
      const sx = Math.max(0, Math.floor(x0 * dpr));
      const sy = Math.max(0, Math.floor(y0 * dpr));
      const sw = Math.min(base.width, Math.ceil(x1 * dpr)) - sx;
      const sh = Math.min(base.height, Math.ceil(y1 * dpr)) - sy;
      if (sw <= 0 || sh <= 0) return;
      ctx!.clearRect(sx / dpr, sy / dpr, sw / dpr, sh / dpr);
      ctx!.drawImage(base, sx, sy, sw, sh, sx / dpr, sy / dpr, sw / dpr, sh / dpr);
    }

    /* -------------------------------------------------------- stamps --- */

    function raise(key: number, v: number) {
      const cur = active.get(key);
      if (cur === undefined || v > cur) active.set(key, v);
    }

    /** Gaussian disc under the cursor. exp(-d^2 / 2s^2), hard cutoff at 3s. */
    function stampCursor(px: number, py: number, sigma: number) {
      const cut = 3 * sigma;
      const cut2 = cut * cut;
      const denom = 2 * sigma * sigma;
      const c0 = Math.max(0, Math.floor((px - cut - ox) / cell));
      const c1 = Math.min(cols - 1, Math.ceil((px + cut - ox) / cell));
      const r0 = Math.max(0, Math.floor((py - cut - oy) / cell));
      const r1 = Math.min(rows - 1, Math.ceil((py + cut - oy) / cell));

      for (let r = r0; r <= r1; r++) {
        const dy = oy + (r + 0.5) * cell - py;
        const dy2 = dy * dy;
        const rowBase = r * cols;
        for (let c = c0; c <= c1; c++) {
          const dx = ox + (c + 0.5) * cell - px;
          const d2 = dx * dx + dy2;
          if (d2 > cut2) continue;
          const v = Math.exp(-d2 / denom);
          if (v > T_MIN) raise(rowBase + c, v);
        }
      }
    }

    /* --------------------------------------------------------- frame --- */

    let raf = 0;
    let prevT: number | null = null;

    function frame(t: number) {
      raf = requestAnimationFrame(frame);
      const dt = prevT === null ? 0 : Math.min(MAX_DT, (t - prevT) / 1000);
      prevT = t;
      if (!cols || !rows || !ctx) return;

      /* Both layout reads happen here, before any write, so the frame never
         thrashes. getBoundingClientRect already accounts for the parallax
         transform, which is why pointer mapping needs no correction for it. */
      const rect = canvas!.getBoundingClientRect();
      const host = scrollHandoff
        ? canvas!.parentElement?.getBoundingClientRect()
        : undefined;

      /* --- pointer ------------------------------------------------- */
      const inside =
        pointer.seen &&
        pointer.cx >= rect.left &&
        pointer.cx <= rect.right &&
        pointer.cy >= rect.top &&
        pointer.cy <= rect.bottom;

      pointer.live = inside;
      if (inside) {
        pointer.x = pointer.cx - rect.left;
        pointer.y = pointer.cy - rect.top;
        if (!smooth.init) {
          smooth.x = pointer.x;
          smooth.y = pointer.y;
          smooth.init = true;
        } else {
          const k = 1 - Math.exp(-POINTER_SMOOTH * dt);
          smooth.x += (pointer.x - smooth.x) * k;
          smooth.y += (pointer.y - smooth.y) * k;
        }
      } else {
        smooth.init = false;
      }

      const sinceMove = lastMoveT > 0 ? (t - lastMoveT) / 1000 : 999;
      if (!inside || sinceMove > IDLE_S) {
        const k = Math.exp(-VEL_DECAY * dt);
        vel.x *= k;
        vel.y *= k;
      }

      /* --- decay --------------------------------------------------- */
      const decay = dt / DECAY_S;
      for (const [key, v] of active) {
        const next = v - decay;
        if (next <= T_MIN) active.delete(key);
        else active.set(key, next);
      }

      /* --- paint influence ----------------------------------------- */
      if (inside && smooth.init) {
        const speed = Math.hypot(vel.x, vel.y);
        const sigma =
          Math.min(SIGMA_MAX, SIGMA_BASE + SIGMA_SPEED * speed) * cell;
        stampCursor(smooth.x, smooth.y, sigma);
      }

      /* --- resolve glyphs and this frame's dirty box ---------------- */
      let n = 0;
      let x0 = Infinity;
      let y0 = Infinity;
      let x1 = -Infinity;
      let y1 = -Infinity;

      for (const [key, v] of active) {
        // Below T_FAINT the cell is its resting glyph, which the base layer
        // already holds - nothing to draw, nothing to dirty.
        if (v < T_FAINT) continue;
        const c = key % cols;
        const r = (key - c) / cols;
        const x = ox + (c + 0.5) * cell;
        const y = oy + (r + 0.5) * cell;
        drawKeys[n] = key;
        drawGlyph[n] = v >= T_WARM ? 3 : v >= T_COOL ? 2 : 1;
        n++;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }

      const any = n > 0;
      if (any) {
        const half = tileDraw / 2 + 1;
        x0 -= half;
        y0 -= half;
        x1 += half;
        y1 += half;
      }

      /* --- redraw --------------------------------------------------- */
      if (any || prevAny) {
        // Union with last frame's box: those cells have to go back to rest.
        const bx0 = prevAny ? (any ? Math.min(x0, prevX0) : prevX0) : x0;
        const by0 = prevAny ? (any ? Math.min(y0, prevY0) : prevY0) : y0;
        const bx1 = prevAny ? (any ? Math.max(x1, prevX1) : prevX1) : x1;
        const by1 = prevAny ? (any ? Math.max(y1, prevY1) : prevY1) : y1;
        paintBase(bx0, by0, bx1, by1);

        for (let i = 0; i < n; i++) {
          const key = drawKeys[i];
          const c = key % cols;
          const r = (key - c) / cols;
          blit(ctx, drawGlyph[i], ox + (c + 0.5) * cell, oy + (r + 0.5) * cell);
        }
      }

      prevAny = any;
      prevX0 = x0;
      prevY0 = y0;
      prevX1 = x1;
      prevY1 = y1;

      /* --- scroll handoff, compositor only -------------------------- */
      if (host) {
        const scrolled = Math.max(0, -host.top);
        const fade = 1 - Math.min(1, scrolled / Math.max(1, host.height * FADE_END));
        canvas!.style.opacity = fade.toFixed(3);
        canvas!.style.transform = `translate3d(0, ${(scrolled * PARALLAX).toFixed(2)}px, 0)`;
      }
    }

    /* ------------------------------------------------------ listeners --- */

    function onMove(e: PointerEvent) {
      const now = performance.now();
      if (pointer.seen && lastMoveT > 0) {
        const step = Math.max(0.001, (now - lastMoveT) / 1000);
        vel.x = VEL_KEEP * vel.x + VEL_MIX * ((e.clientX - pointer.cx) / step);
        vel.y = VEL_KEEP * vel.y + VEL_MIX * ((e.clientY - pointer.cy) / step);
      }
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.seen = true;
      lastMoveT = now;
    }

    const ro = new ResizeObserver(() => rebuild());
    ro.observe(canvas);

    isDark = document.documentElement.classList.contains("dark");

    /* No next-themes, no context - ThemeToggle just flips `.dark` on <html>,
       so the only way to hear about it is to watch the attribute. */
    const mo = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains("dark");
      if (nowDark === isDark) return;
      isDark = nowDark;
      rebuild();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    rebuild();

    /* The global prefers-reduced-motion rule in globals.css cannot stop a rAF
       loop, so the gate has to be explicit. One static frame keeps the texture
       and drops every moving part. */
    if (reduced) {
      return () => {
        ro.disconnect();
        mo.disconnect();
      };
    }

    let listening = false;
    function listen(on: boolean) {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("pointermove", onMove, { passive: true });
      } else {
        window.removeEventListener("pointermove", onMove);
        pointer.seen = false;
        smooth.init = false;
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        listen(visible);
        if (visible) {
          if (!raf) {
            prevT = null;
            raf = requestAnimationFrame(frame);
          }
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      listen(false);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
    };
  }, [reduced, scrollHandoff]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none ${className}`}
    />
  );
}
