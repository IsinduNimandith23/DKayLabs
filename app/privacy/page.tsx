import type { Metadata } from "next";
import LegalDoc from "@/components/sections/LegalDoc";
import { PRIVACY } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What DKayLABS does with your information: no tracking, no cookies, no database - just the contact form, and only so we can reply.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="pt-16">
      <LegalDoc doc={PRIVACY} />
    </main>
  );
}
