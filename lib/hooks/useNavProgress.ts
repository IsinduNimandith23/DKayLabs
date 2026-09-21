"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/** Scroll distance ignored before the bar starts collapsing. */
const DEAD_ZONE = 50;
/** Distance over which it collapses - fully closed at DEAD_ZONE + SCRUB. */
const SCRUB = 350;

/* Reduced motion gets a hard snap instead of a scrub. The two thresholds
   are deliberately apart so a scroll hovering near the boundary can't
   flap the bar open and shut. */
const SNAP_IN = 220;
const SNAP_OUT = 160;

export type NavProgress = {
  /** 0 = full-bleed bar, 1 = collapsed capsule. */
  progress: MotionValue<number>;
  /** Set true to stop scroll from driving `progress` (menu open, transitions). */
  halted: React.MutableRefObject<boolean>;
  /** The progress this scroll offset maps to, honouring reduced motion. */
  targetFor: (y: number) => number;
  /** Current scroll offset, from Lenis when it's running. */
  readScroll: () => number;
};

/**
 * Drives the navbar's collapse from scroll position.
 *
 * The value is a MotionValue rather than state so the writer can push it
 * straight to a CSS variable on every frame without re-rendering React.
 */
export function useNavProgress(): NavProgress {
  const progress = useMotionValue(0);
  const halted = useRef(false);

  // Read through a ref: the scroll callbacks below are registered once, and
  // closing over `reduced` directly would freeze them on its first value.
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  const targetFor = useCallback(
    (y: number) => {
      if (reducedRef.current) {
        // Hold the current value inside the hysteresis band.
        return y > SNAP_IN ? 1 : y < SNAP_OUT ? 0 : progress.get();
      }
      const travelled = y > DEAD_ZONE ? y - DEAD_ZONE : 0;
      return Math.min(1, Math.max(0, travelled / SCRUB));
    },
    [progress],
  );

  /* Smooth path. useLenis registers into ReactLenis's own callback list,
     which runs inside its single rAF loop, so the write lands before paint
     in the same frame. It also fires once on registration, which seeds the
     value on mount. */
  const lenis = useLenis((instance) => {
    if (halted.current) return;
    progress.set(targetFor(instance.animatedScroll));
  }, []);

  /* Fallback for when there is no Lenis in the tree.
     This effect MUST be keyed on `lenis`, not []. useReducedMotion returns
     false on first render and only flips in an effect, so under reduced
     motion SmoothScroll mounts ReactLenis and then tears it down - `lenis`
     goes from an instance to undefined. Keyed on [], the fallback would
     attach only when Lenis never existed at all, and would silently do
     nothing in the real reduced-motion case. */
  useEffect(() => {
    if (lenis) return;

    const onScroll = () => {
      if (halted.current) return;
      progress.set(targetFor(window.scrollY));
    };

    onScroll(); // seed, since `scroll` only fires on change
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lenis, progress, targetFor]);

  const readScroll = useCallback(
    () => lenis?.animatedScroll ?? window.scrollY,
    [lenis],
  );

  return { progress, halted, targetFor, readScroll };
}
