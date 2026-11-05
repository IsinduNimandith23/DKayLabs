import type { Metadata } from "next";
import Products from "@/components/sections/Products";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  // Brand names AND what they are: nobody searches "Shopwrights" yet.
  title: "Shopwrights MRP & TrainingWheels Driving School Software",
  description:
    "In-house software from DKayLABS: Shopwrights, a live MRP platform for manufacturers, and TrainingWheels, a driving school management system in development.",
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
