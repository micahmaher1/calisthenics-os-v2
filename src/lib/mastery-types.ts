export type MasteryCategory =
  | "strength" | "power" | "balance" | "mobility"
  | "endurance" | "coordination" | "grip" | "static_strength"
  | "explosiveness" | "athleticism";

export const MASTERY_CATEGORY_META: Record<MasteryCategory, {
  label:       string;
  icon:        string;
  color:       string;
  border:      string;
  bg:          string;
  description: string;
  keywords:    string[];
  xpPerRep:    number;
  xpPerWorkout: number;
}> = {
  strength: {
    label: "Strength", icon: "💪", color: "text-orange-400",
    border: "border-orange-500/30", bg: "bg-orange-500/8",
    description: "Raw pushing and pulling power across all planes",
    keywords: ["push-up", "push up", "pull-up", "pull up", "chin-up", "chin up", "dip", "squat", "lunge", "row"],
    xpPerRep: 1, xpPerWorkout: 10,
  },
  power: {
    label: "Power", icon: "⚡", color: "text-yellow-400",
    border: "border-yellow-500/30", bg: "bg-yellow-500/8",
    description: "Explosive force generation and dynamic movement",
    keywords: ["muscle-up", "muscle up", "kip", "explosive", "clap", "power"],
    xpPerRep: 2, xpPerWorkout: 15,
  },
  balance: {
    label: "Balance", icon: "⚖️", color: "text-sky-400",
    border: "border-sky-500/30", bg: "bg-sky-500/8",
    description: "Body control, proprioception and equilibrium",
    keywords: ["handstand", "hand stand", "flag", "crow", "headstand", "balance", "single leg"],
    xpPerRep: 3, xpPerWorkout: 20,
  },
  mobility: {
    label: "Mobility", icon: "🧘", color: "text-green-400",
    border: "border-green-500/30", bg: "bg-green-500/8",
    description: "Flexibility, range of motion and joint health",
    keywords: ["stretch", "squat hold", "bridge", "pancake", "pike", "mobility", "jefferson", "thoracic", "hip flexor", "split"],
    xpPerRep: 2, xpPerWorkout: 15,
  },
  endurance: {
    label: "Endurance", icon: "🏃", color: "text-cyan-400",
    border: "border-cyan-500/30", bg: "bg-cyan-500/8",
    description: "Sustained effort and cardiovascular capacity",
    keywords: ["run", "sprint", "burpee", "jump", "circuit", "cardio", "endurance", "hiit"],
    xpPerRep: 1, xpPerWorkout: 12,
  },
  coordination: {
    label: "Coordination", icon: "🎯", color: "text-purple-400",
    border: "border-purple-500/30", bg: "bg-purple-500/8",
    description: "Skill transfer, timing and neuromuscular control",
    keywords: ["skill", "flow", "combo", "sequence", "coordination", "agility", "footwork"],
    xpPerRep: 2, xpPerWorkout: 18,
  },
  grip: {
    label: "Grip", icon: "🤝", color: "text-amber-400",
    border: "border-amber-500/30", bg: "bg-amber-500/8",
    description: "Grip strength, endurance and finger power",
    keywords: ["dead hang", "hang", "grip", "finger", "wrist", "forearm", "pinch"],
    xpPerRep: 2, xpPerWorkout: 15,
  },
  static_strength: {
    label: "Static Strength", icon: "🗿", color: "text-slate-400",
    border: "border-slate-500/30", bg: "bg-slate-500/8",
    description: "Isometric holds and static skill development",
    keywords: ["hold", "l-sit", "l sit", "planche", "lever", "iron cross", "tuck", "straddle", "isometric"],
    xpPerRep: 3, xpPerWorkout: 25,
  },
  explosiveness: {
    label: "Explosiveness", icon: "💥", color: "text-pink-400",
    border: "border-pink-500/30", bg: "bg-pink-500/8",
    description: "Fast-twitch development and plyometric power",
    keywords: ["jump", "plyometric", "plyo", "box jump", "broad jump", "explosive push", "clap push"],
    xpPerRep: 2, xpPerWorkout: 20,
  },
  athleticism: {
    label: "Athleticism", icon: "🏆", color: "text-indigo-400",
    border: "border-indigo-500/30", bg: "bg-indigo-500/8",
    description: "All-round athletic performance and versatility",
    keywords: ["athlete", "athletic", "sport", "full body", "compound", "workout"],
    xpPerRep: 1, xpPerWorkout: 8,
  },
};

export function masteryXPForLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let l = 1; l < level; l++) {
    total += Math.floor(100 * Math.pow(l, 1.15));
  }
  return total;
}

export function masteryXPToNextLevel(currentLevel: number, currentXP: number): number {
  const xpForNext = masteryXPForLevel(currentLevel + 1);
  return Math.max(0, xpForNext - currentXP);
}

export function masteryLevelFromXP(totalXP: number): number {
  let level = 1;
  while (masteryXPForLevel(level + 1) <= totalXP) level++;
  return level;
}

export type MasteryRank = "apprentice" | "adept" | "expert" | "master" | "grandmaster" | "mythic";

export const MASTERY_RANK_META: Record<MasteryRank, {
  label: string; minLevel: number; color: string; border: string; bg: string; icon: string;
}> = {
  apprentice:  { label: "Apprentice",  minLevel: 1,   color: "text-slate-400",   border: "border-slate-500/25",   bg: "bg-slate-500/8",    icon: "🌱" },
  adept:       { label: "Adept",       minLevel: 11,  color: "text-green-400",   border: "border-green-500/30",   bg: "bg-green-500/8",    icon: "⚡" },
  expert:      { label: "Expert",      minLevel: 26,  color: "text-sky-400",     border: "border-sky-500/30",     bg: "bg-sky-500/8",      icon: "🔥" },
  master:      { label: "Master",      minLevel: 51,  color: "text-purple-400",  border: "border-purple-500/30",  bg: "bg-purple-500/8",   icon: "👑" },
  grandmaster: { label: "Grandmaster", minLevel: 76,  color: "text-yellow-400",  border: "border-yellow-500/40",  bg: "bg-yellow-500/8",   icon: "🌟" },
  mythic:      { label: "Mythic",      minLevel: 101, color: "text-pink-400",    border: "border-pink-500/50",    bg: "bg-pink-500/8",     icon: "✨" },
};

export function getMasteryRank(level: number): MasteryRank {
  if (level >= 101) return "mythic";
  if (level >= 76)  return "grandmaster";
  if (level >= 51)  return "master";
  if (level >= 26)  return "expert";
  if (level >= 11)  return "adept";
  return "apprentice";
}

export interface CategoryMastery {
  totalXP:      number;
  level:        number;
  rank:         MasteryRank;
}

export interface MasteryState {
  categories:   Record<MasteryCategory, CategoryMastery>;
  lastUpdatedAt: number;
  grantedRewardKeys: string[];
}

export interface MasteryGainResult {
  category:  MasteryCategory;
  xpGained:  number;
  prevLevel: number;
  newLevel:  number;
  leveledUp: boolean;
}

export function calcGlobalMasteryScore(state: MasteryState): number {
  return (Object.values(state.categories) as CategoryMastery[]).reduce((sum, c) => sum + c.level, 0);
}

export type GlobalMasteryRank = "novice" | "practitioner" | "specialist" | "veteran" | "champion" | "legend" | "mythic_legend";

export const GLOBAL_MASTERY_RANK_META: Record<GlobalMasteryRank, {
  label: string; minScore: number; color: string; icon: string;
}> = {
  novice:         { label: "Novice",          minScore: 0,   color: "text-slate-400",  icon: "🌱" },
  practitioner:   { label: "Practitioner",    minScore: 51,  color: "text-green-400",  icon: "⚡" },
  specialist:     { label: "Specialist",      minScore: 150, color: "text-sky-400",    icon: "🔥" },
  veteran:        { label: "Veteran",         minScore: 300, color: "text-orange-400", icon: "⚔️"  },
  champion:       { label: "Champion",        minScore: 500, color: "text-purple-400", icon: "👑" },
  legend:         { label: "Legend",          minScore: 750, color: "text-yellow-400", icon: "🌟" },
  mythic_legend:  { label: "Mythic Legend",   minScore: 1000,color: "text-pink-400",   icon: "✨" },
};

export function getGlobalMasteryRank(score: number): GlobalMasteryRank {
  if (score >= 1000) return "mythic_legend";
  if (score >= 750)  return "legend";
  if (score >= 500)  return "champion";
  if (score >= 300)  return "veteran";
  if (score >= 150)  return "specialist";
  if (score >= 51)   return "practitioner";
  return "novice";
}
