import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/sections/ProductDetail";
import CtaBand from "@/components/sections/CtaBand";
import { PRODUCTS, SITE } from "@/lib/constants";

/** Every product is known at build time, so prerender all of them. */
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) return { title: `Product - ${SITE.name}` };

  return {
    title: `${product.name} - ${SITE.name}`,
    description: product.description,
  };
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
