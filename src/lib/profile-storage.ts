import { UserProfile, defaultProfile } from "./profile-types";

const PROFILE_KEY = "calisthenics-os:profile:v1";
const AVATAR_KEY  = "calisthenics-os:avatar:v1";

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return defaultProfile();
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaultProfile();
    const parsed = JSON.parse(raw) as UserProfile;
    // Back-fill any missing fields added after first save
    if (!parsed.profileId)   parsed.profileId   = defaultProfile().profileId;
    if (!parsed.goals)       parsed.goals        = [];
    if (!parsed.friendIds)   parsed.friendIds    = [];
    if (!parsed.heightUnit)  parsed.heightUnit   = "cm";
    if (!parsed.weightUnit)  parsed.weightUnit   = "kg";
    if (parsed.visibility === undefined) parsed.visibility = "private";
    return parsed;
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile, updatedAt: Date.now() }));
  } catch {}
}

// Avatar stored separately — base64 strings can be large
export function loadAvatar(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AVATAR_KEY);
  } catch {
    return null;
  }
}

export function saveAvatar(dataUrl: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AVATAR_KEY, dataUrl);
  } catch {}
}

export function removeAvatar(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AVATAR_KEY);
  } catch {}
}
