import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contact - ${SITE.name}`,
  description:
    "Tell us about your project. We usually reply within one business day.",
};

export default function ContactPage() {
  return (
    <main className="pt-16">
      <Contact />
    </main>
  );
}
