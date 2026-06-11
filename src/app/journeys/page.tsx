import { Metadata } from "next";
import JourneyPage from "@/components/journeys/JourneyPage";

export const metadata: Metadata = {
  title: "Skill Journeys · Calisthenics OS",
  description: "Epic skill progression campaigns",
};

export default function JourneysRoute() {
  return <JourneyPage />;
}
