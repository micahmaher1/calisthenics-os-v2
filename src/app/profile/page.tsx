import type { Metadata } from "next";
import ProfilePage from "@/components/profile/ProfilePage";

export const metadata: Metadata = {
  title: "Profile · Calisthenics OS",
  description: "Your athlete profile",
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
