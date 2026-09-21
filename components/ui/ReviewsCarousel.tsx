"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { Testimonial } from "@/lib/constants";

const ADVANCE_MS = 5000;
const SLIDE_MS = 1100;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

/** Cards on screen: 1 on phones, 2 on tablets, 3 from lg up. */
function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setCount(lg.matches ? 3 : md.matches ? 2 : 1);
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);
  return count;
}

function QuoteMark() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#262626]">
      <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor" aria-hidden className="text-primary">
        <path d="M0 12V7.2C0 3.4 1.9.9 5.3 0l.7 1.5C4.2 2.2 3.3 3.5 3.2 5.3H6V12H0Zm8 0V7.2C8 3.4 9.9.9 13.3 0l.7 1.5c-1.8.7-2.7 2-2.8 3.8H14V12H8Z" />
      </svg>
    </span>
  );
}

function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-lg bg-[#131313] p-5">
      <QuoteMark />
      <blockquote className="mt-3 flex-1 font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-[0.8rem] font-light italic leading-[1.35] text-ink/90">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 font-machina">
        <p className="text-[0.95rem] font-bold leading-tight text-ink">{t.name}</p>
        <p className="mt-0.5 text-[0.62rem] font-light leading-tight text-ink/60">{t.role}</p>
      </figcaption>
    </figure>
  );
}

/**
 * Steps one review at a time: the leftmost card fades out, the rest slide
 * left into its place, and the next review fades in on the right. Pauses on
 * hover and off-screen; holds still under reduced motion.
 *
 * It's a fixed-width track rather than a layout animation: one extra card
 * waits invisibly past the right edge, the whole track glides left by exactly
 * one card + gap, and when the glide ends the content shifts by one while the
 * track snaps back to 0 with transitions off - the same frame on screen, so
 * the reset is invisible. Nothing is measured, so nothing can jump.
 */
export default function ReviewsCarousel({ items }: { items: Testimonial[] }) {
  const count = Math.min(useVisibleCount(), items.length);
  const [start, setStart] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const rotates = items.length > count && !reduced;

  // Wait, then start a glide. Hover or scrolling away holds the wait, but
  // never interrupts a glide already underway.
  useEffect(() => {
    if (!rotates || sliding || paused || !inView) return;
    const id = window.setTimeout(() => setSliding(true), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [rotates, sliding, paused, inView]);

  // A timer, not transitionend - that event is skipped in background tabs.
  useEffect(() => {
    if (!sliding) return;
    const id = window.setTimeout(() => {
      setStart((s) => (s + 1) % items.length);
      setSliding(false);
    }, SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [sliding, items.length]);

  const slots = rotates ? count + 1 : count;
  const shown = Array.from({ length: slots }, (_, i) => (start + i) % items.length);
  const cardWidth = `calc((100% - ${count - 1} * var(--gap)) / ${count})`;
  const fade = (delay: number) =>
    sliding ? `opacity ${SLIDE_MS * 0.6}ms ${EASE} ${SLIDE_MS * delay}ms` : "none";

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative [--gap:1.5rem] lg:[--gap:2.5rem]"
    >
      <ul
        className="flex items-stretch gap-[var(--gap)]"
        style={{
          transform: sliding ? `translateX(calc(-1 * (${cardWidth} + var(--gap))))` : "translateX(0)",
          transition: sliding ? `transform ${SLIDE_MS}ms ${EASE}` : "none",
        }}
      >
        {shown.map((idx, i) => {
          const leaving = i === 0 && rotates;
          const arriving = i === count;
          const opacity = arriving ? (sliding ? 1 : 0) : leaving && sliding ? 0 : 1;
          return (
            <li
              key={`${i}-${idx}`}
              aria-hidden={arriving || undefined}
              className="min-h-[19rem] shrink-0 lg:min-h-[21rem]"
              style={{
                width: cardWidth,
                opacity,
                transition: fade(arriving ? 0.4 : 0),
              }}
            >
              <ReviewCard t={items[idx]} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
