import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import RollText from "@/components/ui/RollText";
import { PRODUCTS, PRODUCT_STATUS } from "@/lib/constants";

/**
 * /products: in-house software - what DKayLABS is building for itself, as
 * opposed to the client work on /services.
 *
 * Same hairline-row language as the services index, but every row stands
 * open: there are only a couple of products, and each gets its full pitch.
 * The name and the pill both lead through to /products/<slug>.
 */
export default function Products() {
  return (
    // Last section before the footer: the bottom padding tops PageHero's own
    // pb-10 up to the py-28 / sm:py-36 rhythm the other sections use.
    <div id="products" className="scroll-mt-24 pb-[4.5rem] sm:pb-[6.5rem]">
      <PageHero
        label="Our own products"
        lines={["Our", "Own", "Products"]}
        intro="Alongside client work we build our own software. These are in active development - get in early and help shape where they go."
      >
        <ul className="border-b border-ink/20">
          {PRODUCTS.map((product, i) => {
            const href = `/products/${product.slug}`;

            return (
              <li
                key={product.slug}
                id={product.slug}
                className="scroll-mt-32 border-t border-ink/20 py-10 sm:py-14"
              >
                <Reveal>
                  <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[4rem_minmax(0,1fr)]">
                    <span className="pt-[0.35em] font-machina text-xs tabular-nums text-ink/45 sm:text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                        <h2 className="font-machina text-[length:clamp(1.75rem,6vw,3.5rem)] font-medium uppercase leading-[0.95] tracking-[-0.02em] text-ink">
                          <Link
                            href={href}
                            className="inline-block transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-2 hover:text-primary"
                          >
                            {product.name}
                          </Link>
                        </h2>

                        <span className="mt-2 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.status === "live" ? "bg-emerald-400" : "animate-pulse bg-primary"
                            }`}
                          />
                          {PRODUCT_STATUS[product.status]}
                        </span>
                      </div>

                      <p className="mt-3 font-machina text-sm text-ink/60">{product.tagline}</p>

                      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
                        <div className="flex flex-col items-start">
                          <p className="max-w-xl text-[0.95rem] leading-relaxed text-muted">
                            {product.description}
                          </p>

                          <Link
                            href={href}
                            className="group/cta mt-8 inline-flex items-center gap-3 rounded-full border border-ink/70 py-2 pl-6 pr-2 text-xs font-bold text-ink transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-on-primary lg:mt-auto"
                          >
                            <RollText>View product</RollText>
                            <Image
                              src="/button.png"
                              alt=""
                              aria-hidden
                              width={261}
                              height={261}
                              className="h-7 w-7 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:rotate-45"
                            />
                          </Link>
                        </div>

                        <div>
                          <h3 className="font-machina text-sm text-ink/60">Highlights</h3>
                          <ul className="mt-3 border-b border-ink/10">
                            {product.highlights.map((item) => (
                              <li
                                key={item}
                                className="flex items-baseline gap-3 border-t border-ink/10 py-2.5 text-sm text-ink/90"
                              >
                                <span aria-hidden className="font-machina font-black text-primary">
                                  +
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </PageHero>
    </div>
  );
}
