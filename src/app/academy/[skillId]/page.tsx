import { Metadata } from "next";
import SkillAcademyGuide from "@/components/academy/SkillAcademyGuide";
import { SKILL_LIBRARY_MAP } from "@/lib/library-data";

interface Props {
  params: { skillId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const skill = SKILL_LIBRARY_MAP[params.skillId];
  if (!skill) {
    return { title: "Skill Guide · Calisthenics OS" };
  }
  return {
    title: `${skill.name} Guide · Skill Academy · Calisthenics OS`,
    description: `Learn how to train the ${skill.name} — technique, progressions, muscles, and coaching cues.`,
  };
}

export default function SkillAcademyRoute({ params }: Props) {
  return <SkillAcademyGuide skillId={params.skillId} />;
}
