import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import type { LegalDocument } from "@/lib/legal";

/**
 * Renders a legal document from lib/legal.ts. Shared by /privacy and /terms so
 * the two pages cannot drift apart visually - the only difference between them
 * is the object passed in.
 *
 * Deliberately a narrower measure than the marketing sections: this is prose
 * somebody actually has to read, so the column is capped around 70 characters
 * rather than run to the full 6xl grid.
 */
export default function LegalDoc({ doc }: { doc: LegalDocument }) {
  return (
    <section className="relative pb-28 pt-16 sm:pb-36 sm:pt-20">
      <GlowOrb className="left-1/2 top-0 -translate-x-1/2 bg-primary/15" size={520} />

      <div className="relative mx-auto max-w-3xl px-6">
        {/* ── Header ───────────────────────────────────────────────── */}
        <Reveal>
          <p className="label-mono mb-3">{doc.eyebrow}</p>
        </Reveal>

        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          <WordReveal text={doc.titleLead} className="text-ink" />
          <WordReveal text={doc.titleAccent} className="text-primary" delay={0.25} />
        </h1>

        <Reveal delay={0.15}>
          <p className="mt-6 text-base leading-relaxed text-muted">{doc.intro}</p>
          <p className="label-mono mt-6 text-muted-dim">
            Last updated {doc.updated}
          </p>
        </Reveal>

        {/* ── Body ─────────────────────────────────────────────────── */}
        <div className="mt-14 space-y-12">
          {doc.sections.map((section) => (
            <Reveal key={section.heading}>
              <div className="border-t border-ink/10 pt-8">
                <h2 className="text-xl font-bold tracking-[-0.02em] text-ink sm:text-2xl">
                  {section.heading}
                </h2>

                {section.body?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 text-base leading-relaxed text-muted"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-base leading-relaxed text-muted"
                      >
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
