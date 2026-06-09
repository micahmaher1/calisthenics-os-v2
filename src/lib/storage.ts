import { AppState, SkillMap, Workout } from "./types";
import { calcLevel, createDefaultSkills, COINS_PER_WORKOUT } from "./xp";

const STORAGE_KEY = "calisthenics-os-state";

function defaultState(): AppState {
  return { totalXP: 0, level: 1, coins: 0, workouts: [], skills: createDefaultSkills() };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.skills) parsed.skills = createDefaultSkills();
    if (parsed.coins === undefined) parsed.coins = 0;
    // Back-fill coins field on old workouts
    parsed.workouts = parsed.workouts.map((w) =>
      w.coins === undefined ? { ...w, coins: COINS_PER_WORKOUT } : w
    );
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function addWorkoutToState(state: AppState, workout: Workout): AppState {
  const totalXP = state.totalXP + workout.xpEarned;

  let skills: SkillMap = state.skills;
  if (workout.skillName) {
    const skill = skills[workout.skillName];
    const newSkillXP = skill.xp + workout.xpEarned;
    skills = {
      ...skills,
      [workout.skillName]: { ...skill, xp: newSkillXP, level: calcLevel(newSkillXP) },
    };
  }

  return {
    ...state,
    totalXP,
    level:    calcLevel(totalXP),
    coins:    (state.coins ?? 0) + workout.coins,
    workouts: [workout, ...state.workouts],
    skills,
  };
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
