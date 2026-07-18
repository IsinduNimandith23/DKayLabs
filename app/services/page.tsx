import type { Metadata } from "next";
import Services from "@/components/sections/Services";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Services - ${SITE.name}`,
  description:
    "Website development, SaaS solutions, and AI services - a full-stack arsenal to build, launch, and dominate.",
};

export default function ServicesPage() {
  return (
    <main className="pt-16">
      <Services />
    </main>
  );
}
