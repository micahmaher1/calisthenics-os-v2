// ─── Coach Goal (separate from profile UserGoal) ──────────────────────────────

export type CoachGoalType =
  | "strength"    // max strength, low reps
  | "muscle"      // hypertrophy, volume
  | "endurance"   // high reps, consistency
  | "mobility"    // flexibility, balance
  | "skills"      // skill tree progression
  | "athletic";   // all-round balance

export const COACH_GOAL_META: Record<CoachGoalType, {
  label:       string;
  icon:        string;
  description: string;
  focusCategories: string[];
}> = {
  strength:  { label: "Build Strength",   icon: "💪", description: "Maximize peak strength through low-rep, high-quality sets.", focusCategories: ["push", "pull"]         },
  muscle:    { label: "Build Muscle",     icon: "🏗️",  description: "Build muscle through consistent volume training.",          focusCategories: ["push", "pull", "legs"]  },
  endurance: { label: "Endurance",        icon: "⏱️",  description: "Train for stamina and high-rep performance.",               focusCategories: ["core", "general"]       },
  mobility:  { label: "Mobility",         icon: "🤸", description: "Improve flexibility, balance, and movement quality.",        focusCategories: ["mobility", "balance"]   },
  skills:    { label: "Unlock Skills",    icon: "🌳", description: "Fast-track through the skill tree to unlock advanced moves.", focusCategories: ["balance", "skill"]      },
  athletic:  { label: "Be Athletic",      icon: "⚡", description: "All-round athleticism — strength, endurance, and skill.",    focusCategories: ["push", "pull", "core"]  },
};

// ─── Coach Personality ────────────────────────────────────────────────────────

export type CoachPersonality =
  | "rpg_mentor"
  | "drill_sergeant"
  | "wise_master"
  | "elite_athlete"
  | "calm_coach";

export const COACH_PERSONALITY_META: Record<CoachPersonality, {
  label:      string;
  icon:       string;
  description:string;
  greeting:   string;
  shopItemId: string | null;  // null = free/default
  accentColor:string;
  bgClass:    string;
  borderClass:string;
}> = {
  rpg_mentor:     { label: "RPG Mentor",      icon: "🧙",  description: "Speaks in epic RPG lore. Every workout is a quest.",   greeting: "Warrior, your progress calls for action.",        shopItemId: null,               accentColor: "text-purple-400", bgClass: "bg-purple-500/10", borderClass: "border-purple-500/30" },
  drill_sergeant: { label: "Drill Sergeant",  icon: "🎖️",  description: "No-nonsense military intensity. No excuses.",         greeting: "ATTENTION! Here are your orders for today.",      shopItemId: "coach_drill",      accentColor: "text-red-400",    bgClass: "bg-red-500/10",    borderClass: "border-red-500/30"    },
  wise_master:    { label: "Wise Master",     icon: "🌿",  description: "Ancient wisdom meets modern training science.",        greeting: "Stillness reveals the next step on your path.",   shopItemId: "coach_wise",       accentColor: "text-green-400",  bgClass: "bg-green-500/10",  borderClass: "border-green-500/30"  },
  elite_athlete:  { label: "Elite Athlete",   icon: "🏆",  description: "Data-driven. Precision coaching for peak performance.", greeting: "Performance analysis complete. Insights ready.",   shopItemId: "coach_elite",      accentColor: "text-sky-400",    bgClass: "bg-sky-500/10",    borderClass: "border-sky-500/30"    },
  calm_coach:     { label: "Calm Coach",      icon: "☀️",  description: "Supportive and encouraging. Progress at your pace.",   greeting: "You're doing great. Here's what I'm seeing.",     shopItemId: "coach_calm",       accentColor: "text-amber-400",  bgClass: "bg-amber-500/10",  borderClass: "border-amber-500/30"  },
};

// ─── Training Categories ──────────────────────────────────────────────────────

export type TrainingCategory = "push" | "pull" | "core" | "legs" | "mobility" | "balance" | "explosive" | "general";

export const TRAINING_CATEGORY_META: Record<TrainingCategory, {
  label: string; icon: string; color: string; description: string;
}> = {
  push:      { label: "Push",       icon: "💪", color: "text-orange-400", description: "Push-ups, dips, handstand push-ups" },
  pull:      { label: "Pull",       icon: "🧲", color: "text-sky-400",    description: "Pull-ups, rows, muscle-ups"         },
  core:      { label: "Core",       icon: "🔥", color: "text-red-400",    description: "Planks, L-sits, hollow holds"       },
  legs:      { label: "Legs",       icon: "🦵", color: "text-green-400",  description: "Squats, lunges, pistol squats"      },
  mobility:  { label: "Mobility",   icon: "🤸", color: "text-teal-400",   description: "Stretching, flexibility work"       },
  balance:   { label: "Balance",    icon: "🎯", color: "text-purple-400", description: "Handstands, balance holds"          },
  explosive: { label: "Explosive",  icon: "💥", color: "text-yellow-400", description: "Clapping push-ups, jumps, sprints"  },
  general:   { label: "General",    icon: "🏃", color: "text-white/60",   description: "Mixed or unclassified workouts"     },
};

// ─── Training Balance ─────────────────────────────────────────────────────────

export interface TrainingBalance {
  counts: Record<TrainingCategory, number>;          // workouts in last 14 days
  daysSince: Record<TrainingCategory, number | null>; // days since last workout of this type
  total14:   number;
  total7:    number;
  counts7:   Record<TrainingCategory, number>;
}

// ─── Recommendation ───────────────────────────────────────────────────────────

export type RecommendationPriority = "critical" | "high" | "medium" | "low";

export type RecommendationType =
  | "training_balance"
  | "category_neglect"
  | "streak_warning"
  | "streak_milestone"
  | "streak_rank_up"
  | "xp_level_up"
  | "quest_reminder"
  | "record_plateau"
  | "record_improvement"
  | "achievement_close"
  | "skill_opportunity"
  | "goal_alignment"
  | "milestone_forecast"
  | "consistency_warning"
  | "weekly_streak_warning"
  | "general_tip"
  | "mastery_imbalance"
  | "mastery_levelup"
  | "skill_readiness"
  | "standards_upgrade";

export interface CoachRecommendation {
  id:           string;
  type:         RecommendationType;
  priority:     RecommendationPriority;
  title:        string;
  message:      string;
  detail?:      string;
  actionLabel?: string;
  actionHref?:  string;
  xpReward?:    number;
  icon:         string;
  dismissed:    boolean;
  generatedAt:  number;
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export type InsightType = "strength" | "weakness" | "improvement" | "warning" | "tip";

export interface CoachInsight {
  id:      string;
  type:    InsightType;
  message: string;
  icon:    string;
  metric?: string;
}

// ─── Milestone Forecast ───────────────────────────────────────────────────────

export interface MilestoneForecast {
  id:            string;
  label:         string;
  icon:          string;
  estimatedDays: number | null;
  current:       number;
  target:        number;
  description:   string;
  type:          "level" | "streak" | "skill_branch" | "achievement" | "xp";
  confidence:    "high" | "medium" | "low";
}

// ─── Today's Focus ────────────────────────────────────────────────────────────

export interface CoachFocus {
  title:          string;
  subtitle:       string;
  icon:           string;
  xpReward?:      number;
  recommendation: CoachRecommendation;
  urgent:         boolean;
}

// ─── Full Analysis ────────────────────────────────────────────────────────────

export interface CoachAnalysis {
  todayFocus:         CoachFocus | null;
  recommendations:    CoachRecommendation[];
  trainingBalance:    TrainingBalance;
  insights:           CoachInsight[];
  milestoneForecasts: MilestoneForecast[];
  strengths:          CoachInsight[];
  weaknesses:         CoachInsight[];
  recentImprovements: CoachInsight[];
  generatedAt:        number;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface CoachSettings {
  selectedGoal:  CoachGoalType;
  personality:   CoachPersonality;
  dismissedIds:  string[];
  lastViewedAt:  number;
}
