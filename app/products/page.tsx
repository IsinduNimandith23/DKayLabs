import type { Metadata } from "next";
import Products from "@/components/sections/Products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Products",
  description:
    "In-house software from DKayLABS - a material requirements planning platform for manufacturers and a management system for driving schools, both in active development.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <main className="pt-nav">
      <Products />
    </main>
  );
}
