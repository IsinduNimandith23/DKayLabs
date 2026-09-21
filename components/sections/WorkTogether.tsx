"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import RollText from "@/components/ui/RollText";

type Status = "idle" | "submitting" | "success" | "error";

// Underline-only fields: no box, just a hairline that brightens on focus.
// Shared with the /contact form.
export const labelClass = "font-machina text-sm text-ink/80";
export const fieldClass =
  "w-full border-0 border-b border-ink/40 bg-transparent px-0 pb-3 pt-2 font-machina text-[0.95rem] text-ink placeholder:text-ink/70 transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-0";

// The headline's three lines. `indent` pushes WORK across so it sits under
// the tail of LETS, the staggered block from the reference.
const LINES = [
  { text: "Lets", indent: false },
  { text: "Work", indent: true },
  { text: "Together", indent: false },
];

/**
 * Homepage closer: a giant staggered headline over a bare, underline-style
 * contact form. Posts to the same /api/contact handler as the contact page.
 */
export default function WorkTogether() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }

      setStatus("success");
      form.reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong.",
      );
      setStatus("error");
    }
  }

  return (
    <section id="work-together" className="relative pb-28 pt-8 sm:pb-36">
      {/* The column is the size container; the inner block shrinks to the
          headline's width, so TOGETHER sets the right edge that the arrow
          and the form both line up to. */}
      <div className="mx-auto max-w-5xl px-6 [container-type:inline-size]">
        <div className="mx-auto w-fit">
        <h2
          aria-label="Lets work together"
          className="font-machina font-normal uppercase leading-[0.74] tracking-[-0.04em] text-ink"
        >
          {LINES.map((line, i) => (
            <Reveal key={line.text} delay={i * 0.12}>
              <span
                aria-hidden="true"
                className={`block text-[18cqw] ${line.indent ? "pl-[35%]" : ""}`}
              >
                {line.text}
              </span>
            </Reveal>
          ))}
        </h2>

        {/* Arrow and its gap scale with the headline, as in the reference. */}
        <div className="mt-[max(1.75rem,6cqw)] flex justify-end">
          <Reveal direction="scale" delay={0.3}>
            {/* The artwork points up-right; flipped to aim down at the form. */}
            <Image
              src="/button.png"
              alt=""
              width={261}
              height={260}
              className="h-[max(2.5rem,7cqw)] w-[max(2.5rem,7cqw)] rotate-180"
            />
          </Reveal>
        </div>

        <Reveal direction="up" delay={0.1}>
          <form onSubmit={handleSubmit} className="relative mt-[max(3rem,9cqw)]">
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-14">
              <div className="flex flex-col gap-1">
                <label htmlFor="wt-name" className={labelClass}>
                  Name*
                </label>
                <input
                  id="wt-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Enter your name"
                  className={fieldClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="wt-email" className={labelClass}>
                  Email*
                </label>
                <input
                  id="wt-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={fieldClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="wt-phone" className={labelClass}>
                  Phone*
                </label>
                <input
                  id="wt-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="Include country code"
                  className={fieldClass}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="wt-country" className={labelClass}>
                  Country
                </label>
                <input
                  id="wt-country"
                  name="country"
                  type="text"
                  autoComplete="country-name"
                  placeholder="Enter your country"
                  className={fieldClass}
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label htmlFor="wt-message" className={labelClass}>
                  Message*
                </label>
                <textarea
                  id="wt-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Type your message"
                  className={`${fieldClass} resize-none`}
                />
              </div>
            </div>

            {/* Honeypot: hidden from people, irresistible to bots. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <div className="mt-12 flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="flex min-w-[7rem] cursor-pointer items-center justify-center gap-2 rounded-full border border-ink/70 px-7 py-2.5 text-xs font-bold text-ink transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/40 border-t-ink" />
                    Sending…
                  </>
                ) : status === "success" ? (
                  "Sent ✓"
                ) : (
                  <RollText>Submit</RollText>
                )}
              </button>

              {status === "success" && (
                <p role="status" className="text-sm text-emerald-400">
                  Thanks - we&apos;ll be in touch shortly.
                </p>
              )}

              {status === "error" && (
                <p role="alert" className="text-sm text-red-400">
                  {error}
                </p>
              )}
            </div>
          </form>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
