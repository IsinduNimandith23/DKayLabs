"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import RollText from "@/components/ui/RollText";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { PRODUCTS, PROJECTS, SERVICES, type IconKey } from "@/lib/constants";
import { serviceSlug } from "@/lib/services";

/** One card in the showcase - a service, fronted by one piece of its work. */
type Showcase = {
  service: string;
  icon: IconKey;
  title: string;
  href: string;
  external: boolean;
  image?: string;
  /** "Visit" / "View" / "Start" - the cursor label and the link's verb. */
  verb: string;
};

/**
 * Resolve each service to the work it shows: a client project, else an
 * in-house product, else an open invite (or "coming soon" for services that
 * haven't launched). Mapping lives on SERVICES in lib/constants.ts.
 */
const SHOWCASE: Showcase[] = SERVICES.map((s) => {
  const base = { service: s.title, icon: s.icon };
  const project = PROJECTS.find((p) => p.title === s.featuredProject);
  if (project) {
    return { ...base, title: project.title, href: project.url, external: true, image: project.image, verb: "Visit" };
  }
  const product = PRODUCTS.find((p) => p.slug === s.featuredProduct);
  if (product) {
    return { ...base, title: product.name, href: `/products/${product.slug}`, external: false, verb: "View" };
  }
  if (s.status === "coming-soon") {
    return { ...base, title: "Coming Soon", href: `/services#${serviceSlug(s.title)}`, external: false, verb: "View" };
  }
  return {
    ...base,
    title: "Yours Next?",
    href: `/contact?service=${encodeURIComponent(s.title)}`,
    external: false,
    verb: "Start",
  };
});

/*
 * Card geometry, in the inner panel's own 376 x 356 box. The dark body rises
 * into a tab on the left - the title's seat - then steps down to the right
 * over a soft slope, like a file folder laid over the artwork. The SVG keeps
 * its aspect (the card does too), so the curves never stretch.
 */
const PANEL_PATH =
  "M0 110Q0 90 20 90H186C198 90 204 93 211 100L228 117C234 123 240 126 250 126H356Q376 126 376 146V356H0Z";

/**
 * Folder-tab showcase card. Sized by its parent; everything inside scales
 * with it through container-query units, so it holds the same proportions at
 * every breakpoint.
 */
function ShowcaseCard({ item, active }: { item: Showcase; active: boolean }) {
  return (
    <div className="group relative h-full w-full rounded-[1.75rem] border border-ink/10 bg-surface p-[1.75%] shadow-bevel [container-type:inline-size]">
      <div className="relative h-full w-full overflow-hidden rounded-[1.375rem] bg-sunken">
        {/* Artwork - the project's screenshot, else a branded field with the
            service's icon where a client logo would sit. */}
        <div className="absolute inset-x-0 top-0 h-[46%]">
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(max-width: 640px) 240px, 340px"
              quality={85}
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/35 via-primary/10 to-sunken">
              <span className="absolute right-[7%] top-[14%] text-ink/80">
                <ServiceIcon icon={item.icon} size={36} />
              </span>
            </div>
          )}
        </div>

        <svg viewBox="0 0 376 356" className="absolute inset-0 h-full w-full fill-base" aria-hidden>
          <path d={PANEL_PATH} />
        </svg>

        {/* Wraps rather than truncates. The width stops at the tab's flat top
            (x 186 of 376 = 49.5%), so the first line never runs out over the
            artwork; a second line drops into the full-width body below. */}
        <h3 className="absolute left-[7.5%] top-[28.5%] line-clamp-2 max-w-[42%] break-words font-machina text-[5cqw] font-bold leading-[1.1] text-ink">
          {item.title}
        </h3>

        <p className="absolute bottom-[8%] left-[7.5%] max-w-[60%] font-machina text-[4cqw] leading-tight text-ink/85">
          {item.service}
        </p>

        <span
          className={`absolute bottom-[6%] right-[6%] aspect-square w-[13.5%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            active ? "group-hover:rotate-45 group-hover:scale-110" : ""
          }`}
        >
          <Image src="/button.png" alt="" fill sizes="56px" />
        </span>
      </div>
    </div>
  );
}

/** Shortest signed distance from `active` to `i` around a ring of `n`. */
function ringOffset(i: number, active: number, n: number) {
  let d = (i - active) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

/** Fan pose for a card `d` places from centre. Past +-2 cards are hidden. */
function pose(d: number) {
  const a = Math.abs(d);
  return {
    x: `${d * 62}%`,
    y: `${a * a * 3.5}%`,
    rotateZ: d * 7,
    rotateY: -d * 16,
    scale: 1 - a * 0.08,
    opacity: a > 2 ? 0 : 1,
    // Same function list at every step so framer can tween between them.
    filter: `brightness(${[1, 0.7, 0.32][Math.min(a, 2)]}) blur(${[0, 0.15, 0.8][Math.min(a, 2)]}px)`,
  };
}

const AUTOPLAY_MS = 5000;

function NavButton({ dir, onClick }: { dir: -1 | 1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? "Previous service" : "Next service"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-on-primary"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {dir < 0 ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

/**
 * "Proof Of Concept" - one card per service, fanned in 3D around the one in
 * focus. Side cards are clickable to bring them forward; the stage also
 * takes a swipe/drag and the arrow keys, and rotates on its own while it's in
 * view and nobody is interacting with it.
 */
export default function FeaturedWork() {
  const n = SHOWCASE.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.4 });
  // A pan ends in a click on whatever card is under the pointer - swallow it.
  const dragged = useRef(false);

  const go = useCallback((step: number) => setActive((a) => (a + step + n) % n), [n]);

  // Re-armed on every change, so a manual step restarts the countdown.
  useEffect(() => {
    if (reduced || paused || !inView) return;
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, reduced, paused, inView, go]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
    else return;
    e.preventDefault();
  };

  return (
    <section className="relative overflow-x-clip py-28 sm:py-36">
      <div className="relative">
        <h2 className="px-6 text-center font-machina text-[length:clamp(2rem,8.5vw,5.5rem)] leading-none tracking-[-0.02em]">
          <WordReveal text="Proof" className="font-extralight text-ink" />
          <WordReveal text="Of" className="font-medium text-ink" delay={0.1} />
          <WordReveal text="Concept" className="font-black text-primary" delay={0.2} />
        </h2>

        <Reveal delay={0.15}>
          <motion.div
            ref={stageRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Work by service"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onPanStart={() => (dragged.current = true)}
            onPanEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 40) go(info.offset.x < 0 ? 1 : -1);
              // Let the trailing click see the flag, then clear it.
              window.setTimeout(() => (dragged.current = false), 0);
            }}
            className="relative mx-auto mt-14 aspect-[400/380] w-[240px] cursor-grab touch-pan-y select-none outline-none [perspective:1400px] active:cursor-grabbing sm:mt-20 sm:w-[290px] lg:w-[340px]"
          >
            {SHOWCASE.map((item, i) => {
              const d = ringOffset(i, active, n);
              const isActive = d === 0;
              const hidden = Math.abs(d) > 2;
              const linkProps = item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {};

              return (
                <motion.a
                  key={item.service}
                  href={item.href}
                  {...linkProps}
                  draggable={false}
                  aria-hidden={hidden || undefined}
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`${item.service}: ${item.title} - ${item.verb.toLowerCase()}`}
                  data-cursor={isActive ? item.verb : undefined}
                  onClick={(e) => {
                    if (dragged.current || !isActive) e.preventDefault();
                    if (!dragged.current && !isActive) setActive(i);
                  }}
                  initial={false}
                  animate={pose(d)}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 26, mass: 0.9 }}
                  style={{ zIndex: 10 - Math.abs(d), pointerEvents: hidden ? "none" : "auto" }}
                  className="absolute inset-0 block rounded-[1.75rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <ShowcaseCard item={item} active={isActive} />
                </motion.a>
              );
            })}
          </motion.div>
        </Reveal>

        <p aria-live="polite" className="sr-only">
          {`${SHOWCASE[active].service}: ${SHOWCASE[active].title}, ${active + 1} of ${n}`}
        </p>

        {/* Room for the lowered outer cards before the controls. */}
        <div className="mt-20 flex items-center justify-center gap-4 px-6 sm:mt-24">
          <NavButton dir={-1} onClick={() => go(-1)} />
          <Link
            href="/portfolio"
            className="inline-flex items-center rounded-full border-2 border-ink/80 px-6 py-3 font-machina text-sm font-bold text-ink transition-all duration-300 hover:border-primary hover:bg-primary hover:text-on-primary hover:shadow-glow"
          >
            <RollText>Wanna See More?</RollText>
          </Link>
          <NavButton dir={1} onClick={() => go(1)} />
        </div>
      </div>
    </section>
  );
}
