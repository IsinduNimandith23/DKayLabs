import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/sections/ProductDetail";
import CtaBand from "@/components/sections/CtaBand";
import MrpPage from "@/components/sections/products/mrp";
import { PRODUCTS, SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

/**
 * Products that have outgrown the generic ProductDetail layout and get a page
 * written for them instead. Anything not listed here falls through to the
 * shared component, which stays the default - a bespoke page is earned, not
 * the starting point.
 */
const RICH_PAGES: Record<string, () => JSX.Element> = {
  mrp: MrpPage,
};

/** Every product is known at build time, so prerender all of them. */
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

/*
 * ...and refuse anything else outright. Without this an unknown slug is
 * rendered on demand, and the notFound() below then streams the 404 as
 * client-side flight data - the visitor gets an empty page until hydration.
 * Turning dynamic params off routes unknown slugs to the prerendered 404
 * instead, which arrives as real HTML.
 */
export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = PRODUCTS.find((p) => p.slug === params.slug);

  // Unknown slug renders the 404 below. Keep it out of the index rather than
  // letting a crawler bank a real URL for a page that doesn't exist.
  if (!product) {
    return { title: `Product - ${SITE.name}`, robots: { index: false, follow: false } };
  }

  return pageMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}`,
  });
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const RichPage = RICH_PAGES[product.slug];

  return (
    <main className="pt-16">
      {RichPage ? <RichPage /> : <ProductDetail product={product} />}
      {/* A bespoke page closes with its own CTA, so the shared band would just
          stack a second one under it. The generic layout has no closing CTA of
          its own and still needs this. */}
      {!RichPage && <CtaBand />}
    </main>
  );
}
