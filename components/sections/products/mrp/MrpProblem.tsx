import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { MRP_PAGE } from "@/lib/constants";

const { problem } = MRP_PAGE;

function CrossIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="mt-1 shrink-0 text-muted-dim"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="mt-1 shrink-0 text-primary"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** The spreadsheet, and what replaces it. Two cards, side by side. */
export default function MrpProblem() {
  return (
    <section className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="label-mono mb-4">{problem.eyebrow}</p>
          </Reveal>
          <h2 className="text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            <WordReveal text={problem.headingLead} className="text-ink" />
            <WordReveal
              text={problem.headingAccent}
              className="text-primary"
              delay={0.2}
            />
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-5 leading-relaxed text-muted">{problem.lede}</p>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="glass h-full rounded-2xl p-6 sm:p-8">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.13em] text-muted-dim">
                {problem.now.cap}
              </p>
              <h3 className="mt-3 text-xl font-bold text-ink">
                {problem.now.title}
              </h3>
              <ul className="mt-6 flex flex-col gap-4">
                {problem.now.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 leading-relaxed text-muted"
                  >
                    <CrossIcon />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            {/* The answer card - orange edge and a top wash so the eye lands
                here second. */}
            <div className="glass relative h-full overflow-hidden rounded-2xl border-primary/30 p-6 shadow-glow-soft sm:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/[0.08] to-transparent" />
              <div className="relative">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.13em] text-primary">
                  {problem.platform.cap}
                </p>
                <h3 className="mt-3 text-xl font-bold text-ink">
                  {problem.platform.title}
                </h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {problem.platform.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 leading-relaxed text-muted"
                    >
                      <CheckIcon />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
