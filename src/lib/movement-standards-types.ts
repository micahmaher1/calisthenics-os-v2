export type StandardRank = "unranked" | "bronze" | "silver" | "gold" | "elite" | "legendary";

export const STANDARD_RANK_META: Record<StandardRank, {
  label:     string;
  icon:      string;
  color:     string;
  border:    string;
  bg:        string;
  glow:      string;
  points:    number;
}> = {
  unranked:  { label: "Unranked",  icon: "—",  color: "text-slate-500",   border: "border-slate-700",      bg: "bg-slate-800/40",   glow: "",                        points: 0  },
  bronze:    { label: "Bronze",    icon: "🥉", color: "text-amber-600",   border: "border-amber-700/50",   bg: "bg-amber-900/20",   glow: "shadow-amber-700/20",     points: 1  },
  silver:    { label: "Silver",    icon: "🥈", color: "text-slate-300",   border: "border-slate-400/50",   bg: "bg-slate-700/20",   glow: "shadow-slate-400/20",     points: 2  },
  gold:      { label: "Gold",      icon: "🥇", color: "text-yellow-400",  border: "border-yellow-500/50",  bg: "bg-yellow-900/20",  glow: "shadow-yellow-500/25",    points: 3  },
  elite:     { label: "Elite",     icon: "💎", color: "text-sky-400",     border: "border-sky-500/50",     bg: "bg-sky-900/20",     glow: "shadow-sky-500/25",       points: 5  },
  legendary: { label: "Legendary", icon: "👑", color: "text-purple-400",  border: "border-purple-500/50",  bg: "bg-purple-900/20",  glow: "shadow-purple-500/30",    points: 10 },
};

export const RANK_ORDER: StandardRank[] = ["unranked", "bronze", "silver", "gold", "elite", "legendary"];

export function getNextRank(rank: StandardRank): StandardRank | null {
  const idx = RANK_ORDER.indexOf(rank);
  if (idx < 0 || idx >= RANK_ORDER.length - 1) return null;
  return RANK_ORDER[idx + 1];
}

export type StandardMeasureType = "reps" | "seconds" | "qualitative";

export type MovementCategory =
  | "strength" | "static_strength" | "balance" | "grip" | "power"
  | "mobility" | "endurance" | "explosiveness" | "coordination" | "athleticism";

export const MOVEMENT_CATEGORY_META: Record<MovementCategory, {
  label: string; icon: string; color: string; masteryCategory: string;
}> = {
  strength:        { label: "Strength",        icon: "💪", color: "text-orange-400",  masteryCategory: "strength"        },
  static_strength: { label: "Static Strength", icon: "🗿", color: "text-slate-400",   masteryCategory: "static_strength" },
  balance:         { label: "Balance",         icon: "⚖️",  color: "text-sky-400",     masteryCategory: "balance"         },
  grip:            { label: "Grip Strength",   icon: "🤝", color: "text-amber-400",   masteryCategory: "grip"            },
  power:           { label: "Power",           icon: "⚡", color: "text-yellow-400",  masteryCategory: "power"           },
  mobility:        { label: "Mobility",        icon: "🧘", color: "text-green-400",   masteryCategory: "mobility"        },
  endurance:       { label: "Endurance",       icon: "🏃", color: "text-cyan-400",    masteryCategory: "endurance"       },
  explosiveness:   { label: "Explosiveness",   icon: "💥", color: "text-pink-400",    masteryCategory: "explosiveness"   },
  coordination:    { label: "Coordination",    icon: "🎯", color: "text-purple-400",  masteryCategory: "coordination"    },
  athleticism:     { label: "Athleticism",     icon: "🏆", color: "text-indigo-400",  masteryCategory: "athleticism"     },
};

export interface RankThreshold {
  rank:        StandardRank;
  value:       number;
  label:       string;
  description: string;
}

export interface MovementStandard {
  id:             string;
  name:           string;
  icon:           string;
  category:       MovementCategory;
  measureType:    StandardMeasureType;
  unit:           string;
  description:    string;
  thresholds:     RankThreshold[];
  qualitativeLabels?: string[];
  relatedSkillId?:  string;
  relatedJourneyId?: string;
  recordKey?:      string;
  tips:            string[];
  featured?:       boolean;
}

export interface StandardProgress {
  standardId:   string;
  currentValue: number;
  currentRank:  StandardRank;
  nextRank:     StandardRank | null;
  nextValue:    number | null;
  remaining:    number | null;
  pct:          number;
  overallPct:   number;
}

export interface StandardsState {
  manualValues:   Record<string, number>;
  trackedIds:     string[];
  lastUpdatedAt:  number;
}

export interface StandardsAnalytics {
  totalScore:         number;
  totalGold:          number;
  totalElite:         number;
  totalLegendary:     number;
  strongestCategory:  MovementCategory | null;
  weakestCategory:    MovementCategory | null;
  closestUpgrade:     { standard: MovementStandard; progress: StandardProgress } | null;
  mostImproved:       string | null;
  categoryScores:     Record<MovementCategory, number>;
}
