import { Metadata } from "next";
import SkillsPage from "@/components/skills/SkillsPage";

export const metadata: Metadata = {
  title: "Skills · Calisthenics OS",
  description: "Skill requirements and progression tracking",
};

export default function SkillsRoute() {
  return <SkillsPage />;
}
