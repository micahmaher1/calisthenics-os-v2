import { Workout } from "./types";
import {
  MasteryState, MasteryCategory, CategoryMastery, MasteryGainResult,
  MASTERY_CATEGORY_META, masteryLevelFromXP, getMasteryRank,
} from "./mastery-types";

export function defaultCategoryMastery(): CategoryMastery {
  return { totalXP: 0, level: 1, rank: "apprentice" };
}

export function defaultMasteryState(): MasteryState {
  const categories = {} as Record<MasteryCategory, CategoryMastery>;
  const cats: MasteryCategory[] = [
    "strength","power","balance","mobility","endurance",
    "coordination","grip","static_strength","explosiveness","athleticism",
  ];
  for (const cat of cats) categories[cat] = defaultCategoryMastery();
  return { categories, lastUpdatedAt: 0, grantedRewardKeys: [] };
}

export function getWorkoutMasteryCategories(workout: Workout): Array<{ category: MasteryCategory; xp: number }> {
  const name = (workout.name || "").toLowerCase();
  const reps = workout.reps || 0;
  const results: Array<{ category: MasteryCategory; xp: number }> = [];

  const cats: MasteryCategory[] = [
    "strength","power","balance","mobility","endurance",
    "coordination","grip","static_strength","explosiveness","athleticism",
  ];

  for (const cat of cats) {
    const meta = MASTERY_CATEGORY_META[cat];
    const matches = meta.keywords.some((kw) => name.includes(kw));
    if (matches) {
      const xp = Math.floor(reps * meta.xpPerRep + meta.xpPerWorkout);
      results.push({ category: cat, xp });
    }
  }

  if (results.length === 0) {
    results.push({ category: "athleticism", xp: MASTERY_CATEGORY_META.athleticism.xpPerWorkout });
  }

  return results;
}

export function recalculateMastery(workouts: Workout[]): MasteryState {
  const state = defaultMasteryState();
  for (const workout of workouts) {
    const gains = getWorkoutMasteryCategories(workout);
    for (const { category, xp } of gains) {
      state.categories[category].totalXP += xp;
    }
  }
  const cats = Object.keys(state.categories) as MasteryCategory[];
  for (const cat of cats) {
    const cm = state.categories[cat];
    cm.level = masteryLevelFromXP(cm.totalXP);
    cm.rank  = getMasteryRank(cm.level);
  }
  state.lastUpdatedAt = Date.now();
  return state;
}

export function applyWorkoutMastery(
  state: MasteryState,
  workout: Workout,
): { newState: MasteryState; gains: MasteryGainResult[] } {
  const newState: MasteryState = {
    ...state,
    categories: { ...state.categories },
    grantedRewardKeys: [...state.grantedRewardKeys],
  };
  const gains: MasteryGainResult[] = [];

  const workoutGains = getWorkoutMasteryCategories(workout);
  for (const { category, xp } of workoutGains) {
    const prev = { ...newState.categories[category] };
    const updated: CategoryMastery = {
      totalXP: prev.totalXP + xp,
      level: 0,
      rank: prev.rank,
    };
    updated.level = masteryLevelFromXP(updated.totalXP);
    updated.rank  = getMasteryRank(updated.level);
    newState.categories[category] = updated;

    gains.push({
      category,
      xpGained:  xp,
      prevLevel: prev.level,
      newLevel:  updated.level,
      leveledUp: updated.level !== prev.level,
    });
  }

  newState.lastUpdatedAt = Date.now();
  return { newState, gains };
}

export interface MasteryReward {
  key:         string;
  category:    MasteryCategory;
  level:       number;
  xpBonus:     number;
  coinBonus:   number;
  titleId?:    string;
  badgeId?:    string;
  label:       string;
}

export const MASTERY_REWARDS: MasteryReward[] = [
  // Strength
  { key: "strength_10",  category: "strength",       level: 10,  xpBonus: 200,  coinBonus: 50,  label: "Strength Adept" },
  { key: "strength_25",  category: "strength",       level: 25,  xpBonus: 500,  coinBonus: 150, label: "Strength Expert" },
  { key: "strength_50",  category: "strength",       level: 50,  xpBonus: 1500, coinBonus: 500, label: "Strength Master" },
  // Balance
  { key: "balance_10",   category: "balance",        level: 10,  xpBonus: 200,  coinBonus: 50,  label: "Balance Adept" },
  { key: "balance_25",   category: "balance",        level: 25,  xpBonus: 500,  coinBonus: 150, label: "Balance Expert" },
  { key: "balance_50",   category: "balance",        level: 50,  xpBonus: 1500, coinBonus: 500, label: "Balance Master" },
  // Mobility
  { key: "mobility_10",  category: "mobility",       level: 10,  xpBonus: 200,  coinBonus: 50,  label: "Mobility Adept" },
  { key: "mobility_25",  category: "mobility",       level: 25,  xpBonus: 500,  coinBonus: 150, label: "Mobility Sage" },
  // Power
  { key: "power_10",     category: "power",          level: 10,  xpBonus: 200,  coinBonus: 50,  label: "Power Adept" },
  { key: "power_25",     category: "power",          level: 25,  xpBonus: 500,  coinBonus: 150, label: "Power Champion" },
  // Static Strength
  { key: "static_10",    category: "static_strength",level: 10,  xpBonus: 300,  coinBonus: 75,  label: "Static Strength Adept" },
  { key: "static_25",    category: "static_strength",level: 25,  xpBonus: 750,  coinBonus: 200, label: "Static Strength Lord" },
  // Grip
  { key: "grip_10",      category: "grip",           level: 10,  xpBonus: 200,  coinBonus: 50,  label: "Grip Adept" },
  { key: "grip_25",      category: "grip",           level: 25,  xpBonus: 500,  coinBonus: 150, label: "Grip Master" },
  // Athleticism
  { key: "athleticism_10",category:"athleticism",    level: 10,  xpBonus: 200,  coinBonus: 50,  label: "Athletic Adept" },
  { key: "athleticism_25",category:"athleticism",    level: 25,  xpBonus: 500,  coinBonus: 150, label: "Athletic Legend" },
  // Explosiveness
  { key: "explosive_10", category: "explosiveness",  level: 10,  xpBonus: 200,  coinBonus: 50,  label: "Explosive Adept" },
  // Endurance
  { key: "endurance_10", category: "endurance",      level: 10,  xpBonus: 200,  coinBonus: 50,  label: "Endurance Adept" },
  // Coordination
  { key: "coordination_10",category:"coordination",  level: 10,  xpBonus: 200,  coinBonus: 50,  label: "Coordination Adept" },
];

export function checkMasteryRewards(state: MasteryState): MasteryReward[] {
  return MASTERY_REWARDS.filter((r) => {
    if (state.grantedRewardKeys.includes(r.key)) return false;
    return state.categories[r.category].level >= r.level;
  });
}
