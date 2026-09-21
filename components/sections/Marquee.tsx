import Image from "next/image";

import { PARTNERS } from "@/lib/constants";

/**
 * Infinite scrolling partner-logo strip under the hero.
 * Pure CSS animation (animate-marquee translates -50%; content is doubled
 * so the loop is seamless). Freezes automatically under reduced motion
 * via the global media query in globals.css.
 *
 * Logos are supplied white, for the dark theme; the light theme inverts them
 * to black. Partners without a logo yet show their name as a placeholder.
 */
export default function Marquee() {
  // Two identical copies back-to-back = seamless -50% loop.
  const items = [...PARTNERS, ...PARTNERS];

  return (
    <section
      aria-label="Partners"
      className="relative overflow-hidden bg-base/60 py-10 backdrop-blur"
    >
      {/* Edge fades so items dissolve in/out instead of hard-clipping. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-base to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-base to-transparent sm:w-40" />

      <ul className="flex w-max animate-marquee items-center">
        {items.map(({ name, logo }, i) => (
          <li
            key={i}
            // The second copy exists only for the loop.
            aria-hidden={i >= PARTNERS.length || undefined}
            className="flex h-10 shrink-0 items-center px-10 sm:h-12 sm:px-14"
          >
            {logo ? (
              <Image
                src={logo}
                alt={name}
                width={240}
                height={96}
                className="h-full w-auto object-contain invert dark:invert-0"
              />
            ) : (
              <span className="whitespace-nowrap font-display text-lg uppercase tracking-[0.2em] text-ink/80 sm:text-xl">
                {name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
