import { Metadata } from "next";
import MasteryPage from "@/components/mastery/MasteryPage";

export const metadata: Metadata = { title: "Mastery · Calisthenics OS" };

export default function MasteryRoute() {
  return <MasteryPage />;
}
