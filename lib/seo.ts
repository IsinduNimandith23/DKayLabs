/**
 * Per-page metadata builder.
 *
 * Next.js merges the `metadata` export SHALLOWLY: a page that exports only
 * `title` and `description` inherits the ROOT `openGraph` object wholesale,
 * so every such page ends up advertising the same OG title and description.
 * That is why each route has to emit its own complete openGraph/twitter
 * block rather than relying on inheritance - and why that block is built
 * here once instead of being copy-pasted into seven files.
 *
 * The card image has to be named explicitly for the same reason. Next's
 * app/opengraph-image.tsx file convention injects og:image into the ROOT
 * segment's openGraph object - which is exactly the object a child page's
 * own openGraph replaces. Inheriting it only works for pages that declare
 * no openGraph at all, and every page here declares one, so leaving it out
 * silently shipped seven routes with no card image at all.
 */

import type { Metadata } from "next";
import { SITE } from "./constants";

/**
 * Root-relative path -> absolute URL, with the root rendered as the BARE
 * origin rather than `${SITE.url}/`.
 *
 * Next resolves the relative canonicals below against `metadataBase`, and for
 * "/" that yields "https://www.dkaylabs.com" with NO trailing slash. Anything
 * that spells the same page differently - the sitemap, a JSON-LD @id - is a
 * competing canonicalisation signal, and Google reported exactly that as
 * "Duplicate, Google chose different canonical than user". One helper so the
 * rule is stated once and every consumer agrees.
 */
export const absoluteUrl = (path: string) =>
  path === "/" ? SITE.url : `${SITE.url}${path}`;

/** Route served by app/opengraph-image.tsx. Absolutised via `metadataBase`. */
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE.name} - ${SITE.tagline}`,
};

type PageSeo = {
  /**
   * Page title WITHOUT the brand suffix, e.g. "Services".
   * Omit on the homepage, which uses the brand + tagline instead.
   */
  title?: string;
  description: string;
  /** Root-relative, no trailing slash: "/services". The homepage is "/". */
  path: string;
};

export function pageMetadata({ title, description, path }: PageSeo): Metadata {
  const fullTitle = title
    ? `${title} - ${SITE.name}`
    : `${SITE.name} - ${SITE.tagline}`;

  return {
    title: fullTitle,
    description,
    // Relative - resolved against `metadataBase` in app/layout.tsx.
    alternates: { canonical: path },
    /*
     * Indexability lives HERE, not on the root layout, because app/not-found.tsx
     * cannot export metadata to override what it inherits. With this block at
     * the root the 404 rendered Next's automatic `noindex` AND an inherited
     * `index, follow` - two contradictory robots tags on the same response.
     * Google resolves that to the most restrictive, so it happened to behave,
     * but it muddies crawl diagnostics. Every real route calls pageMetadata(),
     * so they all keep these directives; the 404 now inherits nothing and
     * emits `noindex` alone.
     *
     * `max-image-preview: large` is what lets Google show a full-width
     * thumbnail next to the result instead of a postage stamp.
     */
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE.name,
      locale: "en_US",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
