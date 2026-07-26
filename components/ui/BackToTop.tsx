"use client";

/** Smoothly scrolls to the top of the page. */
export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        })
      }
      className="group inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-muted transition-colors hover:text-ink"
    >
      Back to top
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:text-primary">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </span>
    </button>
  );
}
