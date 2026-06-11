export type TitleRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export const TITLE_RARITY_META: Record<TitleRarity, {
  label: string; color: string; border: string; bg: string; glow: string; shimmer: boolean; badgeClass: string;
}> = {
  common:    { label: "Common",    color: "text-white/60",    border: "border-white/15",      bg: "bg-white/5",       glow: "",                         shimmer: false, badgeClass: "bg-white/10" },
  rare:      { label: "Rare",      color: "text-sky-400",     border: "border-sky-500/35",    bg: "bg-sky-500/10",    glow: "shadow-sky-500/20",        shimmer: false, badgeClass: "bg-sky-500/20" },
  epic:      { label: "Epic",      color: "text-purple-400",  border: "border-purple-500/35", bg: "bg-purple-500/10", glow: "shadow-purple-500/20",     shimmer: false, badgeClass: "bg-purple-500/20" },
  legendary: { label: "Legendary", color: "text-yellow-400",  border: "border-yellow-500/45", bg: "bg-yellow-500/10", glow: "shadow-yellow-500/30",     shimmer: true,  badgeClass: "bg-yellow-500/20" },
  mythic:    { label: "Mythic",    color: "text-pink-400",    border: "border-pink-500/50",   bg: "bg-pink-500/10",   glow: "shadow-pink-500/35",       shimmer: true,  badgeClass: "bg-pink-500/20" },
};

export type TitleCategory =
  | "beginner" | "level" | "streak" | "strength" | "skill_tree"
  | "elite" | "secret" | "quest" | "achievement" | "records";

export const TITLE_CATEGORY_META: Record<TitleCategory, { label: string; icon: string; color: string }> = {
  beginner:    { label: "Beginner",    icon: "🌱", color: "text-green-400"   },
  level:       { label: "Level",       icon: "⬆️",  color: "text-blue-400"   },
  streak:      { label: "Streak",      icon: "🔥", color: "text-red-400"    },
  strength:    { label: "Strength",    icon: "💪", color: "text-orange-400" },
  skill_tree:  { label: "Skill Tree",  icon: "🌳", color: "text-emerald-400"},
  elite:       { label: "Elite",       icon: "👑", color: "text-yellow-400" },
  secret:      { label: "Secret",      icon: "🔮", color: "text-purple-400" },
  quest:       { label: "Quest",       icon: "⚔️",  color: "text-amber-400"  },
  achievement: { label: "Achievement", icon: "🏆", color: "text-yellow-400" },
  records:     { label: "Records",     icon: "🏅", color: "text-cyan-400"   },
};

export type TitleRequirementType =
  | "level" | "xp" | "streak_days" | "workout_count" | "skill_count"
  | "achievement_count" | "quest_count" | "coins_earned" | "records_set"
  | "pushup_reps" | "pullup_reps" | "dip_reps" | "squat_reps"
  | "specific_achievement" | "rank";

export interface TitleRequirement {
  type:  TitleRequirementType;
  value: number | string;
  label: string;
}

export interface TitleDef {
  id:           string;
  name:         string;
  description:  string;
  category:     TitleCategory;
  rarity:       TitleRarity;
  icon:         string;
  requirements: TitleRequirement[];
  secret?:      boolean;
  hint?:        string;
}

export interface BadgeDef {
  id:           string;
  name:         string;
  description:  string;
  icon:         string;
  rarity:       TitleRarity;
  category:     TitleCategory;
  requirements: TitleRequirement[];
  secret?:      boolean;
  hint?:        string;
}

export interface TitleState {
  unlockedTitleIds: string[];
  equippedTitleId:  string | null;
  unlockedBadgeIds: string[];
  favoriteBadgeIds: string[];
  seenUnlockIds:    string[];
  lastEvaluatedAt:  number;
}

export interface TitleUnlockResult {
  type: "title" | "badge";
  def:  TitleDef | BadgeDef;
}
