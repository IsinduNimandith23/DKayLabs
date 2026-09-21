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
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 dark:bg-[#262626]">
      <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor" aria-hidden className="text-primary">
        <path d="M0 12V7.2C0 3.4 1.9.9 5.3 0l.7 1.5C4.2 2.2 3.3 3.5 3.2 5.3H6V12H0Zm8 0V7.2C8 3.4 9.9.9 13.3 0l.7 1.5c-1.8.7-2.7 2-2.8 3.8H14V12H8Z" />
      </svg>
    </span>
  );
}

function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-lg bg-surface p-5 shadow-bevel dark:bg-[#131313] dark:shadow-none">
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

/*
 * Cards per row as a CSS variable, so the server-rendered HTML is already
 * sized right for the screen - no flash of three squashed cards on a phone
 * before hydration. Literal class strings so Tailwind can see them.
 */
const N_MD = ["", "md:[--n:1]", "md:[--n:2]"];
const N_LG = ["", "lg:[--n:1]", "lg:[--n:2]", "lg:[--n:3]"];
const CARD_WIDTH = "calc((100% - (var(--n) - 1) * var(--gap)) / var(--n))";

/**
 * Steps one review at a time: the leftmost card fades out, the rest slide
 * left into its place, and the next review fades in on the right. Pauses on
 * mouse hover and off-screen. Under reduced motion it becomes a plain
 * swipeable row instead, so every review is still reachable on a phone.
 *
 * It's a fixed-width track rather than a layout animation: the next card
 * waits invisibly past the right edge, the whole track glides left by exactly
 * one card + gap, and when the glide ends the content shifts by one while the
 * track snaps back to 0 with transitions off - the same frame on screen, so
 * the reset is invisible.
 *
 * Height comes from an invisible stack of every card, so the panel is always
 * as tall as the longest review and never changes size as they rotate - on
 * a phone, where one long quote wraps to many lines, that would otherwise
 * shove the rest of the page up and down every five seconds.
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
  const vars = `[--n:1] ${N_MD[Math.min(2, items.length)]} ${N_LG[Math.min(3, items.length)]} [--gap:1.5rem] lg:[--gap:2.5rem]`;

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

  if (reduced) {
    return (
      <ul
        className={`${vars} -mx-1 flex snap-x snap-mandatory gap-[var(--gap)] overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {items.map((t) => (
          <li key={t.name} className="shrink-0 snap-start" style={{ width: CARD_WIDTH }}>
            <ReviewCard t={t} />
          </li>
        ))}
      </ul>
    );
  }

  // Every review is in the track, rotated to start at `start` - no
  // duplicates, so screen readers get each quote exactly once. Cards past
  // the visible ones sit beyond the panel edge, which clips them.
  const shown = items.map((_, i) => (start + i) % items.length);
  const fade = (delay: number) =>
    sliding ? `opacity ${SLIDE_MS * 0.6}ms ${EASE} ${SLIDE_MS * delay}ms` : "none";

  return (
    <div
      ref={ref}
      // Pointer events filtered to a real mouse: on touch, a tap fires
      // mouseenter with no matching leave, which froze the carousel for good.
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      className={`relative ${vars}`}
    >
      <div aria-hidden className="invisible grid" style={{ width: CARD_WIDTH }}>
        {items.map((t) => (
          <div key={t.name} className="col-start-1 row-start-1">
            <ReviewCard t={t} />
          </div>
        ))}
      </div>

      <ul
        className="absolute inset-0 flex gap-[var(--gap)]"
        style={{
          transform: sliding ? `translateX(calc(-1 * (${CARD_WIDTH} + var(--gap))))` : "translateX(0)",
          transition: sliding ? `transform ${SLIDE_MS}ms ${EASE}` : "none",
        }}
      >
        {shown.map((idx, i) => {
          const leaving = i === 0 && rotates;
          const arriving = i === count && rotates;
          const opacity =
            i > count ? 0 : arriving ? (sliding ? 1 : 0) : leaving && sliding ? 0 : 1;
          return (
            <li
              key={`${i}-${idx}`}
              className="h-full shrink-0"
              style={{ width: CARD_WIDTH, opacity, transition: fade(arriving ? 0.4 : 0) }}
            >
              <ReviewCard t={items[idx]} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
