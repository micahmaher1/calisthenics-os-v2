// ─── Rarity ───────────────────────────────────────────────────────────────────

export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "secret_legendary";

export const RARITY_META: Record<
  Rarity,
  {
    label:    string;
    color:    string;
    border:   string;
    bg:       string;
    glow:     string;
    badgeBg:  string;
    xpRange:  [number, number];
    animated: boolean;
  }
> = {
  common: {
    label: "Common", color: "text-white/60", border: "border-white/10",
    bg: "bg-white/3", glow: "", badgeBg: "bg-white/10",
    xpRange: [10, 50], animated: false,
  },
  uncommon: {
    label: "Uncommon", color: "text-green-400", border: "border-green-500/30",
    bg: "bg-green-500/5", glow: "shadow-green-500/20", badgeBg: "bg-green-500/15",
    xpRange: [50, 150], animated: false,
  },
  rare: {
    label: "Rare", color: "text-sky-400", border: "border-sky-500/30",
    bg: "bg-sky-500/5", glow: "shadow-sky-500/20", badgeBg: "bg-sky-500/15",
    xpRange: [150, 400], animated: false,
  },
  epic: {
    label: "Epic", color: "text-purple-400", border: "border-purple-500/30",
    bg: "bg-purple-500/5", glow: "shadow-purple-500/20", badgeBg: "bg-purple-500/15",
    xpRange: [400, 1000], animated: false,
  },
  legendary: {
    label: "Legendary", color: "text-yellow-400", border: "border-yellow-500/40",
    bg: "bg-yellow-500/5", glow: "shadow-yellow-500/30", badgeBg: "bg-yellow-500/15",
    xpRange: [1000, 3000], animated: false,
  },
  secret_legendary: {
    label: "Secret Legendary", color: "text-yellow-300", border: "border-yellow-400/60",
    bg: "bg-yellow-500/8", glow: "shadow-yellow-400/50", badgeBg: "bg-yellow-400/20",
    xpRange: [2000, 5000], animated: true,
  },
};

// ─── Category ─────────────────────────────────────────────────────────────────

export type AchievementCategory =
  | "workout_milestones"
  | "xp_milestones"
  | "level_milestones"
  | "skill_unlocks"
  | "branch_completion"
  | "advanced_skills"
  | "endgame_skills"
  | "streaks"
  | "exercise_totals"
  | "completionist"
  | "special";

export const CATEGORY_META: Record<AchievementCategory, { label: string; icon: string }> = {
  workout_milestones: { label: "Workout Milestones", icon: "🏋️" },
  xp_milestones:      { label: "XP Milestones",      icon: "⚡" },
  level_milestones:   { label: "Level Milestones",   icon: "🎯" },
  skill_unlocks:      { label: "Skill Unlocks",      icon: "🌳" },
  branch_completion:  { label: "Branch Completion",  icon: "🏆" },
  advanced_skills:    { label: "Advanced Skills",    icon: "💫" },
  endgame_skills:     { label: "Endgame Skills",     icon: "👑" },
  streaks:            { label: "Streaks",            icon: "🔥" },
  exercise_totals:    { label: "Exercise Totals",    icon: "📊" },
  completionist:      { label: "Completionist",      icon: "💎" },
  special:            { label: "Special",            icon: "⭐" },
};

// ─── Requirement ──────────────────────────────────────────────────────────────

export type RequirementType =
  | "workout_count"
  | "total_xp"
  | "player_level"
  | "skills_completed"
  | "all_skills_completed"
  | "branch_percent"
  | "all_branches_complete"
  | "specific_skill"
  | "streak_days"
  | "exercise_reps"
  | "hang_time_seconds"
  | "endgame_count"
  | "all_endgame"
  | "all_achievements"
  | "max_level";

export interface AchievementRequirement {
  type:      RequirementType;
  value:     number;
  branch?:   "push" | "pull" | "core" | "skill";
  skillId?:  string;
  exercise?: "push-up" | "pull-up" | "core" | "hang";
}

// ─── Achievement Definition ───────────────────────────────────────────────────

export interface AchievementDef {
  id:          string;
  name:        string;
  description: string;
  icon:        string;
  rarity:      Rarity;
  xpReward:    number;
  coinReward:  number;
  category:    AchievementCategory;
  requirement: AchievementRequirement;
  secret:      boolean;
  hint?:       string;
}

// ─── Progress Snapshot ────────────────────────────────────────────────────────

export interface AchievementProgress {
  id:          string;
  current:     number;
  target:      number;
  unlocked:    boolean;
  unlockedAt?: number;
}

export type AchievementProgressMap = Record<string, AchievementProgress>;

// ─── Persisted State ──────────────────────────────────────────────────────────

export interface AchievementState {
  progress:   AchievementProgressMap;
  totalAchXP: number;
  totalCoins: number;
}

// ─── Computed Stats ───────────────────────────────────────────────────────────

export interface AchievementStats {
  total:            number;
  unlocked:         number;
  secret:           number;
  secretUnlocked:   number;
  completionPct:    number;
  byRarity:         Record<Rarity, { total: number; unlocked: number }>;
  byCategory:       Record<AchievementCategory, { total: number; unlocked: number }>;
  recentlyUnlocked: string[];
}

// ─── Notification Queue ───────────────────────────────────────────────────────

export interface AchievementNotification {
  id:          string;
  triggeredAt: number;
}
