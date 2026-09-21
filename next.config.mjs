/*
 * /products/mrp is not a page in this app. It's the DKayMRP site - a separate
 * Next.js app, deployed as its own project with basePath "/products/mrp" -
 * and these rewrites serve it under this domain (Next.js multi-zones). The
 * visitor's address bar never leaves www.dkaylabs.com.
 *
 * MRP_SITE_URL is that project's own origin, e.g. its *.vercel.app address.
 * Locally it falls back to the MRP dev server's port.
 */
const MRP_SITE_URL = (
  process.env.MRP_SITE_URL ??
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3800")
).replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    /*
     * Failing the build is deliberate: a Vercel deploy that fails leaves the
     * previous one live, whereas one without these rewrites would ship a
     * 404 at /products/mrp.
     */
    if (!MRP_SITE_URL) {
      throw new Error(
        "MRP_SITE_URL is not set. Point it at the DKayMRP deployment's origin - see README.",
      );
    }

    return [
      { source: "/products/mrp", destination: `${MRP_SITE_URL}/products/mrp` },
      {
        source: "/products/mrp/:path*",
        destination: `${MRP_SITE_URL}/products/mrp/:path*`,
      },
    ];
  },
};

export default nextConfig;
