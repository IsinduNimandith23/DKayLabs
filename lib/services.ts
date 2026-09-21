import { PROJECTS, type Service } from "./constants";

const ALL_SHOTS = PROJECTS.flatMap((p) => (p.image ? [p.image] : []));

/** A service's own images, else screenshots of work under it, else all work. */
export function serviceImages(service: Service): string[] {
  if (service.images?.length) return service.images;
  const matching = PROJECTS.filter((p) => p.service === service.title).flatMap((p) =>
    p.image ? [p.image] : [],
  );
  return matching.length ? matching : ALL_SHOTS;
}

/** URL-safe id for a service - the /services#<slug> anchor that opens its row. */
export function serviceSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
