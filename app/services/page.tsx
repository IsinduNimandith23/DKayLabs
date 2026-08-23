import type { Metadata } from "next";
import Services from "@/components/sections/Services";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Website development, SaaS solutions, and AI services - a full-stack arsenal to build, launch, and dominate.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main className="pt-16">
      <Services />
    </main>
  );
}
