"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { NAV_LINKS } from "@/lib/constants";

/**
 * Sticky frosted-glass navbar, split into three floating pills:
 * logo (left), nav links (center), CTA (right).
 *  - pills get a stronger glass + crimson glow treatment after scrolling
 *  - crimson underline-glow link hovers (see .nav-link in globals.css)
 *  - smooth-scroll anchors (Lenis intercepts in-page hashes)
 *  - mobile: single compact pill with slide-down menu
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-4 top-4 z-50 mx-auto max-w-6xl"
    >
      {/* ── Desktop: three pills ─────────────────────────────── */}
      <div className="relative hidden items-center justify-between md:flex">
        {/* Left pill - logo */}
        <div
          className={`rounded-full border px-5 py-2 transition-all duration-300 ${
            scrolled
              ? "glass-strong border-crimson/20 shadow-glow-soft"
              : "glass border-snow/10"
          }`}
        >
          <Logo size={34} />
        </div>

        {/* Center pill - nav links, always visible */}
        <nav
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border px-9 py-3.5 transition-all duration-300 ${
            scrolled
              ? "glass-strong border-crimson/20 shadow-glow-soft"
              : "glass border-snow/10"
          }`}
        >
          <ul className="flex items-center gap-7 lg:gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link text-sm font-medium uppercase tracking-wider">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right pill - CTA (already pill-shaped, no extra wrapper) */}
        <Link
          href="/contact"
          className="btn-shine cursor-pointer rounded-full border border-crimson/40 bg-crimson/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-snow backdrop-blur-xl transition-all duration-200 hover:bg-crimson hover:shadow-glow"
        >
          Get Started
        </Link>
      </div>

      {/* ── Mobile: single pill ──────────────────────────────── */}
      <nav
        className={`flex items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 md:hidden ${
          scrolled
            ? "glass-strong border-crimson/20 shadow-glow-soft"
            : "glass border-snow/10"
        }`}
      >
        <Logo size={38} />

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-snow/10 text-snow"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass-strong mt-2 flex flex-col gap-1 rounded-2xl border border-crimson/20 p-3 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block cursor-pointer rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-wider text-silver transition-colors hover:bg-crimson/10 hover:text-snow"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-1">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block cursor-pointer rounded-full border border-crimson/40 bg-crimson/10 px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-snow transition-all duration-200 hover:bg-crimson"
              >
                Get Started
              </Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
