import type { Metadata } from "next";
import Products from "@/components/sections/Products";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "SaaS Products: MRP & Driving School Software",
  description:
    "In-house software from DKayLABS: an MRP platform for manufacturers and a management system for driving schools, both in active development.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <main className="pt-nav">
      <JsonLd data={breadcrumbSchema([{ name: "Products", path: "/products" }])} />
      <Products />
    </main>
  );
}
