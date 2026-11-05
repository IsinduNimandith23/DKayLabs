import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyDetail from "@/components/sections/CaseStudyDetail";
import JsonLd from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { breadcrumbSchema, caseStudySchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { CASE_STUDY_PROJECTS, isCaseStudyPublished, projectSlug } from "@/lib/services";

/**
 * /portfolio/<slug> - a case study per client project with a live site.
 *
 * Indexed only once the project's `caseStudy` write-up exists in
 * lib/constants.ts (isCaseStudyPublished). Before that the page renders the
 * facts the portfolio card already has - preview-able, but `noindex` and out
 * of the sitemap, because a screenshot and one sentence is a thin page.
 */
const findProject = (slug: string) => CASE_STUDY_PROJECTS.find((p) => projectSlug(p) === slug);

export function generateStaticParams() {
  return CASE_STUDY_PROJECTS.map((project) => ({ slug: projectSlug(project) }));
}

// Unknown slugs go to the prerendered 404 - see app/products/[slug]/page.tsx.
export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = findProject(params.slug);
  if (!project) {
    return { title: `Case study - ${SITE.name}`, robots: { index: false, follow: false } };
  }

  return pageMetadata({
    title: `${project.title} Case Study: ${project.category}`,
    description: project.description,
    path: `/portfolio/${params.slug}`,
    noindex: !isCaseStudyPublished(project),
  });
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = findProject(params.slug);
  if (!project) notFound();

  const path = `/portfolio/${params.slug}`;

  return (
    <main className="pt-nav">
      <JsonLd data={caseStudySchema(project, path)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Portfolio", path: "/portfolio" },
          { name: project.title, path },
        ])}
      />
      <CaseStudyDetail project={project} />
    </main>
  );
}
