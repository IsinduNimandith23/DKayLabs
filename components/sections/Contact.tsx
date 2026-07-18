"use client";

import { useState, type FormEvent } from "react";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import { SITE } from "@/lib/constants";

type Status = "idle" | "submitting" | "success";

// Shared input styling - crimson focus state.
const fieldClass =
  "w-full rounded-xl border border-snow/10 bg-charcoal/50 px-4 py-3 text-snow placeholder:text-silver-dim transition-all duration-200 focus:border-crimson focus:bg-charcoal/70 focus:outline-none focus:ring-2 focus:ring-crimson/40";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  // Placeholder submit handler - wire this to your API / email service.
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    // TODO: replace with real submission (e.g. /api/contact, Resend, Formspree).
    await new Promise((r) => setTimeout(r, 1200));

    setStatus("success");
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <section id="contact" className="relative scroll-mt-24 py-28 sm:py-36">
      <GlowOrb className="right-0 top-10 bg-crimson/15" size={500} />

      <div className="relative mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-crimson">
              Get In Touch
            </p>
          </Reveal>
          <h2 className="text-3xl font-bold sm:text-5xl">
            <WordReveal text="Let's build something " className="text-snow" />
            <WordReveal text="legendary" className="text-metal" delay={0.25} />
          </h2>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-4 max-w-xl text-silver">
              Tell us about your project. We usually reply within one business day.
            </p>
          </Reveal>
        </div>

        <Reveal direction="up" delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="glass relative overflow-hidden rounded-3xl p-6 shadow-glow-soft sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson to-transparent" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-silver">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className={fieldClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-silver">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest text-silver">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="What are we building?"
                className={`${fieldClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-shine mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-crimson px-6 py-4 text-sm font-bold uppercase tracking-wider text-snow shadow-glow transition-all duration-200 hover:bg-crimson-dark hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-snow/40 border-t-snow" />
                  Sending…
                </>
              ) : status === "success" ? (
                "Message sent ✓"
              ) : (
                "Send Message"
              )}
            </button>

            {status === "success" && (
              <p
                role="status"
                className="mt-4 text-center text-sm text-emerald-400"
              >
                Thanks - we&apos;ll be in touch shortly.
              </p>
            )}

            <p className="mt-6 text-center text-xs text-silver-dim">
              Prefer email?{" "}
              <a href={`mailto:${SITE.email}`} className="text-crimson hover:text-crimson-glow">
                {SITE.email}
              </a>
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
