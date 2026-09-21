"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import RollText from "@/components/ui/RollText";
import { fieldClass, labelClass } from "@/components/sections/WorkTogether";
import {
  SERVICES,
  PRODUCTS,
  buildInquiryMessage,
  buildProductInquiryMessage,
} from "@/lib/constants";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The /contact form - the homepage's underline fields, plus the message
 * prefill for visitors arriving from a service's or product's Apply link.
 * Posts to /api/contact, which sends the email server-side via Resend.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Prefill the message from ?service= or ?product=. Read from window rather
  // than useSearchParams so this doesn't force a Suspense boundary on the
  // static contact route.
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
    <form onSubmit={handleSubmit} className="relative">
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-14">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className={labelClass}>
            Name*
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Enter your name"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className={labelClass}>
            Email*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter your email"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className={labelClass}>
            Phone
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

        <div className="flex flex-col gap-1">
          <label htmlFor="country" className={labelClass}>
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country-name"
            placeholder="Enter your country"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Message*
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={message ? 11 : 4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What are we building?"
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

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group/cta inline-flex min-h-[2.75rem] cursor-pointer items-center gap-3 rounded-full border border-ink/70 py-2 pl-6 pr-2 text-xs font-bold text-ink transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              Sending…
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-ink/40 border-t-ink" />
            </>
          ) : status === "success" ? (
            <span className="pr-4">Sent ✓</span>
          ) : (
            <>
              <RollText>Send message</RollText>
              <Image
                src="/button.png"
                alt=""
                aria-hidden
                width={261}
                height={261}
                className="h-7 w-7 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:rotate-45"
              />
            </>
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
  );
}
