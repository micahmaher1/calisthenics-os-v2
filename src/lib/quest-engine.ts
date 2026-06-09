import { AppState, Workout } from "./types";
import { SkillTreeState } from "./skilltree-types";
import { getTotalCompleted } from "./skilltree-engine";
import {
  QuestState, QuestSlotState, ActiveQuest, QuestStreak, QuestStats, QuestCompletionResult,
} from "./quest-types";
import {
  DAILY_QUEST_POOL, WEEKLY_QUEST_POOL,
  DAILY_BONUS_XP, DAILY_BONUS_COINS,
  WEEKLY_BONUS_XP, WEEKLY_BONUS_COINS,
} from "./quest-data";

// ─── Date Keys ────────────────────────────────────────────────────────────────

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function thisWeekKey(): string {
  const d   = new Date();
  const jan4 = new Date(d.getFullYear(), 0, 4);
  const week = Math.ceil(((d.getTime() - jan4.getTime()) / 86_400_000 + jan4.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function seededHash(str: string, salt: number): number {
  let h = salt;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

// ─── Quest Generation ─────────────────────────────────────────────────────────

function pickQuests(pool: typeof DAILY_QUEST_POOL, count: number, key: string): ActiveQuest[] {
  const used: Record<number, boolean> = {};
  const result: ActiveQuest[] = [];

  let attempt = 0;
  while (result.length < count && attempt < 1000) {
    const idx = seededHash(key, attempt + 1) % pool.length;
    if (!used[idx]) {
      used[idx] = true;
      const t = pool[idx];
      result.push({
        templateId:  t.id,
        title:       t.title,
        description: t.description,
        category:    t.category,
        rarity:      t.rarity,
        type:        t.type,
        target:      t.target,
        progress:    0,
        completed:   false,
        rewarded:    false,
        rewardXP:    t.rewardXP,
        rewardCoins: t.rewardCoins,
        isWeekly:    t.isWeekly,
      });
    }
    attempt++;
  }
  return result;
}

// ─── Default State ────────────────────────────────────────────────────────────

export function buildDefaultQuestState(): QuestState {
  const dk = todayKey();
  const wk = thisWeekKey();
  return {
    daily: {
      dateKey:      dk,
      quests:       pickQuests(DAILY_QUEST_POOL, 3, dk),
      bonusClaimed: false,
    },
    weekly: {
      dateKey:      wk,
      quests:       pickQuests(WEEKLY_QUEST_POOL, 3, wk),
      bonusClaimed: false,
    },
    streak: { current: 0, longest: 0, lastCompletedDate: null },
    stats:  { totalCompleted: 0, dailyCompleted: 0, weeklyCompleted: 0, totalXPEarned: 0, totalCoinsEarned: 0, perfectDays: 0, perfectWeeks: 0 },
  };
}

// ─── Refresh (if day/week changed) ───────────────────────────────────────────

function refreshIfNeeded(state: QuestState): QuestState {
  const dk = todayKey();
  const wk = thisWeekKey();

  let daily  = state.daily;
  let weekly = state.weekly;

  if (daily.dateKey !== dk) {
    // Update quest streak before resetting
    const allDone = daily.quests.every((q) => q.completed);
    let streak = state.streak;
    if (allDone) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
      const wasYesterday = state.streak.lastCompletedDate === yKey || state.streak.lastCompletedDate === daily.dateKey;
      const newCurrent = wasYesterday ? state.streak.current + 1 : 1;
      streak = {
        current:           newCurrent,
        longest:           Math.max(state.streak.longest, newCurrent),
        lastCompletedDate: daily.dateKey,
      };
    } else if (state.streak.lastCompletedDate !== null) {
      // Missed a day — break streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
      if (state.streak.lastCompletedDate !== yKey) {
        streak = { ...state.streak, current: 0 };
      }
    }

    daily = { dateKey: dk, quests: pickQuests(DAILY_QUEST_POOL, 3, dk), bonusClaimed: false };
    state = { ...state, streak };
  }

  if (weekly.dateKey !== wk) {
    weekly = { dateKey: wk, quests: pickQuests(WEEKLY_QUEST_POOL, 3, wk), bonusClaimed: false };
  }

  return { ...state, daily, weekly };
}

// ─── Snapshot for Progress Evaluation ────────────────────────────────────────

interface QuestSnapshot {
  workoutsToday:   number;
  workoutsThisWeek:number;
  xpToday:         number;
  xpThisWeek:      number;
  pushUpsToday:    number;
  pushUpsWeek:     number;
  pullUpsToday:    number;
  pullUpsWeek:     number;
  dipsToday:       number;
  dipsWeek:        number;
  currentStreak:   number;
  totalWorkouts:   number;
  currentLevel:    number;
  skillsUnlockedWeek: number;
  skillsUnlockedTotal: number;
}

function dayKey(ts: number): number { return Math.floor(ts / 86_400_000); }

function buildQuestSnapshot(appState: AppState, treeState: SkillTreeState, prevLevel: number): QuestSnapshot {
  const today     = dayKey(Date.now());
  const weekStart = today - new Date().getDay();

  let workoutsToday    = 0, workoutsThisWeek = 0;
  let xpToday          = 0, xpThisWeek       = 0;
  let pushUpsToday     = 0, pushUpsWeek       = 0;
  let pullUpsToday     = 0, pullUpsWeek       = 0;
  let dipsToday        = 0, dipsWeek          = 0;

  for (const w of appState.workouts) {
    const d  = dayKey(w.timestamp);
    const wk = Math.floor(w.timestamp / (7 * 86_400_000));
    const thisWeekNum = Math.floor(Date.now() / (7 * 86_400_000));

    if (d === today)             { workoutsToday++;  xpToday   += w.xpEarned; }
    if (wk === thisWeekNum)      { workoutsThisWeek++; xpThisWeek += w.xpEarned; }

    if (d === today) {
      if (w.skillName === "push-ups") pushUpsToday += w.reps;
      if (w.skillName === "pull-ups") pullUpsToday += w.reps;
      if (w.skillName === "dips")     dipsToday    += w.reps;
    }
    if (wk === thisWeekNum) {
      if (w.skillName === "push-ups") pushUpsWeek += w.reps;
      if (w.skillName === "pull-ups") pullUpsWeek += w.reps;
      if (w.skillName === "dips")     dipsWeek    += w.reps;
    }
  }

  // Streak calculation
  let currentStreak = 0;
  if (appState.workouts.length > 0) {
    const todayKey2 = dayKey(Date.now());
    const seen: Record<number, boolean> = {};
    const uniqueDays: number[] = [];
    for (const w of appState.workouts) {
      const d = dayKey(w.timestamp);
      if (!seen[d]) { seen[d] = true; uniqueDays.push(d); }
    }
    uniqueDays.sort((a, b) => b - a);
    if (uniqueDays[0] >= todayKey2 - 1) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDays.length; i++) {
        if (uniqueDays[i - 1] - uniqueDays[i] === 1) currentStreak++;
        else break;
      }
    }
  }

  const skillsUnlockedTotal = getTotalCompleted(treeState.progress);

  // Approximate weekly skill unlocks — we use total since we don't track unlock timestamps
  // This is a reasonable approximation: track using the quest's initial progress vs current
  const skillsUnlockedWeek = skillsUnlockedTotal;

  return {
    workoutsToday, workoutsThisWeek,
    xpToday, xpThisWeek,
    pushUpsToday, pushUpsWeek,
    pullUpsToday, pullUpsWeek,
    dipsToday, dipsWeek,
    currentStreak,
    totalWorkouts: appState.workouts.length,
    currentLevel:  appState.level,
    skillsUnlockedWeek,
    skillsUnlockedTotal,
  };
}

function getProgress(q: ActiveQuest, snap: QuestSnapshot, weekStartSkills: number, weekStartLevel: number): number {
  switch (q.type) {
    case "workout_count_today":  return snap.workoutsToday;
    case "workout_count_week":   return snap.workoutsThisWeek;
    case "earn_xp_today":        return snap.xpToday;
    case "earn_xp_week":         return snap.xpThisWeek;
    case "push_up_reps_today":   return snap.pushUpsToday;
    case "push_up_reps_week":    return snap.pushUpsWeek;
    case "pull_up_reps_today":   return snap.pullUpsToday;
    case "pull_up_reps_week":    return snap.pullUpsWeek;
    case "dip_reps_today":       return snap.dipsToday;
    case "dip_reps_week":        return snap.dipsWeek;
    case "streak_days":          return snap.currentStreak;
    case "skill_unlock_total":   return snap.skillsUnlockedTotal;
    case "skill_unlock_week":    return Math.max(0, snap.skillsUnlockedTotal - weekStartSkills);
    case "reach_level":          return snap.currentLevel > weekStartLevel ? 1 : 0;
    case "total_workouts":       return snap.totalWorkouts;
    default:                     return 0;
  }
}

// ─── Main Evaluation ──────────────────────────────────────────────────────────

export function evaluateQuests(
  questState: QuestState,
  appState:   AppState,
  treeState:  SkillTreeState,
  prevLevel:  number,
  weekStartSkills: number,
  weekStartLevel:  number,
): QuestCompletionResult {
  let state = refreshIfNeeded(questState);
  const snap = buildQuestSnapshot(appState, treeState, prevLevel);

  const newlyCompleted: ActiveQuest[] = [];
  let bonusXP    = 0;
  let bonusCoins = 0;
  let statsXP    = 0;
  let statsCoins = 0;
  let newDailyCompleted  = 0;
  let newWeeklyCompleted = 0;

  // Update daily quests
  const updatedDaily = state.daily.quests.map((q) => {
    const progress = Math.min(q.target, getProgress(q, snap, weekStartSkills, weekStartLevel));
    const justCompleted = !q.completed && progress >= q.target;
    if (justCompleted) {
      newlyCompleted.push({ ...q, progress, completed: true });
      statsXP    += q.rewardXP;
      statsCoins += q.rewardCoins;
      newDailyCompleted++;
    }
    return { ...q, progress, completed: progress >= q.target };
  });

  // Update weekly quests
  const updatedWeekly = state.weekly.quests.map((q) => {
    const progress = Math.min(q.target, getProgress(q, snap, weekStartSkills, weekStartLevel));
    const justCompleted = !q.completed && progress >= q.target;
    if (justCompleted) {
      newlyCompleted.push({ ...q, progress, completed: true });
      statsXP    += q.rewardXP;
      statsCoins += q.rewardCoins;
      newWeeklyCompleted++;
    }
    return { ...q, progress, completed: progress >= q.target };
  });

  // Check daily bonus
  let newDailyBonusClaimed = state.daily.bonusClaimed;
  const allDailyDone = updatedDaily.every((q) => q.completed);
  if (allDailyDone && !state.daily.bonusClaimed) {
    newDailyBonusClaimed = true;
    bonusXP    += DAILY_BONUS_XP;
    bonusCoins += DAILY_BONUS_COINS;
    statsXP    += DAILY_BONUS_XP;
    statsCoins += DAILY_BONUS_COINS;
  }

  // Check weekly bonus
  let newWeeklyBonusClaimed = state.weekly.bonusClaimed;
  const allWeeklyDone = updatedWeekly.every((q) => q.completed);
  if (allWeeklyDone && !state.weekly.bonusClaimed) {
    newWeeklyBonusClaimed = true;
    bonusXP    += WEEKLY_BONUS_XP;
    bonusCoins += WEEKLY_BONUS_COINS;
    statsXP    += WEEKLY_BONUS_XP;
    statsCoins += WEEKLY_BONUS_COINS;
  }

  const newState: QuestState = {
    ...state,
    daily:  { ...state.daily,  quests: updatedDaily,  bonusClaimed: newDailyBonusClaimed },
    weekly: { ...state.weekly, quests: updatedWeekly, bonusClaimed: newWeeklyBonusClaimed },
    stats: {
      ...state.stats,
      totalCompleted:   state.stats.totalCompleted   + newlyCompleted.length,
      dailyCompleted:   state.stats.dailyCompleted   + newDailyCompleted,
      weeklyCompleted:  state.stats.weeklyCompleted  + newWeeklyCompleted,
      totalXPEarned:    state.stats.totalXPEarned    + statsXP,
      totalCoinsEarned: state.stats.totalCoinsEarned + statsCoins,
      perfectDays:      state.stats.perfectDays  + (allDailyDone && !state.daily.bonusClaimed ? 1 : 0),
      perfectWeeks:     state.stats.perfectWeeks + (allWeeklyDone && !state.weekly.bonusClaimed ? 1 : 0),
    },
  };

  return { newState, newlyCompleted, bonusXP, bonusCoins };
}

// ─── Time Remaining Helpers ───────────────────────────────────────────────────

export function timeUntilMidnight(): string {
  const now  = new Date();
  const next = new Date(now);
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  const diff = next.getTime() - now.getTime();
  const h    = Math.floor(diff / 3_600_000);
  const m    = Math.floor((diff % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

export function timeUntilMonday(): string {
  const now  = new Date();
  const day  = now.getDay(); // 0=Sun
  const daysUntilMon = day === 0 ? 1 : 8 - day;
  const next = new Date(now);
  next.setDate(next.getDate() + daysUntilMon);
  next.setHours(0, 0, 0, 0);
  const diff = next.getTime() - now.getTime();
  const d    = Math.floor(diff / 86_400_000);
  const h    = Math.floor((diff % 86_400_000) / 3_600_000);
  if (d > 0) return `${d}d ${h}h`;
  return `${h}h`;
}
