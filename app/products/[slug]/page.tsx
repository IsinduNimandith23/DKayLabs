import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/sections/ProductDetail";
import CtaBand from "@/components/sections/CtaBand";
import { PRODUCTS, SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

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

  return (
    <main className="pt-16">
      <ProductDetail product={product} />
      <CtaBand />
    </main>
  );
}
