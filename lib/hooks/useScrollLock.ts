"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * Freezes page scrolling while `locked`.
 *
 * Both halves are needed, because only one of the two scroll systems is
 * ever running: `lenis.stop()` covers the smooth path (it adds
 * `.lenis-stopped`, styled in globals.css), and the body overflow covers
 * the reduced-motion path where Lenis isn't mounted at all.
 *
 * The padding compensation mirrors the old ServiceModal. With `scrollbar-gutter:
 * stable` on <html> the gap is already 0, so it only does work on browsers
 * without that support.
 */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;

    // Measure before anything hides the scrollbar.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;

    lenis?.stop();
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      lenis?.start();
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked, lenis]);
}
