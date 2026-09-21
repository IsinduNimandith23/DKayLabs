"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RollText from "@/components/ui/RollText";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { PROJECTS, SERVICES, type Project } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

// "All" + one filter per service, in SERVICES order. Services with no
// published work stay listed - their empty state is a lead, not a dead end.
const FILTERS = ["All", ...SERVICES.map((s) => s.title)];

/**
 * /portfolio: text filters over a two-up grid of live projects. Each tile
 * links out to the live site.
 */
export default function PortfolioGrid() {
  const [active, setActive] = useState("All");

  const visible = active === "All" ? PROJECTS : PROJECTS.filter((p) => p.service === active);

  return (
    <MotionConfig reducedMotion="user">
      <div
        role="group"
        aria-label="Filter projects by service"
        // A fixed grid rather than a wrapping row, so the labels' uneven
        // lengths line up in columns - 9 filters make 3 clean rows from sm up.
        className="grid grid-cols-2 gap-x-6 border-b border-ink/20 sm:grid-cols-3 sm:gap-x-10"
      >
        {FILTERS.map((label) => {
          const isActive = label === active;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActive(label)}
              aria-pressed={isActive}
              className={`group flex cursor-pointer items-center gap-3 border-t border-ink/15 py-3 text-left font-machina text-[0.8rem] leading-tight outline-none transition-colors duration-300 focus-visible:bg-ink/5 sm:py-3.5 sm:text-[0.95rem] ${
                isActive ? "text-primary" : "text-ink/55 hover:text-ink"
              }`}
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                  isActive ? "bg-primary" : "bg-ink/20 group-hover:bg-ink/60"
                }`}
              />
              {label}
            </button>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <motion.ul layout className="mt-12 grid gap-x-8 gap-y-14 sm:mt-16 sm:grid-cols-2 sm:gap-y-20">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project) => (
              <motion.li
                layout
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <ProjectTile project={project} number={PROJECTS.indexOf(project) + 1} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <EmptyState key={active} service={active} />
      )}
    </MotionConfig>
  );
}

/** A service with no published work yet - turned into a lead. */
function EmptyState({ service }: { service: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mt-12 rounded-3xl bg-sunken p-8 dark:bg-[#1e1e1e] sm:mt-16 sm:p-12 lg:p-14"
    >
      <p className="font-machina text-[length:clamp(1.75rem,5vw,3rem)] leading-[1.05] tracking-[-0.02em]">
        <span className="font-extralight text-ink">Want to start </span>
        <span className="font-black text-primary">a project?</span>
      </p>
      <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted">
        We haven&apos;t published any {service} work yet. Yours could be the
        first one here.
      </p>
      <Link
        href={`/contact?service=${encodeURIComponent(service)}`}
        className="group/cta mt-8 inline-flex items-center gap-3 rounded-full border border-ink/70 py-2 pl-6 pr-2 text-xs font-bold text-ink transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-on-primary"
      >
        <RollText>Start a project</RollText>
        <Image
          src="/button.png"
          alt=""
          aria-hidden
          width={261}
          height={261}
          className="h-7 w-7 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:rotate-45"
        />
      </Link>
    </motion.div>
  );
}

function ProjectTile({ project, number }: { project: Project; number: number }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.title} - visit live site`}
      data-cursor="Visit"
      className="group block outline-none"
    >
      {/* Held at the screenshots' native ~19:9 so nothing is cropped or
          upscaled; anchored to the top to keep each site's hero in frame. */}
      <div className="relative aspect-[19/9] overflow-hidden rounded-2xl bg-sunken ring-primary ring-offset-4 ring-offset-base dark:bg-[#1e1e1e] group-focus-visible:ring-2">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} website screenshot`}
            fill
            sizes="(max-width: 640px) 90vw, 480px"
            quality={90}
            className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-machina text-5xl font-black text-primary">
            {project.monogram}
          </span>
        )}

        {/* The artwork points up-right, which is where the link goes. */}
        <Image
          src="/button.png"
          alt=""
          aria-hidden
          width={261}
          height={261}
          className="absolute right-4 top-4 h-10 w-10 translate-y-2 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        />
      </div>

      <div className="mt-5 grid grid-cols-[2.5rem_minmax(0,1fr)]">
        <span className="pt-[0.3em] font-machina text-xs tabular-nums text-ink/45">
          {String(number).padStart(2, "0")}
        </span>
        <div>
          <h2 className="font-machina text-[length:clamp(1.25rem,3vw,1.75rem)] font-medium uppercase leading-[1.05] tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-primary">
            {project.title}
          </h2>
          <p className="mt-1.5 font-machina text-sm text-ink/60">{project.category}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{project.description}</p>
          <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            {project.tags.join(" · ")}
          </p>
        </div>
      </div>
    </a>
  );
}
