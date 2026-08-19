"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { PRODUCT_STATUS, type Product } from "@/lib/constants";

/**
 * Product teaser on /products. The whole card is one link through to the
 * product's own page at /products/<slug>, where the enquiry CTA lives.
 */
export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const inProgress = product.status !== "live";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.0, delay: (index % 2) * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl"
    >
      {/* Animated glow ring revealed on hover. */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/50 to-transparent opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />

      <Link
        href={`/products/${product.slug}`}
        className="glass relative flex h-full cursor-pointer flex-col rounded-2xl p-7 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group-hover:-translate-y-2 group-hover:border-primary/40 group-hover:shadow-glow"
      >
        {/* Header: icon + status badge */}
        <div className="mb-6 flex w-full items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-ink/10 bg-surface/60 text-primary transition-colors duration-300 group-hover:border-primary/40 group-hover:text-primary-dark">
            <ServiceIcon icon={product.icon} />
          </div>

          <span
            className={
              inProgress
                ? "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-dark shadow-glow-soft"
                : "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-muted/20 bg-surface/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted"
            }
          >
            <span
              className={
                inProgress
                  ? "h-1.5 w-1.5 animate-pulse rounded-full bg-primary-light"
                  : "h-1.5 w-1.5 rounded-full bg-emerald-400"
              }
            />
            {PRODUCT_STATUS[product.status]}
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-wide text-ink">
          {product.name}
        </h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          {product.tagline}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          {product.description}
        </p>

        <ul className="mt-6 flex flex-col gap-2.5">
          {product.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="mt-0.5 shrink-0 text-primary"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {item}
            </li>
          ))}
        </ul>

        {/* mt-auto pins this to the bottom so the CTA lines up across cards
            even when their descriptions run to different lengths. */}
        <span className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold uppercase tracking-wider text-primary">
          View product
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </Link>
    </motion.article>
  );
}
