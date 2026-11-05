import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import JsonLd from "@/components/seo/JsonLd";
import { getDesigns } from "@/lib/designs";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Web Design Portfolio: Client Websites & Stores",
  description:
    "Real projects shipped by DKayLABS - e-commerce stores, business websites, and digital product platforms, live in the wild.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <main className="pt-nav">
      <JsonLd data={breadcrumbSchema([{ name: "Portfolio", path: "/portfolio" }])} />
      {/* Last section before the footer: the bottom padding tops PageHero's
          own pb-10 up to the py-28 / sm:py-36 rhythm the other sections use. */}
      <div className="pb-[4.5rem] sm:pb-[6.5rem]">
        <PageHero
          label="Our live work"
          lines={["Our", "Live", "Work"]}
          intro="Every project below is shipped and serving real customers. Pick one to visit the live site or view the full design."
        >
          <PortfolioGrid designs={getDesigns()} />
        </PageHero>
      </div>
    </main>
  );
}
