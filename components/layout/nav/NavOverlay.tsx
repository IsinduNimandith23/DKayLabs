"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { useScrollLock } from "@/lib/hooks/useScrollLock";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { NAV_LINKS, PRODUCTS, PRODUCT_STATUS } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Diagonal arrow that slides in on row hover. */
function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="-translate-x-3 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="8 7 17 7 17 16" />
    </svg>
  );
}

/**
 * Full-screen navigation menu behind the navbar's Menu button.
 *
 * Portalled to <body> rather than rendered inside the header, and that is
 * load-bearing twice over. The header sets z-[110], which opens a stacking
 * context its children can never escape - as a child, this overlay's
 * z-[109] could not paint *below* the bar, which is the whole point (the
 * capsule floats over the menu and the Close button stays live). And the
 * bar's backdrop-filter would become the containing block for anything
 * position: fixed inside it.
 */
export default function NavOverlay({
  open,
  onClose,
  menuButtonRef,
}: {
  open: boolean;
  onClose: () => void;
  menuButtonRef: RefObject<HTMLButtonElement>;
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  // document.body is client-only, so portal after the first paint.
  useEffect(() => setMounted(true), []);

  useScrollLock(open);
  useFocusTrap([menuButtonRef, panelRef], open);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    // Move focus into the menu, then hand it back to the trigger on close
    // so keyboard users don't get dropped at the top of the document.
    const trigger = menuButtonRef.current;
    const first = panelRef.current?.querySelector<HTMLElement>("a[href]");
    first?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open, onClose, menuButtonRef]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /* Rows rise out of their own masks on a stagger. The exit is fast, flat
     and opacity-only - a staggered exit always feels like the menu is
     reluctant to close. */
  const list = {
    hidden: {},
    show: {
      transition: reduced
        ? {}
        : { staggerChildren: 0.05, delayChildren: 0.12 },
    },
  };
  const row = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { y: "110%" },
        show: { y: "0%", transition: { duration: 0.7, ease: EASE } },
      };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[109] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
        >
          {/* Near-opaque rather than merely frosted: the hero artwork behind
              it is high-contrast, and the menu has to stay legible over
              whatever part of the page it happens to open on. The
              few percent that do bleed through are smeared past recognition
              by a blur radius well beyond Tailwind's scale - at this tint,
              anything smaller leaves the hero's display type readable as a
              ghost. */}
          <div className="absolute inset-0 bg-base/[0.97] backdrop-blur-[96px]" />
          <div className="absolute inset-0 bg-primary-fade" />

          <motion.nav
            ref={panelRef}
            id="site-menu"
            aria-label="Site menu"
            variants={list}
            initial="hidden"
            animate="show"
            className="relative mx-auto grid min-h-[100dvh] w-full max-w-[1920px] content-start px-6 pb-20 pt-[calc(var(--nav-h)+5rem)] sm:px-10 lg:px-32 2xl:px-44"
          >
            {/* ── Primary navigation ───────────────────────────── */}
            <ul className="flex flex-col">
              {NAV_LINKS.map((link, i) => {
                const active = isActive(link.href);
                const children =
                  link.href === "/products" ? PRODUCTS : undefined;

                return (
                  <li key={link.href}>
                    <div className="overflow-hidden">
                      <motion.div variants={row}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          aria-current={active ? "page" : undefined}
                          className="group flex items-baseline gap-4 py-1 sm:gap-6"
                        >
                          <span className="w-6 shrink-0 font-mono text-[11px] tracking-widest text-muted-dim">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`font-display text-[clamp(2rem,6.5vw,4.25rem)] font-extrabold uppercase leading-[1.02] tracking-tight transition-colors duration-200 group-hover:text-ink ${
                              active ? "text-ink" : "text-muted"
                            }`}
                          >
                            {link.label}
                          </span>
                          {active && (
                            <span
                              className="h-2 w-2 shrink-0 self-center rounded-full bg-primary"
                              aria-hidden
                            />
                          )}
                          <ArrowIcon />
                        </Link>
                      </motion.div>
                    </div>

                    {/* Products expand inline - a full-screen surface has
                        the room, so there's nothing to collapse behind an
                        accordion. */}
                    {children && (
                      <ul className="mb-3 ml-10 flex flex-col gap-1 border-l border-ink/10 pl-4 sm:ml-12">
                        {children.map((product) => (
                          <li key={product.slug} className="overflow-hidden">
                            <motion.div variants={row}>
                              <Link
                                href={`/products/${product.slug}`}
                                onClick={onClose}
                                className="group/item flex items-start gap-3 rounded-xl p-2 transition-colors duration-200 hover:bg-primary/10"
                              >
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                                  <ServiceIcon icon={product.icon} size={18} />
                                </span>
                                <span className="min-w-0">
                                  <span className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-semibold text-ink">
                                      {product.name}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary-dark">
                                      <span className="h-1 w-1 rounded-full bg-primary-light" />
                                      {PRODUCT_STATUS[product.status]}
                                    </span>
                                  </span>
                                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                                    {product.tagline}
                                  </span>
                                </span>
                              </Link>
                            </motion.div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
