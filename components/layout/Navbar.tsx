"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate, useMotionValueEvent, useReducedMotion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import NavMenuButton from "@/components/layout/nav/NavMenuButton";
import NavClock from "@/components/layout/nav/NavClock";
import NavOverlay from "@/components/layout/nav/NavOverlay";
import RollText from "@/components/ui/RollText";
import { useNavProgress } from "@/lib/hooks/useNavProgress";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Site header.
 *
 * The bar starts full-bleed with no background of its own and contracts
 * into a centred glass capsule as you scroll, over the first ~400px. The
 * geometry all lives in CSS (see .nav-capsule in globals.css); the only
 * thing JS does is write a single 0..1 number to --nav-p on this element,
 * straight from a MotionValue, so scrolling never re-renders React.
 *
 * Deliberately NOT sharing the page gutter (px-6 sm:px-10 lg:px-32). An
 * earlier version did, so the logo would line up with the hero's copy
 * column - that constraint died with the centred logo, and 128px is an
 * absurd inset for a nav. The bar has its own --nav-gutter now.
 *
 * Mounted from app/layout.tsx as a sibling of {children}: app/template.tsx
 * wraps every page in a transformed motion.div, and a transformed ancestor
 * would become the containing block for `position: fixed`.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const { progress, halted, targetFor, readScroll } = useNavProgress();

  /* Seed before the first post-hydration paint. useMotionValueEvent only
     fires on change, so reloading halfway down a page would otherwise paint
     one frame of fully-expanded bar before the first scroll event. */
  useLayoutEffect(() => {
    headerRef.current?.style.setProperty("--nav-p", String(progress.get()));
  }, [progress]);

  /* One property write per frame, on the header itself. Never on
     documentElement: custom properties inherit, so writing it at the root
     would invalidate style for every node in the document 60x a second. */
  useMotionValueEvent(progress, "change", (v) => {
    headerRef.current?.style.setProperty("--nav-p", v.toFixed(4));
  });

  /* While the menu is open the bar returns to full width so it reads as
     part of the overlay rather than a capsule floating on top of it.
     Scroll is held off for the duration, then handed back at whatever
     position the page is actually at. */
  useEffect(() => {
    if (open) {
      halted.current = true;
      const controls = animate(progress, 0, {
        duration: reduced ? 0 : 0.6,
        ease: EASE,
      });
      return () => controls.stop();
    }

    const controls = animate(progress, targetFor(readScroll()), {
      duration: reduced ? 0 : 0.5,
      ease: EASE,
      onComplete: () => {
        halted.current = false;
      },
    });
    return () => controls.stop();
  }, [open, progress, halted, targetFor, readScroll, reduced]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        ref={headerRef}
        style={{ "--nav-p": 0 } as React.CSSProperties}
        className="fixed inset-x-0 top-0 z-[110]"
      >
        {/* Entrance is a CSS animation (.nav-enter), not framer. Framer
            leaves `will-change: opacity, transform` on the element after it
            finishes, and any transform hint on an ancestor of the glass
            makes that ancestor the backdrop root - which measurably guts
            the blur. See .nav-capsule in globals.css. */}
        <div className="nav-enter">
          <div className="nav-capsule flex items-center justify-between">
            <div className="nav-glass" aria-hidden />

            <NavMenuButton
              open={open}
              onClick={() => setOpen((v) => !v)}
              buttonRef={menuButtonRef}
            />

            {/* Absolutely positioned so the wordmark is optically centred in
                the bar and, more to the point, never joins the flex line
                that re-lays-out on every scrub frame. */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Logo
                variant="wordmark"
                size={26}
                className="pointer-events-auto"
              />
            </div>

            <div className="relative flex shrink-0 items-center gap-2">
              <NavClock />

              <ThemeToggle variant="bare" className="nav-btn aspect-square" />

              <Link
                href="/contact"
                aria-label="Contact DKayLABS"
                className="nav-btn px-3"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <polyline points="3 7 12 13 21 7" />
                </svg>
                <span className="nav-cta-label hidden text-xs font-semibold uppercase tracking-wider lg:block">
                  <RollText>Contact</RollText>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <NavOverlay
        open={open}
        onClose={() => setOpen(false)}
        menuButtonRef={menuButtonRef}
      />
    </>
  );
}
