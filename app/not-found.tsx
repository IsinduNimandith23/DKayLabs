import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import GlowOrb from "@/components/ui/GlowOrb";
import WordReveal from "@/components/ui/WordReveal";

/*
 * Catches both a bad URL and the notFound() call in
 * app/products/[slug]/page.tsx.
 *
 * not-found.tsx cannot export `metadata` in the App Router, so the tab title
 * falls back to the root one. That is fine - the 404 status code is what a
 * crawler acts on, and the root metadata already carries the brand.
 */
export default function NotFound() {
  return (
    <main className="pt-16">
      <section className="relative pb-28 pt-16 sm:pb-36 sm:pt-24">
        <GlowOrb className="left-1/2 top-0 -translate-x-1/2 bg-primary/15" size={600} />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="label-mono mb-3">Error 404</p>
          </Reveal>

          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            <WordReveal text="This page went " className="text-ink" />
            <WordReveal text="off the map" className="text-primary" delay={0.25} />
          </h1>

          <Reveal delay={0.3}>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              The link is broken or the page has moved. Everything we build is
              still one click away.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/"
                className="btn-shine w-full cursor-pointer rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-on-primary shadow-glow transition-all duration-200 hover:bg-primary-dark hover:shadow-glow-lg sm:w-auto"
              >
                Back Home
              </Link>
              <Link
                href="/contact"
                className="w-full cursor-pointer rounded-full border border-muted/30 bg-surface/40 px-8 py-4 text-sm font-bold uppercase tracking-wider text-ink backdrop-blur transition-all duration-200 hover:border-muted/60 hover:bg-surface/70 sm:w-auto"
              >
                Get in Touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
