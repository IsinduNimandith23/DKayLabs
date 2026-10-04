import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import RollText from "@/components/ui/RollText";

/*
 * The light / medium / black ladder PageHero and WorkTogether use, at a size
 * the longest line fits: "MESSAGE AWAY" (Black) and the indented "LEVEL IS
 * ONE" are the widest. Measure a copy change against those before making it.
 */
const LINES = [
  { text: "Your Next", style: "font-extralight text-ink" },
  { text: "Level Is One", style: "font-medium text-ink pl-[10%]" },
  { text: "Message Away", style: "font-black text-primary" },
];

/**
 * A page closer without a form: staggered headline, one line of copy, two
 * pill links, and the arrow mark. For pages that don't want WorkTogether's
 * full contact form - /about and the generic product layout.
 */
export default function ClosingCta() {
  return (
    <section className="relative pb-28 pt-8 sm:pb-36">
      {/* The column is the size container, so the headline scales with it
          rather than the viewport, as in PageHero. */}
      <div className="mx-auto max-w-5xl px-6 [container-type:inline-size]">
        <Reveal>
          <p className="font-machina text-sm text-ink/60">Ready when you are</p>
        </Reveal>

        <h2
          aria-label="Your next level is one message away"
          className="mt-6 font-machina uppercase leading-[0.8] tracking-[-0.04em]"
        >
          {LINES.map((line, i) => (
            <Reveal key={line.text} delay={i * 0.12}>
              <span aria-hidden="true" className={`block text-[11cqw] ${line.style}`}>
                {line.text}
              </span>
            </Reveal>
          ))}
        </h2>

        <div className="mt-[max(2.5rem,7cqw)] flex items-end justify-between gap-8">
          <Reveal delay={0.35}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Tell us what you&apos;re building. We&apos;ll bring the design,
              the engineering, and the obsession.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border-2 border-primary bg-primary px-6 py-3 font-machina text-sm font-bold text-on-primary transition-all duration-300 hover:shadow-glow"
              >
                <RollText>Start a project</RollText>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center rounded-full border-2 border-ink/80 px-6 py-3 font-machina text-sm font-bold text-ink transition-all duration-300 hover:border-primary hover:bg-primary hover:text-on-primary hover:shadow-glow"
              >
                <RollText>See services</RollText>
              </Link>
            </div>
          </Reveal>

          <Reveal direction="scale" delay={0.45} className="shrink-0">
            {/* Not rotated: it points up-right as on the homepage hero - this
                is the way out, not a pointer at more content below. */}
            <Image
              src="/button.png"
              alt=""
              width={261}
              height={261}
              className="h-[max(2.5rem,7cqw)] w-[max(2.5rem,7cqw)]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
