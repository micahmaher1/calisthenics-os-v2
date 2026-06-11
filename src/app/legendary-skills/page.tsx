import { Metadata } from "next";
import LegendarySkillsPage from "@/components/library/LegendarySkillsPage";

export const metadata: Metadata = {
  title: "Legendary Skills · Calisthenics OS",
};

export default function LegendarySkillsRoute() {
  return <LegendarySkillsPage />;
}
