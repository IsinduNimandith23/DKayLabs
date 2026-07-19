"use client";

import { motion } from "framer-motion";
import type { Service } from "@/lib/constants";

/** Inline SVG icon set (no emojis). 24x24 viewBox, stroke-based. */
function ServiceIcon({ icon }: { icon: Service["icon"] }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (icon) {
    case "code":
      return (
        <svg {...common}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "mobile":
      return (
        <svg {...common}>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common}>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 3h3l2.4 12.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6" />
        </svg>
      );
    case "design":
      return (
        <svg {...common}>
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      );
    case "seo":
      return (
        <svg {...common}>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M5 12H1M23 12h-4" />
          <path d="M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z" />
        </svg>
      );
  }
}

/**
 * Glassy service card. Lifts and glows crimson on hover.
 * Uses transform (translateY) + shadow/border transitions - no layout shift.
 */
export default function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const isComingSoon = service.status === "coming-soon";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      // Stagger resets each row of 4 so later cards don't lag far behind.
      transition={{ duration: 1.0, delay: (index % 4) * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group relative cursor-default rounded-2xl"
    >
      {/* Animated glow ring revealed on hover. */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-crimson/50 to-transparent opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />

      <div className="glass relative flex h-full flex-col rounded-2xl p-7 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-crimson/40 group-hover:shadow-glow">
        {/* Header: icon + status badge */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-snow/10 bg-charcoal/60 text-crimson transition-colors duration-300 group-hover:border-crimson/40 group-hover:text-crimson-glow">
            <ServiceIcon icon={service.icon} />
          </div>

          {isComingSoon ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-crimson/40 bg-crimson/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-crimson-glow shadow-glow-soft">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-crimson-glow" />
              Coming Soon
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-silver/20 bg-charcoal/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-silver">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Available
            </span>
          )}
        </div>

        <h3 className="mb-3 text-xl font-bold tracking-wide text-snow">
          {service.title}
        </h3>
        <p className="text-sm leading-relaxed text-silver">
          {service.description}
        </p>

        {/* Footer link */}
        <div className="mt-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-crimson opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
          {isComingSoon ? "Notify me" : "Learn more"}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </motion.article>
  );
}
