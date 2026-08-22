import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import CtaBand from "@/components/sections/CtaBand";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Portfolio - ${SITE.name}`,
  description:
    "Real projects shipped by DKayLABS - e-commerce stores, business websites, and digital product platforms, live in the wild.",
};

export default function PortfolioPage() {
  return (
    <main className="pt-16">
      {/* Top padding is lighter than the bottom - see the note in
          components/sections/Products.tsx: <main> already adds pt-16 to
          clear the fixed navbar. */}
      <section className="relative pb-28 pt-16 sm:pb-32 sm:pt-20">
        <GlowOrb className="left-1/2 top-0 -translate-x-1/2 bg-primary/15" size={600} />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <Reveal>
              <p className="label-mono mb-3">
                Portfolio
              </p>
            </Reveal>
            <h1 className="text-4xl font-bold sm:text-6xl">
              <WordReveal text="Work that's " className="text-ink" />
              <WordReveal text="live right now" className="text-metal" delay={0.2} />
            </h1>
            <Reveal delay={0.3}>
              <p className="mx-auto mt-4 max-w-2xl text-muted">
                Every project below is shipped and serving real customers. Click
                any card to visit the live site.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <PortfolioGrid />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
