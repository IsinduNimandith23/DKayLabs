import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { PRICING_NOTE } from "@/lib/constants";

const STEPS = [
  {
    title: "Tell us the plan",
    body: "Share what you're building, who it's for and when you need it. A few lines is enough to start.",
  },
  {
    title: "Get a tailored quote",
    body: "We scope the features, complexity and timeline, then send a quote built around your project.",
  },
  {
    title: "We build & launch",
    body: "Design, development and launch - with you in the loop at every step, not just at the end.",
  },
];

/**
 * /services: the three steps from enquiry to launch, plus the pricing note
 * that used to live in every service modal. Same framed panel and card
 * treatment as the homepage's client reviews.
 */
export default function HowWeWork() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="relative mx-auto max-w-5xl px-6">
        <h2 className="mb-14 font-machina text-[length:clamp(2.5rem,7vw,4.5rem)] leading-none tracking-[-0.02em] sm:mb-20">
          <WordReveal text="How" className="font-extralight text-ink" />
          <WordReveal text="We" className="font-medium text-ink" delay={0.1} />
          <WordReveal text="Work" className="font-black text-primary" delay={0.2} />
        </h2>

        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-sunken p-5 dark:bg-[#1e1e1e] sm:p-10 lg:px-12 lg:py-14">
            <ol className="grid gap-4 md:grid-cols-3 md:gap-6 lg:gap-10">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="flex flex-col rounded-lg bg-surface p-5 shadow-bevel dark:bg-[#131313] dark:shadow-none sm:p-6"
                >
                  <span className="font-machina text-[2.75rem] font-black leading-none text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-8 font-machina text-lg font-bold leading-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid gap-3 border-t border-ink/15 pt-8 sm:mt-10 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8 sm:pt-10">
              <p className="font-machina text-sm text-ink/60">On pricing</p>
              <p className="max-w-2xl text-sm leading-relaxed text-ink/90">{PRICING_NOTE}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
