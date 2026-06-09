import { Workout } from "./types";
import { getRankInfo, RANK_TABLE, RankInfo } from "./xp";

// ─── Level Rewards ────────────────────────────────────────────────────────────

export type RewardType = "coins" | "badge" | "title" | "cosmetic" | "bonus";

export interface LevelReward {
  level:  number;
  icon:   string;
  title:  string;
  desc:   string;
  coins:  number;
  type:   RewardType;
}

export const LEVEL_REWARDS: LevelReward[] = [
  { level: 5,   icon: "💰", title: "Coin Bonus",       desc: "500 coins for reaching Level 5",               coins: 500,  type: "coins"    },
  { level: 10,  icon: "🥉", title: "Bronze Badge",     desc: "Veteran Trainee — Earned at Level 10",          coins: 200,  type: "badge"    },
  { level: 15,  icon: "💰", title: "Coin Drop",        desc: "750 coins for reaching Level 15",               coins: 750,  type: "coins"    },
  { level: 20,  icon: "🥈", title: "Silver Badge",     desc: "Proven Athlete — Earned at Level 20",           coins: 300,  type: "badge"    },
  { level: 25,  icon: "💰", title: "Big Coin Bonus",   desc: "1,000 coins for reaching Level 25",             coins: 1000, type: "coins"    },
  { level: 30,  icon: "🏷️",  title: "Gold Title",      desc: "Advanced Practitioner — Earned at Level 30",    coins: 400,  type: "title"    },
  { level: 35,  icon: "💰", title: "Elite Drop",       desc: "1,500 coins for reaching Level 35",             coins: 1500, type: "coins"    },
  { level: 40,  icon: "💎", title: "Platinum Badge",   desc: "Elite Performer — Earned at Level 40",          coins: 500,  type: "badge"    },
  { level: 50,  icon: "⚔️", title: "Master Cosmetic",  desc: "Master Profile Frame — Earned at Level 50",     coins: 2000, type: "cosmetic" },
  { level: 75,  icon: "💎", title: "GM Frame",         desc: "Grandmaster Profile Border — Earned at Level 75", coins: 3000, type: "cosmetic" },
  { level: 100, icon: "👑", title: "Legend Crown",     desc: "The ultimate reward. You are a Legend.",         coins: 5000, type: "cosmetic" },
];

export function getRewardForLevel(level: number): LevelReward | null {
  return LEVEL_REWARDS.find((r) => r.level === level) ?? null;
}

export function getNextReward(currentLevel: number): LevelReward | null {
  return LEVEL_REWARDS.find((r) => r.level > currentLevel) ?? null;
}

// ─── Rank Progress ────────────────────────────────────────────────────────────

export interface RankProgress {
  current:     RankInfo;
  next:        RankInfo | null;
  pct:         number;
  levelsLeft:  number;
  levelInRank: number;
  rankSize:    number;
}

export function calcRankProgress(level: number): RankProgress {
  const current          = getRankInfo(level);
  const nextMinLevel     = current.nextLevel;

  if (!nextMinLevel) {
    return { current, next: null, pct: 100, levelsLeft: 0, levelInRank: 0, rankSize: 0 };
  }

  const next       = getRankInfo(nextMinLevel);
  const rankSize   = nextMinLevel - current.minLevel;
  const levelInRank = level - current.minLevel;
  const pct        = Math.min(100, Math.round((levelInRank / rankSize) * 100));
  const levelsLeft = nextMinLevel - level;

  return { current, next, pct, levelsLeft, levelInRank, rankSize };
}

// ─── Progression Insights ────────────────────────────────────────────────────

export interface ProgressionInsights {
  monthXP:            number;
  monthWorkouts:      number;
  avgDailyXP:         number;
  daysToNextLevel:    number | null;
  nextReward:         LevelReward | null;
  levelsToNextReward: number | null;
  levelsToNextRank:   number;
  allRanks:           RankInfo[];
}

export function calcProgressionInsights(
  workouts: Workout[],
  level:    number,
  xpToNext: number,
): ProgressionInsights {
  const now      = Date.now();
  const month30  = now - 30 * 86_400_000;
  const monthWks = workouts.filter((w) => w.timestamp >= month30);

  const monthXP       = monthWks.reduce((s, w) => s + w.xpEarned, 0);
  const monthWorkouts = monthWks.length;

  // Average daily XP over the last 30 days (or all time if fewer)
  const activeDays    = 30;
  const avgDailyXP    = Math.round(monthXP / activeDays);

  const daysToNextLevel = avgDailyXP > 0 ? Math.ceil(xpToNext / avgDailyXP) : null;

  const nextReward         = getNextReward(level);
  const levelsToNextReward = nextReward ? nextReward.level - level : null;

  const rankProg       = calcRankProgress(level);
  const levelsToNextRank = rankProg.levelsLeft;

  return {
    monthXP,
    monthWorkouts,
    avgDailyXP,
    daysToNextLevel,
    nextReward,
    levelsToNextReward,
    levelsToNextRank,
    allRanks: RANK_TABLE,
  };
}

// ─── Milestone levels ─────────────────────────────────────────────────────────

export const MILESTONE_LEVELS = new Set([5, 10, 15, 20, 25, 30, 35, 40, 50, 75, 100]);

export function isMilestoneLevel(level: number): boolean {
  return MILESTONE_LEVELS.has(level);
}
