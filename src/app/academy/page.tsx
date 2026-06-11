import { Metadata } from "next";
import AcademyPage from "@/components/academy/AcademyPage";

export const metadata: Metadata = {
  title: "Skill Academy · Calisthenics OS",
  description: "Learn any calisthenics skill — technique guides, progressions, muscles, and coaching cues.",
};

export default function AcademyRoute() {
  return <AcademyPage />;
}
