import { TitleDef, BadgeDef } from "./title-types";

// ─── Titles ───────────────────────────────────────────────────────────────────

export const ALL_TITLES: TitleDef[] = [
  // ── Beginner ──────────────────────────────────────────────────────────────
  {
    id: "rookie", name: "Rookie", description: "Logged your very first workout.",
    category: "beginner", rarity: "common", icon: "🌱",
    requirements: [{ type: "workout_count", value: 1, label: "Log 1 workout" }],
  },
  {
    id: "trainee", name: "Trainee", description: "5 workouts in the books.",
    category: "beginner", rarity: "common", icon: "💪",
    requirements: [{ type: "workout_count", value: 5, label: "Log 5 workouts" }],
  },
  {
    id: "new_challenger", name: "New Challenger", description: "10 workouts and counting.",
    category: "beginner", rarity: "common", icon: "⚡",
    requirements: [{ type: "workout_count", value: 10, label: "Log 10 workouts" }],
  },

  // ── Level ──────────────────────────────────────────────────────────────────
  {
    id: "rising_athlete", name: "Rising Athlete", description: "Reached Level 10.",
    category: "level", rarity: "rare", icon: "📈",
    requirements: [{ type: "level", value: 10, label: "Reach Level 10" }],
  },
  {
    id: "dedicated_athlete", name: "Dedicated Athlete", description: "Reached Level 25.",
    category: "level", rarity: "rare", icon: "🎯",
    requirements: [{ type: "level", value: 25, label: "Reach Level 25" }],
  },
  {
    id: "elite_athlete_title", name: "Elite Athlete", description: "Reached Level 50.",
    category: "level", rarity: "epic", icon: "🔥",
    requirements: [{ type: "level", value: 50, label: "Reach Level 50" }],
  },
  {
    id: "master_athlete", name: "Master Athlete", description: "Reached Level 75.",
    category: "level", rarity: "legendary", icon: "👑",
    requirements: [{ type: "level", value: 75, label: "Reach Level 75" }],
  },
  {
    id: "legend_title", name: "Legend", description: "Reached the pinnacle — Level 100.",
    category: "level", rarity: "mythic", icon: "🌟",
    requirements: [{ type: "level", value: 100, label: "Reach Level 100" }],
  },

  // ── Streak ─────────────────────────────────────────────────────────────────
  {
    id: "consistent", name: "Consistent", description: "7-day training streak.",
    category: "streak", rarity: "rare", icon: "🔥",
    requirements: [{ type: "streak_days", value: 7, label: "7-day streak" }],
  },
  {
    id: "disciplined", name: "Disciplined", description: "30-day training streak.",
    category: "streak", rarity: "epic", icon: "🔥",
    requirements: [{ type: "streak_days", value: 30, label: "30-day streak" }],
  },
  {
    id: "unbreakable", name: "Unbreakable", description: "100-day training streak.",
    category: "streak", rarity: "legendary", icon: "💎",
    requirements: [{ type: "streak_days", value: 100, label: "100-day streak" }],
  },
  {
    id: "consistency_legend", name: "Consistency Legend", description: "365-day training streak.",
    category: "streak", rarity: "mythic", icon: "🌟",
    requirements: [{ type: "streak_days", value: 365, label: "365-day streak" }],
  },

  // ── Strength ───────────────────────────────────────────────────────────────
  {
    id: "pushup_specialist", name: "Push-Up Specialist", description: "Logged 100 total push-up reps.",
    category: "strength", rarity: "rare", icon: "💪",
    requirements: [{ type: "pushup_reps", value: 100, label: "100 push-up reps total" }],
  },
  {
    id: "pullup_specialist", name: "Pull-Up Specialist", description: "Logged 50 total pull-up reps.",
    category: "strength", rarity: "rare", icon: "🧲",
    requirements: [{ type: "pullup_reps", value: 50, label: "50 pull-up reps total" }],
  },
  {
    id: "dip_specialist", name: "Dip Specialist", description: "Logged 75 total dip reps.",
    category: "strength", rarity: "rare", icon: "⚡",
    requirements: [{ type: "dip_reps", value: 75, label: "75 dip reps total" }],
  },
  {
    id: "leg_day_survivor", name: "Leg Day Survivor", description: "Logged 100 total squat reps.",
    category: "strength", rarity: "rare", icon: "🦵",
    requirements: [{ type: "squat_reps", value: 100, label: "100 squat reps total" }],
  },
  {
    id: "century_warrior", name: "Century Warrior", description: "100 total workouts logged.",
    category: "strength", rarity: "epic", icon: "⚔️",
    requirements: [{ type: "workout_count", value: 100, label: "Log 100 workouts" }],
  },

  // ── Skill Tree ─────────────────────────────────────────────────────────────
  {
    id: "balance_adept", name: "Balance Adept", description: "Unlocked 5 skills in the skill tree.",
    category: "skill_tree", rarity: "rare", icon: "🌳",
    requirements: [{ type: "skill_count", value: 5, label: "Unlock 5 skills" }],
  },
  {
    id: "mobility_expert", name: "Mobility Expert", description: "Unlocked 15 skills in the skill tree.",
    category: "skill_tree", rarity: "rare", icon: "🤸",
    requirements: [{ type: "skill_count", value: 15, label: "Unlock 15 skills" }],
  },
  {
    id: "static_strength", name: "Static Strength Master", description: "Unlocked 25 skills in the skill tree.",
    category: "skill_tree", rarity: "epic", icon: "🔱",
    requirements: [{ type: "skill_count", value: 25, label: "Unlock 25 skills" }],
  },
  {
    id: "athletic_movement", name: "Athletic Movement Specialist", description: "Unlocked 35 skills in the skill tree.",
    category: "skill_tree", rarity: "epic", icon: "💫",
    requirements: [{ type: "skill_count", value: 35, label: "Unlock 35 skills" }],
  },
  {
    id: "skill_master", name: "Skill Master", description: "Unlocked 50 skills in the skill tree.",
    category: "skill_tree", rarity: "legendary", icon: "🌲",
    requirements: [{ type: "skill_count", value: 50, label: "Unlock 50 skills" }],
  },

  // ── Quest ──────────────────────────────────────────────────────────────────
  {
    id: "quest_initiate", name: "Quest Initiate", description: "Completed 5 quests.",
    category: "quest", rarity: "rare", icon: "⚔️",
    requirements: [{ type: "quest_count", value: 5, label: "Complete 5 quests" }],
  },
  {
    id: "quest_veteran", name: "Quest Veteran", description: "Completed 25 quests.",
    category: "quest", rarity: "rare", icon: "🗡️",
    requirements: [{ type: "quest_count", value: 25, label: "Complete 25 quests" }],
  },
  {
    id: "quest_champion_title", name: "Quest Champion", description: "Completed 50 quests.",
    category: "quest", rarity: "epic", icon: "🏆",
    requirements: [{ type: "quest_count", value: 50, label: "Complete 50 quests" }],
  },
  {
    id: "quest_legend", name: "Quest Legend", description: "Completed 100 quests.",
    category: "quest", rarity: "legendary", icon: "📜",
    requirements: [{ type: "quest_count", value: 100, label: "Complete 100 quests" }],
  },

  // ── Achievement ────────────────────────────────────────────────────────────
  {
    id: "ach_collector", name: "Achievement Collector", description: "Unlocked 10 achievements.",
    category: "achievement", rarity: "rare", icon: "🏅",
    requirements: [{ type: "achievement_count", value: 10, label: "Unlock 10 achievements" }],
  },
  {
    id: "ach_hunter_title", name: "Achievement Hunter", description: "Unlocked 30 achievements.",
    category: "achievement", rarity: "epic", icon: "🏆",
    requirements: [{ type: "achievement_count", value: 30, label: "Unlock 30 achievements" }],
  },
  {
    id: "ach_master", name: "Achievement Master", description: "Unlocked 50 achievements.",
    category: "achievement", rarity: "legendary", icon: "💎",
    requirements: [{ type: "achievement_count", value: 50, label: "Unlock 50 achievements" }],
  },
  {
    id: "ach_grandmaster", name: "Achievement Grandmaster", description: "Unlocked 75 achievements.",
    category: "achievement", rarity: "legendary", icon: "👑",
    requirements: [{ type: "achievement_count", value: 75, label: "Unlock 75 achievements" }],
  },

  // ── Elite ──────────────────────────────────────────────────────────────────
  {
    id: "iron_will", name: "Iron Will", description: "250 total workouts logged.",
    category: "elite", rarity: "legendary", icon: "🛡️",
    requirements: [{ type: "workout_count", value: 250, label: "Log 250 workouts" }],
  },
  {
    id: "xp_titan", name: "XP Titan", description: "Accumulated 10,000 total XP.",
    category: "elite", rarity: "legendary", icon: "⚡",
    requirements: [{ type: "xp", value: 10000, label: "10,000 total XP" }],
  },
  {
    id: "coin_hoarder", name: "Coin Hoarder", description: "Accumulated 5,000 coins.",
    category: "elite", rarity: "legendary", icon: "🪙",
    requirements: [{ type: "coins_earned", value: 5000, label: "5,000 coins" }],
  },

  // ── Records ────────────────────────────────────────────────────────────────
  {
    id: "record_setter", name: "Record Setter", description: "Set 3 personal records.",
    category: "records", rarity: "rare", icon: "🏅",
    requirements: [{ type: "records_set", value: 3, label: "Set 3 personal records" }],
  },
  {
    id: "record_breaker_title", name: "Record Breaker", description: "Set 10 personal records.",
    category: "records", rarity: "epic", icon: "📊",
    requirements: [{ type: "records_set", value: 10, label: "Set 10 personal records" }],
  },

  // ── Secret ─────────────────────────────────────────────────────────────────
  {
    id: "the_unseen", name: "The Unseen", description: "A warrior who trains in the shadows.",
    category: "secret", rarity: "mythic", icon: "👁️",
    requirements: [{ type: "workout_count", value: 500, label: "Log 500 workouts" }],
    secret: true, hint: "Log an extraordinary number of workouts",
  },
  {
    id: "mythic_athlete", name: "Mythic Athlete", description: "Elite level and supreme consistency combined.",
    category: "secret", rarity: "mythic", icon: "💀",
    requirements: [
      { type: "level", value: 50, label: "Reach Level 50" },
      { type: "streak_days", value: 100, label: "100-day streak" },
    ],
    secret: true, hint: "Combine elite level with supreme consistency",
  },
  {
    id: "calisthenics_god", name: "Calisthenics God", description: "You have reached the absolute pinnacle of progression.",
    category: "secret", rarity: "mythic", icon: "🌌",
    requirements: [{ type: "level", value: 100, label: "Reach Level 100" }],
    secret: true, hint: "Reach the pinnacle of progression",
  },
  {
    id: "hidden_legend", name: "Hidden Legend", description: "A collector of the legendary — 100 achievements unlocked.",
    category: "secret", rarity: "mythic", icon: "🔮",
    requirements: [{ type: "achievement_count", value: 100, label: "Unlock 100 achievements" }],
    secret: true, hint: "Collect a legendary number of achievements",
  },
];

export const TITLE_MAP: Record<string, TitleDef> = Object.fromEntries(
  ALL_TITLES.map((t) => [t.id, t])
);

// ─── Badges ───────────────────────────────────────────────────────────────────

export const ALL_BADGES: BadgeDef[] = [
  {
    id: "first_flame", name: "First Flame", description: "Started a training streak.",
    icon: "🌟", rarity: "common", category: "streak",
    requirements: [{ type: "streak_days", value: 1, label: "Start a streak" }],
  },
  {
    id: "xp_seeker", name: "XP Seeker", description: "Accumulated 500 total XP.",
    icon: "⭐", rarity: "common", category: "level",
    requirements: [{ type: "xp", value: 500, label: "500 total XP" }],
  },
  {
    id: "skill_seeker", name: "Skill Seeker", description: "Unlocked 5 skills in the tree.",
    icon: "🌳", rarity: "common", category: "skill_tree",
    requirements: [{ type: "skill_count", value: 5, label: "Unlock 5 skills" }],
  },
  {
    id: "strength_badge", name: "Strength Badge", description: "Logged 20 total workouts.",
    icon: "⚡", rarity: "rare", category: "strength",
    requirements: [{ type: "workout_count", value: 20, label: "Log 20 workouts" }],
  },
  {
    id: "daily_devotion", name: "Daily Devotion", description: "Maintained a 7-day streak.",
    icon: "☀️", rarity: "rare", category: "streak",
    requirements: [{ type: "streak_days", value: 7, label: "7-day streak" }],
  },
  {
    id: "quest_champion_badge", name: "Quest Champion", description: "Completed 10 quests.",
    icon: "🎯", rarity: "rare", category: "quest",
    requirements: [{ type: "quest_count", value: 10, label: "Complete 10 quests" }],
  },
  {
    id: "iron_body", name: "Iron Body", description: "Logged 30 total workouts.",
    icon: "🛡️", rarity: "rare", category: "strength",
    requirements: [{ type: "workout_count", value: 30, label: "Log 30 workouts" }],
  },
  {
    id: "record_breaker", name: "Record Breaker", description: "Set 3 personal records.",
    icon: "🏅", rarity: "rare", category: "records",
    requirements: [{ type: "records_set", value: 3, label: "Set 3 personal records" }],
  },
  {
    id: "explosive_athlete", name: "Explosive Athlete", description: "Logged 50 total workouts.",
    icon: "💥", rarity: "epic", category: "strength",
    requirements: [{ type: "workout_count", value: 50, label: "Log 50 workouts" }],
  },
  {
    id: "streak_master_badge", name: "Streak Master", description: "Maintained a 30-day streak.",
    icon: "🔥", rarity: "epic", category: "streak",
    requirements: [{ type: "streak_days", value: 30, label: "30-day streak" }],
  },
  {
    id: "strategy_master", name: "Strategy Master", description: "Unlocked 20 skills in the tree.",
    icon: "🧠", rarity: "epic", category: "skill_tree",
    requirements: [{ type: "skill_count", value: 20, label: "Unlock 20 skills" }],
  },
  {
    id: "veteran_warrior", name: "Veteran Warrior", description: "Logged 75 total workouts.",
    icon: "⚔️", rarity: "epic", category: "strength",
    requirements: [{ type: "workout_count", value: 75, label: "Log 75 workouts" }],
  },
  {
    id: "coin_master", name: "Coin Master", description: "Accumulated 2,000 coins.",
    icon: "🪙", rarity: "epic", category: "elite",
    requirements: [{ type: "coins_earned", value: 2000, label: "2,000 coins" }],
  },
  {
    id: "century_club", name: "Century Club", description: "Logged 100 total workouts.",
    icon: "💯", rarity: "legendary", category: "strength",
    requirements: [{ type: "workout_count", value: 100, label: "Log 100 workouts" }],
  },
  {
    id: "achievement_hunter_badge", name: "Achievement Hunter", description: "Unlocked 25 achievements.",
    icon: "🏆", rarity: "legendary", category: "achievement",
    requirements: [{ type: "achievement_count", value: 25, label: "Unlock 25 achievements" }],
  },
  {
    id: "perfectionist", name: "Perfectionist", description: "Unlocked 50 achievements.",
    icon: "✨", rarity: "legendary", category: "achievement",
    requirements: [{ type: "achievement_count", value: 50, label: "Unlock 50 achievements" }],
  },
  {
    id: "prestige_legend", name: "Prestige Legend", description: "Reached Level 50.",
    icon: "👑", rarity: "mythic", category: "elite",
    requirements: [{ type: "level", value: 50, label: "Reach Level 50" }],
  },
  {
    id: "the_grind", name: "The Grind", description: "Logged 200 total workouts.",
    icon: "💀", rarity: "mythic", category: "elite",
    requirements: [{ type: "workout_count", value: 200, label: "Log 200 workouts" }],
  },
];

export const BADGE_MAP: Record<string, BadgeDef> = Object.fromEntries(
  ALL_BADGES.map((b) => [b.id, b])
);
