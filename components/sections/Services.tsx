import PageHero from "@/components/ui/PageHero";
import ServicesIndex from "@/components/ui/ServicesIndex";
import { SERVICES } from "@/lib/constants";

/** /services: a giant staggered headline, then the full service index. */
export default function Services() {
  return (
    <div id="services" className="scroll-mt-24">
      <PageHero
        label="Our core services"
        lines={["Our", "Core", "Services"]}
        intro={
          <>
            From first pixel to production AI - {SERVICES.length} ways we help
            you build, launch and grow. Open any one for what&apos;s included
            and how long it takes.
          </>
        }
      >
        <ServicesIndex />
      </PageHero>
    </div>
  );
}
