import type { Metadata } from "next";
import TitleCollectionPage from "@/components/titles/TitleCollectionPage";

export const metadata: Metadata = {
  title: "Titles & Badges · Calisthenics OS",
  description: "Unlock and equip titles and badges through your training",
};

export default function Page() {
  return <TitleCollectionPage />;
}
