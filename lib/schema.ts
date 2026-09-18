/**
 * schema.org JSON-LD builders.
 *
 * Search Console had four pages sitting in "Discovered - currently not
 * indexed", which is a crawl-PRIORITY signal rather than an error: Google
 * found the URLs and decided they weren't worth fetching yet. Structured data
 * is the main lever available for that - it tells Google what this site and
 * its pages actually are instead of leaving it to infer from markup.
 *
 * Everything is derived from lib/constants.ts so the graph cannot drift away
 * from what the pages render. Nothing here restates content that already
 * lives there.
 *
 * The @id values are stable URIs, not page URLs, so separate pages can
 * reference the same Organization node instead of each declaring a rival copy
 * of the company.
 */

import { SERVICES, SITE, SOCIALS, type Product } from "./constants";
import { absoluteUrl } from "./seo";

/** Stable node identifiers. Fragments keep them distinct from real routes. */
const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;

/**
 * Only profiles that actually exist. SOCIALS keeps unlaunched entries as "#"
 * placeholders (the Footer skips them the same way) and `sameAs` pointing at
 * a dead link is a bad entity signal.
 */
const liveProfiles = SOCIALS.filter((s) => s.href !== "#").map((s) => s.href);

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    /*
     * Two types on one node. ProfessionalService is a LocalBusiness subtype,
     * which is the vocabulary Google maps onto a Google Business Profile - the
     * strongest brand-entity signal available to an agency with a real city.
     * Organization leads because everything referencing ORG_ID (services,
     * products, breadcrumbs) is describing the company, not a storefront.
     *
     * The address below carries locality + country but no street, so the
     * Rich Results Test will flag `address` as incomplete for the
     * LocalBusiness half. That is a warning, not an error, and inventing a
     * street we don't publish would be worse than wearing the warning.
     */
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: SITE.name,
    /*
     * Google tokenises "dkaylabs" as d-kay-labs and hands the query to older
     * entities that already own those tokens - dkaylaw.com, dkayofficials.com,
     * D.Kay. Search Console showed the brand query averaging position 12.9,
     * which is what losing that fight looks like. These are the spellings a
     * person actually types; declaring them maps every variant onto THIS
     * entity instead of leaving a young domain to win on inference alone.
     */
    alternateName: ["DKay LABS", "DKay Labs", "D Kay Labs", "DKayLabs"],
    url: SITE.url,
    description: SITE.description,
    slogan: SITE.tagline,
    /*
     * Year only - ISO 8601 permits the reduced form, and it is the honest
     * precision. Its job is to separate this DKay from the ones that have been
     * trading since the 2010s, not to claim a specific launch day.
     */
    foundingDate: "2026",
    /*
     * Derived from the same SERVICES array /services renders, so the topics we
     * claim expertise in cannot drift from the ones we actually publish.
     */
    knowsAbout: SERVICES.map((service) => service.title),
    areaServed: "Worldwide",
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/Logo/monsterOrange.png"),
      width: 4096,
      height: 4096,
    },
    image: absoluteUrl("/opengraph-image"),
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Colombo",
      addressCountry: "LK",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.email,
      telephone: SITE.phone,
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
    ...(liveProfiles.length > 0 && { sameAs: liveProfiles }),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/**
 * The /services catalogue as an ItemList of Service nodes.
 *
 * Built from the SERVICES array the page itself renders, so the two cannot
 * disagree about what we offer. No `offers`/price: nothing on this site
 * publishes a fixed price, and inventing one to win a rich result would be a
 * lie to both Google and the reader.
 */
export function servicesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Services by ${SITE.name}`,
    itemListElement: SERVICES.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: { "@id": ORG_ID },
        areaServed: "Worldwide",
      },
    })),
  };
}

/**
 * A product page's own entity.
 *
 * SoftwareApplication rather than Product: these are systems people use, not
 * goods with a SKU. Google's rich result for this type wants offers and
 * ratings, which we deliberately don't have - the markup is here to describe
 * the entity accurately, not to farm stars.
 */
export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    alternateName: product.tagline,
    description: product.description,
    url: absoluteUrl(`/products/${product.slug}`),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web browser",
    featureList: product.highlights,
    publisher: { "@id": ORG_ID },
    author: { "@id": ORG_ID },
  };
}

/** Trail for a product detail page: Home > Products > <name>. */
export function productBreadcrumbSchema(product: Product) {
  const trail = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${product.slug}` },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
