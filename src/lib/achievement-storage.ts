import { AchievementState, AchievementProgressMap } from "./achievement-types";
import { ACHIEVEMENTS } from "./achievement-data";

const ACH_KEY = "calisthenics-os:achievements:v1";

function defaultAchState(): AchievementState {
  const progress: AchievementProgressMap = {};
  ACHIEVEMENTS.forEach((a) => {
    progress[a.id] = {
      id: a.id,
      current: 0,
      target: a.requirement.value,
      unlocked: false,
    };
  });
  return { progress, totalAchXP: 0, totalCoins: 0 };
}

export function loadAchievementState(): AchievementState {
  if (typeof window === "undefined") return defaultAchState();
  try {
    const raw = localStorage.getItem(ACH_KEY);
    if (!raw) return defaultAchState();
    const parsed = JSON.parse(raw) as AchievementState;
    // Back-fill any achievements added after initial save
    ACHIEVEMENTS.forEach((a) => {
      if (!parsed.progress[a.id]) {
        parsed.progress[a.id] = {
          id: a.id,
          current: 0,
          target: a.requirement.value,
          unlocked: false,
        };
      }
    });
    return parsed;
  } catch {
    return defaultAchState();
  }
}

export function saveAchievementState(state: AchievementState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACH_KEY, JSON.stringify(state));
  } catch {}
}
