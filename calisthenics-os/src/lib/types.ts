// ─── Workout Types ────────────────────────────────────────────────────────────

export type SkillName = "push-ups" | "pull-ups" | "dips";

export interface Workout {
  id: string;
  name: string;
  skillName: SkillName | null; // null = general workout
  reps: number;
  notes: string;
  xpEarned: number;
  timestamp: number; // Unix ms
}

// ─── Skill Types ──────────────────────────────────────────────────────────────

export interface Skill {
  name: SkillName;
  label: string;
  xp: number;
  level: number;
  icon: string;
  color: string; // Tailwind color class for accent
}

export type SkillMap = Record<SkillName, Skill>;

// ─── App State Types ──────────────────────────────────────────────────────────

export interface AppState {
  totalXP: number;
  level: number;
  workouts: Workout[];
  skills: SkillMap;
}
