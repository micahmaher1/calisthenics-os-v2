import { StreakState } from "@/lib/streak-types";
import { getWeekKey } from "@/lib/streak-engine";

const KEY = "calisthenics-os:streak:v1";

export function defaultStreakState(): StreakState {
  return {
    daily: {
      current:     0,
      longest:     0,
      lastDate:    null,
      claimedDays: [],
    },
    weekly: {
      current:              0,
      longest:              0,
      currentWeekKey:       getWeekKey(),
      currentWeekWorkouts:  0,
      claimedWeeks:         [],
    },
    freezesAvailable:     0,
    freezesUsed:          0,
    totalDaysWorkedOut:   0,
    pendingNotifications: [],
  };
}

export function loadStreakState(): StreakState {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (!raw) return defaultStreakState();
    const parsed = JSON.parse(raw) as Partial<StreakState>;
    const def    = defaultStreakState();
    // Back-fill any missing fields
    return {
      daily: {
        current:     parsed.daily?.current     ?? 0,
        longest:     parsed.daily?.longest     ?? 0,
        lastDate:    parsed.daily?.lastDate     ?? null,
        claimedDays: parsed.daily?.claimedDays  ?? [],
      },
      weekly: {
        current:              parsed.weekly?.current              ?? 0,
        longest:              parsed.weekly?.longest              ?? 0,
        currentWeekKey:       parsed.weekly?.currentWeekKey       ?? def.weekly.currentWeekKey,
        currentWeekWorkouts:  parsed.weekly?.currentWeekWorkouts  ?? 0,
        claimedWeeks:         parsed.weekly?.claimedWeeks         ?? [],
      },
      freezesAvailable:     parsed.freezesAvailable    ?? 0,
      freezesUsed:          parsed.freezesUsed         ?? 0,
      totalDaysWorkedOut:   parsed.totalDaysWorkedOut  ?? 0,
      pendingNotifications: parsed.pendingNotifications ?? [],
    };
  } catch {
    return defaultStreakState();
  }
}

export function saveStreakState(state: StreakState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}
