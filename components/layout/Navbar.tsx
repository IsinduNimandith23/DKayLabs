"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { NAV_LINKS } from "@/lib/constants";

/**
 * Sticky frosted-glass navbar, split into three floating pills:
 * logo (left), nav links (center), theme switch + CTA (right).
 *  - pills get a stronger glass treatment after scrolling
 *  - orange underline link hovers (see .nav-link in globals.css)
 *  - smooth-scroll anchors (Lenis intercepts in-page hashes)
 *  - mobile: single compact pill with slide-down menu
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Home matches only "/"; other links match their route and any sub-path.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
      /* Same container + horizontal padding as the hero copy, so the logo
         and CTA line up with the section content below rather than
         floating at their own inset. */
      className="fixed inset-x-0 top-4 z-50 mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-32 2xl:px-44"
    >
      {/* ── Desktop: three pills ─────────────────────────────── */}
      <div className="relative hidden items-center justify-between lg:flex">
        {/* Left pill - logo */}
        <div
          className={`rounded-full border px-5 py-2 transition-all duration-300 ${
            scrolled
              ? "glass-strong border-primary/20 shadow-glow-soft"
              : "glass border-ink/10"
          }`}
        >
          <Logo size={34} />
        </div>

        {/* Center pill - nav links, always visible */}
        <nav
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border px-9 py-3.5 transition-all duration-300 ${
            scrolled
              ? "glass-strong border-primary/20 shadow-glow-soft"
              : "glass border-ink/10"
          }`}
        >
          <ul className="flex items-center gap-7 lg:gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-active={isActive(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`nav-link text-sm font-medium uppercase tracking-wider ${
                    isActive(link.href) ? "text-ink" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right cluster - theme switch + CTA */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Solid-ish surface behind the label, not a 10% tint: the hero
              artwork sits directly under this pill, so a near-transparent
              background left the text unreadable over the image in dark mode. */}
          <Link
            href="/contact"
            className="btn-shine cursor-pointer rounded-full border border-primary/50 bg-surface/85 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-ink backdrop-blur-xl transition-all duration-200 hover:bg-primary hover:text-on-primary hover:shadow-glow"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* ── Mobile: two separate pills - logo + menu button ──── */}
      <nav className="flex items-center justify-between lg:hidden">
        {/* Logo pill - transparent at top, glass on scroll */}
        <div
          className={`rounded-full border transition-all duration-300 ${
            scrolled
              ? "glass-strong border-primary/20 px-4 py-2 shadow-glow-soft"
              : "border-transparent px-1 py-1"
          }`}
        >
          <Logo size={38} />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border text-ink transition-all duration-300 ${
            scrolled
              ? "glass-strong border-primary/20 shadow-glow-soft"
              : "border-ink/10"
          }`}
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
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass-strong mt-2 flex flex-col gap-1 rounded-2xl border border-primary/20 p-3 lg:hidden"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block cursor-pointer rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-wider transition-colors hover:bg-primary/10 hover:text-ink ${
                    isActive(link.href)
                      ? "bg-primary/10 text-ink"
                      : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-1">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block cursor-pointer rounded-full border border-primary/40 bg-primary/10 px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-ink transition-all duration-200 hover:bg-primary hover:text-on-primary"
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
