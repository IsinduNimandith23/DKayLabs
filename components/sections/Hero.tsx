import Image from "next/image";
import Link from "next/link";

/**
 * Homepage hero - type only, no artwork.
 *
 * Every number below is measured off the Figma export (7681x4321 = a
 * 1920x1080 frame at 4.0005x) by reading the PNG's pixels and solving against
 * Neue Machina's own metrics (upem 1000, cap 0.705, asc 0.735, desc -0.23,
 * lineGap 0, x-height 0.495). Nothing here is eyeballed.
 *
 * Headline: font-size 214px at a 1920 frame = 11.144vw. Cap height measures
 * 603.5px in the export against a predicted 603.6 - the size is exact.
 *
 * LEADING IS NOT UNIFORM. The three baseline advances in the Figma are
 * 0.6343em, 0.4252em and 0.6005em - the lines were placed by hand, almost
 * certainly so the gaps read evenly to the eye despite "meets" being all
 * x-height where the others are caps. A single `line-height` cannot
 * reproduce that, so each line carries its own offset.
 *
 * The mechanism: line-height is 1, which is the one value where the glyphs
 * sit entirely INSIDE the line box (asc 0.735 + desc 0.23 = 0.965 < 1), so
 * `overflow-hidden` masks the reveal without shaving a cap or a descender
 * and needs no padding/negative-margin compensation at all. Each line then
 * pulls itself up by (advance - 1) to land on its measured baseline.
 * `flex flex-col` is required: as plain blocks these margins would collapse.
 *
 * The entrance is CSS (.hero-line / .hero-cta in globals.css), not framer:
 * the framer variants server-rendered the headline hidden and only revealed
 * it after hydration, which held the page's LCP back by over a second on
 * mobile. Same timing as before - lines rise from behind their masks on a
 * 0.11s stagger after 0.15s, the CTA follows - and reduced motion is handled
 * by the global prefers-reduced-motion rule. This is now a server component.
 */
const LINES: { text: string; bold?: boolean; mt?: string }[] = [
  { text: "Where" },
  { text: "CODE", bold: true, mt: "-0.3657em" }, // advance 0.6343em
  { text: "meets", mt: "-0.5748em" }, //             advance 0.4252em
  { text: "CRAFT.", bold: true, mt: "-0.3995em" }, // advance 0.6005em
];

const FIRST_DELAY = 0.15;
const STAGGER = 0.11;
// The CTA was the fifth child of the staggered container.
const CTA_DELAY = FIRST_DELAY + STAGGER * LINES.length;

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden py-[calc(var(--nav-h)+1.5rem)]"
    >
      {/* The DotField behind this copy is page-level - see app/page.tsx. */}

      {/*
        The frame insets the copy 227 of 1920px on BOTH sides = 11.82%, and
        "Together?" sits flush to the right one. min() holds that ratio up to
        1920 and then freezes it, matching the max on the font sizes so the
        whole composition stops scaling at the frame width.
      */}
      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-[min(11.82vw,227px)]">
        <div className="flex flex-col items-center gap-10 [--hero-fs:min(calc((100vw_-_3rem)/4.2),26svh)] sm:gap-12 sm:[--hero-fs:min(calc((100vw_-_5rem)/4.2),26svh)] lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:[--hero-fs:clamp(3rem,11.144vw,13.375rem)]">
          {/*
            Below lg the composition stacks, so the frame's 11.144vw would
            leave the headline filling barely half the width of a phone. There
            it is sized off the widest line instead: "CRAFT." is 3.947em of
            advance, so dividing the content width (viewport less the px-6 /
            px-10 gutters) by 4.2 fills it with ~6% slack for a desktop
            scrollbar. The 26svh cap keeps the stack (headline ~2.66em tall)
            inside a landscape phone. lg returns to the measured frame size.

            The stack is centred on the page below lg; lg restores the frame's
            left-aligned headline (lg:items-end on the parent overrides
            items-center).
          */}
          <h1 className="flex flex-col text-center font-machina lg:text-left text-[length:var(--hero-fs)] leading-none">
              {LINES.map(({ text, bold, mt }, i) => (
                <span
                  key={text}
                  style={{ marginTop: mt }}
                  className="block overflow-hidden"
                >
                  <span
                    style={{ animationDelay: `${FIRST_DELAY + STAGGER * i}s` }}
                    className={`hero-line block ${
                      bold ? "font-extrabold text-primary" : "font-light text-ink"
                    }`}
                  >
                    {text}
                  </span>
                  {/* A real word boundary for the TEXT ("Where CODE meets
                      CRAFT.", not "WhereCODEmeetsCRAFT.") - trailing white
                      space at the end of a block line renders as nothing. */}
                  {" "}
                </span>
              ))}
            </h1>

          {/*
            CTA. font-size 74.8px at a 1920 frame = 3.898vw; baseline advance
            0.7849em.

            lg:mb lifts it onto the Figma's vertical: bottom-aligning the two
            boxes would drop "Together?"'s baseline 34.5px BELOW "CRAFT."'s,
            where the frame puts it 12.6px above - 47.1px of correction, which
            is 0.63 of the CTA's own em.

            lg:-mr makes the INK flush to the right inset rather than the
            advance box; '?' carries a 0.374em right side bearing that would
            otherwise hold the block 28px short of where the frame has it.
          */}
          <div
            style={{ animationDelay: `${CTA_DELAY}s` }}
            className="hero-cta shrink-0 lg:mb-[0.63em] lg:-mr-[0.374em]"
          >
            <Link
              href="/contact"
              className="group inline-flex flex-col items-center font-machina text-[length:calc(var(--hero-fs)*0.4)] leading-none text-ink lg:text-[clamp(1.5rem,3.898vw,4.675rem)]"
            >
              {/* Centred over "Together?", as the frame has it: the two ink
                  spans' centres sit 11.5px apart out of 1528, and "Build" is
                  indented 0.779em - far past any side bearing.

                  The nudge is the difference between how CSS centres and how
                  the frame does. `items-center` centres ADVANCE boxes, and
                  '?' carries a 0.374em right side bearing, so centring the
                  boxes lands "Build" 0.176em right of where centring the ink
                  puts it. Translate, so it stays out of layout. */}
              <span className="inline-flex -translate-x-[0.176em] items-baseline gap-[0.0907em]">
                <span className="font-normal">Build</span>
                {/* 0.735em across - exactly the ascender height - with its
                    bottom on the baseline, so its top lands on the ascender,
                    which is how the frame places it.

                    Baseline-aligned (an image's baseline is its bottom edge)
                    rather than offset from the line box top: the font leaves
                    USE_TYPO_METRICS off, so Windows lays it out with the win
                    metrics (1.04/0.27), not hhea (0.735/0.23), which drops
                    the baseline 0.1325em lower than an offset can predict. */}
                <Image
                  src="/button.png"
                  alt=""
                  aria-hidden
                  width={261}
                  height={261}
                  // Eager, not `priority`: it's above the fold so it mustn't
                  // lazy-load, but a decorative arrow shouldn't compete with
                  // the real LCP for fetchpriority=high.
                  loading="eager"
                  className="h-[0.735em] w-[0.735em] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[0.12em] group-hover:translate-x-[0.12em]"
                />
              </span>
              {/* " " keeps the link's text "Build Together?", not
                  "BuildTogether?" - white space between flex items renders
                  as nothing. */}{" "}
              <span className="font-extrabold" style={{ marginTop: "-0.2151em" }}>
                Together?
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
