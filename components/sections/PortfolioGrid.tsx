"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RollText from "@/components/ui/RollText";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  DESIGN_CATEGORIES,
  DESIGN_SERVICE,
  PROJECTS,
  SERVICES,
  type Design,
  type Project,
} from "@/lib/constants";
import { serviceSlug } from "@/lib/services";

const EASE = [0.16, 1, 0.3, 1] as const;

// "All" + one filter per service, in SERVICES order. Services with no
// published work stay listed - their empty state is a lead, not a dead end.
const FILTERS = ["All", ...SERVICES.map((s) => s.title)];

// Second row under Digital Design: "All" + one per artwork folder.
const SUB_FILTERS = ["All", ...DESIGN_CATEGORIES.map((c) => c.title)];

/**
 * /portfolio: text filters over a two-up grid of projects. Each tile links
 * out to the live site, or to the full-size artwork for design pieces.
 * Digital Design swaps the grid for a gallery of every design, with its own
 * Graphic / Web sub-filters.
 */
export default function PortfolioGrid({ designs }: { designs: Design[] }) {
  const [active, setActive] = useState("All");
  const [sub, setSub] = useState("All");

  // Open on the filter named by ?service=<slug> (the homepage showcase links
  // here that way), and under Digital Design the sub-filter named by
  // ?type=<folder>. Read from window rather than useSearchParams so this
  // doesn't force a Suspense boundary on the static route. Only slugs of
  // services we offer are accepted.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const match = SERVICES.find((s) => serviceSlug(s.title) === params.get("service"));
    if (!match) return;
    setActive(match.title);
    const type = DESIGN_CATEGORIES.find((c) => c.folder === params.get("type"));
    if (match.title === DESIGN_SERVICE && type) setSub(type.title);
  }, []);

  // Keep the URL in step so a refresh or shared link lands on the same filter.
  const syncUrl = (service: string, type: string) => {
    const url = new URL(window.location.href);
    if (service === "All") url.searchParams.delete("service");
    else url.searchParams.set("service", serviceSlug(service));
    const folder = DESIGN_CATEGORIES.find((c) => c.title === type)?.folder;
    if (folder) url.searchParams.set("type", folder);
    else url.searchParams.delete("type");
    window.history.replaceState(window.history.state, "", url);
  };

  const select = (label: string) => {
    setActive(label);
    setSub("All");
    syncUrl(label, "All");
  };

  const selectSub = (label: string) => {
    setSub(label);
    syncUrl(active, label);
  };

  const isDesign = active === DESIGN_SERVICE;
  const visible = active === "All" ? PROJECTS : PROJECTS.filter((p) => p.service === active);
  const visibleDesigns = sub === "All" ? designs : designs.filter((d) => d.category === sub);

  return (
    <MotionConfig reducedMotion="user">
      <div
        role="group"
        aria-label="Filter projects by service"
        // A fixed grid rather than a wrapping row, so the labels' uneven
        // lengths line up in columns - 9 filters make 3 clean rows from sm up.
        className="grid grid-cols-2 gap-x-6 border-b border-ink/20 sm:grid-cols-3 sm:gap-x-10"
      >
        {FILTERS.map((label) => (
          <FilterButton key={label} label={label} active={label === active} onClick={() => select(label)} />
        ))}
      </div>

      <AnimatePresence initial={false}>
        {isDesign && (
          <motion.div
            key="sub-filters"
            role="group"
            aria-label="Filter designs by type"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pt-6">
              {SUB_FILTERS.map((label) => {
                const isActive = label === sub;
                const count = label === "All" ? designs.length : designs.filter((d) => d.category === label).length;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => selectSub(label)}
                    aria-pressed={isActive}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 font-machina text-xs outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary sm:text-[0.8rem] ${
                      isActive
                        ? "border-primary bg-primary text-on-primary"
                        : "border-ink/20 text-ink/60 hover:border-ink/50 hover:text-ink"
                    }`}
                  >
                    {label}
                    <span className={`tabular-nums ${isActive ? "opacity-80" : "text-ink/35"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isDesign ? (
        visibleDesigns.length > 0 ? (
          <motion.ul
            layout
            className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-12 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleDesigns.map((design) => (
                <motion.li
                  layout
                  key={design.src}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <DesignTile design={design} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <EmptyState key={sub} service={DESIGN_SERVICE} label={sub === "All" ? DESIGN_SERVICE : sub} />
        )
      ) : visible.length > 0 ? (
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

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex cursor-pointer items-center gap-3 border-t border-ink/15 py-3 text-left font-machina text-[0.8rem] leading-tight outline-none transition-colors duration-300 focus-visible:bg-ink/5 sm:py-3.5 sm:text-[0.95rem] ${
        active ? "text-primary" : "text-ink/55 hover:text-ink"
      }`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
          active ? "bg-primary" : "bg-ink/20 group-hover:bg-ink/60"
        }`}
      />
      {label}
    </button>
  );
}

/** A service (or design type) with no published work yet - turned into a
 *  lead. `label` names the empty slice; `service` prefills the contact form. */
function EmptyState({ service, label = service }: { service: string; label?: string }) {
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
        We haven&apos;t published any {label} work yet. Yours could be the
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

/** One design in the Digital Design gallery - opens the full artwork. */
function DesignTile({ design }: { design: Design }) {
  return (
    <a
      href={design.src}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${design.title} - view full design`}
      data-cursor="View"
      className="group block outline-none"
    >
      {/* Social posts are 4:5; banners and squares sit whole inside the
          same frame so the grid stays even. */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sunken ring-primary ring-offset-4 ring-offset-base dark:bg-[#1e1e1e] group-focus-visible:ring-2">
        <Image
          src={design.src}
          alt={`${design.title} design`}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
          className="object-contain p-3 drop-shadow-[0_8px_18px_rgba(0,0,0,0.16)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] sm:p-4"
        />
      </div>
      <p className="mt-3 font-machina text-[0.8rem] leading-snug text-ink/70 transition-colors duration-300 group-hover:text-primary sm:text-sm">
        {design.title}
      </p>
      <p className="mt-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-ink/40">
        {design.category}
      </p>
    </a>
  );
}

function ProjectTile({ project, number }: { project: Project; number: number }) {
  const poster = project.format === "poster";
  return (
    <a
      href={project.url ?? project.image}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={project.url ? `${project.title} - visit live site` : `${project.title} - view full design`}
      data-cursor={project.url ? "Visit" : "View"}
      className="group block outline-none"
    >
      {/* Held at the screenshots' native ~19:9 so nothing is cropped or
          upscaled; anchored to the top to keep each site's hero in frame.
          Posters sit whole inside the same frame so the grid stays even. */}
      <div className="relative aspect-[19/9] overflow-hidden rounded-2xl bg-sunken ring-primary ring-offset-4 ring-offset-base dark:bg-[#1e1e1e] group-focus-visible:ring-2">
        {project.image ? (
          <Image
            src={project.image}
            alt={poster ? `${project.title} design` : `${project.title} website screenshot`}
            fill
            sizes={poster ? "(max-width: 640px) 45vw, 240px" : "(max-width: 640px) 90vw, 480px"}
            quality={90}
            className={`transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              poster
                ? "object-contain py-4 drop-shadow-[0_10px_24px_rgba(0,0,0,0.18)] group-hover:scale-[1.06]"
                : "object-cover object-top group-hover:scale-[1.04]"
            }`}
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
