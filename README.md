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

The wordmark ships as two artwork files, one per theme:

- **`public/Logo/BlackText.png`** - dark "DKay", used on light backgrounds
- **`public/Logo/WhiteText.png`** - white "DKay", used on dark backgrounds

`components/ui/Logo.tsx` renders both and hides one with a `dark:` variant, so the
swap happens in CSS with no hydration flash. Replacing the artwork? Keep the two
filenames and update the `ASPECT` constant if the new files aren't 8539 x 1829.

### Favicon

The tab icon uses the monster mark rather than the wordmark, which is unreadable at
16px. **`public/Logo/logo.svg`** is the vector master and **`monsterOrange.png`**
the raster one; the shipped files are:

| File | Use |
| --- | --- |
| `public/favicon.svg` | **the tab icon** - vector, hand-derived from `Logo/logo.svg` |
| `public/favicon-16.png` | 16px solid silhouette - fallback, 1x |
| `public/favicon-32.png` | 32px solid silhouette - fallback, 2x |
| `public/favicon-96.png` | 96px full detail - fallback, larger slots |
| `public/apple-touch-icon.png` | 180px, full detail on `#0A0A0A` - iOS home screen |

The SVG is listed first, so every SVG-capable browser uses it and the PNGs only
serve Safari below 16.4 and anything else that ignores vector icons.

Two things are deliberate here, and both came out of rendering the mark at actual
tab size rather than eyeballing it large:

- **The small PNGs are a different drawing.** The mark is outline art with a
  transparent belly. Below roughly 32px the strokes fall under a pixel wide, alias
  into noise, and the body reads as a hole - so the icon looks thin and
  undersized. The 16 and 32 fallbacks get a solid silhouette instead, produced by
  flood-filling the enclosed void; it holds its weight all the way down.

  Worth knowing: **the SVG hits the same wall.** Vector fixes sharpness, not
  sub-pixel stroke weight, so at a true 16px slot the line art is thin no matter
  the format. Thickening it enough to survive 16px (roughly 4x the stroke) would
  wreck it at 96px. If a 1x tab strip ever looks spindly, the fix is to lead with
  the PNG silhouettes again, or to derive a silhouette *SVG* by dropping the
  interior subpaths from `logo.svg` - bold at every size, at the cost of the face.
- **No tile on the tab icon.** An opaque tile does fill the slot, but
  against a *dark* tab strip it reads as a black box drawn around the mark - worse
  than the thinness it was meant to fix. The silhouette gets the same visual
  weight without boxing anything in, and works on light and dark strips alike.
  The Apple size is the exception: iOS composites transparency onto black
  regardless, and a tile is what a home-screen icon is meant to look like.

Regenerate from a new master with `scripts/make-icons.ps1` (shared helpers live in
`scripts/_iconlib.ps1`, so throwaway comparison scripts can render through exactly
the same code). If you ever swap in a mark that is *solid* rather than outline art,
the silhouette step stops earning its keep and every size can use the drawing.

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
  Logo/               BlackText.png (light bg) + WhiteText.png (dark bg)
```

## Accessibility & performance

- `prefers-reduced-motion` disables Lenis, Framer animations, and swaps the 3D
  hero for a static logo.
- The 3D scene is lazy-loaded (client-only), DPR-capped, and scales down on
  mobile / coarse-pointer devices.

## Deploy

Push to GitHub and import into Vercel - zero config.
