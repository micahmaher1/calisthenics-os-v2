import { AppState, SkillMap, Workout } from "./types";
import { calcLevel, createDefaultSkills } from "./xp";

const STORAGE_KEY = "calisthenics-os-state";

// ─── Default State ────────────────────────────────────────────────────────────

function defaultState(): AppState {
  return {
    totalXP: 0,
    level: 1,
    workouts: [],
    skills: createDefaultSkills(),
  };
}

// ─── Load / Save ──────────────────────────────────────────────────────────────

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    // Ensure skills exist (backwards-compat)
    if (!parsed.skills) parsed.skills = createDefaultSkills();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage quota or privacy mode — silently ignore
  }
}

// ─── Derived Helpers ──────────────────────────────────────────────────────────

export function addWorkoutToState(
  state: AppState,
  workout: Workout
): AppState {
  const totalXP = state.totalXP + workout.xpEarned;

  // Update skill XP if applicable
  let skills: SkillMap = state.skills;
  if (workout.skillName) {
    const skill = skills[workout.skillName];
    const newSkillXP = skill.xp + workout.xpEarned;
    skills = {
      ...skills,
      [workout.skillName]: {
        ...skill,
        xp: newSkillXP,
        level: calcLevel(newSkillXP),
      },
    };
  }

  return {
    ...state,
    totalXP,
    level: calcLevel(totalXP),
    workouts: [workout, ...state.workouts],
    skills,
  };
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
