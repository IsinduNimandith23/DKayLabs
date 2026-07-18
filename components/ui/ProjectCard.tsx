import type { Project } from "@/lib/constants";

/** Stylized thumbnail - gradient plate + monogram (swap for real screenshots later). */
export function ProjectVisual({
  project,
  className = "h-44",
}: {
  project: Project;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border-b border-snow/10 bg-gradient-to-br from-charcoal via-obsidian to-void ${className}`}
    >
      {/* Faint grid texture. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,245,245,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,245,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Crimson bloom that intensifies on hover. */}
      <div className="absolute -bottom-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-crimson/25 blur-3xl transition-all duration-500 group-hover:bg-crimson/45" />

      {/* Monogram plate. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl border border-crimson/30 bg-obsidian/70 font-display text-2xl text-crimson shadow-glow-soft backdrop-blur transition-all duration-300 group-hover:scale-105 group-hover:text-crimson-glow group-hover:shadow-glow">
          {project.monogram}
        </span>
      </div>
    </div>
  );
}

/**
 * Project card linking out to the live site.
 * Used on the homepage (Featured Work) and the /portfolio page.
 */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.title} - visit live site`}
      className="glass group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:border-crimson/40 hover:shadow-glow"
    >
      <ProjectVisual project={project} />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-crimson">
            {project.category}
          </p>
          {/* External-link arrow - brightens on hover. */}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="shrink-0 text-silver-dim transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-crimson"
          >
            <path d="M7 17L17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </div>
        <h3 className="mt-2 text-xl text-snow">{project.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-silver">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-snow/10 bg-charcoal/60 px-3 py-1 text-[11px] uppercase tracking-wider text-silver"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
