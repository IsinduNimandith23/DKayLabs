import type { Metadata } from "next";
import Services from "@/components/sections/Services";
import HowWeWork from "@/components/sections/HowWeWork";
import Testimonials from "@/components/sections/Testimonials";
import WorkTogether from "@/components/sections/WorkTogether";
import JsonLd from "@/components/seo/JsonLd";
import { servicesSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Website development, SaaS solutions, and AI services - a full-stack arsenal to build, launch, and dominate.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main className="pt-nav">
      <JsonLd data={servicesSchema()} />
      <Services />
      <HowWeWork />
      <Testimonials />
      <WorkTogether />
    </main>
  );
}
