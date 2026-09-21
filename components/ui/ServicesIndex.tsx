"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import RollText from "@/components/ui/RollText";
import { SERVICES } from "@/lib/constants";
import { serviceSlug } from "@/lib/services";

const EASE = [0.16, 1, 0.3, 1] as const;

const ROWS = SERVICES.map((service) => ({
  ...service,
  slug: serviceSlug(service.title),
}));

/**
 * The /services page's full index: the homepage list's hairline rows, grown
 * into an accordion. Each row opens in place onto the service's write-up,
 * timeline and deliverables, with the enquiry link - everything the old
 * card + modal pair held, without leaving the page.
 *
 * One row is open at a time. The first starts open so the page shows what's
 * inside; a /services#<slug> hash (the homepage rows link with one) opens
 * that row instead.
 */
export default function ServicesIndex() {
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const openFromHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      const i = ROWS.findIndex((row) => row.slug === slug);
      if (i !== -1) setOpen(i);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ul className="border-b border-ink/20">
        {ROWS.map((service, i) => {
          const isOpen = open === i;
          const comingSoon = service.status === "coming-soon";
          const panelId = `${service.slug}-panel`;

          return (
            <li key={service.slug} id={service.slug} className="scroll-mt-32 border-t border-ink/20">
              <h2>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group grid w-full cursor-pointer grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-y-1 py-5 text-left outline-none focus-visible:bg-ink/5 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:py-7"
                >
                  <span
                    className={`font-machina text-xs tabular-nums transition-colors duration-500 sm:text-sm ${
                      isOpen ? "text-primary" : "text-ink/45 group-hover:text-ink"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="font-machina text-[length:clamp(1.25rem,5.2vw,2.6rem)] font-medium uppercase leading-[1.05] tracking-[-0.01em] text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                    {service.title}
                  </span>

                  <span className="ml-4 flex items-center gap-4">
                    {comingSoon && (
                      <span className="hidden font-mono text-[10px] font-bold uppercase tracking-widest text-primary sm:inline">
                        Coming soon
                      </span>
                    )}
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-9 sm:w-9 ${
                        isOpen
                          ? "rotate-45 bg-primary text-white"
                          : "bg-ink/10 text-ink group-hover:bg-primary group-hover:text-white"
                      }`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        aria-hidden
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </span>

                  {/* Phones have no room beside the title for the tag. */}
                  {comingSoon && (
                    <span className="col-start-2 font-mono text-[10px] font-bold uppercase tracking-widest text-primary sm:hidden">
                      Coming soon
                    </span>
                  )}
                </button>
              </h2>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="panel"
                    id={panelId}
                    role="region"
                    aria-label={service.title}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-10 pb-12 pt-2 sm:pl-16 lg:grid-cols-2 lg:gap-14 lg:pb-16">
                      <div className="flex flex-col items-start">
                        <p className="max-w-xl text-[0.95rem] leading-relaxed text-muted">
                          {service.detail.overview}
                        </p>

                        <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-machina text-sm">
                          <span className="text-ink/60">Timeline</span>
                          <span className="text-ink">{service.detail.timeline}</span>
                        </p>

                        <Link
                          href={`/contact?service=${encodeURIComponent(service.title)}`}
                          className="group/cta mt-8 inline-flex items-center gap-3 rounded-full border border-ink/70 py-2 pl-6 pr-2 text-xs font-bold text-ink transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-on-primary lg:mt-auto"
                        >
                          <RollText>
                            {comingSoon ? "Apply for early access" : "Apply for this service"}
                          </RollText>
                          <Image
                            src="/button.png"
                            alt=""
                            aria-hidden
                            width={261}
                            height={261}
                            className="h-7 w-7 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:rotate-45"
                          />
                        </Link>
                      </div>

                      <div>
                        <h3 className="font-machina text-sm text-ink/60">What you get</h3>
                        <ul className="mt-3 border-b border-ink/10">
                          {service.detail.deliverables.map((item) => (
                            <li
                              key={item}
                              className="flex items-baseline gap-3 border-t border-ink/10 py-2.5 text-sm text-ink/90"
                            >
                              <span aria-hidden className="font-machina font-black text-primary">
                                +
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </MotionConfig>
  );
}
