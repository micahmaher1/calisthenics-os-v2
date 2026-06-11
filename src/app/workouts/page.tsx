import { Metadata } from "next";
import WorkoutBuilderPage from "@/components/workouts/WorkoutBuilderPage";

export const metadata: Metadata = {
  title: "Workout Builder | Calisthenics OS",
  description: "Generate custom calisthenics workouts and training programs",
};

export default function WorkoutsPage() {
  return <WorkoutBuilderPage />;
}
