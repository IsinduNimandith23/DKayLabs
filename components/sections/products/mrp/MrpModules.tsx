import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { MRP_PAGE } from "@/lib/constants";

const { modules } = MRP_PAGE;

/**
 * Status pill per module. Green reads "you can have this now", blue "this is
 * being built", grey "this is on paper" - so the page can't be mistaken for
 * claiming more than it ships.
 */
const TONE: Record<(typeof modules.items)[number]["tone"], string> = {
  live: "border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/40 dark:text-emerald-300",
  next: "border-sky-600/40 bg-sky-500/10 text-sky-700 dark:border-sky-400/40 dark:text-sky-300",
  planned: "border-ink/15 bg-surface/60 text-muted-dim",
};

/** Row tint - only the live module gets one, so the eye finds it first. */
const ROW_TINT: Record<(typeof modules.items)[number]["tone"], string> = {
  live: "bg-gradient-to-r from-emerald-500/[0.07] to-transparent",
  next: "",
  planned: "",
};

/** Honest per-module status: what runs, what's next, what's still on paper. */
export default function MrpModules() {
  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="label-mono mb-4">{modules.eyebrow}</p>
          </Reveal>
          <h2 className="text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            <WordReveal text={modules.headingLead} className="text-ink" />
            <WordReveal
              text={modules.headingAccent}
              className="text-primary"
              delay={0.2}
            />
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-5 leading-relaxed text-muted">{modules.lede}</p>
          </Reveal>
        </div>

        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-ink/10">
            {modules.items.map((item) => (
              <div
                key={item.name}
                className={`grid items-start gap-4 border-b border-ink/10 bg-surface/50 p-5 last:border-b-0 sm:p-6 md:grid-cols-[200px_1fr_130px] md:gap-8 md:p-7 ${ROW_TINT[item.tone]}`}
              >
                {/* On a phone the status belongs on the same line as the module
                    name - it's the whole point of the section, and stacked it
                    ends up below the body copy. md:contents dissolves this
                    wrapper so the three-column desktop grid is unchanged; the
                    explicit col-start/row-start below are what keep the body in
                    the middle column, since the DOM order is now name, status,
                    body. */}
                <div className="flex items-start justify-between gap-4 md:contents">
                  <div className="md:col-start-1">
                    <h3 className="text-lg font-bold text-ink">{item.name}</h3>
                    <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-dim">
                      {item.meta}
                    </p>
                  </div>

                  <span
                    className={`mt-1 inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.11em] md:col-start-3 md:mt-0 md:justify-self-end ${TONE[item.tone]}`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="leading-relaxed text-muted md:col-start-2 md:row-start-1">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
