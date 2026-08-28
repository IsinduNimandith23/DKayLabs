import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { MRP_ENQUIRY_HREF, MRP_PAGE } from "@/lib/constants";

const { earlyAccess } = MRP_PAGE;

/**
 * Early-access conversion band.
 *
 * No inline form on purpose: /contact already reads the `product` query
 * param and prefills the enquiry (see components/sections/Contact.tsx), so
 * this routes there rather than standing up a second form to maintain. The
 * product name in MRP_ENQUIRY_HREF has to keep matching PRODUCTS[].name or
 * that prefill silently does nothing.
 */
export default function MrpEarlyAccess() {
  // Bottom padding matches CtaBand's - this is the last section before the
  // footer, and the shared band is what sets that rhythm everywhere else.
  return (
    <section className="relative pb-28 pt-20 sm:pb-36 sm:pt-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal direction="scale">
          <div className="glass relative overflow-hidden rounded-3xl px-6 py-12 text-center shadow-glow-soft sm:px-8 sm:py-16">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />
            <div className="absolute inset-0 bg-metal-sheen opacity-40" />

            <div className="relative">
              <p className="label-mono mb-3">{earlyAccess.eyebrow}</p>
              <h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                <WordReveal
                  text={earlyAccess.headingLead}
                  className="text-ink"
                />
                <WordReveal
                  text={earlyAccess.headingAccent}
                  className="text-primary"
                  delay={0.25}
                />
              </h2>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
                {earlyAccess.body}
              </p>

              <div className="mt-9 flex justify-center">
                <Link
                  href={MRP_ENQUIRY_HREF}
                  className="btn-shine w-full cursor-pointer rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-on-primary shadow-glow transition-all duration-200 hover:bg-primary-dark hover:shadow-glow-lg sm:w-auto"
                >
                  {earlyAccess.cta}
                </Link>
              </div>

              <p className="mt-6 font-mono text-[11px] tracking-[0.04em] text-muted-dim">
                {earlyAccess.fine}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
