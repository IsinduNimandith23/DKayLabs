"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GlowOrb from "@/components/ui/GlowOrb";
import WordReveal from "@/components/ui/WordReveal";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { SITE } from "@/lib/constants";

// 3D is client-only & heavy - load it lazily so it never blocks first paint.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

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
  const reduced = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Parallax glow accents */}
      <GlowOrb className="-left-32 top-20" size={520} />
      <GlowOrb className="-right-24 bottom-0 bg-crimson/20" size={420} />

      {/* 3D layer (absolute, behind content). Static fallback if reduced motion. */}
      <div className="absolute inset-0 z-0">
        {reduced ? (
          <div className="flex h-full items-center justify-center">
            <Image
              src="/logo.png"
              alt=""
              aria-hidden
              width={340}
              height={340}
              className="object-contain opacity-30 blur-[1px] drop-shadow-[0_0_40px_rgba(255,46,63,0.5)]"
            />
          </div>
        ) : (
          <HeroScene />
        )}
        {/* Vignette so text stays legible over the 3D. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-obsidian/40 via-transparent to-obsidian" />
      </div>

      {/* Foreground content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-6xl px-6 text-center"
      >
        <motion.p
          variants={item}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-crimson"
        >
          Digital Services · Engineered to Win
        </motion.p>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
          <WordReveal text="WE BUILD WHAT" className="text-metal" delay={0.3} />
          <br />
          <WordReveal text="PUTS YOU " className="text-snow" delay={0.6} />
          <WordReveal
            text="ABOVE"
            className="text-crimson drop-shadow-[0_0_20px_rgba(255,46,63,0.6)]"
            delay={0.8}
          />
        </h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-xl text-base text-silver sm:text-lg"
        >
          {SITE.name} crafts cutting-edge websites, SaaS platforms, and AI-powered
          products for brands that refuse to settle for ordinary.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/services"
            className="btn-shine group w-full cursor-pointer rounded-full bg-crimson px-8 py-4 text-sm font-bold uppercase tracking-wider text-snow shadow-glow transition-all duration-200 hover:bg-crimson-dark hover:shadow-glow-lg sm:w-auto"
          >
            Explore Services
          </Link>
          <Link
            href="/contact"
            className="w-full cursor-pointer rounded-full border border-silver/30 bg-charcoal/40 px-8 py-4 text-sm font-bold uppercase tracking-wider text-snow backdrop-blur transition-all duration-200 hover:border-silver/60 hover:bg-charcoal/70 sm:w-auto"
          >
            Start a Project
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      {!reduced && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-silver/40 p-1.5">
            <motion.span
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="h-2 w-1 rounded-full bg-crimson"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
