import WordReveal from "@/components/ui/WordReveal";
import ServicesList, { type ServiceRow } from "@/components/ui/ServicesList";
import { PROJECTS, SERVICES } from "@/lib/constants";

/**
 * Homepage services glance - an interactive list. The full write-ups,
 * pricing, and enquiry flow live on /services.
 *
 * Note: never size text here with `text-base` - the theme defines a colour
 * token named `base`, so that class resolves to the page background colour.
 */

const ALL_SHOTS = PROJECTS.flatMap((p) => (p.image ? [p.image] : []));

/** A service's own images, else screenshots of work under it, else all work. */
function imagesFor(title: string, own?: string[]) {
  if (own?.length) return own;
  const matching = PROJECTS.filter((p) => p.service === title).flatMap((p) =>
    p.image ? [p.image] : [],
  );
  return matching.length ? matching : ALL_SHOTS;
}

const ROWS: ServiceRow[] = SERVICES.map((s) => ({
  title: s.title,
  description: s.description,
  comingSoon: s.status === "coming-soon",
  images: imagesFor(s.title, s.images),
}));

export default function ServicesPreview() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="relative mx-auto max-w-5xl px-6">
        <h2 className="mb-14 font-machina text-[length:clamp(2.5rem,7vw,4.5rem)] leading-none tracking-[-0.02em] sm:mb-20">
          <WordReveal text="Our" className="font-extralight text-ink" />
          <WordReveal text="Core" className="font-medium text-ink" delay={0.1} />
          <WordReveal text="Services" className="font-black text-primary" delay={0.2} />
        </h2>

        <ServicesList services={ROWS} />
      </div>
    </section>
  );
}
