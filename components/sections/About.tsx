import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";

const STATS = [
  { value: "100%", label: "Client-first" },
  { value: "24/7", label: "Always shipping" },
  { value: "∞", label: "Ambition" },
];

/**
 * /about: headline + mission, a big-type statement, the three stats as a
 * hairline row, and the team line in the framed panel the homepage reviews
 * use.
 */
export default function About() {
  return (
    // Last section before the footer: the bottom padding tops PageHero's own
    // pb-10 up to the py-28 / sm:py-36 rhythm the other sections use.
    <div id="about" className="scroll-mt-24 pb-[4.5rem] sm:pb-[6.5rem]">
      <PageHero
        label="Built to help you win"
        lines={["Built", "To Help", "You Win"]}
        intro={
          <>
            DKayLABS exists for the builders, the challengers, and the brands
            that play to win. We fuse sharp design, hardened engineering, and
            emerging AI into digital products that don&apos;t just keep up -
            they set the pace.
          </>
        }
      >
        <p className="max-w-4xl font-machina text-[length:clamp(1.75rem,4.6vw,3.25rem)] leading-[1.1] tracking-[-0.02em]">
          <WordReveal text="No templates. No filler." className="font-black text-primary" />{" "}
          <WordReveal
            text="Every line of code and every pixel is engineered to push you a level above the competition."
            className="font-extralight text-ink"
            delay={0.2}
          />
        </p>

        <ul className="mt-20 grid grid-cols-3 border-y border-ink/20 sm:mt-28">
          {STATS.map((stat, i) => (
            <li
              key={stat.label}
              className={`py-8 sm:py-12 ${i > 0 ? "border-l border-ink/20 pl-4 sm:pl-8" : ""}`}
            >
              <Reveal delay={i * 0.12}>
                <p className="font-machina text-[length:clamp(1.5rem,7.5vw,5.5rem)] font-black leading-none tracking-[-0.03em] text-primary">
                  {stat.value}
                </p>
                <p className="mt-3 font-machina text-xs text-ink/60 sm:text-sm">{stat.label}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-20 sm:mt-28">
          <figure className="rounded-3xl bg-sunken p-8 dark:bg-[#1e1e1e] sm:p-12 lg:p-16">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 dark:bg-[#262626]">
              <svg width="16" height="14" viewBox="0 0 14 12" fill="currentColor" aria-hidden className="text-primary">
                <path d="M0 12V7.2C0 3.4 1.9.9 5.3 0l.7 1.5C4.2 2.2 3.3 3.5 3.2 5.3H6V12H0Zm8 0V7.2C8 3.4 9.9.9 13.3 0l.7 1.5c-1.8.7-2.7 2-2.8 3.8H14V12H8Z" />
              </svg>
            </span>
            <blockquote className="mt-6 max-w-3xl font-machina text-[length:clamp(1.5rem,4vw,2.75rem)] font-light leading-[1.15] tracking-[-0.02em] text-ink">
              We measure success by how far our{" "}
              <span className="font-black text-primary">partners climb.</span>
            </blockquote>
            <figcaption className="mt-8 font-machina text-sm text-ink/60">
              The DKayLABS Team
            </figcaption>
          </figure>
        </Reveal>
      </PageHero>
    </div>
  );
}
