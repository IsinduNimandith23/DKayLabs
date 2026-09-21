import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Reveal from "@/components/ui/Reveal";
import BackToTop from "@/components/ui/BackToTop";
import { NAV_LINKS, SOCIALS, SERVICES, SITE } from "@/lib/constants";
import SocialIcon from "@/components/ui/SocialIcon";

export default function Footer() {
  const year = new Date().getFullYear();
  // First four services, shown as quick links in the footer.
  const footerServices = SERVICES.slice(0, 4);

  return (
    <footer className="relative overflow-hidden border-t border-ink/10 bg-base/60 backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1600px] px-8 lg:px-16">
        {/* ── Main columns ───────────────────────────────────────── */}
        <div className="grid gap-12 pb-16 pt-20 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.2fr]">
          {/* Brand + socials */}
          <Reveal>
            <Logo size={46} />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
              {SITE.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {SOCIALS.filter((s) => s.href !== "#").map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-ink/10 bg-surface/50 text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-glow-soft"
                >
                  <SocialIcon name={s.key} />
                </a>
              ))}
            </div>
          </Reveal>

          {/* Explore */}
          <Reveal delay={0.1}>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-dim">
              Explore
            </h4>
            <ul className="space-y-4">
              {NAV_LINKS.filter((l) => l.href !== "/").map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex cursor-pointer items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                  >
                    <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-4" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Services */}
          <Reveal delay={0.15}>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-dim">
              Services
            </h4>
            <ul className="space-y-4">
              {footerServices.map((s) => (
                <li key={s.title}>
                  <Link
                    href="/services"
                    className="group inline-flex cursor-pointer items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                  >
                    <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-4" />
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Get in touch */}
          <Reveal delay={0.2}>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-dim">
              Get in touch
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-semibold text-ink transition-colors hover:text-primary"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                  className="text-muted transition-colors hover:text-ink"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="text-muted">{SITE.location}</li>
              <li className="text-muted">{SITE.hours}</li>
            </ul>
          </Reveal>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-ink/10 py-7 text-xs text-muted-dim sm:flex-row">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-7">
            <Link
              href="/privacy"
              className="cursor-pointer transition-colors hover:text-ink"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="cursor-pointer transition-colors hover:text-ink"
            >
              Terms
            </Link>
            <BackToTop />
          </div>
        </div>
      </div>

      {/* ── Oversized brand watermark ──────────────────────────── */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="w-full pb-[0.06em] text-center font-display font-bold leading-none tracking-tight text-ink/[0.04] [font-size:20vw]">
          {SITE.name}
        </p>
      </div>
    </footer>
  );
}
