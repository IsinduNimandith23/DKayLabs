import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import { FOUNDERS, PROJECTS, SERVICES, SITE } from "@/lib/constants";

/** "Isindu Nimandith" -> "IN". Stands in for a photo until there is one. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

/** "https://www.linkedin.com/in/x" -> "LinkedIn", "https://github.com/x" -> "GitHub". */
function profileLabel(href: string) {
  const host = new URL(href).hostname.replace(/^www\./, "");
  const known: Record<string, string> = {
    "linkedin.com": "LinkedIn",
    "github.com": "GitHub",
    "x.com": "X",
    "twitter.com": "X",
    "behance.net": "Behance",
    "dribbble.com": "Dribbble",
  };
  return known[host] ?? host;
}

/** Client work that is live on its own domain (in-house products excluded). */
const liveClientSites = PROJECTS.filter((p) => p.url?.startsWith("http")).length;

/*
 * Numbers a visitor can check against the rest of the site, all derived from
 * lib/constants.ts so they can't go stale. These replaced "100% Client-first",
 * "24/7 Always shipping" and "∞ Ambition" - slogans dressed as stats, which
 * read as filler to a careful buyer and gave answer engines nothing to quote.
 */
const STATS = [
  { value: String(liveClientSites), label: "Client sites live" },
  { value: String(SERVICES.length), label: "Services in-house" },
  { value: SITE.foundingYear, label: `Founded in ${SITE.location.split(",")[0]}` },
];

/**
 * /about: headline + mission, a big-type statement, the three stats as a
 * hairline row, then the people behind the company - a heading, an intro
 * line and a card per founder. app/about/page.tsx closes with ClosingCta.
 */
export default function About() {
  return (
    // The bottom padding tops PageHero's own pb-10 up to the py-28 / sm:py-36
    // rhythm the other sections use, before the ClosingCta that follows.
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

        {/* The people behind it: heading, one intro line, a card per founder.
            Names are plain text, NOT WordReveal - that splits text into
            per-word spans, and these have to reach the HTML Google fetches
            as whole names for a name search to land here. */}
        <section aria-labelledby="founders-heading" className="mt-28 sm:mt-36">
          <h2
            id="founders-heading"
            className="font-machina text-[length:clamp(2.25rem,7vw,4.5rem)] leading-none tracking-[-0.02em]"
          >
            <WordReveal text="The people" className="font-extralight text-ink" />{" "}
            <WordReveal text="behind" className="font-medium text-ink" delay={0.1} />{" "}
            <WordReveal text={`${SITE.name}.`} className="font-black text-primary" delay={0.2} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-muted sm:mt-8">
              {SITE.name} was started by two co-founders in {SITE.location},
              who wanted digital products built properly - designed with care,
              engineered to last.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2">
            {FOUNDERS.map((founder, i) => (
              <li key={founder.slug} id={founder.slug} className="scroll-mt-24">
                <Reveal delay={i * 0.12} className="h-full">
                  <article className="h-full rounded-3xl bg-sunken p-8 dark:bg-[#1e1e1e] sm:p-10">
                    {/* Headshot when there is one; initials until then. */}
                    {founder.photo ? (
                      <Image
                        src={founder.photo}
                        alt={`${founder.name}, ${founder.role} of ${SITE.name}`}
                        width={128}
                        height={128}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-machina text-xl font-black text-primary dark:bg-[#262626]"
                      >
                        {initials(founder.name)}
                      </span>
                    )}
                    <h3 className="mt-8 font-machina text-[length:clamp(1.5rem,3.2vw,2.25rem)] font-black leading-[1.1] tracking-[-0.02em] text-ink">
                      {founder.name}
                    </h3>
                    <p className="mt-2 font-machina text-sm text-primary">
                      {founder.role}, {SITE.name}
                    </p>
                    <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">
                      {founder.bio}
                    </p>
                    {founder.longBio?.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)} className="mt-4 text-[0.95rem] leading-relaxed text-muted">
                        {paragraph}
                      </p>
                    ))}
                    {/* The same profiles feed the Person node's sameAs - a
                        visible link and the structured data agree. */}
                    {founder.sameAs.length > 0 && (
                      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                        {founder.sameAs.map((href) => (
                          <li key={href}>
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer me"
                              className="inline-flex min-h-[44px] items-center font-machina text-sm text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                            >
                              {profileLabel(href)}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </PageHero>
    </div>
  );
}
