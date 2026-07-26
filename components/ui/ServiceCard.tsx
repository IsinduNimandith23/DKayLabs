"use client";

import { motion } from "framer-motion";
import ServiceIcon from "@/components/ui/ServiceIcon";
import type { Service } from "@/lib/constants";

/**
 * Glassy service card. Lifts and glows violet on hover.
 * Uses transform (translateY) + shadow/border transitions - no layout shift.
 * Clicking opens the ServiceModal via `onSelect`.
 */
export default function ServiceCard({
  service,
  index,
  onSelect,
}: {
  service: Service;
  index: number;
  onSelect: (service: Service) => void;
}) {
  const isComingSoon = service.status === "coming-soon";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      // Stagger resets each row of 4 so later cards don't lag far behind.
      transition={{ duration: 1.0, delay: (index % 4) * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl"
    >
      {/* Animated glow ring revealed on hover. */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/50 to-transparent opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />

      <button
        type="button"
        onClick={() => onSelect(service)}
        aria-label={`View details for ${service.title}`}
        className="glass relative flex h-full w-full cursor-pointer flex-col rounded-2xl p-7 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group-hover:-translate-y-2 group-hover:border-primary/40 group-hover:shadow-glow"
      >
        {/* Header: icon + status badge */}
        <div className="mb-6 flex w-full items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-ink/10 bg-surface/60 text-primary transition-colors duration-300 group-hover:border-primary/40 group-hover:text-primary-dark">
            <ServiceIcon icon={service.icon} />
          </div>

          {isComingSoon ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-dark shadow-glow-soft">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-light" />
              Coming Soon
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-muted/20 bg-surface/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Available
            </span>
          )}
        </div>

        <h3 className="mb-3 text-xl font-bold tracking-wide text-ink">
          {service.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted">
          {service.description}
        </p>

        {/* Footer link */}
        <div className="mt-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
          {isComingSoon ? "Notify me" : "Learn more"}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </button>
    </motion.article>
  );
}
