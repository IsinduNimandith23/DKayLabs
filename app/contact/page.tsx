import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us: Start Your Web or SaaS Project",
  description:
    "Tell us about your website, app or SaaS project. Email, call or WhatsApp the DKayLABS team in Colombo - we usually reply within one business day.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="pt-nav">
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      <Contact />
    </main>
  );
}
