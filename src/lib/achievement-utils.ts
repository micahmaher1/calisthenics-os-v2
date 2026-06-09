import { AppState, Workout } from "./types";
import { SkillTreeState } from "./skilltree-types";
import { getAllBranchStats, getTotalCompleted, getTotalNodes } from "./skilltree-engine";
import {
  AchievementState, AchievementProgressMap, AchievementStats,
  Rarity, AchievementCategory,
} from "./achievement-types";
import { ACHIEVEMENTS, ACHIEVEMENT_MAP, ENDGAME_SKILL_IDS } from "./achievement-data";

// ─── Snapshot ────────────────────────────────────────────────────────────────

export interface GameSnapshot {
  totalXP:          number;
  level:            number;
  workoutCount:     number;
  streak:           number;
  pushUpReps:       number;
  pullUpReps:       number;
  coreReps:         number;
  hangSeconds:      number;
  skillsCompleted:  number;
  branchPercents:   Record<string, number>;
  completedSkillIds: Set<string>;
  endgameCount:     number;
  completedBranches: number;
  allSkillsDone:    boolean;
}

function dayKey(ts: number): number {
  return Math.floor(ts / 86_400_000);
}

function calcStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;
  const todayKey = dayKey(Date.now());
  const dayKeys = workouts.map((w) => dayKey(w.timestamp));
  const seen: Record<number, true> = {};
  const uniqueDays = dayKeys.filter((d) => { if (seen[d]) return false; seen[d] = true; return true; }).sort((a, b) => b - a);
  if (uniqueDays[0] < todayKey - 1) return 0;
  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    if (uniqueDays[i - 1] - uniqueDays[i] === 1) streak++;
    else break;
  }
  return streak;
}

const CORE_KEYWORDS = ["plank", "hollow", "l-sit", "dragon", "ab ", "crunch", "leg raise", "core", "tuck", "v-up", "sit-up", "situp"];
const HANG_KEYWORDS  = ["hang", "dead hang", "bar hang"];

function isCoreWorkout(name: string): boolean {
  const lower = name.toLowerCase();
  return CORE_KEYWORDS.some((kw) => lower.includes(kw));
}

function isHangWorkout(name: string): boolean {
  const lower = name.toLowerCase();
  return HANG_KEYWORDS.some((kw) => lower.includes(kw));
}

export function buildSnapshot(appState: AppState, treeState: SkillTreeState): GameSnapshot {
  const { workouts, totalXP, level } = appState;
  const progress = treeState.progress;

  // Exercise totals
  let pushUpReps = 0, pullUpReps = 0, coreReps = 0, hangSeconds = 0;
  for (const w of workouts) {
    if (w.skillName === "push-ups") pushUpReps += w.reps;
    else if (w.skillName === "pull-ups") pullUpReps += w.reps;
    else if (isCoreWorkout(w.name)) coreReps += w.reps;
    if (isHangWorkout(w.name)) hangSeconds += w.reps;
  }

  // Tree stats
  const branchStatsMap = getAllBranchStats(progress);
  const branchPercents: Record<string, number> = {
    push:  branchStatsMap.push.percent,
    pull:  branchStatsMap.pull.percent,
    core:  branchStatsMap.core.percent,
    skill: branchStatsMap.skill.percent,
  };
  const completedBranches = Object.values(branchStatsMap).filter((s) => s.mastered).length;

  const completedSkillIds = new Set<string>(
    Object.entries(progress)
      .filter(([, p]) => p.status === "completed")
      .map(([id]) => id)
  );

  const endgameCount = ENDGAME_SKILL_IDS.filter((id) => completedSkillIds.has(id)).length;
  const skillsCompleted = getTotalCompleted(progress);
  const totalNodes = getTotalNodes();
  const allSkillsDone = skillsCompleted === totalNodes && totalNodes > 0;

  // Combined XP (workout XP + tree XP for level-based achievements)
  const combinedXP = totalXP + treeState.totalTreeXP;

  return {
    totalXP: combinedXP,
    level,
    workoutCount: workouts.length,
    streak: calcStreak(workouts),
    pushUpReps,
    pullUpReps,
    coreReps,
    hangSeconds,
    skillsCompleted,
    branchPercents,
    completedSkillIds,
    endgameCount,
    completedBranches,
    allSkillsDone,
  };
}

// ─── Evaluate Single Achievement ─────────────────────────────────────────────

export function evaluateAchievement(
  achId: string,
  snapshot: GameSnapshot,
  achState: AchievementState
): { current: number; target: number; met: boolean } {
  const ach = ACHIEVEMENT_MAP[achId];
  if (!ach) return { current: 0, target: 1, met: false };
  const req = ach.requirement;
  let current = 0;
  const target = req.value;

  switch (req.type) {
    case "workout_count":
      current = snapshot.workoutCount;
      break;
    case "total_xp":
      current = snapshot.totalXP;
      break;
    case "player_level":
      current = snapshot.level;
      break;
    case "skills_completed":
      current = snapshot.skillsCompleted;
      break;
    case "all_skills_completed":
      current = snapshot.allSkillsDone ? 1 : 0;
      break;
    case "branch_percent":
      if (req.branch) current = snapshot.branchPercents[req.branch] ?? 0;
      break;
    case "all_branches_complete":
      current = snapshot.completedBranches;
      break;
    case "specific_skill":
      current = req.skillId && snapshot.completedSkillIds.has(req.skillId) ? 1 : 0;
      break;
    case "streak_days":
      current = snapshot.streak;
      break;
    case "exercise_reps":
      if (req.exercise === "push-up") current = snapshot.pushUpReps;
      else if (req.exercise === "pull-up") current = snapshot.pullUpReps;
      else if (req.exercise === "core") current = snapshot.coreReps;
      else if (req.exercise === "hang") current = snapshot.hangSeconds;
      break;
    case "hang_time_seconds":
      current = snapshot.hangSeconds;
      break;
    case "endgame_count":
      current = snapshot.endgameCount;
      break;
    case "all_endgame":
      current = snapshot.endgameCount >= ENDGAME_SKILL_IDS.length ? 1 : 0;
      break;
    case "all_achievements": {
      const others = ACHIEVEMENTS.filter((a) => a.id !== achId);
      current = others.every((a) => achState.progress[a.id]?.unlocked) ? 1 : 0;
      break;
    }
    case "max_level":
      current = snapshot.level >= target ? target : snapshot.level;
      break;
  }

  return { current, target, met: current >= target };
}

// ─── Check All Achievements ───────────────────────────────────────────────────

export interface CheckResult {
  newState:       AchievementState;
  newlyUnlocked:  string[];
}

export function checkAchievements(
  achState: AchievementState,
  snapshot: GameSnapshot
): CheckResult {
  const newProgress: AchievementProgressMap = { ...achState.progress };
  const newlyUnlocked: string[] = [];
  let totalAchXP = achState.totalAchXP;
  let totalCoins = achState.totalCoins;

  // Check non-collector achievements first
  for (const ach of ACHIEVEMENTS) {
    if (ach.id === "the_collector") continue;
    const prog = newProgress[ach.id];
    if (prog?.unlocked) continue;

    const { current, target, met } = evaluateAchievement(ach.id, snapshot, { ...achState, progress: newProgress });
    newProgress[ach.id] = { ...prog, current: Math.min(current, target), target };

    if (met) {
      newProgress[ach.id] = { ...newProgress[ach.id], unlocked: true, unlockedAt: Date.now() };
      totalAchXP += ach.xpReward;
      totalCoins  += ach.coinReward;
      newlyUnlocked.push(ach.id);
    }
  }

  // Now check the_collector
  const collectorProg = newProgress["the_collector"];
  if (!collectorProg?.unlocked) {
    const { current, target, met } = evaluateAchievement(
      "the_collector",
      snapshot,
      { ...achState, progress: newProgress }
    );
    newProgress["the_collector"] = { ...collectorProg, current: Math.min(current, target), target };
    if (met) {
      const collectorAch = ACHIEVEMENT_MAP["the_collector"];
      newProgress["the_collector"] = { ...newProgress["the_collector"], unlocked: true, unlockedAt: Date.now() };
      totalAchXP += collectorAch.xpReward;
      totalCoins  += collectorAch.coinReward;
      newlyUnlocked.push("the_collector");
    }
  }

  return {
    newState: { progress: newProgress, totalAchXP, totalCoins },
    newlyUnlocked,
  };
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function computeStats(achState: AchievementState): AchievementStats {
  const byRarity = {} as Record<Rarity, { total: number; unlocked: number }>;
  const byCategory = {} as Record<AchievementCategory, { total: number; unlocked: number }>;

  for (const ach of ACHIEVEMENTS) {
    if (!byRarity[ach.rarity]) byRarity[ach.rarity] = { total: 0, unlocked: 0 };
    byRarity[ach.rarity].total++;

    if (!byCategory[ach.category]) byCategory[ach.category] = { total: 0, unlocked: 0 };
    byCategory[ach.category].total++;

    const prog = achState.progress[ach.id];
    if (prog?.unlocked) {
      byRarity[ach.rarity].unlocked++;
      byCategory[ach.category].unlocked++;
    }
  }

  const unlocked = ACHIEVEMENTS.filter((a) => achState.progress[a.id]?.unlocked).length;
  const secret = ACHIEVEMENTS.filter((a) => a.secret).length;
  const secretUnlocked = ACHIEVEMENTS.filter((a) => a.secret && achState.progress[a.id]?.unlocked).length;

  const recentlyUnlocked = ACHIEVEMENTS
    .filter((a) => achState.progress[a.id]?.unlocked)
    .sort((a, b) => (achState.progress[b.id]?.unlockedAt ?? 0) - (achState.progress[a.id]?.unlockedAt ?? 0))
    .slice(0, 5)
    .map((a) => a.id);

  return {
    total: ACHIEVEMENTS.length,
    unlocked,
    secret,
    secretUnlocked,
    completionPct: ACHIEVEMENTS.length > 0 ? Math.round((unlocked / ACHIEVEMENTS.length) * 100) : 0,
    byRarity,
    byCategory,
    recentlyUnlocked,
  };
}
