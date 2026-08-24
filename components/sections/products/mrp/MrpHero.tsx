import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import { MRP_ENQUIRY_HREF, MRP_PAGE } from "@/lib/constants";
import MrpDashboardMock from "./MrpDashboardMock";

const { hero } = MRP_PAGE;

/** Opening section of /products/mrp - claim, proof, and the two ways out. */
export default function MrpHero() {
  return (
    <section className="relative pb-20 pt-16 sm:pt-20">
      <GlowOrb className="left-1/2 top-0 -translate-x-1/2 bg-primary/15" size={600} />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Products are a set, not one-offs - always offer the way back. */}
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

        <Reveal delay={0.05}>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-dark shadow-glow-soft">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-light" />
            {hero.pill}
          </span>
        </Reveal>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
          <WordReveal text={hero.headingLead} className="text-ink" />
          <WordReveal text={hero.headingAccent} className="text-metal" delay={0.25} />
        </h1>

        <Reveal delay={0.3}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {hero.lede}
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={MRP_ENQUIRY_HREF}
              className="btn-shine cursor-pointer rounded-full bg-primary px-8 py-4 text-center text-sm font-bold uppercase tracking-wider text-on-primary shadow-glow transition-all duration-200 hover:bg-primary-dark hover:shadow-glow-lg"
            >
              {hero.primaryCta}
            </Link>
            <Link
              href="#whats-live"
              className="cursor-pointer rounded-full border border-muted/30 bg-surface/40 px-8 py-4 text-center text-sm font-bold uppercase tracking-wider text-ink backdrop-blur transition-all duration-200 hover:border-muted/60 hover:bg-surface/70"
            >
              {hero.secondaryCta}
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-dim">
            {hero.note}
          </p>
        </Reveal>

        <MrpDashboardMock />
      </div>
    </section>
  );
}
