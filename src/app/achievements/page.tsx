import type { Metadata } from "next";
import AchievementPage from "@/components/achievements/AchievementPage";

export const metadata: Metadata = {
  title: "Achievements · Calisthenics OS",
  description: "Track your achievement progress and milestones",
};

export default function Page() {
  return <AchievementPage />;
}
