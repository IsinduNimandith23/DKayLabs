import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ServicesPreview from "@/components/sections/ServicesPreview";
import Testimonials from "@/components/sections/Testimonials";
import WorkTogether from "@/components/sections/WorkTogether";
import { SITE } from "@/lib/constants";
import { getDesigns } from "@/lib/designs";
import { pageMetadata } from "@/lib/seo";

// Brand first (it's what people search for today), then the service and the
// place - Search Console shows zero impressions for any non-brand query, and
// "web design / development" + "Sri Lanka" is what buyers here actually type.
export const metadata: Metadata = pageMetadata({
  absoluteTitle: `${SITE.name} - Web Design & Development Company in Sri Lanka`,
  description:
    "DKayLABS is a Colombo, Sri Lanka studio designing and building fast websites, e-commerce stores, mobile apps and SaaS platforms for clients worldwide.",
  path: "/",
});

export default function Home() {
  return (
    <main>
      {/* The dot field behind this page is sitewide - see app/layout.tsx. */}
      <Hero />
      <Marquee />
      <FeaturedWork designs={getDesigns().map((d) => d.src)} />
      <ServicesPreview />
      <Testimonials />
      <WorkTogether />
    </main>
  );
}
