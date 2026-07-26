"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "@/components/ui/ProjectCard";
import { PROJECTS, SERVICES } from "@/lib/constants";

// "All" + one tab per service, kept in sync with the SERVICES list.
const FILTERS = ["All", ...SERVICES.map((s) => s.title)];

export default function PortfolioGrid() {
  const [active, setActive] = useState("All");

  const visible =
    active === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.service === active);

  return (
    <div>
      {/* Filter pills */}
      <div
        role="group"
        aria-label="Filter projects by service"
        className="mb-14 flex flex-wrap justify-center gap-3"
      >
        {FILTERS.map((filter) => {
          const isActive = filter === active;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              aria-pressed={isActive}
              className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? "border-primary bg-primary text-on-primary shadow-glow"
                  : "border-ink/10 bg-surface/50 text-muted hover:border-primary/40 hover:text-ink"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty category - turn it into a lead. */
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass mx-auto max-w-xl rounded-2xl p-10 text-center"
        >
          <p className="font-display text-xl text-ink">Nothing public here - yet</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            We haven&apos;t published {active} work yet. Your project could be
            the first one on this wall.
          </p>
          <Link
            href="/contact"
            className="btn-shine mt-6 inline-block cursor-pointer rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-on-primary shadow-glow transition-all duration-200 hover:bg-primary-dark hover:shadow-glow-lg"
          >
            Start a Project
          </Link>
        </motion.div>
      )}
    </div>
  );
}
