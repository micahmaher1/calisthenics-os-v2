import type { Metadata } from "next";
import QuestPage from "@/components/quests/QuestPage";

export const metadata: Metadata = {
  title: "Quests · Calisthenics OS",
  description: "Daily and weekly quests",
};

export default function QuestsRoute() {
  return <QuestPage />;
}
