import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import { TESTIMONIALS, type Testimonial } from "@/lib/constants";

/** Crimson star - filled or dimmed. */
function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={filled ? "text-crimson drop-shadow-[0_0_6px_rgba(255,46,63,0.7)]" : "text-snow/15"}
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
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-crimson/40 bg-crimson/10 font-display text-sm text-crimson">
      {initials}
    </span>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="glass mr-6 flex w-[300px] shrink-0 flex-col rounded-2xl p-7 transition-colors duration-300 hover:border-crimson/40 sm:w-[380px]">
      <Stars rating={t.rating} label={`${t.rating} out of 5 stars`} />

      <blockquote className="mt-5 flex-1 text-sm italic leading-relaxed text-snow/90">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-snow/10 pt-5">
        <Avatar name={t.name} />
        <div>
          <p className="text-sm font-semibold text-snow">{t.name}</p>
          <p className="text-xs uppercase tracking-wider text-silver-dim">
            {t.role}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  const average =
    TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length;

  // One "half" of the loop - repeated so it's wider than any viewport,
  // then rendered twice and translated -50% for a seamless infinite scroll.
  const half = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <GlowOrb className="right-0 top-1/3 bg-crimson/15" size={500} />

      <div className="relative">
        <div className="mx-auto mb-16 max-w-6xl px-6 text-center">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-crimson">
              Client Love
            </p>
          </Reveal>
          <h2 className="text-3xl font-bold sm:text-5xl">
            <WordReveal text="Rated by the " className="text-snow" />
            <WordReveal text="people we serve" className="text-metal" delay={0.2} />
          </h2>

          {/* Aggregate rating strip. */}
          <Reveal direction="scale" delay={0.35}>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-snow/10 bg-charcoal/50 px-5 py-2.5 backdrop-blur">
              <Stars rating={Math.round(average)} label={`Average rating ${average.toFixed(1)} out of 5`} />
              <span className="font-display text-sm text-snow">{average.toFixed(1)}</span>
              <span className="text-xs uppercase tracking-wider text-silver-dim">
                from our partners
              </span>
            </div>
          </Reveal>
        </div>

        {/* Auto-scrolling strip - inset from the viewport edges, with a
            fade-out mask on both sides. Pauses on hover, freezes under
            reduced motion. */}
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
      </div>
    </section>
  );
}
