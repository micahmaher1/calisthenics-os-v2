import { AppState } from "./types";
import { SkillTreeState } from "./skilltree-types";
import { AchievementState } from "./achievement-types";
import { QuestState } from "./quest-types";
import { RecordsState } from "./records-types";
import { StreakState } from "./streak-types";
import {
  TitleState, TitleDef, BadgeDef, TitleRequirement, TitleUnlockResult,
} from "./title-types";
import { ALL_TITLES, ALL_BADGES, TITLE_MAP } from "./title-data";
import { getTotalCompleted } from "./skilltree-engine";

// ─── Snapshot ─────────────────────────────────────────────────────────────────

export interface TitleSnapshot {
  level:            number;
  totalXP:          number;
  workoutCount:     number;
  currentStreak:    number;
  longestStreak:    number;
  skillCount:       number;
  achievementCount: number;
  questCount:       number;
  coinsEarned:      number;
  recordsSet:       number;
  pushupReps:       number;
  pullupReps:       number;
  dipReps:          number;
  squatReps:        number;
  rank:             string;
}

export function buildTitleSnapshot(
  appState: AppState,
  streakState: StreakState,
  treeState: SkillTreeState,
  achState: AchievementState,
  questState: QuestState,
  recState: RecordsState,
): TitleSnapshot {
  const { getRankLabel } = require("./xp") as { getRankLabel: (l: number) => string };

  // Count unlocked achievements
  const achievementCount = Object.values(achState.progress).filter((p) => p.unlocked).length;

  // Count completed skills
  const skillCount = getTotalCompleted(treeState.progress);

  // Count quests completed
  const questCount = questState.stats.totalCompleted;

  // Count records with a current value
  const recordsSet = Object.values(recState.records).filter(
    (r) => r.current !== null && r.current.value > 0
  ).length;

  // Sum reps by exercise type
  let pushupReps = 0, pullupReps = 0, dipReps = 0, squatReps = 0;
  for (const w of appState.workouts) {
    const n = w.name.toLowerCase();
    if (/push.?up|chest press/i.test(n) || w.skillName === "push-ups") {
      pushupReps += w.reps;
    } else if (/pull.?up|chin.?up|lat/i.test(n) || w.skillName === "pull-ups") {
      pullupReps += w.reps;
    } else if (/\bdip\b/i.test(n) || w.skillName === "dips") {
      dipReps += w.reps;
    } else if (/squat|leg|pistol/i.test(n)) {
      squatReps += w.reps;
    }
  }

  return {
    level:            appState.level,
    totalXP:          appState.totalXP,
    workoutCount:     appState.workouts.length,
    currentStreak:    streakState.daily.current,
    longestStreak:    streakState.daily.longest,
    skillCount,
    achievementCount,
    questCount,
    coinsEarned:      appState.coins,
    recordsSet,
    pushupReps,
    pullupReps,
    dipReps,
    squatReps,
    rank:             getRankLabel(appState.level),
  };
}

// ─── Requirement Checker ──────────────────────────────────────────────────────

export function checkTitleRequirement(req: TitleRequirement, snap: TitleSnapshot): boolean {
  const val = typeof req.value === "string" ? req.value : req.value;
  const num = typeof req.value === "number" ? req.value : 0;

  switch (req.type) {
    case "level":            return snap.level >= num;
    case "xp":               return snap.totalXP >= num;
    case "streak_days":      return snap.longestStreak >= num || snap.currentStreak >= num;
    case "workout_count":    return snap.workoutCount >= num;
    case "skill_count":      return snap.skillCount >= num;
    case "achievement_count":return snap.achievementCount >= num;
    case "quest_count":      return snap.questCount >= num;
    case "coins_earned":     return snap.coinsEarned >= num;
    case "records_set":      return snap.recordsSet >= num;
    case "pushup_reps":      return snap.pushupReps >= num;
    case "pullup_reps":      return snap.pullupReps >= num;
    case "dip_reps":         return snap.dipReps >= num;
    case "squat_reps":       return snap.squatReps >= num;
    case "rank":             return snap.rank === val;
    case "specific_achievement": return false; // future
    default:                 return false;
  }
}

export function checkAllRequirements(reqs: TitleRequirement[], snap: TitleSnapshot): boolean {
  return reqs.every((r) => checkTitleRequirement(r, snap));
}

// ─── Evaluate ─────────────────────────────────────────────────────────────────

export function evaluateTitlesAndBadges(
  titleState: TitleState,
  snap: TitleSnapshot,
): { newState: TitleState; newlyUnlockedTitles: TitleDef[]; newlyUnlockedBadges: BadgeDef[] } {
  const newState = { ...titleState };
  const newlyUnlockedTitles: TitleDef[] = [];
  const newlyUnlockedBadges: BadgeDef[] = [];

  for (const title of ALL_TITLES) {
    if (!newState.unlockedTitleIds.includes(title.id)) {
      if (checkAllRequirements(title.requirements, snap)) {
        newState.unlockedTitleIds = [...newState.unlockedTitleIds, title.id];
        if (!newState.seenUnlockIds.includes(title.id)) {
          newlyUnlockedTitles.push(title);
          newState.seenUnlockIds = [...newState.seenUnlockIds, title.id];
        }
      }
    }
  }

  for (const badge of ALL_BADGES) {
    if (!newState.unlockedBadgeIds.includes(badge.id)) {
      if (checkAllRequirements(badge.requirements, snap)) {
        newState.unlockedBadgeIds = [...newState.unlockedBadgeIds, badge.id];
        if (!newState.seenUnlockIds.includes(badge.id)) {
          newlyUnlockedBadges.push(badge);
          newState.seenUnlockIds = [...newState.seenUnlockIds, badge.id];
        }
      }
    }
  }

  // Auto-equip first title if none equipped
  if (!newState.equippedTitleId && newState.unlockedTitleIds.length > 0) {
    newState.equippedTitleId = newState.unlockedTitleIds[0];
  }

  newState.lastEvaluatedAt = Date.now();
  return { newState, newlyUnlockedTitles, newlyUnlockedBadges };
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface TitleProgress {
  current: number;
  max:     number;
  pct:     number;
}

export function getTitleProgress(titleDef: TitleDef, snap: TitleSnapshot): TitleProgress {
  const req = titleDef.requirements[0];
  if (!req || typeof req.value !== "number") return { current: 0, max: 1, pct: 0 };

  let current = 0;
  switch (req.type) {
    case "level":             current = snap.level; break;
    case "xp":                current = snap.totalXP; break;
    case "streak_days":       current = Math.max(snap.currentStreak, snap.longestStreak); break;
    case "workout_count":     current = snap.workoutCount; break;
    case "skill_count":       current = snap.skillCount; break;
    case "achievement_count": current = snap.achievementCount; break;
    case "quest_count":       current = snap.questCount; break;
    case "coins_earned":      current = snap.coinsEarned; break;
    case "records_set":       current = snap.recordsSet; break;
    case "pushup_reps":       current = snap.pushupReps; break;
    case "pullup_reps":       current = snap.pullupReps; break;
    case "dip_reps":          current = snap.dipReps; break;
    case "squat_reps":        current = snap.squatReps; break;
    default:                  current = 0;
  }

  const max = req.value as number;
  return { current, max, pct: Math.min(100, Math.round((current / max) * 100)) };
}

export function getEquippedTitle(titleState: TitleState): TitleDef | null {
  if (!titleState.equippedTitleId) return null;
  return TITLE_MAP[titleState.equippedTitleId] ?? null;
}

// ─── Find next title to unlock ────────────────────────────────────────────────

export function getClosestLockedTitle(
  titleState: TitleState,
  snap: TitleSnapshot,
): { title: TitleDef; progress: TitleProgress } | null {
  let best: { title: TitleDef; progress: TitleProgress } | null = null;

  for (const title of ALL_TITLES) {
    if (titleState.unlockedTitleIds.includes(title.id)) continue;
    if (title.secret) continue;
    const progress = getTitleProgress(title, snap);
    if (progress.pct >= 100) continue;
    if (!best || progress.pct > best.progress.pct) {
      best = { title, progress };
    }
  }

  return best;
}
