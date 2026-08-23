import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { SITE } from "@/lib/constants";

// Plus Jakarta Sans carries both display and body - a geometric grotesque in
// the Gilroy/Sofia Pro vein, which is the face the headline reference uses.
// 800 is reserved for the big section headlines; keeping one family throughout
// stops the type from feeling stitched together.
//
// ONE loader for both roles. This used to be two next/font calls on the same
// family with overlapping weights, which declares two font instances of an
// identical face. Tailwind's `font-body` now points at --font-display too
// (see tailwind.config.ts), so the two roles stay nameable in the markup
// without paying for the face twice.
const display = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Mono for the small uppercase labels, eyebrows and stat captions -
// the blueprint/telemetry detail that defines the reference look.
const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  /*
   * Every relative URL in metadata - canonicals, og:url, the generated OG
   * image - is resolved against this. Without it Next warns at build time
   * and emits relative og:url values that no crawler can follow.
   */
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} - ${SITE.tagline}`,
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  /*
   * `max-image-preview: large` is what lets Google show a full-width
   * thumbnail next to the result instead of a postage stamp.
   *
   * NOTE: no `alternates.canonical` here on purpose. Child segments inherit
   * it, so a canonical set at the root would make all eight routes claim
   * "/" as their canonical URL. Each page sets its own via pageMetadata().
   */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /*
   * Tab icon: the monster mark, not the wordmark - a 4.7:1 lockup is an
   * illegible sliver at 16px.
   *
   * The vector leads: every SVG-capable browser (Chrome/Edge 80+, Firefox
   * 41+, Safari 16.4+) takes /favicon.svg and renders it crisp at whatever
   * size the slot is, which is the whole point of shipping a vector.
   *
   * The PNGs stay as the fallback chain for Safari below 16.4 and anything
   * else that ignores SVG icons. They are not redundant: 16 and 32 are a
   * SOLID SILHOUETTE rather than the real drawing, because the mark is
   * outline art whose strokes fall under a pixel wide at 16px and alias into
   * noise. That is a limit of the artwork, not the format - the SVG hits the
   * same wall at 16px, so on a 1x display the tab icon will read thinner
   * than the silhouette did. On hidpi (32 device px and up) it is sharper
   * than any PNG. See the README if that trade wants revisiting.
   */
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
  },
  /*
   * The fallback card for any route that doesn't build its own via
   * pageMetadata() - currently only the 404, which cannot export metadata.
   * The og:image comes from app/opengraph-image.tsx by file convention.
   */
  openGraph: {
    title: `${SITE.name} - ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} - ${SITE.tagline}`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

/**
 * Resolves the theme BEFORE first paint - without this the page renders in
 * the wrong theme for a moment while React hydrates.
 *
 * Precedence: an explicit choice from the toggle wins; otherwise follow the
 * OS `prefers-color-scheme`. Clearing `localStorage.theme` hands control
 * back to the OS.
 */
const noFlashThemeScript = `
(function(){
  try {
    var stored = localStorage.getItem("theme");
    var isDark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body>
        <SmoothScroll>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
