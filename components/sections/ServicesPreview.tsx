import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { SERVICES } from "@/lib/constants";

/**
 * Homepage services glance - names only, no copy or modals.
 * The full write-ups, pricing, and enquiry flow live on /services.
 *
 * Note: never size text here with `text-base` - the theme defines a colour
 * token named `base`, so that class resolves to the page background colour.
 */
export default function ServicesPreview() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="label-mono mb-3">What We Do</p>
          </Reveal>
          <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            <WordReveal text="Services We " className="text-ink" />
            <WordReveal text="Offer" className="text-metal" delay={0.15} />
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={(i % 4) * 0.08} className="h-full">
              <div className="glass group flex h-full flex-col items-center justify-start gap-4 rounded-2xl px-4 py-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/15">
                  <ServiceIcon icon={service.icon} size={22} />
                </span>

                <h3 className="text-[15px] font-semibold leading-snug text-ink">
                  {service.title}
                </h3>

                {service.status === "coming-soon" && (
                  <span className="-mt-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                    Coming soon
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted transition-colors duration-200 hover:text-primary"
            >
              Explore all services
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
