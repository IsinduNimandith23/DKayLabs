import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import GlowOrb from "@/components/ui/GlowOrb";
import ServiceIcon from "@/components/ui/ServiceIcon";
import RollText from "@/components/ui/RollText";
import { PROJECTS, type Service } from "@/lib/constants";
import {
  isCaseStudyPublished,
  projectSlug,
  projectTestimonial,
  serviceSlug,
} from "@/lib/services";

/**
 * A service's own page, /services/<slug>. Built from the same SERVICES entry
 * the /services accordion renders, plus its optional long-form `page`
 * content - see the ServicePage type in lib/constants.ts. Sections with no
 * content simply don't render, so the page never shows an empty heading.
 */
export default function ServiceDetail({ service }: { service: Service }) {
  const page = service.page;
  const work = PROJECTS.filter((p) => p.service === service.title && p.format !== "poster");
  const quote = work.map(projectTestimonial).find(Boolean);
  const intro = page?.intro ?? [service.detail.overview];

  return (
    <article className="relative pb-28 pt-16 sm:pb-36 sm:pt-20">
      <GlowOrb className="left-1/2 top-0 -translate-x-1/2 bg-primary/15" size={600} />

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal>
          <Link
            href={`/services#${serviceSlug(service.title)}`}
            className="mb-10 inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted transition-colors duration-200 hover:text-primary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <RollText>All services</RollText>
          </Link>
        </Reveal>

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <ServiceIcon icon={service.icon} size={32} />
          </span>
          <div>
            <p className="label-mono mb-3">Service</p>
            {/* Plain text, not WordReveal - the H1 has to reach the HTML as
                one phrase. */}
            <h1 className="font-machina text-4xl font-black leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl">
              {service.title}
            </h1>
          </div>
        </div>

        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-muted">{service.description}</p>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="label-mono mb-5">How we approach it</h2>
            {intro.map((para) => (
              <p key={para.slice(0, 40)} className="mb-4 leading-relaxed text-muted">
                {para}
              </p>
            ))}
          </div>

          <div className="glass h-fit rounded-2xl p-7">
            <h2 className="label-mono mb-5">What you get</h2>
            <ul className="flex flex-col gap-3.5">
              {service.detail.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-muted">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0 text-primary">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <dl className="mt-7 grid gap-4 border-t border-ink/10 pt-6 text-sm">
              <div>
                <dt className="font-machina text-ink/60">Timeline</dt>
                <dd className="mt-1 text-ink">{service.detail.timeline}</dd>
              </div>
              {page?.startingPrice && (
                <div>
                  <dt className="font-machina text-ink/60">Typical investment</dt>
                  <dd className="mt-1 text-ink">{page.startingPrice}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {page?.process && page.process.length > 0 && (
          <section aria-labelledby="process-heading" className="mt-20">
            <h2 id="process-heading" className="font-machina text-[length:clamp(1.75rem,4vw,2.75rem)] font-black leading-none tracking-[-0.02em] text-ink">
              How a project runs
            </h2>
            <ol className="mt-8 border-b border-ink/15">
              {page.process.map((step, i) => (
                <li key={step.title} className="grid gap-2 border-t border-ink/15 py-6 sm:grid-cols-[4rem_14rem_1fr] sm:gap-6">
                  <span className="font-machina text-sm tabular-nums text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-machina font-medium text-ink">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{step.detail}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {work.length > 0 && (
          <section aria-labelledby="work-heading" className="mt-20">
            <h2 id="work-heading" className="font-machina text-[length:clamp(1.75rem,4vw,2.75rem)] font-black leading-none tracking-[-0.02em] text-ink">
              {service.title} we&apos;ve shipped
            </h2>
            <ul className="mt-8 grid gap-8 sm:grid-cols-2">
              {work.map((project) => {
                const caseStudy = isCaseStudyPublished(project);
                const href = caseStudy ? `/portfolio/${projectSlug(project)}` : project.url ?? "/portfolio";
                const external = !caseStudy && href.startsWith("http");
                return (
                  <li key={project.title}>
                    <a
                      href={href}
                      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                      className="group block"
                    >
                      {project.image && (
                        <div className="relative aspect-[19/9] overflow-hidden rounded-2xl bg-sunken dark:bg-[#1e1e1e]">
                          <Image
                            src={project.image}
                            alt={`${project.title} website screenshot`}
                            fill
                            sizes="(max-width: 640px) 90vw, 480px"
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </div>
                      )}
                      <h3 className="mt-4 font-machina text-lg font-medium text-ink transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{project.description}</p>
                      <span className="mt-2 inline-block font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                        {caseStudy ? "Read the case study" : external ? "Visit the live site" : "See it in the portfolio"}
                      </span>
                    </a>
                  </li>
                );
              })}
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

        {page?.faqs && page.faqs.length > 0 && (
          <section aria-labelledby="faq-heading" className="mt-20">
            <h2 id="faq-heading" className="font-machina text-[length:clamp(1.75rem,4vw,2.75rem)] font-black leading-none tracking-[-0.02em] text-ink">
              Questions clients ask
            </h2>
            <dl className="mt-8 border-b border-ink/15">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="border-t border-ink/15 py-6">
                  <dt className="font-machina font-medium text-ink">{faq.question}</dt>
                  <dd className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="glass mt-20 flex flex-col gap-6 rounded-2xl p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="label-mono mb-3">Start a {service.title.toLowerCase()} project</h2>
            <p className="text-sm leading-relaxed text-muted">
              Tell us what you&apos;re building. We scope every project around
              what you actually need and reply within one business day.
            </p>
          </div>
          <Link
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            className="btn-shine inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary/50 bg-surface/70 px-8 py-3.5 text-center text-sm font-semibold uppercase tracking-wider text-ink transition-all duration-200 hover:bg-primary hover:text-on-primary hover:shadow-glow"
          >
            <RollText>Get a quote</RollText>
          </Link>
        </div>
      </div>
    </article>
  );
}
