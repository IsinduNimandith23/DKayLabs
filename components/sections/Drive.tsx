import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import { DRIVES } from "@/lib/constants";

/**
 * Homepage "Our Drive" - what pushes us, framed around the client's win.
 * Numbered cards with ghost numerals; deeper mission copy lives on /about.
 */
export default function Drive() {
  return (
    <section className="relative py-28 sm:py-36">
      <GlowOrb className="left-0 top-1/4 bg-primary/15" size={460} />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <Reveal>
            <p className="label-mono mb-3">
              Our Drive
            </p>
          </Reveal>
          <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            <WordReveal text="Why we " className="text-ink" />
            <WordReveal
              text="build"
              className="text-primary"
              delay={0.15}
            />
          </h2>
          <Reveal delay={0.25}>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Everything we make exists for one reason - to put you a level above
              the competition.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {DRIVES.map((drive, i) => (
            <Reveal key={drive.title} delay={i * 0.12} className="h-full">
              <div className="glass group relative h-full overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:border-primary/40 hover:shadow-glow-soft">
                {/* Ghost numeral. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-3 -top-6 font-display text-8xl text-ink/5 transition-colors duration-300 group-hover:text-primary/10"
                >
                  0{i + 1}
                </span>

                <span className="mb-5 block h-px w-10 bg-primary shadow-glow" />
                <h3 className="relative text-lg text-ink">{drive.title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted">
                  {drive.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
