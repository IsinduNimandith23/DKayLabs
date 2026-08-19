import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import ServicesGrid from "@/components/ui/ServicesGrid";
import GlowOrb from "@/components/ui/GlowOrb";

export default function Services() {
  // Top padding is lighter than the bottom - see the note in Products.tsx:
  // <main> already adds pt-16 to clear the fixed navbar.
  return (
    <section id="services" className="relative scroll-mt-24 pb-28 pt-16 sm:pb-36 sm:pt-20">
      <GlowOrb className="left-1/2 top-0 -translate-x-1/2 bg-primary/15" size={600} />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <Reveal>
            <p className="label-mono mb-3">
              What We Do
            </p>
          </Reveal>
          <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            <WordReveal text="Services that " className="text-ink" />
            <WordReveal text="scale" className="text-metal" delay={0.2} />
          </h2>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              From first pixel to production AI - a full-stack arsenal to build,
              launch, and dominate.
            </p>
          </Reveal>
        </div>

        <ServicesGrid />
      </div>
    </section>
  );
}
