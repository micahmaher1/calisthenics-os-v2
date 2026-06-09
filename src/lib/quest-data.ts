import { QuestTemplate } from "./quest-types";

// ─── Daily Quest Pool ─────────────────────────────────────────────────────────

export const DAILY_QUEST_POOL: QuestTemplate[] = [
  {
    id: "d_workout_1", title: "First Rep", description: "Complete at least 1 workout today.",
    category: "training", rarity: "common", type: "workout_count_today", target: 1,
    rewardXP: 30, rewardCoins: 15, isWeekly: false,
  },
  {
    id: "d_workout_2", title: "Double Session", description: "Complete 2 workouts in a single day.",
    category: "training", rarity: "uncommon", type: "workout_count_today", target: 2,
    rewardXP: 60, rewardCoins: 30, isWeekly: false,
  },
  {
    id: "d_workout_3", title: "Triple Threat", description: "Complete 3 workouts today.",
    category: "training", rarity: "rare", type: "workout_count_today", target: 3,
    rewardXP: 120, rewardCoins: 60, isWeekly: false,
  },
  {
    id: "d_xp_100", title: "XP Grind", description: "Earn 100 XP today.",
    category: "xp", rarity: "common", type: "earn_xp_today", target: 100,
    rewardXP: 25, rewardCoins: 15, isWeekly: false,
  },
  {
    id: "d_xp_200", title: "XP Rush", description: "Earn 200 XP in a single day.",
    category: "xp", rarity: "uncommon", type: "earn_xp_today", target: 200,
    rewardXP: 50, rewardCoins: 25, isWeekly: false,
  },
  {
    id: "d_xp_500", title: "XP Surge", description: "Earn 500 XP today.",
    category: "xp", rarity: "rare", type: "earn_xp_today", target: 500,
    rewardXP: 100, rewardCoins: 50, isWeekly: false,
  },
  {
    id: "d_pushup_30", title: "Push-Up Warm-Up", description: "Log 30 push-up reps today.",
    category: "training", rarity: "common", type: "push_up_reps_today", target: 30,
    rewardXP: 35, rewardCoins: 18, isWeekly: false,
  },
  {
    id: "d_pushup_75", title: "Push-Up Set", description: "Log 75 push-up reps today.",
    category: "training", rarity: "uncommon", type: "push_up_reps_today", target: 75,
    rewardXP: 70, rewardCoins: 35, isWeekly: false,
  },
  {
    id: "d_pushup_150", title: "Push-Up Century", description: "Log 150 push-up reps today.",
    category: "training", rarity: "rare", type: "push_up_reps_today", target: 150,
    rewardXP: 130, rewardCoins: 65, isWeekly: false,
  },
  {
    id: "d_pullup_15", title: "Pull-Up Starter", description: "Log 15 pull-up reps today.",
    category: "training", rarity: "common", type: "pull_up_reps_today", target: 15,
    rewardXP: 35, rewardCoins: 18, isWeekly: false,
  },
  {
    id: "d_pullup_40", title: "Pull-Up Grind", description: "Log 40 pull-up reps today.",
    category: "training", rarity: "uncommon", type: "pull_up_reps_today", target: 40,
    rewardXP: 70, rewardCoins: 35, isWeekly: false,
  },
  {
    id: "d_dip_20", title: "Dip Session", description: "Log 20 dip reps today.",
    category: "training", rarity: "common", type: "dip_reps_today", target: 20,
    rewardXP: 35, rewardCoins: 18, isWeekly: false,
  },
  {
    id: "d_dip_50", title: "Dip Mastery", description: "Log 50 dip reps today.",
    category: "training", rarity: "uncommon", type: "dip_reps_today", target: 50,
    rewardXP: 70, rewardCoins: 35, isWeekly: false,
  },
  {
    id: "d_streak_2", title: "Back to Back", description: "Maintain a 2-day workout streak.",
    category: "streaks", rarity: "common", type: "streak_days", target: 2,
    rewardXP: 40, rewardCoins: 20, isWeekly: false,
  },
  {
    id: "d_streak_3", title: "Three-Peat", description: "Maintain a 3-day workout streak.",
    category: "streaks", rarity: "uncommon", type: "streak_days", target: 3,
    rewardXP: 75, rewardCoins: 40, isWeekly: false,
  },
  {
    id: "d_streak_7", title: "Week Warrior", description: "Hit a 7-day workout streak.",
    category: "streaks", rarity: "epic", type: "streak_days", target: 7,
    rewardXP: 250, rewardCoins: 125, isWeekly: false,
  },
  {
    id: "d_skill_1", title: "Skill Hunter", description: "Unlock at least 1 new skill in the Skill Tree.",
    category: "skill_tree", rarity: "uncommon", type: "skill_unlock_week", target: 1,
    rewardXP: 60, rewardCoins: 30, isWeekly: false,
  },
  {
    id: "d_pushup_epic", title: "Push-Up Blitz", description: "Log 300 push-up reps in one day.",
    category: "training", rarity: "epic", type: "push_up_reps_today", target: 300,
    rewardXP: 200, rewardCoins: 100, isWeekly: false,
  },
  {
    id: "d_xp_legendary", title: "XP Legend", description: "Earn 1,000 XP in a single day.",
    category: "xp", rarity: "legendary", type: "earn_xp_today", target: 1000,
    rewardXP: 500, rewardCoins: 250, isWeekly: false,
  },
  {
    id: "d_total_10", title: "Veteran", description: "Reach 10 total workouts logged.",
    category: "progression", rarity: "common", type: "total_workouts", target: 10,
    rewardXP: 50, rewardCoins: 25, isWeekly: false,
  },
  {
    id: "d_total_25", title: "Grizzled", description: "Reach 25 total workouts.",
    category: "progression", rarity: "uncommon", type: "total_workouts", target: 25,
    rewardXP: 100, rewardCoins: 50, isWeekly: false,
  },
];

// ─── Weekly Quest Pool ────────────────────────────────────────────────────────

export const WEEKLY_QUEST_POOL: QuestTemplate[] = [
  {
    id: "w_workout_4", title: "Weekly Grind", description: "Complete 4 workouts this week.",
    category: "training", rarity: "common", type: "workout_count_week", target: 4,
    rewardXP: 100, rewardCoins: 60, isWeekly: true,
  },
  {
    id: "w_workout_7", title: "Full Week", description: "Complete 7 workouts this week.",
    category: "training", rarity: "rare", type: "workout_count_week", target: 7,
    rewardXP: 300, rewardCoins: 150, isWeekly: true,
  },
  {
    id: "w_workout_10", title: "Overachiever", description: "Complete 10 workouts this week.",
    category: "training", rarity: "epic", type: "workout_count_week", target: 10,
    rewardXP: 600, rewardCoins: 300, isWeekly: true,
  },
  {
    id: "w_xp_500", title: "XP Collector", description: "Earn 500 XP this week.",
    category: "xp", rarity: "common", type: "earn_xp_week", target: 500,
    rewardXP: 100, rewardCoins: 60, isWeekly: true,
  },
  {
    id: "w_xp_1000", title: "XP Hunter", description: "Earn 1,000 XP this week.",
    category: "xp", rarity: "uncommon", type: "earn_xp_week", target: 1000,
    rewardXP: 200, rewardCoins: 100, isWeekly: true,
  },
  {
    id: "w_xp_2500", title: "XP Dominator", description: "Earn 2,500 XP this week.",
    category: "xp", rarity: "rare", type: "earn_xp_week", target: 2500,
    rewardXP: 400, rewardCoins: 200, isWeekly: true,
  },
  {
    id: "w_xp_5000", title: "XP Legend", description: "Earn 5,000 XP this week.",
    category: "xp", rarity: "legendary", type: "earn_xp_week", target: 5000,
    rewardXP: 1000, rewardCoins: 500, isWeekly: true,
  },
  {
    id: "w_pushup_200", title: "Push-Up Week", description: "Log 200 push-up reps this week.",
    category: "training", rarity: "uncommon", type: "push_up_reps_week", target: 200,
    rewardXP: 200, rewardCoins: 100, isWeekly: true,
  },
  {
    id: "w_pushup_500", title: "Push-Up Machine", description: "Log 500 push-up reps this week.",
    category: "training", rarity: "rare", type: "push_up_reps_week", target: 500,
    rewardXP: 400, rewardCoins: 200, isWeekly: true,
  },
  {
    id: "w_pullup_100", title: "Pull-Up Week", description: "Log 100 pull-up reps this week.",
    category: "training", rarity: "uncommon", type: "pull_up_reps_week", target: 100,
    rewardXP: 200, rewardCoins: 100, isWeekly: true,
  },
  {
    id: "w_pullup_250", title: "Pull-Up Crusher", description: "Log 250 pull-up reps this week.",
    category: "training", rarity: "rare", type: "pull_up_reps_week", target: 250,
    rewardXP: 400, rewardCoins: 200, isWeekly: true,
  },
  {
    id: "w_dip_100", title: "Dip Week", description: "Log 100 dip reps this week.",
    category: "training", rarity: "uncommon", type: "dip_reps_week", target: 100,
    rewardXP: 200, rewardCoins: 100, isWeekly: true,
  },
  {
    id: "w_streak_5", title: "5-Day Streak", description: "Maintain a 5-day workout streak.",
    category: "streaks", rarity: "uncommon", type: "streak_days", target: 5,
    rewardXP: 250, rewardCoins: 125, isWeekly: true,
  },
  {
    id: "w_streak_7", title: "Perfect Week Streak", description: "Maintain a 7-day workout streak.",
    category: "streaks", rarity: "epic", type: "streak_days", target: 7,
    rewardXP: 500, rewardCoins: 250, isWeekly: true,
  },
  {
    id: "w_streak_14", title: "Two-Week Warrior", description: "Hit a 14-day workout streak.",
    category: "streaks", rarity: "legendary", type: "streak_days", target: 14,
    rewardXP: 1000, rewardCoins: 500, isWeekly: true,
  },
  {
    id: "w_skills_2", title: "Skill Seeker", description: "Unlock 2 new skills in the Skill Tree this week.",
    category: "skill_tree", rarity: "uncommon", type: "skill_unlock_week", target: 2,
    rewardXP: 200, rewardCoins: 100, isWeekly: true,
  },
  {
    id: "w_skills_5", title: "Skill Collector", description: "Unlock 5 new skills this week.",
    category: "skill_tree", rarity: "rare", type: "skill_unlock_week", target: 5,
    rewardXP: 400, rewardCoins: 200, isWeekly: true,
  },
  {
    id: "w_level_up", title: "Level Up!", description: "Reach a new overall level this week.",
    category: "progression", rarity: "rare", type: "reach_level", target: 0,
    rewardXP: 300, rewardCoins: 150, isWeekly: true,
  },
  {
    id: "w_total_50", title: "Half Century", description: "Reach 50 total workouts logged.",
    category: "progression", rarity: "rare", type: "total_workouts", target: 50,
    rewardXP: 300, rewardCoins: 150, isWeekly: true,
  },
  {
    id: "w_total_100", title: "Centurion", description: "Reach 100 total workouts.",
    category: "progression", rarity: "epic", type: "total_workouts", target: 100,
    rewardXP: 600, rewardCoins: 300, isWeekly: true,
  },
];

// ─── Bonus Rewards ────────────────────────────────────────────────────────────

export const DAILY_BONUS_XP    = 75;
export const DAILY_BONUS_COINS = 40;
export const WEEKLY_BONUS_XP    = 300;
export const WEEKLY_BONUS_COINS = 150;
