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

import {
  FOUNDERS,
  SERVICES,
  SITE,
  SOCIALS,
  type Founder,
  type Product,
  type Project,
  type Service,
} from "./constants";
import { absoluteUrl } from "./seo";

/** Stable node identifiers. Fragments keep them distinct from real routes. */
const ORG_ID = `${SITE.url}/#organization`;
const SITE_ID = `${SITE.url}/#website`;
const personId = (founder: Founder) => `${SITE.url}/about#${founder.slug}`;

/**
 * Only profiles that actually exist. SOCIALS keeps unlaunched entries as "#"
 * placeholders (the Footer skips them the same way) and `sameAs` pointing at
 * a dead link is a bad entity signal.
 */
const liveProfiles = SOCIALS.filter((s) => s.href !== "#").map((s) => s.href);

/**
 * Spellings people actually type for the brand. Shared by the Organization
 * (entity matching) and the WebSite (Google's site-name feature reads the
 * WebSite node's alternateName, not the Organization's).
 */
const BRAND_ALTERNATE_NAMES = ["DKay LABS", "DKay Labs", "D Kay Labs", "DKayLabs"];

/**
 * Only what we actually sell today. "Coming soon" services stay on the page
 * (with their badge) but declaring them as offered Services / expertise in
 * structured data would claim something the page itself says isn't live.
 */
const AVAILABLE_SERVICES = SERVICES.filter((service) => service.status === "available");

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
    alternateName: BRAND_ALTERNATE_NAMES,
    url: SITE.url,
    description: SITE.description,
    slogan: SITE.tagline,
    /*
     * Year only - ISO 8601 permits the reduced form, and it is the honest
     * precision. Its job is to separate this DKay from the ones that have been
     * trading since the 2010s, not to claim a specific launch day.
     */
    foundingDate: SITE.foundingYear,
    /*
     * References, not copies - the Person nodes themselves are declared
     * sitewide by personSchema() in app/layout.tsx, so every page that
     * carries this reference also carries its target. This is what ties a
     * search for a founder's name to this organisation.
     */
    founder: FOUNDERS.map((founder) => ({ "@id": personId(founder) })),
    /*
     * Derived from the same SERVICES array /services renders, so the topics we
     * claim expertise in cannot drift from the ones we actually publish.
     */
    knowsAbout: AVAILABLE_SERVICES.map((service) => service.title),
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

/** A co-founder, declared sitewide and referenced by the Organization. */
export function personSchema(founder: Founder) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(founder),
    name: founder.name,
    jobTitle: founder.role,
    description: founder.bio,
    url: absoluteUrl("/about"),
    worksFor: { "@id": ORG_ID },
    ...(founder.sameAs.length > 0 && { sameAs: founder.sameAs }),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE.url,
    name: SITE.name,
    alternateName: BRAND_ALTERNATE_NAMES,
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
    itemListElement: AVAILABLE_SERVICES.map((service, index) => ({
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

/** A single service's own page (/services/<slug>). */
export function serviceSchema(service: Service, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.description,
    url: absoluteUrl(path),
    provider: { "@id": ORG_ID },
    areaServed: "Worldwide",
  };
}

/**
 * A case study (/portfolio/<slug>): the client's site as a CreativeWork we
 * made. `url` is the case-study page; `sameAs` points at the live site.
 */
export function caseStudySchema(project: Project, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(path)}#work`,
    name: project.title,
    headline: `${project.title} - ${project.category}`,
    description: project.description,
    url: absoluteUrl(path),
    ...(project.url?.startsWith("http") && { sameAs: project.url }),
    ...(project.image && { image: absoluteUrl(project.image) }),
    keywords: project.tags.join(", "),
    creator: { "@id": ORG_ID },
    about: project.service,
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

type Crumb = { name: string; path: string };

/**
 * BreadcrumbList for any page. Pass the trail BELOW Home - Home is always
 * the first crumb, so callers can't forget it or spell it differently.
 */
export function breadcrumbSchema(trailBelowHome: Crumb[]) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...trailBelowHome];

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

/** Trail for a product detail page: Home > Products > <name>. */
export function productBreadcrumbSchema(product: Product) {
  return breadcrumbSchema([
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${product.slug}` },
  ]);
}
