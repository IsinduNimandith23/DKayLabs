import type { Metadata } from "next";
import LegalDoc from "@/components/sections/LegalDoc";
import { TERMS } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms covering your use of the DKayLABS website, and how they relate to the written contract behind any project we take on.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="pt-16">
      <LegalDoc doc={TERMS} />
    </main>
  );
}
