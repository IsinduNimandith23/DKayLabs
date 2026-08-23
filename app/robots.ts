import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/** Served at /robots.txt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The contact form handler - nothing to index, and crawling POST
      // endpoints only generates noise in the logs.
      disallow: "/api/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
