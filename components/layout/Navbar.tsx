"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { NAV_LINKS, PRODUCTS, type NavLink } from "@/lib/constants";

/**
 * Sticky frosted-glass navbar, split into three floating pills:
 * logo (left), nav links (center), theme switch + CTA (right).
 *  - pills get a stronger glass treatment after scrolling
 *  - orange underline link hovers (see .nav-link in globals.css)
 *  - smooth-scroll anchors (Lenis intercepts in-page hashes)
 *  - links carrying `children` open a dropdown (desktop) / accordion (mobile)
 *  - mobile: single compact pill with slide-down menu
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  /** Desktop: label of the nav item whose dropdown is showing. */
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  /** Mobile: label of the expanded accordion group. */
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  // Home matches only "/"; other links match their route and any sub-path.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navigating away should never leave a menu hanging open.
  useEffect(() => {
    setOpenMenu(null);
    setOpen(false);
  }, [pathname]);

  // Collapsing the mobile sheet also collapses whatever was expanded inside it.
  useEffect(() => {
    if (!open) setOpenGroup(null);
  }, [open]);

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
            {NAV_LINKS.map((link) =>
              link.children ? (
                <DesktopDropdown
                  key={link.href}
                  link={link}
                  active={isActive(link.href)}
                  isOpen={openMenu === link.label}
                  onOpen={() => setOpenMenu(link.label)}
                  onClose={() => setOpenMenu(null)}
                  reduceMotion={Boolean(reduceMotion)}
                />
              ) : (
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
              ),
            )}
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
            {NAV_LINKS.map((link) =>
              link.children ? (
                <MobileGroup
                  key={link.href}
                  link={link}
                  active={isActive(link.href)}
                  isOpen={openGroup === link.label}
                  onToggle={() =>
                    setOpenGroup((v) => (v === link.label ? null : link.label))
                  }
                  onNavigate={() => setOpen(false)}
                />
              ) : (
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
              ),
            )}
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

/** Chevron that flips when its menu is open. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/**
 * Desktop nav item with a hover/focus dropdown.
 *
 * The trigger stays a real <Link> so the parent route is still reachable by
 * click and by keyboard; the panel is supplementary, not the only way in.
 * No portal needed here - unlike ServiceModal this panel is absolute, and the
 * navbar renders outside the transformed wrapper in app/template.tsx.
 */
function DesktopDropdown({
  link,
  active,
  isOpen,
  onOpen,
  onClose,
  reduceMotion,
}: {
  link: NavLink;
  active: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  reduceMotion: boolean;
}) {
  const triggerRef = useRef<HTMLAnchorElement>(null);

  return (
    <li
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      // Only close when focus actually leaves the item - otherwise tabbing
      // from the trigger into the panel would dismiss it mid-keystroke.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
          triggerRef.current?.focus();
        }
      }}
    >
      {/* The label carries .nav-link rather than the anchor, so the orange
          underline stops at the text and doesn't run under the chevron. */}
      <Link
        ref={triggerRef}
        href={link.href}
        aria-current={active ? "page" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="group flex items-center gap-1.5 text-sm font-medium uppercase tracking-wider text-muted transition-colors duration-200 hover:text-ink"
      >
        <span
          data-active={active}
          className={`nav-link ${active ? "text-ink" : ""}`}
        >
          {link.label}
        </span>
        <Chevron open={isOpen} />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            /* The x:-50% centering lives in the animation, not in a Tailwind
               -translate-x-1/2: framer writes `transform` inline for `y`,
               which would overwrite the utility and leave the panel hanging
               off to the right of the trigger. */
            initial={{ opacity: 0, x: "-50%", y: reduceMotion ? 0 : -8 }}
            animate={{ opacity: 1, x: "-50%", y: 0 }}
            exit={{ opacity: 0, x: "-50%", y: reduceMotion ? 0 : -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            /* The top padding is load-bearing: it sets the visual gap below
               the nav pill *and* bridges it, so the pointer can travel down
               into the panel without tripping a mouseleave. */
            className="absolute left-1/2 top-full w-[400px] pt-7"
          >
            {/* Near-solid rather than .glass-strong: the hero artwork sits
                directly under this panel, and at 85% it read as washed out. */}
            <div className="rounded-2xl border border-primary/20 bg-surface/95 p-2 shadow-glow-soft backdrop-blur-2xl">
              <ul>
                {link.children?.map((child) => {
                  const product = PRODUCTS.find(
                    (p) => `/products/${p.slug}` === child.href,
                  );
                  return (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={onClose}
                        className="flex items-start gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-primary/10"
                      >
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                          <ServiceIcon icon={product?.icon ?? "spark"} size={20} />
                        </span>
                        {/* Name and badge share one non-wrapping row, with the
                            badge pinned right - so every entry is the same
                            height no matter how long the product name is. */}
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-3">
                            <span className="truncate text-[15px] font-semibold text-ink">
                              {child.label}
                            </span>
                            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary-dark">
                              <span className="h-1 w-1 animate-pulse rounded-full bg-primary-light" />
                              {child.status}
                            </span>
                          </span>
                          <span className="mt-1 block truncate text-xs leading-relaxed text-muted">
                            {child.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-1 border-t border-ink/10 pt-1">
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                >
                  View all {link.label.toLowerCase()}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/**
 * Mobile counterpart: tap-to-expand accordion, since hover doesn't exist.
 * The parent route is reachable from the "All …" row inside the panel.
 */
function MobileGroup({
  link,
  active,
  isOpen,
  onToggle,
  onNavigate,
}: {
  link: NavLink;
  active: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-wider transition-colors hover:bg-primary/10 hover:text-ink ${
          active ? "bg-primary/10 text-ink" : "text-muted"
        }`}
      >
        {link.label}
        <Chevron open={isOpen} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="ml-4 overflow-hidden border-l border-primary/20 pl-2"
          >
            <li>
              <Link
                href={link.href}
                onClick={onNavigate}
                className="block cursor-pointer rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:bg-primary/10 hover:text-primary"
              >
                All {link.label}
              </Link>
            </li>
            {link.children?.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  className="flex cursor-pointer flex-col gap-1 rounded-lg px-4 py-2.5 transition-colors hover:bg-primary/10"
                >
                  <span className="text-sm font-medium text-ink">
                    {child.label}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {child.status}
                  </span>
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
