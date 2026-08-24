import { NextResponse } from "next/server";

/**
 * Contact form handler. Posts the submission to Resend, which emails it to TO.
 *
 * The `from` address is Resend's shared onboarding sender, which needs no
 * domain purchase - but it will ONLY deliver to the address that owns the
 * Resend account.
 *
 * TO is the Zoho group, so a submission reaches both partners at once. It is
 * deliberately the same address SITE.email publishes to visitors - one address
 * for the whole company, nothing personal baked into the repo.
 *
 * FROM sits on send.dkaylabs.com, a subdomain verified in Resend purely for
 * sending. Keeping it off the apex is deliberate: dkaylabs.com's SPF and MX
 * belong to Zoho, and a second SPF record there would invalidate both and take
 * real mail down with it. Nobody outside the company ever sees this address -
 * the notification goes to our own inbox, and the address clients see is
 * SITE.email.
 *
 * CONTACT_INBOX remains as an escape hatch for pointing submissions somewhere
 * else (a staging inbox, a temporary forward) without a code change.
 */
const FROM = "DKayLABS <noreply@send.dkaylabs.com>";
const TO = process.env.CONTACT_INBOX ?? "contact@dkaylabs.com";

// Keep the request body small so a bot can't push megabytes through the form.
const LIMITS = { name: 100, email: 200, phone: 40, message: 5000 };

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown; // optional
  message?: unknown;
  company?: unknown; // honeypot - real users never see this field
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Escape before interpolating user text into the HTML body of the email.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Email is not configured yet." },
      { status: 500 },
    );
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // A filled honeypot means a bot. Return success so it doesn't retry.
  if (clean(body.company, 100)) return NextResponse.json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const phone = clean(body.phone, LIMITS.phone); // optional - "" is valid
  const message = clean(body.message, LIMITS.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in every field." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      // Hitting Reply in the inbox goes straight back to the sender.
      reply_to: email,
      subject: `New enquiry from ${name}`,
      html: `
        <h2 style="margin:0 0 16px;font-family:sans-serif">New contact form submission</h2>
        <p style="font-family:sans-serif"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="font-family:sans-serif"><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p style="font-family:sans-serif"><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p style="font-family:sans-serif"><strong>Message:</strong></p>
        <p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
      // Plain-text fallback for clients that don't render HTML.
      text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ""}\n${message}`,
    }),
  });

  if (!response.ok) {
    // Log the provider's reason for us; don't leak it to the browser.
    console.error("[contact] Resend rejected the send:", await response.text());
    return NextResponse.json(
      { error: "We couldn't send that. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
