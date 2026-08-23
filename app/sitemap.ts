import type { MetadataRoute } from "next";
import { PRODUCTS, SITE } from "@/lib/constants";

/**
 * Served at /sitemap.xml.
 *
 * Priority is relative within this site only - it tells a crawler which of
 * OUR pages matter most, not how we rank against anyone else. Commercial
 * intent leads: services and portfolio are what a prospect searches for.
 */
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1.0 },
  { path: "/services", priority: 0.9 },
  { path: "/portfolio", priority: 0.9 },
  { path: "/products", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/contact", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...STATIC_ROUTES.map(({ path, priority }) => ({
      url: `${SITE.url}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),
    // Derived from the same PRODUCTS array that generateStaticParams uses in
    // app/products/[slug]/page.tsx, so the sitemap cannot list a route that
    // doesn't exist - or miss one that does.
    ...PRODUCTS.map((product) => ({
      url: `${SITE.url}/products/${product.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
