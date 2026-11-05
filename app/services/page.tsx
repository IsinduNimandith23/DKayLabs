import type { Metadata } from "next";
import Services from "@/components/sections/Services";
import HowWeWork from "@/components/sections/HowWeWork";
import Testimonials from "@/components/sections/Testimonials";
import WorkTogether from "@/components/sections/WorkTogether";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, servicesSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Web, App & SaaS Development Services in Sri Lanka",
  description:
    "Website, e-commerce, mobile app and SaaS development from a Colombo, Sri Lanka studio - with clear timelines, set deliverables and a free project quote.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main className="pt-nav">
      <JsonLd data={servicesSchema()} />
      <JsonLd data={breadcrumbSchema([{ name: "Services", path: "/services" }])} />
      <Services />
      <HowWeWork />
      <Testimonials />
      <WorkTogether />
    </main>
  );
}
