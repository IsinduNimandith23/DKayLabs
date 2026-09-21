"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Keeps Tab cycling inside a set of elements while `active`.
 *
 * It takes several roots rather than one because the nav menu's trigger
 * stays in the header - which paints *above* the overlay - so the tab ring
 * has to span two subtrees that aren't nested. Roots are visited in the
 * order given, which should match document order.
 */
export function useFocusTrap(
  roots: RefObject<HTMLElement>[],
  active: boolean,
) {
  // Callers pass an array literal, so its identity changes every render.
  // Reading it through a ref keeps the listener bound to `active` alone.
  const rootsRef = useRef(roots);
  rootsRef.current = roots;

  useEffect(() => {
    if (!active) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      const items = rootsRef.current.flatMap((root) =>
        root.current
          ? Array.from(root.current.querySelectorAll<HTMLElement>(FOCUSABLE))
          : [],
      );
      // offsetParent is null for anything display:none'd by a breakpoint,
      // so responsive-hidden controls never become invisible tab stops.
      const focusable = items.filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      } else if (current instanceof HTMLElement && !focusable.includes(current)) {
        // Focus escaped the trap (or started outside it) - pull it back.
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active]);
}
