import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { PRODUCT_STATUS, type Product } from "@/lib/constants";

/** Full write-up for a single product, rendered at /products/<slug>. */
export default function ProductDetail({ product }: { product: Product }) {
  const inProgress = product.status !== "live";

  return (
    <section className="relative pb-28 pt-16 sm:pb-36 sm:pt-20">
      <GlowOrb className="left-1/2 top-0 -translate-x-1/2 bg-primary/15" size={600} />

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Back to the listing - products are a set, not one-offs. */}
        <Reveal>
          <Link
            href="/products"
            className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted transition-colors duration-200 hover:text-primary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            All products
          </Link>
        </Reveal>

        {/* Header */}
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Reveal>
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <ServiceIcon icon={product.icon} size={32} />
            </span>
          </Reveal>

          <div>
            <Reveal delay={0.05}>
              <span
                className={
                  inProgress
                    ? "mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-dark shadow-glow-soft"
                    : "mb-3 inline-flex items-center gap-1.5 rounded-full border border-muted/20 bg-surface/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted"
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
            </Reveal>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              <WordReveal text={product.name} className="text-metal" />
            </h1>

            <Reveal delay={0.2}>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                {product.tagline}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.25}>
          <p className="mt-10 max-w-3xl text-lg leading-relaxed text-muted">
            {product.description}
          </p>
        </Reveal>

        {/* Overview + highlights */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal delay={0.1}>
            <div>
              <p className="label-mono mb-5">Overview</p>
              {/* Copy is authored with blank lines between paragraphs. */}
              {product.detail.overview.split("\n\n").map((para) => (
                <p key={para} className="mb-4 leading-relaxed text-muted">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="glass rounded-2xl p-7">
              <p className="label-mono mb-5">What it does</p>
              <ul className="flex flex-col gap-3.5">
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
            </div>
          </Reveal>
        </div>

        {/* Status + CTA */}
        <Reveal delay={0.15}>
          <div className="glass mt-14 flex flex-col gap-6 rounded-2xl p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="label-mono mb-3">Current status</p>
              <p className="text-sm leading-relaxed text-muted">
                {product.detail.timeline}
              </p>
            </div>

            <Link
              href={`/contact?product=${encodeURIComponent(product.name)}`}
              className="btn-shine shrink-0 cursor-pointer rounded-full border border-primary/50 bg-surface/70 px-8 py-3.5 text-center text-sm font-semibold uppercase tracking-wider text-ink transition-all duration-200 hover:bg-primary hover:text-on-primary hover:shadow-glow"
            >
              {inProgress ? "Request early access" : "Get in touch"}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
