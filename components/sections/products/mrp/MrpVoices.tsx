import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { MRP_PAGE } from "@/lib/constants";

const { voices } = MRP_PAGE;

/**
 * What manufacturers say about the software they already have, and what we
 * did about each one.
 *
 * IMPORTANT: these are complaints about OTHER systems, gathered from public
 * industry discussion - they are not DKayLABS client testimonials and must
 * never be styled or worded to look like one. Real client quotes live in
 * TESTIMONIALS in lib/constants.ts, and that list stays real. The heading
 * and lede here both say plainly whose words these are; keep that framing
 * if this section is ever edited.
 */
export default function MrpVoices() {
  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-3xl">
          <Reveal>
            <p className="label-mono mb-4">{voices.eyebrow}</p>
          </Reveal>
          <h2 className="text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            <WordReveal text={voices.headingLead} className="text-ink" />
            <WordReveal
              text={voices.headingAccent}
              className="text-metal"
              delay={0.3}
            />
          </h2>
          <Reveal delay={0.35}>
            <p className="mt-5 max-w-2xl leading-relaxed text-muted">
              {voices.lede}
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-ink/10">
            {voices.pairs.map((pair) => (
              <div
                key={pair.quote}
                className="grid border-b border-ink/10 last:border-b-0 md:grid-cols-2"
              >
                <blockquote className="border-b border-ink/10 bg-sunken/60 p-5 sm:p-6 md:border-b-0 md:border-r md:p-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-muted-dim">
                    {voices.quoteCap}
                  </p>
                  <p className="mt-4 text-lg italic leading-relaxed text-ink">
                    &ldquo;{pair.quote}&rdquo;
                  </p>
                </blockquote>

                <div className="bg-surface/50 p-5 sm:p-6 md:p-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-primary">
                    {voices.answerCap}
                  </p>
                  <p className="mt-4 leading-relaxed text-muted">
                    {pair.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
