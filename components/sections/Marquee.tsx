import { MARQUEE_ITEMS } from "@/lib/constants";

/**
 * Infinite scrolling keyword strip under the hero.
 * Pure CSS animation (animate-marquee translates -50%; content is doubled
 * so the loop is seamless). Freezes automatically under reduced motion
 * via the global media query in globals.css.
 */
export default function Marquee() {
  // Two identical copies back-to-back = seamless -50% loop.
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-ink/10 bg-base/60 py-6 backdrop-blur"
    >
      {/* Edge fades so items dissolve in/out instead of hard-clipping. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-base to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-base to-transparent sm:w-40" />

      <div className="flex w-max animate-marquee">
        {items.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-sm uppercase tracking-[0.3em] text-muted">
              {item}
            </span>
            {/* Violet diamond separator. */}
            <span className="mx-8 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary shadow-glow" />
          </span>
        ))}
      </div>
    </section>
  );
}
