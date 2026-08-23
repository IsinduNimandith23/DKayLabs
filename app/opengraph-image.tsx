import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";
import { MARK_PATHS, MARK_VIEWBOX } from "@/lib/brand-mark";

/*
 * The social card, generated at build time.
 *
 * This is a FILE CONVENTION, not part of the metadata object - Next injects
 * the resulting og:image and twitter:image into every route that inherits
 * from this layout, which is all of them. That is why lib/seo.ts never sets
 * `openGraph.images`: doing so would override this.
 *
 * EDGE runtime, deliberately. The Node build of @vercel/og resolves its own
 * wasm with `path.join(import.meta.url, ...)`, which yields backslashes on
 * Windows and throws "Invalid URL" during `next build`. The edge build has
 * no such step. The cost is no filesystem, hence the inlined vector mark in
 * lib/brand-mark.ts rather than a read of public/Logo.
 */
export const runtime = "edge";
export const alt = `${SITE.name} - ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#FF5E00";
const BASE = "#0A0A0A";

/** Mark is portrait (486 x 685) - width follows from the height we pick. */
const MARK_H = 132;
const MARK_W = Math.round((486.24 / 684.65) * MARK_H);

const FONT_FAMILY = "Plus Jakarta Sans";

type LoadedFont = { name: string; data: ArrayBuffer; weight: 500 | 800; style: "normal" };

/**
 * Satori ships a single regular-weight fallback face, so `fontWeight: 800`
 * on its own renders light - the wordmark came out looking nothing like the
 * site. Google's css2 endpoint hands TTF (rather than woff2, which Satori
 * cannot parse) to clients whose UA it doesn't recognise, and fetch on the
 * edge is one of those.
 *
 * Deliberately fault-tolerant: a card in the wrong typeface is a cosmetic
 * problem, a card that 500s in front of a crawler is a real one. Any failure
 * here falls back to the default face and still produces an image.
 */
async function loadBrandFonts(): Promise<LoadedFont[]> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${FONT_FAMILY.replace(/ /g, "+")}:wght@500;800`,
    ).then((r) => r.text());

    // One @font-face block per weight, in the order requested.
    const blocks = [...css.matchAll(
      /font-weight:\s*(\d+);[\s\S]*?src:\s*url\((https:\/\/[^)]+)\)\s*format\('truetype'\)/g,
    )];

    return await Promise.all(
      blocks.map(async ([, weight, url]) => ({
        name: FONT_FAMILY,
        data: await fetch(url).then((r) => r.arrayBuffer()),
        weight: Number(weight) as 500 | 800,
        style: "normal" as const,
      })),
    );
  } catch {
    return [];
  }
}

export default async function OpengraphImage() {
  const fonts = await loadBrandFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: BASE,
          padding: "68px 76px",
          position: "relative",
          // Falls through to Satori's default face if the fetch above failed.
          fontFamily: FONT_FAMILY,
        }}
      >
        {/* Brand glow, bled off the top-right corner. */}
        <div
          style={{
            position: "absolute",
            top: -280,
            right: -200,
            width: 760,
            height: 760,
            display: "flex",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,94,0,0.32) 0%, rgba(255,94,0,0) 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <svg
            width={MARK_W}
            height={MARK_H}
            viewBox={MARK_VIEWBOX}
            fill="none"
          >
            {MARK_PATHS.map((d) => (
              <path key={d.slice(0, 24)} d={d} fill={BRAND} />
            ))}
          </svg>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 94,
                fontWeight: 800,
                letterSpacing: "-0.035em",
                color: "#FAFAFA",
                lineHeight: 1,
              }}
            >
              {SITE.name}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 22,
                fontSize: 37,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "#A1A1AA",
                lineHeight: 1.25,
                maxWidth: 880,
              }}
            >
              {SITE.tagline}
            </div>

            {/* Accent rule + locality - the one detail that says who this is. */}
            <div
              style={{ display: "flex", alignItems: "center", marginTop: 40 }}
            >
              <div
                style={{ display: "flex", width: 68, height: 6, background: BRAND }}
              />
              <div
                style={{
                  display: "flex",
                  marginLeft: 22,
                  fontSize: 23,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  color: "#71717A",
                }}
              >
                {SITE.location.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
