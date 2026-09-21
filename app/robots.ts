import type { MetadataRoute } from "next";
import { PRODUCTS, SITE } from "@/lib/constants";

/*
 * Products with their own site are served under /products/<slug> by a
 * separate app (see next.config.mjs). Crawlers only read the robots.txt at
 * the host root - this one - so their sitemap and /api/ rule live here too.
 */
const OWN_SITES = PRODUCTS.filter((product) => product.ownSite).map(
  (product) => `/products/${product.slug}`,
);

/** Served at /robots.txt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The contact form handler - nothing to index, and crawling POST
      // endpoints only generates noise in the logs.
      disallow: ["/api/", ...OWN_SITES.map((base) => `${base}/api/`)],
    },
    sitemap: [
      `${SITE.url}/sitemap.xml`,
      ...OWN_SITES.map((base) => `${SITE.url}${base}/sitemap.xml`),
    ],
    host: SITE.url,
  };
}
