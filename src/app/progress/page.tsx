import type { Metadata } from "next";
import RankShowcasePage from "@/components/progress/RankShowcasePage";

export const metadata: Metadata = {
  title: "Progress · Calisthenics OS",
  description: "Rank progression and level rewards",
};

export default function ProgressPage() {
  return <RankShowcasePage />;
}
