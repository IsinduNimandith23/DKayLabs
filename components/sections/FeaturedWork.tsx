"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
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

/** A piece of work filed in a service's folder - or an empty slot for yours. */
type Sheet =
  | { kind: "work"; title: string; label: string; image?: string; icon?: IconKey }
  | { kind: "invite" };

/** One card in the showcase - a service's folder, with its work filed inside. */
type Showcase = {
  service: string;
  icon: IconKey;
  /** Always three: the service's own work first, then open slots. */
  sheets: Sheet[];
  /** How many of `sheets` are real work. */
  count: number;
  comingSoon: boolean;
  /** The portfolio, pre-filtered to this service. */
  href: string;
};

const SHEET_COUNT = 3;

/** Client projects under the service, plus its in-house product if any. */
function workFor(s: (typeof SERVICES)[number]): Sheet[] {
  const work: Sheet[] = PROJECTS.filter((p) => p.service === s.title).map((p) => ({
    kind: "work",
    title: p.title,
    label: p.category,
    image: p.image,
  }));
  const product = PRODUCTS.find((p) => p.slug === s.featuredProduct);
  if (product)
    work.push({ kind: "work", title: product.name, label: product.tagline, image: product.image, icon: product.icon });
  return work.slice(0, SHEET_COUNT);
}

/** One folder per service, opening onto that service's filter on /portfolio. */
const SHOWCASE: Showcase[] = SERVICES.map((s) => {
  const work = workFor(s);
  return {
    service: s.title,
    icon: s.icon,
    sheets: [...work, ...Array.from({ length: SHEET_COUNT - work.length }, () => ({ kind: "invite" }) as const)],
    count: work.length,
    comingSoon: s.status === "coming-soon",
    href: `/portfolio?service=${serviceSlug(s.title)}`,
  };
});

/*
 * Folder geometry, in the card's own 400 x 380 box. The back plate is a plain
 * rounded slab; the front flap rises into a tab on the left, then steps down
 * to the right over a soft slope, like a file folder seen face on. The card
 * holds its aspect, so the mask never stretches the curves.
 */
const FRONT_PATH =
  "M0 102Q0 78 24 78H170C181 78 187 81 194 88L208 100C214 105 220 108 230 108H376Q400 108 400 132V352Q400 380 372 380H28Q0 380 0 352Z";

const FRONT_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 380"><path d="${FRONT_PATH}"/></svg>`,
)}")`;

/* Frosted flap in the site's own dark surfaces, blurred over the sheets behind it. */
const FRONT_STYLE: CSSProperties = {
  maskImage: FRONT_MASK,
  WebkitMaskImage: FRONT_MASK,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  backgroundImage:
    "linear-gradient(to bottom, rgb(var(--c-surface) / 0.96), rgb(var(--c-base) / 0.97))",
};

const EASE = "duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";

/*
 * Each sheet's two poses, front to back. All three share one box - a wide
 * slot at the screenshots' native ~19:9, so they show whole - and are
 * told apart by transform alone. At rest the front two sit down inside the
 * back plate splayed apart - the front one tipped right over the one behind
 * it - with just their tops showing between the plate's edge and the flap;
 * the third waits lower, out of sight. On hover they rise out and fan wider,
 * the back one highest. Translates are in the sheet's own size, and every
 * pose keeps its bottom edge behind the flap.
 */
const SHEETS = [
  { rest: "translate(10%,12%) rotate(5deg)", lift: "translate(12%,-58%) rotate(6deg)", delay: "0ms" },
  { rest: "translate(-9%,5%) rotate(-3deg)", lift: "translate(-14%,-64%) rotate(-8deg)", delay: "40ms" },
  { rest: "translate(0,30%) rotate(0deg)", lift: "translate(0,-72%) rotate(-2deg)", delay: "80ms" },
] as const;

/** A blank page with a folded corner - the open-slot glyph. */
function DocGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" className={className} aria-hidden>
      <path d="M6 3h8l5 5v13H6z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

/** One filed sheet of paper: a project screenshot, a product, or an open slot. */
function SheetFace({ sheet }: { sheet: Sheet }) {
  if (sheet.kind === "invite") {
    return (
      <span className="absolute inset-0 flex items-start justify-center pt-[5%] text-neutral-400">
        <DocGlyph className="w-[16%]" />
      </span>
    );
  }
  if (sheet.image) {
    return (
      <span className="absolute inset-0 overflow-hidden rounded-[inherit] bg-neutral-900">
        <Image src={sheet.image} alt="" fill sizes="(max-width: 640px) 240px, 300px" className="object-cover object-top" />
      </span>
    );
  }
  return (
    <span className="absolute inset-0 flex flex-col items-center justify-start gap-[6%] pt-[5%] text-primary">
      {sheet.icon && (
        <span className="w-[14%] [&>svg]:h-auto [&>svg]:w-full">
          <ServiceIcon icon={sheet.icon} />
        </span>
      )}
      <span className="max-w-[80%] truncate rounded-[1cqw] bg-neutral-900 px-[2.2cqw] py-[0.9cqw] font-machina text-[2.6cqw] font-bold uppercase leading-none tracking-wide text-white">
        {sheet.title}
      </span>
    </span>
  );
}

type Work = Extract<Sheet, { kind: "work" }>;

/** Round thumbnail in the flap's bottom-left stack, one per piece of work. */
function Chip({ sheet, first }: { sheet: Work; first: boolean }) {
  return (
    <span
      className={`relative aspect-square w-[9cqw] overflow-hidden rounded-full bg-white ring-[0.6cqw] ring-base ${
        first ? "" : "-ml-[2.6cqw]"
      }`}
    >
      {sheet.image ? (
        <Image src={sheet.image} alt="" fill sizes="40px" className="object-cover object-top" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-primary [&>svg]:h-[55%] [&>svg]:w-[55%]">
          {sheet.icon && <ServiceIcon icon={sheet.icon} />}
        </span>
      )}
    </span>
  );
}

/**
 * Folder showcase card. Sized by its parent; everything inside scales with
 * it through container-query units, so it holds the same proportions at
 * every breakpoint.
 *
 * Built in three layers so the filed sheets sit between them: the back
 * plate, the sheets, then the frosted front flap (title, chips, button).
 * Nothing clips the sheets - they are free to rise out over the top of the
 * folder. Hover/focus come from the `group` on the link around the card.
 */
function ShowcaseCard({ item, active }: { item: Showcase; active: boolean }) {
  const edgeId = useId();
  const work = item.sheets.filter((s): s is Work => s.kind === "work");

  return (
    <div className="relative h-full w-full [container-type:inline-size] [filter:drop-shadow(0_18px_24px_rgb(0_0_0/0.3))]">
      <div className="absolute inset-x-0 bottom-0 top-[7%] rounded-[7cqw] bg-surface bg-gradient-to-b from-ink/[0.07] to-transparent ring-1 ring-inset ring-ink/10" />

      {item.sheets.map((sheet, i) => {
        const s = SHEETS[i];
        return (
          <div
            key={i}
            aria-hidden
            style={{ zIndex: SHEET_COUNT - i, "--rest": s.rest, "--lift": s.lift, transitionDelay: s.delay } as CSSProperties}
            className={`absolute left-[12%] top-[11%] aspect-[19/9] w-[76%] rounded-[2cqw] bg-neutral-50 shadow-[0_4px_14px_-4px_rgb(0_0_0/0.45)] ring-1 ring-black/10 transition-transform [transform:var(--rest)] ${EASE} ${
              active ? "group-hover:[transform:var(--lift)] group-focus-visible:[transform:var(--lift)]" : ""
            }`}
          >
            <SheetFace sheet={sheet} />
          </div>
        );
      })}

      {/* The flap tips toward the viewer from its bottom edge as the sheets
          lift, like a folder being thumbed open. */}
      <div
        className={`absolute inset-0 z-10 origin-bottom transition-transform ${EASE} ${
          active
            ? "group-hover:[transform:perspective(900px)_rotateX(-14deg)] group-focus-visible:[transform:perspective(900px)_rotateX(-14deg)]"
            : ""
        }`}
      >
        <div style={FRONT_STYLE} className="absolute inset-0 backdrop-blur-md" />
        <svg viewBox="0 0 400 380" fill="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <linearGradient id={edgeId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="white" stopOpacity="0.45" />
              <stop offset="0.35" stopColor="white" stopOpacity="0.08" />
              <stop offset="1" stopColor="white" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path d={FRONT_PATH} stroke={`url(#${edgeId})`} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>

        <h3 className="absolute left-[7%] top-[33%] line-clamp-2 max-w-[70%] break-words font-machina text-[6cqw] font-bold leading-[1.1] text-ink">
          {item.service}
        </h3>

        <div className="absolute bottom-[8.5%] left-[7%] flex items-center gap-[2.6cqw]">
          {work.length > 0 && (
            <span className="flex items-center">
              {work.map((sheet, i) => (
                <Chip key={i} sheet={sheet} first={i === 0} />
              ))}
            </span>
          )}
          <p className="font-machina text-[3.8cqw] leading-none text-ink/70">
            {item.count > 0
              ? `${item.count} ${item.count === 1 ? "Project" : "Projects"}`
              : item.comingSoon
                ? "Coming Soon"
                : "Yours Next?"}
          </p>
        </div>

        <span
          className={`absolute bottom-[6%] right-[6%] aspect-square w-[13.5%] transition-transform ${EASE} ${
            active ? "group-hover:rotate-45 group-hover:scale-110 group-focus-visible:rotate-45" : ""
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

/**
 * Fan pose for a card `d` places from centre. Past +-2 cards are hidden.
 * `compact` (phones) packs the neighbours in tighter so they peek in from the
 * screen edges, and drops the outer pair, which would land fully off-screen.
 */
function pose(d: number, compact: boolean) {
  const a = Math.abs(d);
  return {
    x: `${d * (compact ? 40 : 62)}%`,
    y: `${a * a * (compact ? 3 : 3.5)}%`,
    rotateZ: d * (compact ? 6 : 7),
    rotateY: -d * (compact ? 20 : 16),
    scale: 1 - a * (compact ? 0.12 : 0.08),
    opacity: a > (compact ? 1 : 2) ? 0 : 1,
    // Same function list at every step so framer can tween between them.
    filter: `brightness(${[1, 0.7, 0.32][Math.min(a, 2)]}) blur(${[0, 0.15, 0.8][Math.min(a, 2)]}px)`,
  };
}

const AUTOPLAY_MS = 5000;

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

  // Width only - unlike useIsMobile, a touch tablet should keep the full fan.
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
    <section className="relative overflow-x-clip py-20 sm:py-36">
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
            className="relative mx-auto mt-12 aspect-[400/380] w-[72vw] max-w-[290px] cursor-grab touch-pan-y select-none outline-none [perspective:1400px] active:cursor-grabbing sm:mt-20 sm:w-[290px] lg:w-[340px] lg:max-w-[340px]"
          >
            {SHOWCASE.map((item, i) => {
              const d = ringOffset(i, active, n);
              const isActive = d === 0;
              const hidden = Math.abs(d) > (compact ? 1 : 2);

              return (
                <motion.a
                  key={item.service}
                  href={item.href}
                  draggable={false}
                  aria-hidden={hidden || undefined}
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`${item.service} - view projects`}
                  data-cursor={isActive ? "View" : undefined}
                  onClick={(e) => {
                    if (dragged.current || !isActive) e.preventDefault();
                    if (!dragged.current && !isActive) setActive(i);
                  }}
                  initial={false}
                  animate={pose(d, compact)}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 26, mass: 0.9 }}
                  style={{ zIndex: 10 - Math.abs(d), pointerEvents: hidden ? "none" : "auto" }}
                  className="group absolute inset-0 block rounded-[7%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <ShowcaseCard item={item} active={isActive} />
                </motion.a>
              );
            })}
          </motion.div>
        </Reveal>

        <p aria-live="polite" className="sr-only">
          {`${SHOWCASE[active].service}, ${active + 1} of ${n}`}
        </p>

        {/* Room for the lowered outer cards before the link - less on
            phones, where only the near neighbours show. */}
        <div className="mt-12 flex items-center justify-center px-6 sm:mt-24">
          <Link
            href="/portfolio"
            className="inline-flex items-center rounded-full border-2 border-ink/80 px-6 py-3 font-machina text-sm font-bold text-ink transition-all duration-300 hover:border-primary hover:bg-primary hover:text-on-primary hover:shadow-glow"
          >
            <RollText>Wanna See More?</RollText>
          </Link>
        </div>
      </div>
    </section>
  );
}
