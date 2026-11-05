import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import GlowOrb from "@/components/ui/GlowOrb";
import RollText from "@/components/ui/RollText";
import { SERVICES, type Project } from "@/lib/constants";
import { isServicePagePublished, projectTestimonial, serviceSlug } from "@/lib/services";

/**
 * A project's case study, /portfolio/<slug>. The facts the portfolio card
 * already carries (description, tags, service, live URL, screenshot, the
 * client's quote) render on every page; the write-up - challenge, approach,
 * results, stack, timeline - comes from the project's optional `caseStudy`
 * (lib/constants.ts) and only renders once it exists.
 */
export default function CaseStudyDetail({ project }: { project: Project }) {
  const study = project.caseStudy;
  const quote = projectTestimonial(project);
  const service = SERVICES.find((s) => s.title === project.service);
  const serviceHref = service
    ? isServicePagePublished(service)
      ? `/services/${serviceSlug(service.title)}`
      : `/services#${serviceSlug(service.title)}`
    : "/services";

  return (
    <article className="relative pb-28 pt-16 sm:pb-36 sm:pt-20">
      <GlowOrb className="left-1/2 top-0 -translate-x-1/2 bg-primary/15" size={600} />

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal>
          <Link
            href="/portfolio"
            className="mb-10 inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted transition-colors duration-200 hover:text-primary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <RollText>All work</RollText>
          </Link>
        </Reveal>

        <p className="label-mono mb-3">{project.category}</p>
        <h1 className="font-machina text-4xl font-black leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl">
          {project.title}
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">{project.description}</p>

        {project.image && (
          <div className="relative mt-12 aspect-[19/9] overflow-hidden rounded-3xl bg-sunken dark:bg-[#1e1e1e]">
            <Image
              src={project.image}
              alt={`${project.title} website - homepage screenshot`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 976px"
              className="object-cover object-top"
            />
          </div>
        )}

        {/* Fact sheet. */}
        <dl className="mt-12 grid gap-6 border-y border-ink/15 py-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="font-machina text-ink/60">Service</dt>
            <dd className="mt-1">
              <Link href={serviceHref} className="text-ink underline decoration-ink/30 underline-offset-4 hover:text-primary hover:decoration-primary">
                {project.service}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-machina text-ink/60">Focus</dt>
            <dd className="mt-1 text-ink">{project.tags.join(", ")}</dd>
          </div>
          {study?.timeline && (
            <div>
              <dt className="font-machina text-ink/60">Timeline</dt>
              <dd className="mt-1 text-ink">{study.timeline}</dd>
            </div>
          )}
          {study?.stack && study.stack.length > 0 && (
            <div>
              <dt className="font-machina text-ink/60">Built with</dt>
              <dd className="mt-1 text-ink">{study.stack.join(", ")}</dd>
            </div>
          )}
          {project.url && (
            <div>
              <dt className="font-machina text-ink/60">Live site</dt>
              <dd className="mt-1">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline decoration-ink/30 underline-offset-4 hover:text-primary hover:decoration-primary"
                >
                  {new URL(project.url, "https://www.dkaylabs.com").hostname.replace(/^www\./, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>

        {study && (
          <div className="mt-16 grid gap-14 lg:grid-cols-2">
            <section aria-labelledby="challenge-heading">
              <h2 id="challenge-heading" className="label-mono mb-5">The brief</h2>
              {study.challenge.map((para) => (
                <p key={para.slice(0, 40)} className="mb-4 leading-relaxed text-muted">{para}</p>
              ))}
            </section>
            <section aria-labelledby="approach-heading">
              <h2 id="approach-heading" className="label-mono mb-5">What we built</h2>
              {study.approach.map((para) => (
                <p key={para.slice(0, 40)} className="mb-4 leading-relaxed text-muted">{para}</p>
              ))}
            </section>
          </div>
        )}

        {study && study.results.length > 0 && (
          <section aria-labelledby="results-heading" className="mt-16">
            <h2 id="results-heading" className="font-machina text-[length:clamp(1.75rem,4vw,2.75rem)] font-black leading-none tracking-[-0.02em] text-ink">
              Results
            </h2>
            <ul className="mt-8 border-b border-ink/15">
              {study.results.map((result) => (
                <li key={result} className="flex items-baseline gap-3 border-t border-ink/15 py-4 text-ink">
                  <span aria-hidden className="font-machina font-black text-primary">+</span>
                  {result}
                </li>
              ))}
            </ul>
          </section>
        )}

        {quote && (
          <figure className="mt-20 max-w-3xl">
            <blockquote className="font-machina text-[length:clamp(1.25rem,2.6vw,1.75rem)] font-light leading-snug text-ink">
              &ldquo;{quote.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-sm text-muted">
              <span className="font-semibold text-ink">{quote.name}</span>, {quote.role}
            </figcaption>
          </figure>
        )}

        <div className="glass mt-20 flex flex-col gap-6 rounded-2xl p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="label-mono mb-3">Want something like this?</h2>
            <p className="text-sm leading-relaxed text-muted">
              Tell us about your project and we&apos;ll come back within one
              business day with how we&apos;d approach it.
            </p>
          </div>
          <Link
            href={`/contact?service=${encodeURIComponent(project.service)}`}
            className="btn-shine inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary/50 bg-surface/70 px-8 py-3.5 text-center text-sm font-semibold uppercase tracking-wider text-ink transition-all duration-200 hover:bg-primary hover:text-on-primary hover:shadow-glow"
          >
            <RollText>Start a project like this</RollText>
          </Link>
        </div>
      </div>
    </article>
  );
}
