import { CoachSettings, CoachGoalType, CoachPersonality } from "@/lib/coach-types";

const KEY = "calisthenics-os:coach:v1";

export function defaultCoachSettings(): CoachSettings {
  return {
    selectedGoal: "athletic",
    personality:  "rpg_mentor",
    dismissedIds: [],
    lastViewedAt: 0,
  };
}

export function loadCoachSettings(): CoachSettings {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (!raw) return defaultCoachSettings();
    const parsed = JSON.parse(raw) as Partial<CoachSettings>;
    const def    = defaultCoachSettings();
    return {
      selectedGoal: (parsed.selectedGoal as CoachGoalType)  ?? def.selectedGoal,
      personality:  (parsed.personality  as CoachPersonality) ?? def.personality,
      dismissedIds: parsed.dismissedIds ?? [],
      lastViewedAt: parsed.lastViewedAt ?? 0,
    };
  } catch {
    return defaultCoachSettings();
  }
}

export function saveCoachSettings(settings: CoachSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(settings));
}

export function dismissRecommendation(id: string): void {
  const settings = loadCoachSettings();
  if (!settings.dismissedIds.includes(id)) {
    settings.dismissedIds.push(id);
    // Cap to last 50 dismissals
    if (settings.dismissedIds.length > 50) {
      settings.dismissedIds = settings.dismissedIds.slice(-50);
    }
    saveCoachSettings(settings);
  }
}
