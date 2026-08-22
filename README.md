# DKayLABS

Premium, dark esports/tech marketing site for **DKayLABS** - a digital services company.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS**, an interactive **React Three Fiber** 3D hero, **Framer Motion** animation, and **Lenis** smooth scroll. Deployable on **Vercel**.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Your logo

A placeholder mark ships at **`public/logo.svg`**. Replace that file with your real
red-and-silver "A" mark, keeping the filename `logo.svg`.

- Using a **PNG/WebP** instead? Drop it as `public/logo.png` and update the `src`
  (and `width`/`height`) in:
  - `components/ui/Logo.tsx`
  - `components/sections/Hero.tsx`

## Brand colors

All colors are centralized in **`tailwind.config.ts`** under `theme.extend.colors`
(`charcoal`, `obsidian`, `void`, `crimson`, `snow`, `silver`). Tweak a hex once and
it cascades everywhere.

## Structure

```
app/
  layout.tsx          Root layout: fonts, metadata, Lenis provider
  page.tsx            Page composition
  globals.css         Tailwind layers + glass/glow utilities + a11y
components/
  layout/             Navbar, Footer
  sections/           Hero, Services, About, Contact
  three/              HeroScene (R3F canvas), AngularCrystal (3D object)
  providers/          SmoothScroll (Lenis)
  ui/                 Logo, ServiceCard, Reveal, GlowOrb
lib/
  constants.ts        Site copy, nav, services, socials
  hooks/              useReducedMotion, useIsMobile
public/
  logo.svg            ← replace with your mark
```

## Accessibility & performance

- `prefers-reduced-motion` disables Lenis, Framer animations, and swaps the 3D
  hero for a static logo.
- The 3D scene is lazy-loaded (client-only), DPR-capped, and scales down on
  mobile / coarse-pointer devices.

## Deploy

Push to GitHub and import into Vercel - zero config.
