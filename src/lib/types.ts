// ─── Workout Types ────────────────────────────────────────────────────────────

export type SkillName = "push-ups" | "pull-ups" | "dips";

export interface Workout {
  id:        string;
  name:      string;
  skillName: SkillName | null;
  reps:      number;
  notes:     string;
  xpEarned:  number;
  coins:     number;
  timestamp: number;
}

// ─── Skill Types ──────────────────────────────────────────────────────────────

export interface Skill {
  name:  SkillName;
  label: string;
  xp:    number;
  level: number;
  icon:  string;
  color: string;
}

export type SkillMap = Record<SkillName, Skill>;

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  totalXP:  number;
  level:    number;
  coins:    number;
  workouts: Workout[];
  skills:   SkillMap;
}
