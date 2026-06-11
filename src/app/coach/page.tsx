import type { Metadata } from "next";
import CoachPage from "@/components/coach/CoachPage";

export const metadata: Metadata = {
  title: "AI Coach · Calisthenics OS",
  description: "Personalized training analysis and recommendations powered by your data.",
};

export default function CoachRoute() {
  return <CoachPage />;
}
