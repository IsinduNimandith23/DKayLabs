import type { Metadata } from "next";
import About from "@/components/sections/About";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "DKayLABS exists for the builders, the challengers, and the brands that play to win.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="pt-16">
      <About />
    </main>
  );
}
