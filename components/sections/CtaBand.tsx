import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";

/** Final conversion push before the footer. */
export default function CtaBand() {
  return (
    <section className="relative pb-28 sm:pb-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal direction="scale">
          <div className="glass relative overflow-hidden rounded-3xl px-8 py-14 text-center shadow-glow-soft sm:py-16">
            {/* Violet top edge + ambient bloom. */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />
            <div className="absolute inset-0 bg-metal-sheen opacity-40" />

            <div className="relative">
              <p className="label-mono mb-3">
                Ready When You Are
              </p>
              <h2 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
                <WordReveal text="Your next level is " className="text-ink" />
                <WordReveal
                  text="one message away"
                  className="text-primary"
                  delay={0.25}
                />
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">
                Tell us what you&apos;re building. We&apos;ll bring the design,
                the engineering, and the obsession.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="btn-shine w-full cursor-pointer rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-on-primary shadow-glow transition-all duration-200 hover:bg-primary-dark hover:shadow-glow-lg sm:w-auto"
                >
                  Start a Project
                </Link>
                <Link
                  href="/services"
                  className="w-full cursor-pointer rounded-full border border-muted/30 bg-surface/40 px-8 py-4 text-sm font-bold uppercase tracking-wider text-ink backdrop-blur transition-all duration-200 hover:border-muted/60 hover:bg-surface/70 sm:w-auto"
                >
                  See Services
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
