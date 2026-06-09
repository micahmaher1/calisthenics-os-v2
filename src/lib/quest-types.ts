// ─── Rarity ───────────────────────────────────────────────────────────────────

export type QuestRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const QUEST_RARITY_META: Record<QuestRarity, {
  label:   string;
  color:   string;
  border:  string;
  bg:      string;
  glow:    string;
  xpMult:  number;
}> = {
  common:    { label: "Common",    color: "text-white/60",   border: "border-white/10",     bg: "bg-white/3",      glow: "",                      xpMult: 1.0 },
  uncommon:  { label: "Uncommon",  color: "text-green-400",  border: "border-green-500/30", bg: "bg-green-500/5",  glow: "shadow-green-500/20",   xpMult: 1.5 },
  rare:      { label: "Rare",      color: "text-sky-400",    border: "border-sky-500/30",   bg: "bg-sky-500/5",    glow: "shadow-sky-500/20",     xpMult: 2.0 },
  epic:      { label: "Epic",      color: "text-purple-400", border: "border-purple-500/30",bg: "bg-purple-500/5", glow: "shadow-purple-500/20",  xpMult: 3.0 },
  legendary: { label: "Legendary", color: "text-yellow-400", border: "border-yellow-500/40",bg: "bg-yellow-500/5", glow: "shadow-yellow-500/30",  xpMult: 5.0 },
};

// ─── Category ─────────────────────────────────────────────────────────────────

export type QuestCategory =
  | "training"
  | "xp"
  | "skill_tree"
  | "streaks"
  | "progression"
  | "records";

export const QUEST_CATEGORY_META: Record<QuestCategory, { label: string; icon: string; color: string }> = {
  training:   { label: "Training",   icon: "🏋️", color: "text-green-400"  },
  xp:         { label: "XP",         icon: "⚡", color: "text-yellow-400" },
  skill_tree: { label: "Skill Tree", icon: "🌳", color: "text-purple-400" },
  streaks:    { label: "Streaks",    icon: "🔥", color: "text-orange-400" },
  progression:{ label: "Progression",icon: "📈", color: "text-sky-400"    },
  records:    { label: "Records",    icon: "🏆", color: "text-amber-400"  },
};

// ─── Requirement ──────────────────────────────────────────────────────────────

export type QuestRequirementType =
  | "workout_count_today"
  | "workout_count_week"
  | "earn_xp_today"
  | "earn_xp_week"
  | "push_up_reps_today"
  | "push_up_reps_week"
  | "pull_up_reps_today"
  | "pull_up_reps_week"
  | "dip_reps_today"
  | "dip_reps_week"
  | "streak_days"
  | "skill_unlock_total"
  | "skill_unlock_week"
  | "reach_level"
  | "total_workouts";

// ─── Quest Template (definition) ─────────────────────────────────────────────

export interface QuestTemplate {
  id:          string;
  title:       string;
  description: string;
  category:    QuestCategory;
  rarity:      QuestRarity;
  type:        QuestRequirementType;
  target:      number;
  rewardXP:    number;
  rewardCoins: number;
  isWeekly:    boolean;
}

// ─── Active Quest ─────────────────────────────────────────────────────────────

export interface ActiveQuest {
  templateId:  string;
  title:       string;
  description: string;
  category:    QuestCategory;
  rarity:      QuestRarity;
  type:        QuestRequirementType;
  target:      number;
  progress:    number;
  completed:   boolean;
  rewarded:    boolean;
  rewardXP:    number;
  rewardCoins: number;
  isWeekly:    boolean;
}

// ─── Quest Slot State ─────────────────────────────────────────────────────────

export interface QuestSlotState {
  dateKey:      string;
  quests:       ActiveQuest[];
  bonusClaimed: boolean;
}

// ─── Quest Streak ─────────────────────────────────────────────────────────────

export interface QuestStreak {
  current:           number;
  longest:           number;
  lastCompletedDate: string | null;
}

// ─── Quest Stats ──────────────────────────────────────────────────────────────

export interface QuestStats {
  totalCompleted:  number;
  dailyCompleted:  number;
  weeklyCompleted: number;
  totalXPEarned:   number;
  totalCoinsEarned:number;
  perfectDays:     number;
  perfectWeeks:    number;
}

// ─── Full Quest State ─────────────────────────────────────────────────────────

export interface QuestState {
  daily:  QuestSlotState;
  weekly: QuestSlotState;
  streak: QuestStreak;
  stats:  QuestStats;
}

// ─── Completion Result ────────────────────────────────────────────────────────

export interface QuestCompletionResult {
  newState:       QuestState;
  newlyCompleted: ActiveQuest[];
  bonusXP:        number;
  bonusCoins:     number;
}
