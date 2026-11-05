"use client";

import dynamic from "next/dynamic";

/**
 * The custom cursor as its own chunk, loaded after hydration. It only ever
 * activates for a fine, hovering pointer, so phones were downloading and
 * parsing it for nothing. app/layout.tsx is a server component and can't
 * call dynamic(..., { ssr: false }) itself, hence this thin client wrapper.
 */
const Cursor = dynamic(() => import("@/components/ui/Cursor"), { ssr: false });

export default function LazyCursor() {
  return <Cursor />;
}
