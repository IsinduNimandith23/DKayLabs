import type { Metadata } from "next";
import About from "@/components/sections/About";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About - ${SITE.name}`,
  description:
    "DKayLabs exists for the builders, the challengers, and the brands that play to win.",
};

export default function AboutPage() {
  return (
    <main className="pt-16">
      <About />
    </main>
  );
}
