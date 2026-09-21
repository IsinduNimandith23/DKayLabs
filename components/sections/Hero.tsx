"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import DotField from "@/components/ui/DotField";

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
 */
const LINES: { text: string; bold?: boolean; mt?: string }[] = [
  { text: "Where" },
  { text: "CODE", bold: true, mt: "-0.3657em" }, // advance 0.6343em
  { text: "meets", mt: "-0.5748em" }, //             advance 0.4252em
  { text: "CRAFT.", bold: true, mt: "-0.3995em" }, // advance 0.6005em
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};

// 102% clears the line box (the glyphs occupy 0.965 of it), so each line is
// fully hidden behind its mask before it rises.
const line = {
  hidden: { y: "102%" },
  show: { y: "0%", transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] } },
};

const cta = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/*
        Oversized on purpose: the field lags the page by PARALLAX of the
        scroll, so a flush inset-0 canvas would open a gap along the top edge
        as the hero leaves. 15% of headroom covers the whole travel, and the
        section already clips.
      */}
      <DotField className="absolute inset-x-0 -top-[15%] z-0 h-[130%] w-full" />

      {/*
        The frame insets the copy 227 of 1920px on BOTH sides = 11.82%, and
        "Together?" sits flush to the right one. min() holds that ratio up to
        1920 and then freezes it, matching the max on the font sizes so the
        whole composition stops scaling at the frame width.
      */}
      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-[min(11.82vw,227px)]">
        <motion.div
          variants={container}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "show"}
          className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <h1 className="flex flex-col font-machina text-[clamp(3rem,11.144vw,13.375rem)] leading-none">
            {LINES.map(({ text, bold, mt }) => (
              <span
                key={text}
                style={{ marginTop: mt }}
                className="block overflow-hidden"
              >
                <motion.span
                  variants={reduced ? undefined : line}
                  className={`block ${
                    bold ? "font-extrabold text-primary" : "font-light text-ink"
                  }`}
                >
                  {text}
                </motion.span>
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
          <motion.div
            variants={reduced ? undefined : cta}
            className="shrink-0 lg:mb-[0.63em] lg:-mr-[0.374em]"
          >
            <Link
              href="/contact"
              className="group inline-flex flex-col items-center font-machina text-[clamp(1.5rem,3.898vw,4.675rem)] leading-none text-ink"
            >
              {/* Centred over "Together?", as the frame has it: the two ink
                  spans' centres sit 11.5px apart out of 1528, and "Build" is
                  indented 0.779em - far past any side bearing.

                  The nudge is the difference between how CSS centres and how
                  the frame does. `items-center` centres ADVANCE boxes, and
                  '?' carries a 0.374em right side bearing, so centring the
                  boxes lands "Build" 0.176em right of where centring the ink
                  puts it. Translate, so it stays out of layout. */}
              <span className="inline-flex -translate-x-[0.176em] items-start gap-[0.0907em]">
                <span className="font-normal">Build</span>
                {/* 0.735em across - exactly the ascender height - and offset
                    so its top lands on the ascender and its bottom on the
                    baseline, which is how the frame places it. */}
                <span
                  aria-hidden
                  className="mt-[0.0175em] grid h-[0.735em] w-[0.735em] shrink-0 place-items-center rounded-full bg-primary text-on-primary transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[0.12em] group-hover:translate-x-[0.12em] group-hover:bg-primary-dark"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[0.411em] w-[0.411em]"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </span>
              </span>
              <span className="font-extrabold" style={{ marginTop: "-0.2151em" }}>
                Together?
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
