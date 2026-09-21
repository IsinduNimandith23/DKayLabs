import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import ServicesIndex from "@/components/ui/ServicesIndex";
import { SERVICES } from "@/lib/constants";

// The headline's three lines, in the homepage's light / medium / black
// ladder. `indent` staggers CORE in under the tail of OUR, as WorkTogether
// does with WORK.
const LINES = [
  { text: "Our", weight: "font-extralight text-ink", indent: false },
  { text: "Core", weight: "font-medium text-ink", indent: true },
  { text: "Services", weight: "font-black text-primary", indent: false },
];

/**
 * /services: a giant staggered headline, then the full service index.
 *
 * Top padding is lighter than the bottom - <main> already adds .pt-nav to
 * clear the fixed navbar.
 */
export default function Services() {
  return (
    <section id="services" className="relative scroll-mt-24 pb-10 pt-10 sm:pt-16">
      {/* The column is the size container, so the headline scales with it
          rather than the viewport and never outgrows the list below. */}
      <div className="mx-auto max-w-5xl px-6 [container-type:inline-size]">
        <h1
          aria-label="Our core services"
          className="font-machina uppercase leading-[0.8] tracking-[-0.04em]"
        >
          {LINES.map((line, i) => (
            <Reveal key={line.text} delay={i * 0.12}>
              <span
                aria-hidden="true"
                className={`block text-[17cqw] ${line.weight} ${line.indent ? "pl-[30%]" : ""}`}
              >
                {line.text}
              </span>
            </Reveal>
          ))}
        </h1>

        <div className="mt-[max(2.5rem,7cqw)] flex items-end justify-between gap-8">
          <Reveal delay={0.35}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              From first pixel to production AI - {SERVICES.length} ways we help
              you build, launch and grow. Open any one for what&apos;s included
              and how long it takes.
            </p>
          </Reveal>

          <Reveal direction="scale" delay={0.45} className="shrink-0">
            {/* The artwork points up-right; flipped to aim down at the list. */}
            <Image
              src="/button.png"
              alt=""
              width={261}
              height={261}
              priority
              className="h-[max(2.5rem,7cqw)] w-[max(2.5rem,7cqw)] rotate-180"
            />
          </Reveal>
        </div>

        <div className="mt-[max(3.5rem,9cqw)]">
          <ServicesIndex />
        </div>
      </div>
    </section>
  );
}
