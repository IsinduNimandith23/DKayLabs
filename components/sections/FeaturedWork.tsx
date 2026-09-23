"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import RollText from "@/components/ui/RollText";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { PRODUCTS, PROJECTS, SERVICES, type IconKey } from "@/lib/constants";
import { serviceSlug } from "@/lib/services";

/** A piece of work filed in a service's folder - or an empty slot for yours. */
type Sheet =
  | { kind: "work"; title: string; label: string; image?: string; icon?: IconKey }
  | { kind: "invite" };

/** One card in the showcase - a service's folder, with its work filed inside. */
type Showcase = {
  service: string;
  icon: IconKey;
  /** Always three: the service's own work first, then open slots. */
  sheets: Sheet[];
  /** How many of `sheets` are real work. */
  count: number;
  comingSoon: boolean;
  /** The portfolio, pre-filtered to this service. */
  href: string;
};

const SHEET_COUNT = 3;

/** Client projects under the service, plus its in-house product if any. */
function workFor(s: (typeof SERVICES)[number]): Sheet[] {
  const work: Sheet[] = PROJECTS.filter((p) => p.service === s.title).map((p) => ({
    kind: "work",
    title: p.title,
    label: p.category,
    image: p.image,
  }));
  const product = PRODUCTS.find((p) => p.slug === s.featuredProduct);
  if (product) work.push({ kind: "work", title: product.name, label: product.tagline, icon: product.icon });
  return work.slice(0, SHEET_COUNT);
}

/** One folder per service, opening onto that service's filter on /portfolio. */
const SHOWCASE: Showcase[] = SERVICES.map((s) => {
  const work = workFor(s);
  return {
    service: s.title,
    icon: s.icon,
    sheets: [...work, ...Array.from({ length: SHEET_COUNT - work.length }, () => ({ kind: "invite" }) as const)],
    count: work.length,
    comingSoon: s.status === "coming-soon",
    href: `/portfolio?service=${serviceSlug(s.title)}`,
  };
});

/*
 * Card geometry, in the inner panel's own 376 x 356 box. The dark body rises
 * into a tab on the left - the title's seat - then steps down to the right
 * over a soft slope, like a file folder laid over the artwork. The SVG keeps
 * its aspect (the card does too), so the curves never stretch.
 */
const PANEL_PATH =
  "M0 140Q0 120 20 120H186C198 120 204 123 211 130L228 147C234 153 240 156 250 156H356Q376 156 376 176V356H0Z";

/*
 * Each sheet's two poses, front to back. All three share one box - a wide
 * slot at the screenshots' native ~19:9 - and are told apart by transform
 * alone. At rest they stack straight back inside the folder, each one
 * smaller and higher so its top edge shows over the one in front; on hover
 * the two behind lift out past the top of the card
 * and fan to either side while the front one rises a touch. Translates are in
 * the sheet's own size, and every pose keeps its bottom edge behind the sheet
 * in front or the folder panel.
 */
const SHEETS = [
  { rest: "translate(0,0)", lift: "translate(0,-12%)", delay: "0ms" },
  { rest: "translate(0,-12%) scale(0.94)", lift: "translate(3%,-44%) rotate(4deg) scale(0.9)", delay: "50ms" },
  { rest: "translate(0,-24%) scale(0.88)", lift: "translate(-3%,-74%) rotate(-4deg) scale(0.82)", delay: "100ms" },
] as const;

/** One filed sheet: a project screenshot, a product, or an open slot. */
function SheetFace({ sheet }: { sheet: Sheet }) {
  if (sheet.kind === "invite") {
    return (
      <span className="absolute inset-0 flex items-center justify-center rounded-[inherit] border border-dashed border-ink/25 bg-surface text-ink/35">
        <span className="font-machina text-[8cqw] font-extralight leading-none">+</span>
      </span>
    );
  }
  if (sheet.image) {
    return <Image src={sheet.image} alt="" fill sizes="(max-width: 640px) 290px, 340px" className="object-cover object-top" />;
  }
  return (
    <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/40 via-primary/15 to-surface text-primary">
      {sheet.icon && <ServiceIcon icon={sheet.icon} size={28} />}
    </span>
  );
}

/**
 * Folder-tab showcase card. Sized by its parent; everything inside scales
 * with it through container-query units, so it holds the same proportions at
 * every breakpoint.
 *
 * Built in three layers so the filed sheets sit between them: the folder
 * back, the sheets, then the folder front (panel, text, button). Only the
 * back and front clip to the rounded box - the sheets are free to rise out
 * over the top of the card.
 */
function ShowcaseCard({ item, active }: { item: Showcase; active: boolean }) {
  return (
    <div className="group relative h-full w-full rounded-[1.75rem] border border-ink/10 bg-surface p-[1.75%] shadow-bevel [container-type:inline-size]">
      <div className="relative h-full w-full">
        <div className="absolute inset-0 overflow-hidden rounded-[1.375rem] bg-gradient-to-b from-ink/[0.07] via-sunken to-sunken" />

        {item.sheets.map((sheet, i) => {
          const s = SHEETS[i];
          return (
            <div
              key={i}
              aria-hidden
              style={
                {
                  zIndex: SHEET_COUNT - i,
                  "--rest": s.rest,
                  "--lift": s.lift,
                  transitionDelay: s.delay,
                } as CSSProperties
              }
              className={`absolute left-[3%] top-[12%] aspect-[19/9] w-[94%] overflow-hidden rounded-[2.6cqw] bg-sunken ring-1 ring-ink/10 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.6)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform:var(--rest)] motion-reduce:transition-none ${
                active ? "group-hover:[transform:var(--lift)]" : ""
              }`}
            >
              <SheetFace sheet={sheet} />
            </div>
          );
        })}

        <div className="absolute inset-0 z-10 overflow-hidden rounded-[1.375rem]">
          <svg viewBox="0 0 376 356" className="absolute inset-0 h-full w-full fill-base" aria-hidden>
            <path d={PANEL_PATH} />
          </svg>

          {/* Wraps rather than truncates. The width stops at the tab's flat top
              (x 186 of 376 = 49.5%), so the first line never runs out over the
              sheets; a second line drops into the full-width body below. */}
          <h3 className="absolute left-[7.5%] top-[37%] line-clamp-2 max-w-[42%] break-words font-machina text-[5cqw] font-bold leading-[1.1] text-ink">
            {item.service}
          </h3>

          <p className="absolute bottom-[7%] left-[7.5%] flex max-w-[60%] items-baseline gap-[2cqw] font-machina leading-none text-ink">
            {item.count > 0 ? (
              <>
                <span className="text-[11cqw] font-medium">{item.count}</span>
                <span className="text-[3.6cqw] text-ink/55">{item.count === 1 ? "Project" : "Projects"}</span>
              </>
            ) : (
              <span className="text-[4.4cqw] text-ink/85">{item.comingSoon ? "Coming Soon" : "Yours Next?"}</span>
            )}
          </p>

          <span
            className={`absolute bottom-[6%] right-[6%] aspect-square w-[13.5%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              active ? "group-hover:rotate-45 group-hover:scale-110" : ""
            }`}
          >
            <Image src="/button.png" alt="" fill sizes="56px" />
          </span>
        </div>
      </div>
    </div>
  );
}

/** Shortest signed distance from `active` to `i` around a ring of `n`. */
function ringOffset(i: number, active: number, n: number) {
  let d = (i - active) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

/**
 * Fan pose for a card `d` places from centre. Past +-2 cards are hidden.
 * `compact` (phones) packs the neighbours in tighter so they peek in from the
 * screen edges, and drops the outer pair, which would land fully off-screen.
 */
function pose(d: number, compact: boolean) {
  const a = Math.abs(d);
  return {
    x: `${d * (compact ? 40 : 62)}%`,
    y: `${a * a * (compact ? 3 : 3.5)}%`,
    rotateZ: d * (compact ? 6 : 7),
    rotateY: -d * (compact ? 20 : 16),
    scale: 1 - a * (compact ? 0.12 : 0.08),
    opacity: a > (compact ? 1 : 2) ? 0 : 1,
    // Same function list at every step so framer can tween between them.
    filter: `brightness(${[1, 0.7, 0.32][Math.min(a, 2)]}) blur(${[0, 0.15, 0.8][Math.min(a, 2)]}px)`,
  };
}

const AUTOPLAY_MS = 5000;

/**
 * "Proof Of Concept" - one card per service, fanned in 3D around the one in
 * focus. Side cards are clickable to bring them forward; the stage also
 * takes a swipe/drag and the arrow keys, and rotates on its own while it's in
 * view and nobody is interacting with it.
 */
export default function FeaturedWork() {
  const n = SHOWCASE.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.4 });
  // A pan ends in a click on whatever card is under the pointer - swallow it.
  const dragged = useRef(false);

  // Width only - unlike useIsMobile, a touch tablet should keep the full fan.
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const go =useCallback((step: number) => setActive((a) => (a + step + n) % n), [n]);

  // Re-armed on every change, so a manual step restarts the countdown.
  useEffect(() => {
    if (reduced || paused || !inView) return;
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, reduced, paused, inView, go]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
    else return;
    e.preventDefault();
  };

  return (
    <section className="relative overflow-x-clip py-20 sm:py-36">
      <div className="relative">
        <h2 className="px-6 text-center font-machina text-[length:clamp(2rem,8.5vw,5.5rem)] leading-none tracking-[-0.02em]">
          <WordReveal text="Proof" className="font-extralight text-ink" />
          <WordReveal text="Of" className="font-medium text-ink" delay={0.1} />
          <WordReveal text="Concept" className="font-black text-primary" delay={0.2} />
        </h2>

        <Reveal delay={0.15}>
          <motion.div
            ref={stageRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Work by service"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onPanStart={() => (dragged.current = true)}
            onPanEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 40) go(info.offset.x < 0 ? 1 : -1);
              // Let the trailing click see the flag, then clear it.
              window.setTimeout(() => (dragged.current = false), 0);
            }}
            className="relative mx-auto mt-12 aspect-[400/380] w-[72vw] max-w-[290px] cursor-grab touch-pan-y select-none outline-none [perspective:1400px] active:cursor-grabbing sm:mt-20 sm:w-[290px] lg:w-[340px] lg:max-w-[340px]"
          >
            {SHOWCASE.map((item, i) => {
              const d = ringOffset(i, active, n);
              const isActive = d === 0;
              const hidden = Math.abs(d) > (compact ? 1 : 2);

              return (
                <motion.a
                  key={item.service}
                  href={item.href}
                  draggable={false}
                  aria-hidden={hidden || undefined}
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`${item.service} - view projects`}
                  data-cursor={isActive ? "View" : undefined}
                  onClick={(e) => {
                    if (dragged.current || !isActive) e.preventDefault();
                    if (!dragged.current && !isActive) setActive(i);
                  }}
                  initial={false}
                  animate={pose(d, compact)}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 26, mass: 0.9 }}
                  style={{ zIndex: 10 - Math.abs(d), pointerEvents: hidden ? "none" : "auto" }}
                  className="absolute inset-0 block rounded-[1.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <ShowcaseCard item={item} active={isActive} />
                </motion.a>
              );
            })}
          </motion.div>
        </Reveal>

        <p aria-live="polite" className="sr-only">
          {`${SHOWCASE[active].service}, ${active + 1} of ${n}`}
        </p>

        {/* Room for the lowered outer cards before the link - less on
            phones, where only the near neighbours show. */}
        <div className="mt-12 flex items-center justify-center px-6 sm:mt-24">
          <Link
            href="/portfolio"
            className="inline-flex items-center rounded-full border-2 border-ink/80 px-6 py-3 font-machina text-sm font-bold text-ink transition-all duration-300 hover:border-primary hover:bg-primary hover:text-on-primary hover:shadow-glow"
          >
            <RollText>Wanna See More?</RollText>
          </Link>
        </div>
      </div>
    </section>
  );
}
