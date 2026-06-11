// Skill readiness status
export type SkillReadiness = "locked" | "developing" | "approaching" | "almost_ready" | "ready";

export const SKILL_READINESS_META: Record<SkillReadiness, {
  label:      string;
  minPct:     number;
  color:      string;
  border:     string;
  bg:         string;
  icon:       string;
}> = {
  locked:       { label: "Locked",       minPct: 0,   color: "text-slate-500",   border: "border-slate-700",      bg: "bg-slate-800/50",    icon: "🔒" },
  developing:   { label: "Developing",   minPct: 26,  color: "text-sky-400",     border: "border-sky-500/30",     bg: "bg-sky-500/5",       icon: "📈" },
  approaching:  { label: "Approaching",  minPct: 51,  color: "text-yellow-400",  border: "border-yellow-500/30",  bg: "bg-yellow-500/5",    icon: "🎯" },
  almost_ready: { label: "Almost Ready", minPct: 76,  color: "text-orange-400",  border: "border-orange-500/35",  bg: "bg-orange-500/6",    icon: "⚡" },
  ready:        { label: "Ready",        minPct: 100, color: "text-green-400",   border: "border-green-500/40",   bg: "bg-green-500/8",     icon: "✅" },
};

export function getReadinessFromPct(pct: number): SkillReadiness {
  if (pct >= 100) return "ready";
  if (pct >= 76)  return "almost_ready";
  if (pct >= 51)  return "approaching";
  if (pct >= 26)  return "developing";
  return "locked";
}

// Requirement types for skill unlocks
export type SkillReqType =
  | "mastery_level"        // e.g. Strength Mastery >= 20
  | "journey_stage"        // e.g. front_lever journey stage >= 4
  | "record_reps"          // e.g. Pull-Ups record >= 15
  | "record_seconds"       // e.g. Dead Hang record >= 45s
  | "level"                // player level >= X
  | "xp"                   // total XP >= X
  | "achievement"          // specific achievement unlocked
  | "workout_count"        // N workouts logged
  | "streak_days"          // streak >= N days
  | "skill_unlocked";      // another skill already unlocked (tree dependency)

export interface SkillRequirement {
  type:        SkillReqType;
  target:      string;       // category name, journey id, exercise name, achievement id, skill id
  value:       number;       // threshold
  label:       string;       // "Strength Mastery 20"
  description: string;       // longer description
}

// A skill in the requirements system (separate from the Skill Tree nodes)
export type SkillTier = "beginner" | "intermediate" | "advanced" | "elite" | "legendary";
export type SkillDomain = "push" | "pull" | "core" | "legs" | "balance" | "mobility" | "explosive" | "static";

export const SKILL_TIER_META: Record<SkillTier, { label: string; color: string; border: string; bg: string; icon: string }> = {
  beginner:     { label: "Beginner",     color: "text-green-400",  border: "border-green-500/25",  bg: "bg-green-500/6",   icon: "🌱" },
  intermediate: { label: "Intermediate", color: "text-sky-400",    border: "border-sky-500/30",    bg: "bg-sky-500/6",     icon: "⚡" },
  advanced:     { label: "Advanced",     color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/6",  icon: "🔥" },
  elite:        { label: "Elite",        color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/6",  icon: "👑" },
  legendary:    { label: "Legendary",    color: "text-yellow-400", border: "border-yellow-500/40", bg: "bg-yellow-500/6",  icon: "🌟" },
};

export interface SkillDef {
  id:           string;
  name:         string;
  icon:         string;
  tier:         SkillTier;
  domain:       SkillDomain;
  description:  string;
  requirements: SkillRequirement[];
  prerequisites: string[];   // skill ids that must be unlocked first
  unlocks:      string[];    // skill ids this unlocks
  journeyId?:   string;      // associated journey
  tips:         string[];    // coaching tips
  featured?:    boolean;
}

// Computed progress for a skill
export interface SkillProgress {
  skillId:         string;
  pct:             number;       // 0-100
  readiness:       SkillReadiness;
  metRequirements: SkillRequirement[];
  unmetRequirements: SkillRequirement[];
  // Per-requirement progress
  requirementProgress: Array<{
    req:     SkillRequirement;
    met:     boolean;
    current: number;   // current value
    pct:     number;   // 0-100 progress toward requirement
  }>;
  nextSteps: string[];   // top 3 recommended actions
}

// Snapshot of all system data needed for skill progress calculation
export interface SkillSnapshot {
  level:           number;
  totalXP:         number;
  workoutCount:    number;
  longestStreak:   number;
  masteryLevels:   Record<string, number>;   // category → level
  journeyStages:   Record<string, number>;   // journeyId → completed stage count
  records:         Record<string, number>;   // exercise name (lower) → best value
  unlockedAchievementIds: string[];
  unlockedSkillIds: string[];                // from skill tree
}
