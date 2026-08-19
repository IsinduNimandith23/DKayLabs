"use client";

import { useEffect, useState, type FormEvent } from "react";
import Reveal from "@/components/ui/Reveal";
import WordReveal from "@/components/ui/WordReveal";
import GlowOrb from "@/components/ui/GlowOrb";
import {
  SERVICES,
  PRODUCTS,
  buildInquiryMessage,
  buildProductInquiryMessage,
} from "@/lib/constants";

type Status = "idle" | "submitting" | "success" | "error";

// Shared input styling - violet focus state.
const fieldClass =
  "w-full rounded-xl border border-ink/10 bg-surface/50 px-4 py-3 text-ink placeholder:text-muted-dim transition-all duration-200 focus:border-primary focus:bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary/40";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Prefill the message when arriving from a service modal's Apply button or
  // a product card's CTA. Read from window rather than useSearchParams so this
  // component doesn't force a Suspense boundary on the static contact route.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Only accept names we actually offer - never render arbitrary URL text.
    const requestedService = params.get("service");
    if (requestedService) {
      const match = SERVICES.find((s) => s.title === requestedService);
      if (match) {
        setMessage(buildInquiryMessage(match.title));
        return;
      }
    }

    const requestedProduct = params.get("product");
    if (requestedProduct) {
      const match = PRODUCTS.find((p) => p.name === requestedProduct);
      if (match) setMessage(buildProductInquiryMessage(match.name));
    }
  }, []);

  // Posts to /api/contact, which sends the email server-side via Resend.
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
      setMessage(""); // reset() doesn't clear a controlled field.
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
    <section id="contact" className="relative scroll-mt-24 pb-28 pt-16 sm:pb-36 sm:pt-20">
      <GlowOrb className="right-0 top-10 bg-primary/15" size={500} />

      <div className="relative mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <Reveal>
            <p className="label-mono mb-3">
              Get In Touch
            </p>
          </Reveal>
          <h2 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            <WordReveal text="Let's build something " className="text-ink" />
            <WordReveal text="legendary" className="text-metal" delay={0.25} />
          </h2>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Tell us about your project. We usually reply within one business day.
            </p>
          </Reveal>
        </div>

        <Reveal direction="up" delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="glass relative overflow-hidden rounded-3xl p-6 shadow-glow-soft sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-muted">
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
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted">
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
              <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-widest text-muted">
                Phone{" "}
                <span className="font-normal normal-case tracking-normal text-muted-dim">
                  (optional)
                </span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Include country code"
                className={fieldClass}
              />
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest text-muted">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={message ? 11 : 5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What are we building?"
                className={`${fieldClass} resize-none`}
              />
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

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-shine mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-bold uppercase tracking-wider text-on-primary shadow-glow transition-all duration-200 hover:bg-primary-dark hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/40 border-t-ink" />
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

            {status === "error" && (
              <p role="alert" className="mt-4 text-center text-sm text-red-400">
                {error}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
