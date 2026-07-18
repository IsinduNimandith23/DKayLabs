import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import ServiceCard from "@/components/ui/ServiceCard";
import GlowOrb from "@/components/ui/GlowOrb";
import { SERVICES } from "@/lib/constants";

export default function Services() {
  return (
    <section id="services" className="relative scroll-mt-24 py-28 sm:py-36">
      <GlowOrb className="left-1/2 top-0 -translate-x-1/2 bg-crimson/15" size={600} />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-crimson">
              What We Do
            </p>
          </Reveal>
          <h2 className="text-3xl font-bold sm:text-5xl">
            <WordReveal text="Services that " className="text-snow" />
            <WordReveal text="scale" className="text-metal" delay={0.2} />
          </h2>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-4 max-w-2xl text-silver">
              From first pixel to production AI - a full-stack arsenal to build,
              launch, and dominate.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
