import { Metadata } from "next";
import StandardsPage from "@/components/standards/StandardsPage";

export const metadata: Metadata = { title: "Movement Standards · Calisthenics OS" };

export default function StandardsRoute() {
  return <StandardsPage />;
}
