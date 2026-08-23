import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Tell us about your project. We usually reply within one business day.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="pt-16">
      <Contact />
    </main>
  );
}
