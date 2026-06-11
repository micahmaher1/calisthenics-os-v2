import {
  MovementStandard, StandardProgress, StandardRank, StandardsState,
  StandardsAnalytics, RANK_ORDER, STANDARD_RANK_META, MovementCategory,
} from "./movement-standards-types";
import { MOVEMENT_STANDARDS } from "./movement-standards-data";
import { RecordsState } from "./records-types";

// Get the current best value for a standard
export function getCurrentValue(
  standard: MovementStandard,
  recState: RecordsState,
  manualValues: Record<string, number>,
): number {
  if (standard.measureType === "qualitative") {
    return manualValues[standard.id] ?? -1;  // -1 = unranked
  }
  if (standard.recordKey) {
    return getRecordValue(recState, standard.recordKey);
  }
  return 0;
}

// Look up a record value by exercise name key (case-insensitive partial match)
export function getRecordValue(recState: RecordsState, key: string): number {
  const records = recState.records ?? {};
  // records is Record<string, TrackedRecord> keyed by exerciseName (normalized)
  for (const [exerciseName, trackedRecord] of Object.entries(records)) {
    const norm = exerciseName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, "_");
    if (norm.includes(keyNorm) || keyNorm.includes(norm)) {
      return trackedRecord.current?.value ?? 0;
    }
  }
  return 0;
}

// Calculate progress for a single standard
export function calcStandardProgress(
  standard: MovementStandard,
  currentValue: number,
): StandardProgress {
  const { thresholds } = standard;

  // Find highest rank threshold met
  let currentRank: StandardRank = "unranked";
  for (const threshold of thresholds) {
    if (currentValue >= threshold.value) {
      currentRank = threshold.rank;
    }
  }

  // For qualitative: -1 means unranked
  if (standard.measureType === "qualitative" && currentValue < 0) {
    currentRank = "unranked";
  }

  // Find next rank
  const currentRankIdx = RANK_ORDER.indexOf(currentRank);
  const nextRank: StandardRank | null = currentRankIdx < RANK_ORDER.length - 1
    ? RANK_ORDER[currentRankIdx + 1]
    : null;

  const nextThreshold = nextRank
    ? thresholds.find(t => t.rank === nextRank)
    : null;

  const nextValue = nextThreshold?.value ?? null;
  const remaining = nextValue !== null ? Math.max(0, nextValue - currentValue) : null;

  // Progress percentage toward next rank
  let pct = 0;
  if (nextRank === null) {
    pct = 100; // already legendary
  } else if (currentRank === "unranked") {
    const bronzeThreshold = thresholds.find(t => t.rank === "bronze");
    if (bronzeThreshold && bronzeThreshold.value > 0) {
      pct = Math.min(100, Math.round((Math.max(0, currentValue) / bronzeThreshold.value) * 100));
    } else if (bronzeThreshold && bronzeThreshold.value === 0) {
      // qualitative: if bronze value is 0, check if current >= 0
      pct = currentValue >= 0 ? 100 : 0;
    }
  } else {
    const prevThreshold = thresholds.find(t => t.rank === currentRank);
    if (prevThreshold && nextThreshold) {
      const range = nextThreshold.value - prevThreshold.value;
      const progress = currentValue - prevThreshold.value;
      pct = range > 0 ? Math.min(100, Math.round((progress / range) * 100)) : 100;
    }
  }

  // Overall: how many thresholds met out of total
  const ranksAchieved = thresholds.filter(t => currentValue >= t.value).length;
  const overallPct = Math.round((ranksAchieved / thresholds.length) * 100);

  return {
    standardId:   standard.id,
    currentValue,
    currentRank,
    nextRank,
    nextValue,
    remaining,
    pct,
    overallPct,
  };
}

// Calculate all standards progress
export function calcAllStandardsProgress(
  recState: RecordsState,
  state: StandardsState,
): Record<string, StandardProgress> {
  const result: Record<string, StandardProgress> = {};
  for (const standard of MOVEMENT_STANDARDS) {
    const currentValue = getCurrentValue(standard, recState, state.manualValues);
    result[standard.id] = calcStandardProgress(standard, currentValue);
  }
  return result;
}

// Analytics
export function calcStandardsAnalytics(
  progressMap: Record<string, StandardProgress>,
): StandardsAnalytics {
  let totalScore = 0;
  let totalGold = 0;
  let totalElite = 0;
  let totalLegendary = 0;

  const categoryScores: Partial<Record<MovementCategory, number>> = {};
  const categoryCount: Partial<Record<MovementCategory, number>> = {};

  let closestUpgrade: { standard: MovementStandard; progress: StandardProgress } | null = null;
  let closestPct = -1;

  for (const standard of MOVEMENT_STANDARDS) {
    const progress = progressMap[standard.id];
    if (!progress) continue;

    const points = STANDARD_RANK_META[progress.currentRank].points;
    totalScore += points;

    if (progress.currentRank === "gold")      totalGold++;
    if (progress.currentRank === "elite")     totalElite++;
    if (progress.currentRank === "legendary") totalLegendary++;

    const cat = standard.category;
    categoryScores[cat] = (categoryScores[cat] ?? 0) + points;
    categoryCount[cat]  = (categoryCount[cat] ?? 0) + 1;

    // Closest upgrade (highest pct toward next rank, not yet legendary)
    if (progress.nextRank && progress.pct > closestPct && progress.pct < 100) {
      closestPct = progress.pct;
      closestUpgrade = { standard, progress };
    }
  }

  // Average per category
  const avgCategoryScores: Partial<Record<MovementCategory, number>> = {};
  for (const cat of Object.keys(categoryScores) as MovementCategory[]) {
    const count = categoryCount[cat] ?? 1;
    avgCategoryScores[cat] = (categoryScores[cat] ?? 0) / count;
  }

  const catEntries = Object.entries(avgCategoryScores).sort((a, b) => (b[1] as number) - (a[1] as number));
  const strongestCategory = (catEntries[0]?.[0] as MovementCategory) ?? null;
  const weakestCategory   = (catEntries[catEntries.length - 1]?.[0] as MovementCategory) ?? null;

  // Fill missing categories with 0
  const allCategories: MovementCategory[] = [
    "strength", "static_strength", "balance", "grip", "power",
    "mobility", "endurance", "explosiveness", "coordination", "athleticism",
  ];
  const fullCategoryScores = Object.fromEntries(
    allCategories.map(c => [c, avgCategoryScores[c] ?? 0])
  ) as Record<MovementCategory, number>;

  return {
    totalScore,
    totalGold,
    totalElite,
    totalLegendary,
    strongestCategory,
    weakestCategory,
    closestUpgrade,
    mostImproved: null,
    categoryScores: fullCategoryScores,
  };
}
