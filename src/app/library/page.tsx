import { Metadata } from "next";
import ProgressionLibraryPage from "@/components/library/ProgressionLibraryPage";

export const metadata: Metadata = {
  title: "Progression Library · Calisthenics OS",
};

export default function LibraryRoute() {
  return <ProgressionLibraryPage />;
}
