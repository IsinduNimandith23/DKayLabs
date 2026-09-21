import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import ReviewsCarousel from "@/components/ui/ReviewsCarousel";
import { TESTIMONIALS } from "@/lib/constants";

/**
 * Client reviews - a framed panel of quote cards that steps one review at a
 * time (see ReviewsCarousel). With three or fewer quotes it just sits still.
 */
export default function Testimonials() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="relative mx-auto max-w-5xl px-6">
        <h2 className="mb-14 font-machina text-[length:clamp(2.5rem,7vw,4.5rem)] leading-none tracking-[-0.02em] sm:mb-20">
          <WordReveal text="Our" className="font-extralight text-ink" />
          <WordReveal text="Client" className="font-medium text-ink" delay={0.1} />
          <WordReveal text="Reviews" className="font-black text-primary" delay={0.2} />
        </h2>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-3xl bg-[#1e1e1e] p-5 sm:p-10 lg:px-12 lg:py-14">
            <ReviewsCarousel items={TESTIMONIALS} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
