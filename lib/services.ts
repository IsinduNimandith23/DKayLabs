import { PROJECTS, TESTIMONIALS, type Project, type Service, type Testimonial } from "./constants";

// Website screenshots only - posters are filed under their own service, and
// a driving-school flyer cycling under "SaaS Development" would mislead.
const ALL_SHOTS = PROJECTS.flatMap((p) => (p.image && p.format !== "poster" ? [p.image] : []));

/** A service's own images, else screenshots of work under it, else all work. */
export function serviceImages(service: Service): string[] {
  if (service.images?.length) return service.images;
  const matching = PROJECTS.filter((p) => p.service === service.title).flatMap((p) =>
    p.image ? [p.image] : [],
  );
  return matching.length ? matching : ALL_SHOTS;
}

/** "SEO & Digital Marketing" -> "seo-and-digital-marketing". */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * URL-safe id for a service - the /services#<slug> anchor that opens its row,
 * and the /services/<slug> path of its own page.
 */
export function serviceSlug(title: string): string {
  return slugify(title);
}

/** /portfolio/<slug> for a project: "New Sagarika Driving School" -> "new-sagarika-driving-school". */
export function projectSlug(project: Project): string {
  return slugify(project.title);
}

/**
 * Projects that get a case-study page: client work with a live site of its
 * own. Design posters have nothing to write up beyond the image, and
 * in-house products have their own pages under /products.
 */
export const CASE_STUDY_PROJECTS = PROJECTS.filter(
  (p) => p.format !== "poster" && !!p.url?.startsWith("http"),
);

/** A service's own page is indexable once its long-form content exists. */
export const isServicePagePublished = (service: Service) => !!service.page;

/** A case study is indexable once its write-up exists. */
export const isCaseStudyPublished = (project: Project) => !!project.caseStudy;

/** The project's client quote, matched on the company in the reviewer's role. */
export function projectTestimonial(project: Project): Testimonial | undefined {
  const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = key(project.title);
  return TESTIMONIALS.find((t) => key(t.role).includes(name));
}
