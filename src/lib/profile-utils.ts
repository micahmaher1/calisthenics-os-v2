import { UserGoal, GoalType } from "./profile-types";
import { PersonalRecords } from "./stats";

// ─── Goal Progress ────────────────────────────────────────────────────────────

export function getGoalProgress(
  goal:    UserGoal,
  records: PersonalRecords,
  level:   number,
  streak:  number,
  completedSkillIds: Set<string>,
): { progress: number; target: number; pct: number; completed: boolean } {
  let progress = 0;
  const target = goal.target;

  switch (goal.type) {
    case "max_reps": {
      if (goal.skillName === "push-ups") progress = records.maxPushUpReps;
      else if (goal.skillName === "pull-ups") progress = records.maxPullUpReps;
      else if (goal.skillName === "dips")  progress = records.maxDipReps;
      break;
    }
    case "total_reps": {
      if (goal.skillName === "push-ups") progress = records.totalPushUps;
      else if (goal.skillName === "pull-ups") progress = records.totalPullUps;
      else if (goal.skillName === "dips")  progress = records.totalDips;
      break;
    }
    case "level":   progress = level;  break;
    case "streak":  progress = streak; break;
    case "skill":   progress = goal.skillId && completedSkillIds.has(goal.skillId) ? 1 : 0; break;
    case "custom":  progress = goal.completed ? 1 : 0; break;
  }

  const pct       = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
  const completed = goal.type === "custom" ? goal.completed : progress >= target;
  return { progress, target, pct, completed };
}

// ─── Display Helpers ──────────────────────────────────────────────────────────

export function formatHeight(cm: number | null, unit: "cm" | "ft"): string {
  if (cm === null) return "—";
  if (unit === "cm") return `${cm} cm`;
  const totalInches = cm / 2.54;
  const feet   = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}′${inches}″`;
}

export function formatWeight(kg: number | null, unit: "kg" | "lbs"): string {
  if (kg === null) return "—";
  if (unit === "kg") return `${kg} kg`;
  return `${Math.round(kg * 2.205)} lbs`;
}

export function getInitials(name: string, displayName: string): string {
  const src = displayName || name;
  if (!src.trim()) return "?";
  return src
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
