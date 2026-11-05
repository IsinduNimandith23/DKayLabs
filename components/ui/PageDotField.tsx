"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

/*
 * Its own chunk, fetched after hydration. The canvas is pure decoration and
 * already waits for mount, so shipping its code in the first-load bundle only
 * added main-thread work in front of the page's own scripts.
 */
const DotField = dynamic(() => import("@/components/ui/DotField"), { ssr: false });

/**
 * The hero's DotField, fixed behind every route. Mounted once in
 * app/layout.tsx, so navigation never tears the canvas down and rebuilds it.
 *
 * Portalled to <body> because `position: fixed` is only fixed to the viewport
 * when no ancestor has a transform or `will-change: transform`. The page
 * transition in app/template.tsx is now a CSS animation that leaves no
 * transform behind, but it is one refactor away from doing so again (the
 * framer version left `will-change: opacity, transform` on its wrapper for
 * good), and in place the "fixed" canvas would then be pinned to that
 * wrapper and scroll away with the hero. The portal makes that impossible.
 *
 * -z-10 puts it under every section in the root stacking context; body's
 * bg-base propagates to the viewport, so it still paints beneath the field.
 */
export default function PageDotField() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <DotField
      scrollHandoff={false}
      className="fixed inset-0 -z-10 h-[100lvh] w-full"
    />,
    document.body,
  );
}
