import type { MetadataRoute } from "next";
import { PRODUCTS, SERVICES } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";
import {
  CASE_STUDY_PROJECTS,
  isCaseStudyPublished,
  isServicePagePublished,
  projectSlug,
  serviceSlug,
} from "@/lib/services";

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
  // 2026-11-05: SEO audit pass - new titles/descriptions on all six, the
  // service copy now in the HTML on / and /services, homepage value line,
  // /about stats, AI Solutions live, reply-time copy.
  { path: "/", priority: 1.0, lastModified: "2026-11-05" },
  { path: "/services", priority: 0.9, lastModified: "2026-11-05" },
  { path: "/portfolio", priority: 0.9, lastModified: "2026-11-05" },
  { path: "/products", priority: 0.8, lastModified: "2026-11-05" },
  { path: "/about", priority: 0.7, lastModified: "2026-11-05" },
  { path: "/contact", priority: 0.7, lastModified: "2026-11-05" },
  // Legal pages: linked from the footer sitewide, so they get crawled either
  // way. Low priority - they exist to be findable, not to rank.
  { path: "/privacy", priority: 0.3, lastModified: "2026-09-07" },
  { path: "/terms", priority: 0.3, lastModified: "2026-09-07" },
];

/** Keyed by slug so a new product can't silently inherit a stale date. */
const PRODUCT_LAST_MODIFIED: Record<string, string> = {
  "driving-school": "2026-08-24",
};

const PRODUCT_FALLBACK_LAST_MODIFIED = "2026-08-24";

/**
 * Service pages and case studies are listed ONLY once published (their
 * long-form content exists) - the same checks that flip their pages from
 * noindex to index. Add a slug's date here when you publish it, and bump it
 * when its copy changes.
 */
const SERVICE_PAGE_LAST_MODIFIED: Record<string, string> = {};
const CASE_STUDY_LAST_MODIFIED: Record<string, string> = {};
const CONTENT_FALLBACK_LAST_MODIFIED = "2026-11-05";

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
    // doesn't exist - or miss one that does. A product with its own site
    // publishes its own sitemap, which robots.ts points crawlers at.
    ...PRODUCTS.filter((product) => !product.ownSite).map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified:
        PRODUCT_LAST_MODIFIED[product.slug] ?? PRODUCT_FALLBACK_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...SERVICES.filter(isServicePagePublished).map((service) => {
      const slug = serviceSlug(service.title);
      return {
        url: absoluteUrl(`/services/${slug}`),
        lastModified: SERVICE_PAGE_LAST_MODIFIED[slug] ?? CONTENT_FALLBACK_LAST_MODIFIED,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    }),
    ...CASE_STUDY_PROJECTS.filter(isCaseStudyPublished).map((project) => {
      const slug = projectSlug(project);
      return {
        url: absoluteUrl(`/portfolio/${slug}`),
        lastModified: CASE_STUDY_LAST_MODIFIED[slug] ?? CONTENT_FALLBACK_LAST_MODIFIED,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    }),
  ];
}
