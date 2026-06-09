import type { Metadata } from "next";
import ShopPage from "@/components/shop/ShopPage";

export const metadata: Metadata = {
  title: "Shop · Calisthenics OS",
  description: "Spend your coins on titles, borders, themes, and badges",
};

export default function ShopRoute() {
  return <ShopPage />;
}
