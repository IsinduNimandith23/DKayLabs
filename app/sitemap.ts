import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

/**
 * Served at /sitemap.xml.
 *
 * Priority is relative within this site only - it tells a crawler which of
 * OUR pages matter most, not how we rank against anyone else. Commercial
 * intent leads: services and portfolio are what a prospect searches for.
 */

/*
 * URLs go through absoluteUrl() from lib/seo.ts - the SAME helper the
 * canonical tags resolve through - so every <loc> here is byte-identical to
 * the canonical the corresponding page renders. This file previously
 * concatenated `${SITE.url}${path}`, which turned "/" into
 * "https://www.dkaylabs.com/" while the homepage's own tag said
 * "https://www.dkaylabs.com". A sitemap URL is itself a canonicalisation
 * signal, so the two disagreeing is what Google reported as "Duplicate,
 * Google chose different canonical than user".
 */

/**
 * Real content dates, NOT `new Date()`.
 *
 * Stamping build time made every URL here claim it changed on every deploy,
 * including deploys that touched nothing but config. Crawlers that are lied
 * to about lastmod stop trusting it, which costs crawl budget on the pages
 * that did change. Bump a date here only when that page's copy actually
 * changes.
 */
const STATIC_ROUTES: {
  path: string;
  priority: number;
  lastModified: string;
}[] = [
  { path: "/", priority: 1.0, lastModified: "2026-08-28" },
  { path: "/services", priority: 0.9, lastModified: "2026-08-24" },
  { path: "/portfolio", priority: 0.9, lastModified: "2026-08-24" },
  { path: "/products", priority: 0.8, lastModified: "2026-08-24" },
  { path: "/about", priority: 0.7, lastModified: "2026-08-24" },
  { path: "/contact", priority: 0.7, lastModified: "2026-08-25" },
  // Legal pages: linked from the footer sitewide, so they get crawled either
  // way. Low priority - they exist to be findable, not to rank.
  { path: "/privacy", priority: 0.3, lastModified: "2026-09-07" },
  { path: "/terms", priority: 0.3, lastModified: "2026-09-07" },
];

/** Keyed by slug so a new product can't silently inherit a stale date. */
const PRODUCT_LAST_MODIFIED: Record<string, string> = {
  mrp: "2026-08-28",
  "driving-school": "2026-08-24",
};

const PRODUCT_FALLBACK_LAST_MODIFIED = "2026-08-24";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map(({ path, priority, lastModified }) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),
    // Derived from the same PRODUCTS array that generateStaticParams uses in
    // app/products/[slug]/page.tsx, so the sitemap cannot list a route that
    // doesn't exist - or miss one that does.
    ...PRODUCTS.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified:
        PRODUCT_LAST_MODIFIED[product.slug] ?? PRODUCT_FALLBACK_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
