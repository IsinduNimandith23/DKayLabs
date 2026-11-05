import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/sections/ProductDetail";
import ClosingCta from "@/components/sections/ClosingCta";
import JsonLd from "@/components/seo/JsonLd";
import { productBreadcrumbSchema, productSchema } from "@/lib/schema";
import { PRODUCTS, SITE, productPath } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

/**
 * A product's own page, at the site root: www.dkaylabs.com/trainingwheels.
 *
 * Each product is a brand of its own, so it gets a top-level address rather
 * than /products/<slug> (those old URLs redirect here - see next.config.mjs).
 * This is the only dynamic segment at the root, and every real page beside
 * it (/about, /services, ...) is a static route, which Next always matches
 * first - so it can't shadow them.
 *
 * Products that have outgrown the generic ProductDetail layout get a page
 * written for them instead. Anything not listed in RICH_PAGES falls through
 * to the shared component, which stays the default - a bespoke page is
 * earned, not the starting point.
 *
 * A product that has outgrown even that gets a site of its own (`ownSite`),
 * which next.config.mjs rewrites in - it never reaches this route at all.
 * (Rewrites in next.config run before dynamic routes are matched.)
 */
const RICH_PAGES: Record<string, () => JSX.Element> = {};

/**
 * Every product is known at build time, so prerender all of them - except
 * the ones served by their own site, whose URL this route must not claim.
 */
export function generateStaticParams() {
  return PRODUCTS.filter((product) => !product.ownSite).map((product) => ({
    slug: product.slug,
  }));
}

/*
 * ...and refuse anything else outright. At the root this matters twice over:
 * every mistyped URL on the site lands on this segment. Without this an
 * unknown slug is rendered on demand, and the notFound() below then streams
 * the 404 as client-side flight data - the visitor gets an empty page until
 * hydration. Turning dynamic params off routes unknown slugs to the
 * prerendered 404 instead, which arrives as real HTML.
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
    return { title: `Page not found - ${SITE.name}`, robots: { index: false, follow: false } };
  }

  return pageMetadata({
    // "TrainingWheels - Driving School Management System": the brand alone
    // tells a searcher nothing yet, so the title carries what it is.
    title: `${product.name} - ${product.tagline}`,
    description: product.metaDescription ?? product.description,
    path: productPath(product),
  });
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const RichPage = RICH_PAGES[product.slug];

  return (
    <main className="pt-nav">
      {/* Both layouts get the same markup - the entity is the product, not the
          template that happens to render it. */}
      <JsonLd data={productSchema(product)} />
      <JsonLd data={productBreadcrumbSchema(product)} />
      {RichPage ? <RichPage /> : <ProductDetail product={product} />}
      {/* A bespoke page closes with its own CTA, so the shared closer would
          just stack a second one under it. The generic layout has no closing
          CTA of its own and still needs this. */}
      {!RichPage && <ClosingCta />}
    </main>
  );
}
