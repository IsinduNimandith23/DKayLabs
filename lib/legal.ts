/**
 * Copy for /privacy and /terms. Edit the wording here, not in the component -
 * same split as lib/constants.ts, which is where the company identity these
 * documents reference (email, location) lives.
 *
 * EVERY factual claim below was checked against the code and must stay that
 * way. If any of these change, this file changes with them:
 *
 *   - app/api/contact/route.ts collects name, email, optional phone, message
 *     (plus a `company` honeypot that is discarded), forwards them to Resend,
 *     and stores nothing. There is no database in this project.
 *   - There is no analytics, tag manager, advertising pixel or tracking
 *     script anywhere in the codebase.
 *   - The only browser storage is `localStorage.theme` (app/layout.tsx and
 *     components/ui/ThemeToggle.tsx). No cookies are set.
 *   - Fonts come through next/font, which self-hosts them at build time, so a
 *     visitor's browser never calls Google.
 *
 * Written to be accurate rather than exhaustive. It is not legal advice - have
 * it reviewed before relying on it for a jurisdiction that matters to you.
 */

export type LegalSection = {
  heading: string;
  /** Paragraphs. */
  body?: string[];
  /** Rendered as a bulleted list under `body`. */
  bullets?: string[];
};

export type LegalDocument = {
  eyebrow: string;
  /** Split so the second half can take the violet accent. */
  titleLead: string;
  titleAccent: string;
  intro: string;
  /** Human-readable, shown under the title. */
  updated: string;
  sections: LegalSection[];
};

const UPDATED = "7 September 2026";

export const PRIVACY: LegalDocument = {
  eyebrow: "Legal",
  titleLead: "Privacy ",
  titleAccent: "policy",
  updated: UPDATED,
  intro:
    "This policy explains exactly what happens to your information when you use this site. It is short because the site does very little with it - there is no tracking, no advertising, and no database sitting behind these pages.",
  sections: [
    {
      heading: "Who we are",
      body: [
        "DKayLABS is a digital services company based in Colombo, Sri Lanka, building websites, SaaS platforms and AI-powered products. If you have a question about this policy or about anything below, email contact@dkaylabs.com.",
      ],
    },
    {
      heading: "What we collect",
      body: [
        "Only what you type into the contact form, and only when you choose to submit it:",
      ],
      bullets: [
        "Your name",
        "Your email address",
        "Your phone number, if you choose to give one - the field is optional",
        "The message you write",
      ],
    },
    {
      heading: "What we do with it",
      body: [
        "We use it to read your enquiry and reply to it. That is the whole purpose. We do not sell it, rent it, share it with advertisers, or add you to a marketing list you did not ask to join.",
        "When you submit the form, its contents are sent to Resend, the email provider we use, which delivers them as an email to our own inbox at contact@dkaylabs.com. Your email address is set as the reply-to on that message so we can respond directly. Resend processes the message in order to deliver it and is bound by its own privacy terms.",
        "The site itself stores nothing. There is no database behind these pages and no copy of your submission is kept here - once the email is sent, the only record is the message in our inbox.",
      ],
    },
    {
      heading: "Cookies and tracking",
      body: [
        "This site sets no cookies and runs no analytics, tag manager, advertising pixel or tracking script of any kind.",
        "The one thing stored in your browser is your light or dark theme preference, saved locally on your own device so the site does not flash the wrong theme on your next visit. It never leaves your device and we cannot read it. Clearing your browser storage removes it and hands the choice back to your operating system.",
        "Fonts are served from this site rather than fetched from a third party, so loading a page does not tell anyone else that you visited.",
      ],
    },
    {
      heading: "Hosting and server logs",
      body: [
        "The site is hosted on Vercel. Like effectively every web host, Vercel records standard technical request logs - things like IP address, browser type and the page requested - which exist to keep the service running and secure. That processing is Vercel's, under its own privacy terms, and we do not use those logs to build a profile of you.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "Enquiry emails stay in our inbox for as long as we may reasonably need them - to answer you, to carry out work you go on to commission, and to keep normal business records. When an enquiry is no longer relevant, we delete it.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        "Email contact@dkaylabs.com and you can ask us to send you a copy of what we hold about you, correct anything that is wrong, or delete it entirely. We will act on the request as quickly as we reasonably can. Depending on where you live, you may also have a right to complain to your local data protection authority.",
      ],
    },
    {
      heading: "Links to other sites",
      body: [
        "Some pages link out to client work, our social profiles and other external sites. Once you follow one of those links you are on someone else's site, under their privacy policy, not this one.",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        "If we change how any of this works, we will update this page and the date shown above it. Substantive changes take effect when they are published here.",
      ],
    },
  ],
};

export const TERMS: LegalDocument = {
  eyebrow: "Legal",
  titleLead: "Terms of ",
  titleAccent: "service",
  updated: UPDATED,
  intro:
    "These terms cover your use of this website. They are not the agreement for any project we take on - that is a separate written contract, and where the two ever disagree, the contract wins.",
  sections: [
    {
      heading: "Using this site",
      body: [
        "You are welcome to browse these pages, read what is here and get in touch. In return, please do not attempt to break into, overload, scrape at damaging volume, or otherwise interfere with the site or the systems behind it, and do not use it for anything unlawful.",
      ],
    },
    {
      heading: "Enquiries are not a contract",
      body: [
        "Sending the contact form starts a conversation. It does not create a binding agreement, reserve capacity, or oblige either of us to go ahead. Work begins only once we have both agreed a written scope and price.",
        "Please do not send confidential material through the contact form. Treat anything you put in it as an ordinary email until we have a confidentiality agreement in place.",
      ],
    },
    {
      heading: "Pricing and availability",
      body: [
        "Any prices, timelines, packages or availability shown on this site are indicative and can change without notice. A quote is binding only when we have given it to you in writing for your specific project.",
        "Products listed on this site may be in development, in private beta, or live, and the status shown on each product page is our honest current view rather than a promise about a release date.",
      ],
    },
    {
      heading: "Our content",
      body: [
        "The design, code, text, graphics and branding on this site belong to DKayLABS unless credited otherwise, and are protected by copyright. You may read and share our pages; you may not copy, republish or resell the content or pass our work off as your own without written permission.",
        "Client names, logos and project work are shown with permission and remain the property of their respective owners.",
      ],
    },
    {
      heading: "Third-party links",
      body: [
        "Where we link to another site, we do it because we think it is useful. We do not control those sites and are not responsible for their content, their availability, or what they do with your data.",
      ],
    },
    {
      heading: "No warranty",
      body: [
        "This site is provided as it is. We work to keep it accurate, current and available, but we do not guarantee that it will be uninterrupted, error-free, or that every detail on it is complete and up to date at the moment you read it.",
      ],
    },
    {
      heading: "Liability",
      body: [
        "To the extent the law allows, DKayLABS is not liable for indirect or consequential loss arising from your use of this website - for example lost profits, lost business or lost data. Nothing here limits liability that cannot lawfully be limited.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of Sri Lanka, and the courts of Sri Lanka have jurisdiction over any dispute about them.",
      ],
    },
    {
      heading: "Changes to these terms",
      body: [
        "We may update these terms from time to time. The version published on this page, with the date shown above, is the one that applies.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Questions about these terms go to contact@dkaylabs.com.",
      ],
    },
  ],
};
