import { Workout } from "@/lib/types";
import {
  StreakState, StreakMilestone, WeeklyMilestone,
  StreakEvalResult, StreakNotification, StreakNotifType,
} from "@/lib/streak-types";

// ─── Milestone Definitions ────────────────────────────────────────────────────

export const DAILY_MILESTONES: StreakMilestone[] = [
  { days: 1,   xpReward: 10,   coinReward: 0,    label: "First Flame",    icon: "🌱" },
  { days: 3,   xpReward: 20,   coinReward: 0,    label: "3-Day Streak",   icon: "🔥" },
  { days: 7,   xpReward: 50,   coinReward: 50,   label: "7-Day Streak",   icon: "🔥" },
  { days: 14,  xpReward: 100,  coinReward: 0,    label: "14-Day Streak",  icon: "⚡" },
  { days: 30,  xpReward: 250,  coinReward: 200,  label: "30-Day Streak",  icon: "💎" },
  { days: 60,  xpReward: 500,  coinReward: 0,    label: "60-Day Streak",  icon: "👑" },
  { days: 100, xpReward: 1000, coinReward: 1000, label: "100-Day Streak", icon: "🌟" },
  { days: 365, xpReward: 5000, coinReward: 2000, label: "365-Day Streak", icon: "🏆" },
];

export const WEEKLY_MILESTONES: WeeklyMilestone[] = [
  { weeks: 1,  xpReward: 100,  coinReward: 0,   label: "1 Week Warrior",  icon: "⚔️"  },
  { weeks: 4,  xpReward: 250,  coinReward: 100, label: "Monthly Warrior", icon: "🛡️" },
  { weeks: 8,  xpReward: 500,  coinReward: 0,   label: "2-Month Warrior", icon: "🏅" },
  { weeks: 12, xpReward: 1000, coinReward: 500, label: "Quarter Legend",  icon: "👑" },
];

// ─── Consistency Rank ─────────────────────────────────────────────────────────

export interface ConsistencyRankInfo {
  label:     string;
  icon:      string;
  color:     string;
  minStreak: number;
  nextMin:   number | null;
}

export const CONSISTENCY_RANKS: ConsistencyRankInfo[] = [
  { label: "Beginner",   icon: "🌱", color: "text-white/40",    minStreak: 0,   nextMin: 7   },
  { label: "Consistent", icon: "🔥", color: "text-orange-400",  minStreak: 7,   nextMin: 30  },
  { label: "Dedicated",  icon: "⚡", color: "text-yellow-400",  minStreak: 30,  nextMin: 100 },
  { label: "Elite",      icon: "💎", color: "text-sky-400",     minStreak: 100, nextMin: 365 },
  { label: "Legend",     icon: "🏆", color: "text-yellow-300",  minStreak: 365, nextMin: null },
];

export function getConsistencyRank(longestStreak: number): ConsistencyRankInfo {
  let result = CONSISTENCY_RANKS[0];
  for (const rank of CONSISTENCY_RANKS) {
    if (longestStreak >= rank.minStreak) result = rank;
  }
  return result;
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

export function getTodayKey(): string {
  const d = new Date();
  return fmtDate(d);
}

export function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return fmtDate(d);
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** ISO 8601 week key: "YYYY-Www" */
export function getWeekKey(date?: Date): string {
  const d = date ? new Date(date) : new Date();
  // Copy date so don't modify original
  const target = new Date(d.valueOf());
  // ISO week: Thursday of this week's year
  const dayNr = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const week = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return `${d.getFullYear()}-W${pad(week)}`;
}

/** Days between two "YYYY-MM-DD" keys (b - a) */
function diffDays(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

// ─── Workout Counters ─────────────────────────────────────────────────────────

function dateKeyOf(ts: number): string {
  return fmtDate(new Date(ts));
}

function countTodayWorkouts(workouts: Workout[]): number {
  const today = getTodayKey();
  return workouts.filter((w) => dateKeyOf(w.timestamp) === today).length;
}

function countWeekWorkouts(workouts: Workout[], weekKey: string): number {
  return workouts.filter((w) => getWeekKey(new Date(w.timestamp)) === weekKey).length;
}

// ─── Notification Builders ────────────────────────────────────────────────────

let _notifSeq = 0;
function makeNotif(
  type: StreakNotifType,
  title: string,
  message: string,
  icon: string,
  extras?: { xpReward?: number; coinReward?: number; streakDay?: number },
): StreakNotification {
  return {
    id: `streak-${Date.now()}-${++_notifSeq}`,
    type, title, message, icon,
    timestamp: Date.now(),
    ...extras,
  };
}

// ─── Core Evaluator ───────────────────────────────────────────────────────────

/**
 * Evaluate streak state against the current workout list.
 * Should be called:
 *   1. On app load (to detect freeze events or broken streaks)
 *   2. After every workout is logged
 */
export function evaluateStreak(
  state: StreakState,
  workouts: Workout[],
): StreakEvalResult {
  // Deep-clone to avoid mutation
  const newState: StreakState = JSON.parse(JSON.stringify(state));
  const notifications: StreakNotification[] = [];
  let totalXP    = 0;
  let totalCoins = 0;

  const today     = getTodayKey();
  const yesterday = getYesterdayKey();
  const weekKey   = getWeekKey();
  const todayCount = countTodayWorkouts(workouts);

  // ── 1. Daily Streak ──────────────────────────────────────────────────────

  const { daily } = newState;

  if (daily.lastDate === today) {
    // Already processed today — nothing to do for daily streak progression
  } else if (daily.lastDate === null) {
    // First-ever evaluation
    if (todayCount > 0) {
      daily.current  = 1;
      daily.longest  = 1;
      daily.lastDate = today;
      notifications.push(makeNotif(
        "streak_started",
        "Streak Started! 🌱",
        "Day 1 — every legend starts somewhere.",
        "🌱",
        { streakDay: 1 },
      ));
    }
  } else {
    const gapDays = diffDays(daily.lastDate, today);

    if (gapDays === 1) {
      // Consecutive day — increment if workout today
      if (todayCount > 0) {
        daily.current++;
        daily.longest  = Math.max(daily.longest, daily.current);
        daily.lastDate = today;
        notifications.push(makeNotif(
          "streak_increased",
          `${daily.current}-Day Streak! 🔥`,
          `Keep the flame alive. ${daily.current} days straight.`,
          "🔥",
          { streakDay: daily.current },
        ));
      }
      // No workout today yet — streak is "pending", nothing to do
    } else if (gapDays === 2 && newState.freezesAvailable > 0) {
      // Missed exactly one day — auto-activate freeze
      newState.freezesAvailable--;
      newState.freezesUsed++;
      // Bridge the gap: treat yesterday as credited so today's workout increments normally
      daily.lastDate = yesterday;
      notifications.push(makeNotif(
        "freeze_used",
        "Streak Freeze Used! 🧊",
        `Your ${daily.current}-day streak is protected. Don't miss today!`,
        "🧊",
        { streakDay: daily.current },
      ));
      // Now process today if there's a workout
      if (todayCount > 0) {
        daily.current++;
        daily.longest  = Math.max(daily.longest, daily.current);
        daily.lastDate = today;
        notifications.push(makeNotif(
          "streak_increased",
          `${daily.current}-Day Streak! 🔥`,
          `Freeze saved your streak. Keep going!`,
          "🔥",
          { streakDay: daily.current },
        ));
      }
    } else if (gapDays >= 2 && todayCount > 0) {
      // Streak broken — start fresh
      if (daily.current > 1) {
        notifications.push(makeNotif(
          "streak_broken",
          "Streak Broken 💔",
          `${daily.current}-day streak lost. Build it back — day 1 starts now.`,
          "💔",
          { streakDay: daily.current },
        ));
      }
      daily.current  = 1;
      daily.longest  = Math.max(daily.longest, 1);
      daily.lastDate = today;
      notifications.push(makeNotif(
        "streak_started",
        "New Streak Started! 🌱",
        "Day 1 again — consistency is forged in the restart.",
        "🌱",
        { streakDay: 1 },
      ));
    }
    // gapDays >= 2, no workout today, no freeze: streak is broken but we wait until they log
  }

  // ── 2. Daily Milestone Rewards ────────────────────────────────────────────

  for (const ms of DAILY_MILESTONES) {
    if (daily.current >= ms.days && !daily.claimedDays.includes(ms.days)) {
      daily.claimedDays.push(ms.days);
      totalXP    += ms.xpReward;
      totalCoins += ms.coinReward;
      notifications.push(makeNotif(
        "milestone_reached",
        `${ms.label}! ${ms.icon}`,
        `+${ms.xpReward} XP${ms.coinReward > 0 ? ` · +${ms.coinReward} 🪙` : ""} — ${ms.days} day milestone reached!`,
        ms.icon,
        { xpReward: ms.xpReward, coinReward: ms.coinReward, streakDay: ms.days },
      ));
    }
  }

  // ── 3. Total Days ─────────────────────────────────────────────────────────
  // Track total unique days with a workout (for stats)
  const uniqueDays = new Set(workouts.map((w) => dateKeyOf(w.timestamp)));
  newState.totalDaysWorkedOut = uniqueDays.size;

  // ── 4. Weekly Streak ──────────────────────────────────────────────────────

  const { weekly } = newState;
  const thisWeekCount = countWeekWorkouts(workouts, weekKey);

  if (weekly.currentWeekKey === "") {
    // First-ever load
    weekly.currentWeekKey      = weekKey;
    weekly.currentWeekWorkouts = thisWeekCount;
  } else if (weekly.currentWeekKey !== weekKey) {
    // New week just started — check if PREVIOUS week qualified (3+ workouts)
    if (weekly.currentWeekWorkouts >= 3) {
      weekly.current++;
      weekly.longest = Math.max(weekly.longest, weekly.current);
      notifications.push(makeNotif(
        "weekly_increased",
        `${weekly.current}-Week Streak! ⚔️`,
        `${weekly.current} weeks of 3+ workouts each. You're building real consistency.`,
        "⚔️",
        { streakDay: weekly.current },
      ));

      // Weekly milestones
      for (const ms of WEEKLY_MILESTONES) {
        if (weekly.current >= ms.weeks && !weekly.claimedWeeks.includes(ms.weeks)) {
          weekly.claimedWeeks.push(ms.weeks);
          totalXP    += ms.xpReward;
          totalCoins += ms.coinReward;
          notifications.push(makeNotif(
            "weekly_milestone_reached",
            `${ms.label}! ${ms.icon}`,
            `+${ms.xpReward} XP${ms.coinReward > 0 ? ` · +${ms.coinReward} 🪙` : ""} — ${ms.weeks} week milestone!`,
            ms.icon,
            { xpReward: ms.xpReward, coinReward: ms.coinReward, streakDay: ms.weeks },
          ));
        }
      }
    } else if (weekly.currentWeekWorkouts > 0) {
      // Had workouts but not enough — reset
      weekly.current = 0;
    }
    // Roll over to new week
    weekly.currentWeekKey      = weekKey;
    weekly.currentWeekWorkouts = thisWeekCount;
  } else {
    // Same week — just update count
    weekly.currentWeekWorkouts = thisWeekCount;
  }

  newState.daily  = daily;
  newState.weekly = weekly;

  return { newState, totalXP, totalCoins, notifications };
}

/** How many workouts needed this week to maintain the weekly streak */
export function weeklyWorkoutsNeeded(state: StreakState): number {
  return Math.max(0, 3 - state.weekly.currentWeekWorkouts);
}

/** Next daily milestone the user hasn't hit yet */
export function nextDailyMilestone(state: StreakState): StreakMilestone | null {
  const current = state.daily.current;
  return DAILY_MILESTONES.find((m) => m.days > current) ?? null;
}

/** Next weekly milestone the user hasn't hit yet */
export function nextWeeklyMilestone(state: StreakState): WeeklyMilestone | null {
  const current = state.weekly.current;
  return WEEKLY_MILESTONES.find((m) => m.weeks > current) ?? null;
}
