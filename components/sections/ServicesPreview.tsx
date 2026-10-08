import WordReveal from "@/components/ui/WordReveal";
import ServicesList, { type ServiceRow } from "@/components/ui/ServicesList";
import { DESIGN_SERVICE, SERVICES } from "@/lib/constants";
import { getDesigns } from "@/lib/designs";
import { serviceImages, serviceSlug } from "@/lib/services";

/**
 * Homepage services glance - an interactive list. The full write-ups,
 * pricing, and enquiry flow live on /services; each row deep-links to its
 * own entry there.
 *
 * Note: never size text here with `text-base` - the theme defines a colour
 * token named `base`, so that class resolves to the page background colour.
 */

export default function ServicesPreview() {
  // Digital Design plays its whole gallery, shuffled per view, so every
  // design gets its turn instead of the same few leading every time.
  const designs = getDesigns().map((d) => d.src);
  const rows: ServiceRow[] = SERVICES.map((s) => {
    const isDesign = s.title === DESIGN_SERVICE && designs.length > 0;
    return {
      title: s.title,
      description: s.description,
      href: `/services#${serviceSlug(s.title)}`,
      comingSoon: s.status === "coming-soon",
      images: isDesign ? designs : serviceImages(s),
      shuffle: isDesign,
    };
  });

  return (
    <section className="relative py-28 sm:py-36">
      <div className="relative mx-auto max-w-5xl px-6">
        <h2 className="mb-14 font-machina text-[length:clamp(2.5rem,7vw,4.5rem)] leading-none tracking-[-0.02em] sm:mb-20">
          <WordReveal text="Our" className="font-extralight text-ink" />
          <WordReveal text="Core" className="font-medium text-ink" delay={0.1} />
          <WordReveal text="Services" className="font-black text-primary" delay={0.2} />
        </h2>

        <ServicesList services={rows} />
      </div>
    </section>
  );
}
