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
