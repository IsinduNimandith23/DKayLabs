import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { MRP_PAGE } from "@/lib/constants";
import { MockPanel, MockTable } from "./MockUI";

const { features } = MRP_PAGE;

/**
 * What the inventory module actually does, three rows deep. Copy and visual
 * swap sides row to row on desktop; on mobile the copy always leads.
 *
 * Anchor target for the hero's secondary CTA.
 */
export default function MrpFeatures() {
  return (
    <section id="whats-live" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-2xl">
          <Reveal>
            <p className="label-mono mb-4">{features.eyebrow}</p>
          </Reveal>
          <h2 className="text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            <WordReveal text={features.headingLead} className="text-ink" />
            <WordReveal
              text={features.headingAccent}
              className="text-metal"
              delay={0.2}
            />
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-5 leading-relaxed text-muted">{features.lede}</p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-20 sm:gap-28">
          {features.rows.map((row, index) => {
            // Odd rows put the visual first on desktop only - the copy has to
            // stay above its own illustration once the grid collapses.
            const flipped = index % 2 === 1;

            return (
              <div
                key={row.title}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal className={flipped ? "lg:order-2" : undefined}>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                      {row.eyebrow}
                    </p>
                    <h3 className="mt-3 text-2xl font-extrabold leading-[1.15] tracking-[-0.025em] text-ink sm:text-3xl">
                      {row.title}
                    </h3>
                    <p className="mt-5 leading-relaxed text-muted">{row.body}</p>
                    <div className="mt-7 flex flex-wrap gap-2">
                      {row.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-md border border-ink/10 bg-surface/60 px-3 py-1.5 font-mono text-[11px] text-muted"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>

                <Reveal
                  delay={0.12}
                  className={flipped ? "lg:order-1" : undefined}
                >
                  <MockPanel title={row.tableTitle} meta={row.tableMeta}>
                    <MockTable table={row.table} />
                  </MockPanel>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
