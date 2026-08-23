import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ServicesPreview from "@/components/sections/ServicesPreview";
import Drive from "@/components/sections/Drive";
import Testimonials from "@/components/sections/Testimonials";
import CtaBand from "@/components/sections/CtaBand";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

// No `title` - the homepage carries the brand + tagline, not a page name.
export const metadata: Metadata = pageMetadata({
  description: SITE.description,
  path: "/",
});

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <FeaturedWork />
      <ServicesPreview />
      <Drive />
      <Testimonials />
      <CtaBand />
    </main>
  );
}
