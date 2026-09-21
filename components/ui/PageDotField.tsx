"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import DotField from "@/components/ui/DotField";

/**
 * The hero's DotField, fixed behind an entire page.
 *
 * Portalled to <body> because `position: fixed` is only fixed to the viewport
 * when no ancestor has a transform or `will-change: transform` - and the page
 * transition in app/template.tsx leaves framer's `will-change: opacity,
 * transform` on its wrapper for good. Rendered in place, the "fixed" canvas
 * would be pinned to that wrapper and scroll away with the hero.
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
