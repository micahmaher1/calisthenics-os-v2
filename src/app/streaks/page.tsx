import type { Metadata } from "next";
import StreakPage from "@/components/streaks/StreakPage";

export const metadata: Metadata = {
  title: "Streaks · Calisthenics OS",
  description: "Track your daily and weekly workout streaks and milestones.",
};

export default function StreaksRoute() {
  return <StreakPage />;
}
