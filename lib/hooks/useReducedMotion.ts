"use client";

import { useEffect, useState } from "react";

/**
 * Reactively tracks the user's `prefers-reduced-motion` setting.
 * Returns `true` when motion should be minimized - gate heavy
 * animations/3D on this.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
