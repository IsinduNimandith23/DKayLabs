"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import { ProjectVisual } from "@/components/ui/ProjectCard";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { PROJECTS, type Project } from "@/lib/constants";

/** Big image-first card - title only; full details live on /portfolio. */
function WorkCard({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.title} - visit live site`}
      className="glass group flex w-[82vw] max-w-[680px] shrink-0 snap-center cursor-pointer flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
    >
      <ProjectVisual
        project={project}
        className="aspect-[19/9]"
        sizes="(max-width: 640px) 82vw, 680px"
      />

      <div className="flex items-center justify-between gap-4 p-6">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
            {project.category}
          </p>
          <h3 className="mt-1.5 truncate text-xl text-ink sm:text-2xl">
            {project.title}
          </h3>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="shrink-0 text-muted-dim transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
        >
          <path d="M7 17L17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </div>
    </a>
  );
}

/** Final card in the strip - routes to the full portfolio. */
function ViewAllCard() {
  return (
    <Link
      href="/portfolio"
      className="glass group flex w-[70vw] max-w-[380px] shrink-0 snap-center cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl text-center transition-all duration-300 hover:border-primary/40 hover:shadow-glow"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-glow">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
      <span className="font-display text-2xl text-ink">See all work</span>
      <span className="text-xs uppercase tracking-widest text-muted-dim">
        {PROJECTS.length} live projects
      </span>
    </Link>
  );
}

function Header() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 text-center">
      <Reveal>
        <p className="label-mono mb-3">
          Selected Work
        </p>
      </Reveal>
      <h2 className="text-3xl font-bold sm:text-5xl">
        <WordReveal text="Built to " className="text-ink" />
        <WordReveal text="perform" className="text-metal" delay={0.15} />
      </h2>
      <Reveal delay={0.25}>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Keep scrolling - every project below is live in the wild.
        </p>
      </Reveal>
    </div>
  );
}

/**
 * Scroll-driven horizontal work gallery.
 * The tall section pins its content full-screen while vertical scroll
 * pans the card strip sideways, ending on the "See all work" card.
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

  // Reduced motion: plain swipeable row, no scroll-jacking.
  if (reduced) {
    return (
      <section className="relative py-28 sm:py-36">
        <GlowOrb className="right-0 top-16 bg-primary/15" size={480} />
        <div className="relative">
          <Header />
          <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4">
            {PROJECTS.map((project) => (
              <WorkCard key={project.title} project={project} />
            ))}
            <ViewAllCard />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <GlowOrb className="right-0 top-16 bg-primary/15" size={480} />

        <div className="relative">
          <Header />

          <motion.div
            ref={stripRef}
            style={{ x }}
            className="mt-10 flex items-stretch gap-6 px-6 sm:mt-14 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
          >
            {PROJECTS.map((project) => (
              <WorkCard key={project.title} project={project} />
            ))}
            <ViewAllCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
