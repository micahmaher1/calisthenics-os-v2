import type { Metadata } from "next";
import RecordsPage from "@/components/records/RecordsPage";

export const metadata: Metadata = {
  title: "Records · Calisthenics OS",
  description: "Your personal records, milestones, and progress history",
};

export default function RecordsRoute() {
  return <RecordsPage />;
}
