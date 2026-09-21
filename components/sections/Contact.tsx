import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/ui/ContactForm";
import SocialIcon from "@/components/ui/SocialIcon";
import { SITE, SOCIALS } from "@/lib/constants";

// Direct lines, in the order people reach for them. `href` is optional:
// location and hours are facts, not links.
const DETAILS: { label: string; value: string; href?: string; external?: boolean }[] = [
  { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { label: "Phone", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
  {
    label: "WhatsApp",
    value: "Message us",
    href: `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`,
    external: true,
  },
  { label: "Location", value: SITE.location },
  { label: "Hours", value: SITE.hours },
];

// Placeholder socials ("#") have no page yet, so they stay off the list.
const LIVE_SOCIALS = SOCIALS.filter((s) => s.href !== "#");

/**
 * /contact: the headline, the direct contact lines as hairline rows, and the
 * underline form beside them.
 */
export default function Contact() {
  return (
    // Last section before the footer: the bottom padding tops PageHero's own
    // pb-10 up to the py-28 / sm:py-36 rhythm the other sections use.
    <div id="contact" className="scroll-mt-24 pb-[4.5rem] sm:pb-[6.5rem]">
      <PageHero
        label="Get in touch"
        lines={["Get", "In", "Touch"]}
        intro="Tell us about your project. We usually reply within one business day."
      >
        {/* A wide gutter keeps the detail rows and the form's underlines
            from reading as one block. */}
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-32 xl:gap-40">
          <Reveal>
            <dl className="border-b border-ink/20">
              {DETAILS.map(({ label, value, href, external }) => (
                <div key={label} className="border-t border-ink/20 py-4">
                  <dt className="font-machina text-sm text-ink/60">{label}</dt>
                  <dd className="mt-1 font-machina text-lg text-ink sm:text-xl">
                    {href ? (
                      <a
                        href={href}
                        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                        className="break-words transition-colors duration-300 hover:text-primary"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <ul className="mt-8 flex flex-wrap gap-3">
              {LIVE_SOCIALS.map((social) => (
                <li key={social.key}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink/60 transition-colors duration-300 hover:border-primary hover:text-primary"
                  >
                    <SocialIcon name={social.key} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </PageHero>
    </div>
  );
}
