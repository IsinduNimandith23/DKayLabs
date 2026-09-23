import Image from "next/image";
import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

/**
 * Inner-page opener: a giant staggered three-line headline in the homepage's
 * light / medium / black ladder, then an intro line with the arrow aimed down
 * at whatever follows. `children` sits under it, inside the same column.
 *
 * Headline size is 16cqw of the column, and no line may wrap: a line fills
 * (advance in em x 16)% of it, plus 16% for the indented middle one. The
 * indent is deliberately short - the middle line should tuck under the tail
 * of the first, not drift off to the right. Widest in use are PRODUCTS
 * (Black, 5.69em = 91%) and "TO HELP" (Medium, 3.98em + indent = 80%).
 * Measure a new line against that before adding it.
 */
export default function PageHero({
  label,
  lines,
  intro,
  children,
}: {
  /** Accessible name for the headline; the visible lines are aria-hidden. */
  label: string;
  /** Exactly three lines: light, medium (indented), black in primary. */
  lines: [string, string, string];
  intro: ReactNode;
  children?: ReactNode;
}) {
  const styles = [
    "font-extralight text-ink",
    "font-medium text-ink pl-[16%]",
    "font-black text-primary",
  ];

  // Top padding is lighter than the bottom - <main> already adds .pt-nav to
  // clear the fixed navbar.
  return (
    <section className="relative pb-10 pt-10 sm:pt-16">
      {/* The column is the size container, so the headline scales with it
          rather than the viewport and never outgrows the content below. */}
      <div className="mx-auto max-w-5xl px-6 [container-type:inline-size]">
        <h1 aria-label={label} className="font-machina uppercase leading-[0.8] tracking-[-0.04em]">
          {lines.map((text, i) => (
            <Reveal key={text} delay={i * 0.12}>
              <span aria-hidden="true" className={`block text-[16cqw] ${styles[i]}`}>
                {text}
              </span>
            </Reveal>
          ))}
        </h1>

        <div className="mt-[max(2.5rem,7cqw)] flex items-end justify-between gap-8">
          <Reveal delay={0.35}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-muted">{intro}</p>
          </Reveal>

          <Reveal direction="scale" delay={0.45} className="shrink-0">
            {/* The artwork points up-right; flipped to aim down the page. */}
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

        {children && <div className="mt-[max(3.5rem,9cqw)]">{children}</div>}
      </div>
    </section>
  );
}
