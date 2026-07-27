"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { PROJECTS, type Project } from "@/lib/constants";

/**
 * Numbered work card.
 *
 * The screenshot is held at its native 19:9 so `object-cover` never has to
 * scale it up - cropping a desktop capture to a squarer box zooms straight
 * past the site's own layout. The card gets its height from a caption bar
 * under the image instead, which also keeps the title off the screenshot's
 * own copy. Only the big index stays overlaid, on a short scrim.
 */
function WorkCard({ project, index }: { project: Project; index: number }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.title} - visit live site`}
      className="group relative block w-[78vw] max-w-[520px] shrink-0 snap-center overflow-hidden rounded-2xl border border-ink/10 bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow"
    >
      <div className="relative aspect-[19/9] w-full overflow-hidden">
        {project.image ? (
          /* Quality is raised from the default 75 - these text-heavy
             screenshots soften noticeably under normal compression. */
          <Image
            src={project.image}
            alt={`${project.title} website screenshot`}
            fill
            sizes="(max-width: 640px) 78vw, 520px"
            quality={90}
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface via-base to-sunken">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-surface/70 font-display text-2xl text-primary backdrop-blur">
              {project.monogram}
            </span>
          </div>
        )}

        {/* Short scrim - just enough to seat the index, not enough to wash out
            the screenshot. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
        />

        {/* Hover arrow, top-right. */}
        <span className="absolute right-4 top-4 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:bg-primary group-hover:opacity-100">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M7 17L17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </span>

        <p className="absolute bottom-4 left-5 font-display text-3xl font-extrabold leading-none tracking-tight text-white sm:text-[2.5rem]">
          {number}
        </p>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <h3 className="truncate text-lg font-bold leading-tight text-ink sm:text-xl">
          {project.title}
        </h3>
        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
          {project.category}
        </p>
      </div>
    </a>
  );
}

/**
 * Horizontal inset shared by the headline and the card rail. Deliberately the
 * same scale as the navbar's container so the section lines up with it.
 */
const GUTTER = "w-full max-w-[1920px] px-6 sm:px-10 lg:px-32 2xl:px-44";

/**
 * Left headline + right "All Works" pill.
 * `items-start` puts the pill level with the headline's first line rather
 * than its baseline.
 */
function Header() {
  return (
    <div
      className={`mx-auto flex flex-wrap items-start justify-between gap-6 ${GUTTER}`}
    >
      <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
        {/* Typographic apostrophe, not the straight quote. */}
        <WordReveal text="Let’s See" className="text-ink" />
        <br />
        <WordReveal text="Our " className="text-ink" delay={0.12} />
        <WordReveal text="Work" className="text-primary" delay={0.24} />
      </h2>

      {/* Inverted pill: `ink` fill with `surface` text flips correctly in both
          themes - white pill on dark, black pill on light. */}
      <Reveal delay={0.2}>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface transition-all duration-300 hover:bg-primary hover:text-on-primary hover:shadow-glow"
        >
          All Works
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </Reveal>
    </div>
  );
}

/**
 * Scroll-driven horizontal work gallery.
 * The tall section pins its content full-screen while vertical scroll
 * pans the card strip sideways. Cards alternate a small vertical offset
 * so the strip reads as a staggered row rather than a flat rail.
 * Falls back to a native swipeable row under reduced motion.
 */
export default function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);

  // How far the strip must travel: its full width minus one viewport.
  useEffect(() => {
    const measure = () => {
      if (!stripRef.current) return;
      setRange(Math.max(0, stripRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reduced]);

  const cards = PROJECTS.map((project, i) => (
    <div key={project.title} className={i % 2 === 1 ? "sm:pt-12" : ""}>
      <WorkCard project={project} index={i} />
    </div>
  ));

  // Reduced motion: plain swipeable row, no scroll-jacking.
  if (reduced) {
    return (
      <section className="relative py-28 sm:py-36">
        <GlowOrb className="right-0 top-16 bg-primary/15" size={480} />
        <div className="relative">
          <Header />
          <div
            className={`mx-auto mt-12 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto pb-4 ${GUTTER}`}
          >
            {cards}
          </div>
        </div>
      </section>
    );
  }

  return (
    // Shorter than the old 280vh: the narrower cards make for a shorter strip,
    // so the same scroll length would pan noticeably slower.
    <section ref={sectionRef} className="relative h-[230vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <GlowOrb className="right-0 top-16 bg-primary/15" size={480} />

        <div className="relative">
          <Header />

          <motion.div
            ref={stripRef}
            style={{ x }}
            className={`mx-auto mt-10 flex items-start gap-6 sm:mt-12 ${GUTTER}`}
          >
            {cards}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
