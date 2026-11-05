/*
 * /shopwrights is not a page in this app. It's the Shopwrights site - a
 * separate Next.js app (the "MRP Product Website" repo), deployed as its own
 * project with basePath "/shopwrights" - and these rewrites serve it under
 * this domain (Next.js multi-zones). The visitor's address bar never leaves
 * www.dkaylabs.com. The two basePaths must match: change one, change both.
 *
 * MRP_SITE_URL is that project's own origin, e.g. its *.vercel.app address.
 * Locally it falls back to the MRP dev server's port. (The variable keeps its
 * old name so the Vercel environment doesn't have to change with the brand.)
 */
const SHOPWRIGHTS_BASE = "/shopwrights";

/*
 * Products moved from /products/<slug> to the site root when they got names
 * of their own. Permanent (308) so search engines move the old URLs' standing
 * across, and anything already shared or bookmarked keeps working.
 */
const PRODUCT_MOVES = [
  { from: "/products/mrp", to: SHOPWRIGHTS_BASE },
  { from: "/products/driving-school", to: "/trainingwheels" },
  // Someone guessing the new names under the old prefix.
  { from: "/products/shopwrights", to: SHOPWRIGHTS_BASE },
  { from: "/products/trainingwheels", to: "/trainingwheels" },
];
const MRP_SITE_URL = (
  process.env.MRP_SITE_URL ??
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3800")
).replace(/\/$/, "");

/*
 * Baseline security headers. Vercel only sends HSTS by default.
 *
 * Deliberately NOT here yet: a Content-Security-Policy. The theme script in
 * app/layout.tsx and the JSON-LD blocks are inline, and Next injects inline
 * bootstrap scripts, so an enforcing CSP needs nonces wired through the app.
 * Ship that as Content-Security-Policy-Report-Only first, watch it, then
 * enforce - a wrong CSP blanks the site.
 */
const SECURITY_HEADERS = [
  // Stop browsers MIME-sniffing a response into something executable.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No framing by other sites (clickjacking). SAMEORIGIN, not DENY, so the
  // site can still frame its own pages.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Full URL to our own pages, origin only to everyone else.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here uses these; deny them so an injected script can't either.
  {
    key: "Permissions-Policy",
    // (No interest-cohort: FLoC is dead and Chrome logs the unknown feature
    // as a console error, which Lighthouse then counts against the page.)
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Optimised images were served max-age=0, so every repeat visit
    // re-validated each one. The sources are content-addressed by filename
    // in practice - a changed image gets a new name - so a month is safe.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // Raw files in public/ (logos, portfolio shots, partner logos, fonts)
        // were also max-age=0. A day in the browser, a week at the edge, and
        // stale-while-revalidate so a replaced file still rolls out quickly.
        source: "/:dir(Logo|portfolio|partners|fonts)/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  async redirects() {
    return PRODUCT_MOVES.flatMap(({ from, to }) => [
      { source: from, destination: to, permanent: true },
      // Deep links: /products/mrp/pricing -> /shopwrights/pricing.
      { source: `${from}/:path+`, destination: `${to}/:path+`, permanent: true },
    ]);
  },

  async rewrites() {
    /*
     * Failing the build is deliberate: a Vercel deploy that fails leaves the
     * previous one live, whereas one without these rewrites would ship a
     * 404 at /shopwrights.
     */
    if (!MRP_SITE_URL) {
      throw new Error(
        "MRP_SITE_URL is not set. Point it at the DKayMRP deployment's origin - see README.",
      );
    }

    return [
      { source: SHOPWRIGHTS_BASE, destination: `${MRP_SITE_URL}${SHOPWRIGHTS_BASE}` },
      {
        source: `${SHOPWRIGHTS_BASE}/:path*`,
        destination: `${MRP_SITE_URL}${SHOPWRIGHTS_BASE}/:path*`,
      },
    ];
  },
};

export default nextConfig;
