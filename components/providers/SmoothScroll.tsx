"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Lenis keeps its own scroll position across App Router navigations, so a
 * new page would open wherever the previous one was scrolled. Snap back to
 * the top on every route change (unless the URL targets an #anchor).
 */
function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
}

/**
 * Site-wide Lenis smooth scrolling.
 * Automatically disables itself when the user prefers reduced motion,
 * falling back to native scrolling.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // smoothing factor
        duration: 1.2, // scroll inertia
        smoothWheel: true,
        wheelMultiplier: 1,
      }}
    >
      <ScrollToTop />
      {children}
    </ReactLenis>
  );
}
