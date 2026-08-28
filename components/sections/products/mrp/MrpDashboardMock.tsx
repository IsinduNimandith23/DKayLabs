import Reveal from "@/components/ui/Reveal";
import { MRP_PAGE } from "@/lib/constants";
import { MockPanel, MockTable, MockTag } from "./MockUI";

const { dashboard } = MRP_PAGE;

/**
 * Illustration of the live inventory dashboard, sitting under the hero.
 *
 * It mirrors the real screen - the same four figures across the top, recent
 * movements on the left, low stock on the right - so it can be replaced by
 * an actual screenshot later without redesigning the section around it.
 *
 * Presentational only. The <figcaption> carries the description for anyone
 * who can't see it; the sample numbers themselves say nothing useful aloud.
 */
export default function MrpDashboardMock() {
  return (
    <Reveal delay={0.15}>
      <figure className="mt-12 overflow-hidden rounded-2xl border border-ink/10 bg-base/80 shadow-bevel backdrop-blur sm:mt-20">
        {/* Browser chrome, so it reads as software rather than a table. */}
        <div className="flex items-center gap-2 border-b border-ink/10 bg-surface/70 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="ml-3 truncate font-mono text-[11px] text-muted-dim">
            {dashboard.url}
          </span>
        </div>

        <div className="p-4 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink sm:text-xl">
                {dashboard.title}
              </h2>
              <p className="mt-1 text-[13px] text-muted-dim">
                {dashboard.subtitle}
              </p>
            </div>
            {/* Looks like the primary action on the real screen. Not a link -
                there is nothing behind it. ml-auto keeps it pinned right once
                it wraps onto its own line on a phone, so it still reads as
                toolbar chrome rather than a stray call to action. */}
            <span className="ml-auto rounded-md bg-primary px-4 py-2 text-xs font-bold text-on-primary">
              {dashboard.action}
            </span>
          </div>

          {/* Two-up on a phone rather than a four-card stack - these are four
              short figures, and stacking them buries the panels below. */}
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {dashboard.kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-ink/10 bg-surface/60 p-3 sm:p-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-dim">
                  {kpi.label}
                </p>
                <p
                  className={`mt-2 text-2xl font-extrabold tabular-nums tracking-[-0.03em] sm:text-3xl ${
                    kpi.alert ? "text-amber-600 dark:text-amber-400" : "text-ink"
                  }`}
                >
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.55fr_1fr]">
            <MockPanel
              title={dashboard.movementsTitle}
              meta={dashboard.movementsMeta}
            >
              <MockTable table={dashboard.movements} />
            </MockPanel>

            <MockPanel
              title={dashboard.attentionTitle}
              meta={dashboard.attentionMeta}
            >
              <div>
                {dashboard.attention.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 border-b border-ink/[0.06] px-4 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] text-ink">{item.name}</p>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-muted-dim">
                        {item.meta}
                      </p>
                    </div>
                    <MockTag tone="low">{item.left}</MockTag>
                  </div>
                ))}
              </div>
            </MockPanel>
          </div>
        </div>

        <figcaption className="sr-only">{dashboard.caption}</figcaption>
      </figure>
    </Reveal>
  );
}
