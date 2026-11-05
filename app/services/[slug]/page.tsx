import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetail from "@/components/sections/ServiceDetail";
import JsonLd from "@/components/seo/JsonLd";
import { SERVICES, SITE } from "@/lib/constants";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { isServicePagePublished, serviceSlug } from "@/lib/services";

/**
 * /services/<slug> - one page per service, so each can rank for its own
 * query ("e-commerce website development Sri Lanka") instead of eight
 * services sharing one URL.
 *
 * Every service gets a route, but a page is only INDEXED once its long-form
 * `page` content exists in lib/constants.ts (isServicePagePublished). Until
 * then it renders - so it can be previewed - with `noindex`, and
 * app/sitemap.ts leaves it out.
 */
const findService = (slug: string) => SERVICES.find((s) => serviceSlug(s.title) === slug);

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: serviceSlug(service.title) }));
}

// Unknown slugs go to the prerendered 404 - see app/products/[slug]/page.tsx.
export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = findService(params.slug);
  if (!service) {
    return { title: `Service - ${SITE.name}`, robots: { index: false, follow: false } };
  }

  return pageMetadata({
    title: `${service.title} in Sri Lanka`,
    description: service.description,
    path: `/services/${params.slug}`,
    noindex: !isServicePagePublished(service),
  });
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = findService(params.slug);
  if (!service) notFound();

  const path = `/services/${params.slug}`;

  return (
    <main className="pt-nav">
      <JsonLd data={serviceSchema(service, path)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Services", path: "/services" },
          { name: service.title, path },
        ])}
      />
      <ServiceDetail service={service} />
    </main>
  );
}
