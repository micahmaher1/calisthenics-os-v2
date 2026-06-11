// ─── Streak Types ─────────────────────────────────────────────────────────────

export type StreakNotifType =
  | "streak_started"
  | "streak_increased"
  | "weekly_increased"
  | "milestone_reached"
  | "weekly_milestone_reached"
  | "freeze_used"
  | "streak_broken";

export interface StreakNotification {
  id:          string;
  type:        StreakNotifType;
  title:       string;
  message:     string;
  icon:        string;
  xpReward?:   number;
  coinReward?: number;
  streakDay?:  number;
  timestamp:   number;
}

// ─── Daily Streak ─────────────────────────────────────────────────────────────

export interface DailyStreak {
  current:     number;
  longest:     number;
  lastDate:    string | null; // "YYYY-MM-DD" — last day streak was credited
  claimedDays: number[];      // milestone day values already claimed
}

// ─── Weekly Streak ────────────────────────────────────────────────────────────

export interface WeeklyStreak {
  current:              number;
  longest:              number;
  currentWeekKey:       string;       // "YYYY-Www"
  currentWeekWorkouts:  number;
  claimedWeeks:         number[];     // milestone week values already claimed
}

// ─── Root Streak State ────────────────────────────────────────────────────────

export interface StreakState {
  daily:               DailyStreak;
  weekly:              WeeklyStreak;
  freezesAvailable:    number;
  freezesUsed:         number;
  totalDaysWorkedOut:  number;
  pendingNotifications: StreakNotification[];
}

// ─── Milestone Definitions ────────────────────────────────────────────────────

export interface StreakMilestone {
  days:       number;
  xpReward:   number;
  coinReward: number;
  label:      string;
  icon:       string;
}

export interface WeeklyMilestone {
  weeks:      number;
  xpReward:   number;
  coinReward: number;
  label:      string;
  icon:       string;
}

// ─── Return value from evaluateStreak ────────────────────────────────────────

export interface StreakEvalResult {
  newState:      StreakState;
  totalXP:       number;
  totalCoins:    number;
  notifications: StreakNotification[];
}
