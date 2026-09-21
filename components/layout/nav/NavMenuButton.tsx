"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { RefObject } from "react";

/**
 * The navbar's Menu / Close trigger.
 *
 * Both labels are always mounted and stacked inside an overflow-hidden
 * mask; toggling slides one out through the top as the other rises from
 * the bottom.
 */
export default function NavMenuButton({
  open,
  onClick,
  buttonRef,
}: {
  open: boolean;
  onClick: () => void;
  buttonRef: RefObject<HTMLButtonElement>;
}) {
  const reduced = useReducedMotion();
  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="site-menu"
      className="nav-btn shrink-0 cursor-pointer px-4"
    >
      <span className="relative block overflow-hidden text-xs font-semibold uppercase tracking-wider">
        {/* Invisible sizer: pins the button to the width of the longer word,
            so the label swap doesn't jump and - more importantly - the bar's
            flex line never re-measures text while the capsule is scrubbing. */}
        <span className="invisible block" aria-hidden>
          Close
        </span>

        <motion.span
          className="absolute inset-0 grid place-items-center"
          animate={{ y: open ? "-105%" : "0%" }}
          transition={transition}
        >
          Menu
        </motion.span>

        {/* aria-hidden: aria-expanded already carries the state, so the
            accessible name stays the single word "Menu". */}
        <motion.span
          className="absolute inset-0 grid place-items-center"
          animate={{ y: open ? "0%" : "105%" }}
          transition={transition}
          aria-hidden
        >
          Close
        </motion.span>
      </span>
    </button>
  );
}
