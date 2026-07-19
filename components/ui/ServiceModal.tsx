"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { PRICING_NOTE, type Service } from "@/lib/constants";

/**
 * Detail dialog for a single service. Rendered once by ServicesGrid and fed
 * whichever card was clicked; `service === null` means closed.
 *
 * Rendered through a portal into <body>. This is load-bearing, not tidiness:
 * app/template.tsx animates `y` on a wrapper around every page, and a
 * transformed ancestor becomes the containing block for `position: fixed`.
 * Left in place, the backdrop's `inset-0` would resolve to that page-height
 * wrapper instead of the viewport, and the panel would centre on the page.
 *
 * Layout: the backdrop is a non-scrolling grid that centres the panel, and the
 * panel is a flex column capped at 85dvh whose middle section scrolls. Keeping
 * the scroll inside the panel (rather than on the backdrop) is what guarantees
 * it stays centred and never runs off the bottom of the viewport.
 *
 * Accessibility: Escape closes, backdrop click closes, focus moves to the
 * close button on open, and body scroll is locked while open.
 */
export default function ServiceModal({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const isOpen = service !== null;

  // document.body only exists client-side, so portal after the first paint.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    // Lock scroll without the layout jump from the disappearing scrollbar.
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [isOpen, onClose]);

  const isComingSoon = service?.status === "coming-soon";

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-obsidian/80 p-4 backdrop-blur-sm sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            // Clicks inside must not bubble to the backdrop's close handler.
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl"
          >
            {/* Crimson wash bleeding down from the top edge. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-crimson/15 to-transparent" />

            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-snow/10 bg-charcoal/80 text-silver transition-colors duration-200 hover:border-crimson/40 hover:text-snow focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Fixed header */}
            <div className="relative shrink-0 px-7 pb-5 pt-7 sm:px-9 sm:pt-9">
              <div className="flex items-start gap-4 pr-12">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-crimson/30 bg-charcoal/60 text-crimson-glow">
                  <ServiceIcon icon={service.icon} />
                </div>
                <div>
                  <h3
                    id="service-modal-title"
                    className="text-2xl font-bold tracking-wide text-snow sm:text-3xl"
                  >
                    {service.title}
                  </h3>
                  {isComingSoon ? (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-crimson/40 bg-crimson/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-crimson-glow">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-crimson-glow" />
                      Coming Soon
                    </span>
                  ) : (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-silver/20 bg-charcoal/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-silver">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Available
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable body - the only thing that scrolls. */}
            <div className="relative min-h-0 flex-1 overflow-y-auto px-7 sm:px-9">
              <p className="mb-8 leading-relaxed text-silver">
                {service.detail.overview}
              </p>

              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-crimson">
                What You Get
              </h4>
              <ul className="mb-8 grid gap-3 sm:grid-cols-2">
                {service.detail.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-silver">
                    <svg
                      className="mt-0.5 shrink-0 text-crimson"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Timeline + pricing. Pricing is quote-based by design. */}
              <div className="mb-2 rounded-2xl border border-crimson/20 bg-crimson/5 p-5">
                <div className="mb-4 flex items-center gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-crimson">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-sm text-silver">
                    <span className="font-semibold text-snow">Typical timeline: </span>
                    {service.detail.timeline}
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-crimson">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <p className="text-sm leading-relaxed text-silver">
                    <span className="font-semibold text-snow">Pricing is tailored. </span>
                    {PRICING_NOTE}
                  </p>
                </div>
              </div>
            </div>

            {/* Pinned footer CTA - carries the service through so the contact
                form can prefill the message. */}
            <div className="relative shrink-0 border-t border-snow/10 bg-charcoal/40 px-7 py-6 sm:px-9">
              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                onClick={onClose}
                className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-crimson px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-snow transition-all duration-200 hover:bg-crimson-dark hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              >
                {isComingSoon ? "Apply for early access" : "Apply for this service"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
