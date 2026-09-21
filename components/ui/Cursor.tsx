"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/*
 * Custom cursor, modelled on metalab.com's.
 *
 * One 96px box glued to the pointer, holding an SVG with two circles whose
 * radii animate between three states:
 *
 *   idle   - a small solid dot
 *   focus  - over anything clickable: an orange ring with a pin-point centre
 *   label  - over an element with `data-cursor="<word>"`: a large ring with
 *            that word sliding up inside it
 *
 * The dot is white on `mix-blend-mode: difference`, so it reads on the dark
 * hero and the light sections without per-section theming. The ring is its
 * own layer WITHOUT the blend, otherwise the brand orange would invert to
 * blue on light backgrounds.
 *
 * Only mounts for a fine, hovering pointer (mouse / trackpad). The native
 * cursor is hidden via `html.has-custom-cursor` (globals.css), and that class
 * is added only once the pointer has actually moved - so a touch or keyboard
 * user on a hybrid device never ends up with no cursor at all.
 */

const SIZE = 96;
// Radii in the 0-100 viewBox, same scale as the reference.
const R = { idle: 6, focus: 17, label: 48 } as const;

type CursorState = { kind: "idle" } | { kind: "focus" } | { kind: "label"; text: string };

const INTERACTIVE =
  'a, button, [role="button"], label, summary, select, input, textarea, [data-cursor]';

function stateFor(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return { kind: "idle" };
  const el = target.closest(INTERACTIVE);
  if (!el) return { kind: "idle" };
  const label = el.getAttribute("data-cursor");
  if (label) return { kind: "label", text: label };
  return { kind: "focus" };
}

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<CursorState>({ kind: "idle" });
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Mount only for a real mouse; follow the media query if that changes
  // (e.g. a tablet docking to a keyboard + trackpad).
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;

    // Position is written straight to the DOM - no React render per frame.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = ref.current;
      if (el) {
        el.style.transform = `translate3d(${e.clientX - SIZE / 2}px, ${e.clientY - SIZE / 2}px, 0)`;
      }
      root.classList.add("has-custom-cursor");
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const next = stateFor(e.target);
      setState((prev) =>
        prev.kind === next.kind &&
        (next.kind !== "label" || (prev.kind === "label" && prev.text === next.text))
          ? prev
          : next,
      );
    };
    const onLeave = () => setVisible(false);
    // A touch on a hybrid device hands control back to the native cursor.
    const onTouch = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      root.classList.remove("has-custom-cursor");
      setVisible(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onTouch, { passive: true });
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onTouch);
      window.removeEventListener("blur", onLeave);
      root.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  const ease = [0.215, 0.61, 0.355, 1] as const; // Power3.easeOut
  const t = { duration: reduced ? 0 : 0.3, ease };

  const dotR = state.kind === "idle" ? R.idle : state.kind === "focus" ? 1 : 0;
  const ringR = state.kind === "idle" ? 0 : state.kind === "focus" ? R.focus : R.label;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[300] grid place-items-center transition-opacity duration-300"
      style={{
        width: SIZE,
        height: SIZE,
        opacity: visible ? 1 : 0,
        transform: "translate3d(-200px, -200px, 0)",
      }}
    >
      {/* Ring - brand orange, no blend. */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        <motion.circle
          cx={50}
          cy={50}
          fill="transparent"
          strokeWidth={1}
          className="stroke-primary"
          initial={false}
          animate={{ r: ringR }}
          transition={t}
        />
      </svg>

      {/* Dot - white + difference, so it inverts against whatever is below. */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full mix-blend-difference"
      >
        <motion.circle
          cx={50}
          cy={50}
          fill="#fff"
          initial={false}
          animate={{ r: dotR }}
          transition={t}
        />
      </svg>

      {/* Label - slides up in, and up and out on exit. */}
      <span className="relative h-[1.1em] overflow-hidden text-sm font-medium leading-none text-primary">
        <AnimatePresence initial={false}>
          {state.kind === "label" && (
            <motion.span
              key={state.text}
              className="block whitespace-nowrap"
              initial={{ y: "110%" }}
              animate={{ y: 0, transition: { duration: reduced ? 0 : 0.45, ease } }}
              exit={{
                y: "-110%",
                position: "absolute",
                transition: { duration: reduced ? 0 : 0.225, ease },
              }}
            >
              {state.text}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </div>
  );
}
