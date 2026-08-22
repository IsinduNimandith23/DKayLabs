import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import ProductCard from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/constants";

/**
 * In-house products - what DKayLABS is building for itself, as opposed to
 * the client work on /services and /portfolio.
 */
export default function Products() {
  // Lighter top padding than bottom: this is always the first section on its
  // route, where the parent <main> already adds pt-16 to clear the fixed
  // navbar. A full py-36 on top of that left a dead band of empty space.
  return (
    <section id="products" className="relative scroll-mt-24 pb-28 pt-16 sm:pb-36 sm:pt-20">
      <GlowOrb className="left-1/2 top-0 -translate-x-1/2 bg-primary/15" size={600} />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <Reveal>
            <p className="label-mono mb-3">In The Lab</p>
          </Reveal>
          <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            <WordReveal text="Products we're " className="text-ink" />
            <WordReveal text="building" className="text-metal" delay={0.2} />
          </h2>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Alongside client work we build our own software. These are in
              active development - get in early and help shape where they go.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
