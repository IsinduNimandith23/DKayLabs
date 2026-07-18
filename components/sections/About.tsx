import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";

const STATS = [
  { value: "100%", label: "Client-first" },
  { value: "24/7", label: "Always shipping" },
  { value: "∞", label: "Ambition" },
];

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-28 sm:py-36">
      <GlowOrb className="left-0 top-1/3 bg-crimson/15" size={460} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        {/* Mission copy */}
        <div>
          <Reveal direction="right">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-crimson">
              Our Mission
            </p>
          </Reveal>
          <h2 className="text-3xl font-bold leading-tight sm:text-5xl">
            <WordReveal text="Built to help you " className="text-snow" />
            {/* TODO: replace the crimson word below with your DKayLabs heading copy. */}
            <WordReveal
              text="win"
              className="text-crimson drop-shadow-[0_0_18px_rgba(255,46,63,0.5)]"
              delay={0.3}
            />
          </h2>

          <Reveal direction="right" delay={0.15}>
            <p className="mt-6 text-base leading-relaxed text-silver">
              DKayLabs exists for the builders, the challengers, and the brands
              that play to win. We fuse sharp design, hardened engineering, and
              emerging AI into digital products that don&apos;t just keep up - they
              set the pace.
            </p>
            <p className="mt-4 text-base leading-relaxed text-silver">
              No templates. No filler. Every line of code and every pixel is
              engineered to push you a level above the competition.
            </p>
          </Reveal>
        </div>

        {/* Glass stat panel */}
        <Reveal direction="left" delay={0.1}>
          <div className="glass relative overflow-hidden rounded-3xl p-8 shadow-glow-soft">
            <div className="absolute inset-0 bg-metal-sheen opacity-60" />
            <div className="relative grid grid-cols-3 gap-4">
              {STATS.map((s, i) => (
                <Reveal key={s.label} direction="scale" delay={0.25 + i * 0.12}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-metal sm:text-4xl">
                      {s.value}
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-widest text-silver">
                      {s.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="relative mt-8 rounded-2xl border border-crimson/20 bg-crimson/5 p-5">
              <p className="text-sm italic leading-relaxed text-snow/90">
                &ldquo;We measure success by how far our partners climb.&rdquo;
              </p>
              <p className="mt-3 text-xs uppercase tracking-widest text-crimson">
                - The DKayLabs Team
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
