import { Workout } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dayKey(ts: number): number {
  return Math.floor(ts / 86_400_000);
}

function uniqueSortedDays(workouts: Workout[], desc = true): number[] {
  const seen: Record<number, boolean> = {};
  const days: number[] = [];
  for (const w of workouts) {
    const d = dayKey(w.timestamp);
    if (!seen[d]) { seen[d] = true; days.push(d); }
  }
  return desc ? days.sort((a, b) => b - a) : days.sort((a, b) => a - b);
}

// ─── Streaks ──────────────────────────────────────────────────────────────────

export function calcCurrentStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;
  const todayKey = dayKey(Date.now());
  const days = uniqueSortedDays(workouts, true);
  if (days[0] < todayKey - 1) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i - 1] - days[i] === 1) streak++;
    else break;
  }
  return streak;
}

export function calcLongestStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;
  const days = uniqueSortedDays(workouts, false);
  if (days.length === 0) return 0;
  let longest = 1, current = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i] - days[i - 1] === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}

// ─── Daily / Weekly ───────────────────────────────────────────────────────────

export function calcTodayStats(workouts: Workout[]): { xp: number; count: number } {
  const today = dayKey(Date.now());
  const list  = workouts.filter((w) => dayKey(w.timestamp) === today);
  return { xp: list.reduce((s, w) => s + w.xpEarned, 0), count: list.length };
}

export function calcWeekStats(workouts: Workout[]): { xp: number; count: number } {
  const cutoff = Date.now() - 7 * 86_400_000;
  const list   = workouts.filter((w) => w.timestamp >= cutoff);
  return { xp: list.reduce((s, w) => s + w.xpEarned, 0), count: list.length };
}

// Returns an array of the last 7 days (Mon→Sun order), each with a workout flag
export function calcWeekDots(workouts: Workout[]): { label: string; hasWorkout: boolean; isToday: boolean }[] {
  const today = dayKey(Date.now());
  // Find the Monday of the current week
  const todayDate  = new Date(Date.now());
  const dowOffset  = (todayDate.getDay() + 6) % 7; // 0=Mon … 6=Sun
  const mondayKey  = today - dowOffset;

  const workedSet: Record<number, boolean> = {};
  for (const w of workouts) workedSet[dayKey(w.timestamp)] = true;

  const LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  return LABELS.map((label, i) => {
    const k = mondayKey + i;
    return { label, hasWorkout: !!workedSet[k], isToday: k === today };
  });
}

// ─── Personal Records ─────────────────────────────────────────────────────────

export interface PersonalRecords {
  maxPushUpReps:  number;
  maxPullUpReps:  number;
  maxDipReps:     number;
  highestDayXP:   number;
  highestWeekXP:  number;
  longestStreak:  number;
  totalPushUps:   number;
  totalPullUps:   number;
  totalDips:      number;
}

export function calcPersonalRecords(workouts: Workout[]): PersonalRecords {
  let maxPushUpReps = 0, maxPullUpReps = 0, maxDipReps = 0;
  let totalPushUps  = 0, totalPullUps  = 0, totalDips  = 0;
  const xpByDay: Record<number, number>  = {};
  const xpByWeek: Record<number, number> = {};

  for (const w of workouts) {
    if (w.skillName === "push-ups") { maxPushUpReps = Math.max(maxPushUpReps, w.reps); totalPushUps += w.reps; }
    if (w.skillName === "pull-ups") { maxPullUpReps = Math.max(maxPullUpReps, w.reps); totalPullUps += w.reps; }
    if (w.skillName === "dips")     { maxDipReps    = Math.max(maxDipReps,    w.reps); totalDips    += w.reps; }

    const d  = dayKey(w.timestamp);
    const wk = Math.floor(w.timestamp / (7 * 86_400_000));
    xpByDay[d]   = (xpByDay[d]   ?? 0) + w.xpEarned;
    xpByWeek[wk] = (xpByWeek[wk] ?? 0) + w.xpEarned;
  }

  const highestDayXP  = Object.values(xpByDay).reduce( (m, v) => Math.max(m, v), 0);
  const highestWeekXP = Object.values(xpByWeek).reduce((m, v) => Math.max(m, v), 0);

  return {
    maxPushUpReps, maxPullUpReps, maxDipReps,
    highestDayXP, highestWeekXP,
    longestStreak: calcLongestStreak(workouts),
    totalPushUps, totalPullUps, totalDips,
  };
}
