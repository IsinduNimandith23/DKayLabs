"use client";

import { useEffect, useState, type FocusEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

export type ServiceRow = {
  title: string;
  description: string;
  comingSoon: boolean;
  images: string[];
};

const EASE = [0.16, 1, 0.3, 1] as const;
const SLIDE_MS = 2200;

/**
 * Homepage services list. On hover-capable desktops, hovering a row shrinks
 * the list's type and unfolds just that row: its description on the left and
 * its own image slideshow on the right. Only the list changes size - the
 * section around it keeps its width.
 *
 * On touch / narrow screens the first tap unfolds the row (description +
 * slideshow stacked), the second follows the link.
 */
export default function ServicesList({ services }: { services: ServiceRow[] }) {
  const [active, setActive] = useState<number | null>(null);
  const canHover = useCanHover();
  const open = canHover && active !== null;

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative"
        onMouseLeave={() => canHover && setActive(null)}
        onBlur={handleBlur}
      >
        <ul className="border-b border-ink/20">
          {services.map((service, i) => {
            const isActive = active === i;
            return (
              <li key={service.title} className="border-t border-ink/20">
                <Link
                  href="/services"
                  onMouseEnter={() => canHover && setActive(i)}
                  // Hover devices only - on touch, focus lands before the
                  // click and would skip the "first tap unfolds" step.
                  onFocus={() => canHover && setActive(i)}
                  onClick={(e) => {
                    // Touch: first tap unfolds, second tap navigates.
                    if (!canHover && !isActive) {
                      e.preventDefault();
                      setActive(i);
                    }
                  }}
                  className="block pb-3 pt-4 outline-none focus-visible:bg-ink/5"
                >
                  <div className="flex items-start">
                    <div className="min-w-0 flex-1">
                      <span
                        className={`block font-machina font-medium uppercase leading-[1.05] tracking-[-0.01em] transition-[font-size,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] text-[length:clamp(1.25rem,5.2vw,2.6rem)] ${
                          open ? "lg:text-[length:1.85rem]" : "lg:text-[length:2.6rem]"
                        } ${open && !isActive ? "text-ink/35" : "text-ink"}`}
                      >
                        {service.title}
                      </span>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            key="detail"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-md pt-3 text-sm leading-relaxed text-muted">
                              {service.description}
                            </p>
                            {service.comingSoon && (
                              <span className="mt-2 inline-block font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                                Coming soon
                              </span>
                            )}
                            {!canHover && (
                              <Slideshow
                                images={service.images}
                                alt={service.title}
                                className="mt-4 aspect-[21/10] w-full"
                              />
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Desktop: this row's own slideshow, unrolling in on the
                        right. Padding sits inside the clipped box so the gap
                        grows with it instead of jumping the title. */}
                    <AnimatePresence initial={false}>
                      {canHover && isActive && (
                        <motion.div
                          key="shots"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "42%", opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease: EASE }}
                          className="shrink-0 overflow-hidden"
                        >
                          <div className="pl-8 pt-1">
                            <Slideshow
                              images={service.images}
                              alt={service.title}
                              className="aspect-[21/10] w-full"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <span className="mt-2 flex justify-end">
                    <span
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive ? "rotate-45 scale-125" : ""
                      }`}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="8 7 17 7 17 16" />
                      </svg>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </MotionConfig>
  );
}

/** Auto-advancing crossfade. Restarts from the first image when remounted. */
function Slideshow({
  images,
  alt,
  className = "",
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((n) => (n + 1) % images.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [images.length]);

  const src = images[index];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-sunken ${className}`}>
      <AnimatePresence initial={false}>
        {src && (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {images.map((img, i) => (
            <span
              key={img}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? "w-5 bg-primary" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** True on devices with a real hover pointer at lg width and up. */
function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return canHover;
}
