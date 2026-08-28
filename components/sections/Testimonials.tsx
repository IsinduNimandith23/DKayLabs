import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import { TESTIMONIALS, type Testimonial } from "@/lib/constants";

/** Accent star - filled or dimmed. */
function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={filled ? "text-primary" : "text-ink/15"}
    >
      <path d="M12 2l2.92 6.26 6.86.84-5.06 4.73 1.32 6.78L12 17.27l-6.04 3.34 1.32-6.78L2.22 9.1l6.86-.84L12 2z" />
    </svg>
  );
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} filled={i < rating} />
      ))}
    </div>
  );
}

/** Initials avatar - swap for real photos when available. */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-sm text-ink">
      {initials}
    </span>
  );
}

/**
 * `wide` is the static-row variant: no marquee gutter, no fixed rail width,
 * and room for a long quote to breathe instead of running to twelve lines.
 *
 * The lg cap is half the row minus the gap, so two quotes sit side by side
 * from lg up instead of wrapping onto separate lines - a flat max-w-xl is
 * 576px, and two of those plus the gap overshoot the 1104px row by 72px.
 * Below lg they stack full-width, and a lone quote just centres at that cap.
 */
function TestimonialCard({ t, wide = false }: { t: Testimonial; wide?: boolean }) {
  return (
    <figure
      className={`glass flex flex-col rounded-2xl p-7 transition-colors duration-300 hover:border-primary/40 ${
        wide
          ? "w-full max-w-xl lg:max-w-[calc(50%-0.75rem)]"
          : "mr-6 w-[300px] shrink-0 sm:w-[380px]"
      }`}
    >
      <Stars rating={t.rating} label={`${t.rating} out of 5 stars`} />

      <blockquote className="mt-5 flex-1 text-sm italic leading-relaxed text-ink/90">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
        <Avatar name={t.name} />
        <div>
          <p className="text-sm font-semibold text-ink">{t.name}</p>
          <p className="text-xs uppercase tracking-wider text-muted-dim">
            {t.role}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Below this many quotes the marquee is worse than no marquee: it tiles the
 * same card six times and reads as padding rather than proof.
 */
const MARQUEE_MIN = 3;

export default function Testimonials() {
  const marquee = TESTIMONIALS.length >= MARQUEE_MIN;

  // One "half" of the loop - repeated so it's wider than any viewport,
  // then rendered twice and translated -50% for a seamless infinite scroll.
  const half = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  // NOTE: deliberately no `overflow-hidden` on the section. The blurred orb
  // below overhangs the bottom edge, and clipping it cut the glow off in a
  // hard horizontal line above the CTA card. Horizontal bleed is already
  // covered by `overflow-x: clip` on html/body in globals.css.
  return (
    <section className="relative py-28 sm:py-36">
      <GlowOrb className="right-0 top-1/3 bg-primary/15" size={500} />

      <div className="relative">
        <div className="mx-auto mb-16 max-w-6xl px-6 text-center">
          <Reveal>
            <p className="label-mono mb-3">
              Client Love
            </p>
          </Reveal>
          <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            <WordReveal text="What our " className="text-ink" />
            <WordReveal text="clients say" className="text-metal" delay={0.2} />
          </h2>

          {/*
            The aggregate rating strip that used to sit here is gone. An
            average is a claim about a sample, and it isn't one worth making
            over a handful of reviews - the quotes speak for themselves.
          */}
        </div>

        {marquee ? (
          /* Auto-scrolling strip - inset from the viewport edges, with a
             fade-out mask on both sides. Pauses on hover, freezes under
             reduced motion. */
          <Reveal delay={0.1}>
            <div className="mx-auto max-w-[90rem] px-4 sm:px-6">
              <div className="relative overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                <div className="flex w-max animate-marquee-slow hover:[animation-play-state:paused]">
                  {half.map((t, i) => (
                    <TestimonialCard key={`a-${i}`} t={t} />
                  ))}
                  {/* Duplicate half for the seamless loop - hidden from screen readers. */}
                  <div aria-hidden className="flex">
                    {half.map((t, i) => (
                      <TestimonialCard key={`b-${i}`} t={t} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ) : (
          /* One or two quotes: centre them and let them breathe. */
          <Reveal delay={0.1}>
            <div className="mx-auto flex max-w-6xl flex-wrap items-stretch justify-center gap-6 px-6">
              {TESTIMONIALS.map((t) => (
                <TestimonialCard key={t.name} t={t} wide />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
