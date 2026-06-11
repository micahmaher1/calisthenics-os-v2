import { MasteryState } from "./mastery-types";
import { defaultMasteryState, recalculateMastery } from "./mastery-engine";
import { loadState } from "./storage";

const MASTERY_KEY = "calisthenics-os:mastery:v1";

export function loadMasteryState(): MasteryState {
  if (typeof window === "undefined") return defaultMasteryState();
  try {
    const raw = localStorage.getItem(MASTERY_KEY);
    if (!raw) {
      // First load: calculate from scratch
      const appState = loadState();
      const computed = recalculateMastery(appState.workouts);
      saveMasteryState(computed);
      return computed;
    }
    const parsed = JSON.parse(raw) as MasteryState;
    // Back-fill missing fields
    if (!parsed.grantedRewardKeys) parsed.grantedRewardKeys = [];
    if (!parsed.categories) {
      const fallback = defaultMasteryState();
      fallback.grantedRewardKeys = parsed.grantedRewardKeys;
      return fallback;
    }
    // Back-fill any missing categories
    const defaults = defaultMasteryState();
    for (const cat of Object.keys(defaults.categories) as Array<keyof typeof defaults.categories>) {
      if (!parsed.categories[cat]) {
        parsed.categories[cat] = defaults.categories[cat];
      }
    }
    return parsed;
  } catch {
    return defaultMasteryState();
  }
}

export function saveMasteryState(state: MasteryState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MASTERY_KEY, JSON.stringify(state));
  } catch {}
}
