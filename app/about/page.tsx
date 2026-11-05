import type { Metadata } from "next";
import About from "@/components/sections/About";
import ClosingCta from "@/components/sections/ClosingCta";
import JsonLd from "@/components/seo/JsonLd";
import { FOUNDERS } from "@/lib/constants";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const founderNames = FOUNDERS.map((founder) => founder.name).join(" & ");

export const metadata: Metadata = pageMetadata({
  title: `About - Founded by ${founderNames}`,
  description: `DKayLABS was founded in Colombo by ${FOUNDERS.map((f) => f.name).join(" and ")} for the builders, the challengers, and the brands that play to win.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="pt-nav">
      {/* Founder Person nodes are declared sitewide in app/layout.tsx. */}
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
      <About />
      <ClosingCta />
    </main>
  );
}
