"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import WordReveal from "@/components/ui/WordReveal";
import { SITE } from "@/lib/constants";

// Staggered entrance for the hero copy.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/*
        Hero artwork - full-bleed, composed with open copy space on the left
        and the subject on the right. See the note on the Image below for why
        it switches between cover and contain by breakpoint.
      */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-poster.jpg"
          alt=""
          aria-hidden
          fill
          priority
          quality={90}
          sizes="100vw"
          /*
            lg+: `contain` so the artwork (1672x941, ~16:9) is never cropped.
            `cover` on a full-bleed hero was cutting ~11% off the sides and
            scaling it up. Anchored right so any slack falls on the left,
            which is where the copy sits anyway.
            Below lg: `cover` still, since `contain` would letterbox badly
            on a portrait viewport.
          */
          className="object-cover object-[62%_center] lg:object-contain lg:object-right dark:opacity-[0.72]"
        />

        {/* Small screens only: the crop puts the subject behind the copy
            there, so a top-down fade is needed for legibility.
            From lg up the artwork is left completely un-washed in light mode.
            Uses `base` rather than white so it inverts in dark mode. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-base/90 via-base/65 to-transparent lg:hidden" />

        {/*
          Dark mode only.
          The artwork is a LIGHT asset - white background - so on a black page
          two things break: the copy (now near-white) lands on a white field
          and disappears, and the page/image boundary shows as a hard vertical
          seam. This scrim keeps the left ~40% solid `base`, so the copy always
          sits on the page colour, then fades out before the subject so the
          robot itself is never covered.
          The proper fix is a dark-background export of the artwork; this makes
          the light asset usable in the meantime.
        */}
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-base from-40% to-transparent to-68% dark:lg:block" />
      </div>

      {/* Foreground content - left aligned into the artwork's copy space.
          Near-full-width container so the copy sits close to the viewport
          edge rather than floating in a narrow centred column. */}
      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-32 2xl:px-44">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl text-left 2xl:max-w-3xl"
        >
          <motion.p
            variants={item}
            className="label-mono mb-4"
          >
            Digital Services · Engineered to Win
          </motion.p>

          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl 2xl:text-7xl">
            <WordReveal text="WE BUILD WHAT" className="text-metal" delay={0.3} />
            <br />
            <WordReveal text="PUTS YOU " className="text-ink" delay={0.6} />
            <WordReveal text="ABOVE" className="text-primary" delay={0.8} />
          </h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-base text-muted sm:text-lg 2xl:max-w-xl 2xl:text-xl"
          >
            {SITE.name} crafts cutting-edge websites, SaaS platforms, and AI-powered
            products for brands that refuse to settle for ordinary.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/services"
              className="btn-shine group cursor-pointer rounded-full bg-primary px-8 py-4 text-center text-sm font-bold uppercase tracking-wider text-on-primary shadow-glow transition-all duration-200 hover:bg-primary-dark hover:shadow-glow-lg"
            >
              Explore Services
            </Link>
            <Link
              href="/contact"
              className="cursor-pointer rounded-full border border-ink/15 bg-surface/80 px-8 py-4 text-center text-sm font-bold uppercase tracking-wider text-ink backdrop-blur transition-all duration-200 hover:border-primary/40 hover:bg-surface"
            >
              Start a Project
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
