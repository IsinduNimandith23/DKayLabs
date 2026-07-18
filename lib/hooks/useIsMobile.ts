"use client";

import { useEffect, useState } from "react";

/**
 * True on small / coarse-pointer (touch) devices. Used to scale down
 * or disable the heavy 3D scene on phones & low-power hardware.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = `(max-width: ${breakpoint}px), (pointer: coarse)`;
    const mq = window.matchMedia(query);
    setIsMobile(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}
