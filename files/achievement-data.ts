import { AchievementDef } from "./achievement-types";

export const ACHIEVEMENTS: AchievementDef[] = [

  // ─── WORKOUT MILESTONES ────────────────────────────────────────────────────

  {
    id: "first_workout", name: "First Step", icon: "👟",
    description: "Complete your very first workout. Every legend starts somewhere.",
    rarity: "common", xpReward: 25, coinReward: 10,
    category: "workout_milestones", secret: false,
    requirement: { type: "workout_count", value: 1 },
  },
  {
    id: "workouts_5", name: "Getting Started", icon: "🏃",
    description: "Complete 5 workouts. You're building a habit.",
    rarity: "common", xpReward: 40, coinReward: 15,
    category: "workout_milestones", secret: false,
    requirement: { type: "workout_count", value: 5 },
  },
  {
    id: "workouts_25", name: "Consistent", icon: "📅",
    description: "Complete 25 workouts. Consistency is the key.",
    rarity: "uncommon", xpReward: 100, coinReward: 40,
    category: "workout_milestones", secret: false,
    requirement: { type: "workout_count", value: 25 },
  },
  {
    id: "workouts_50", name: "Dedicated", icon: "💪",
    description: "Complete 50 workouts. Your dedication is showing.",
    rarity: "uncommon", xpReward: 130, coinReward: 60,
    category: "workout_milestones", secret: false,
    requirement: { type: "workout_count", value: 50 },
  },
  {
    id: "workouts_100", name: "Relentless", icon: "⚡",
    description: "Complete 100 workouts. Triple digits. Unstoppable.",
    rarity: "rare", xpReward: 250, coinReward: 100,
    category: "workout_milestones", secret: false,
    requirement: { type: "workout_count", value: 100 },
  },
  {
    id: "workouts_250", name: "Machine", icon: "🤖",
    description: "Complete 250 workouts. You are a training machine.",
    rarity: "epic", xpReward: 600, coinReward: 250,
    category: "workout_milestones", secret: false,
    requirement: { type: "workout_count", value: 250 },
  },
  {
    id: "workouts_500", name: "Workout Monster", icon: "👹",
    description: "Complete 500 workouts. There are no words.",
    rarity: "legendary", xpReward: 1500, coinReward: 600,
    category: "workout_milestones", secret: false,
    requirement: { type: "workout_count", value: 500 },
  },

  // ─── XP MILESTONES ────────────────────────────────────────────────────────

  {
    id: "xp_100", name: "Novice", icon: "✨",
    description: "Earn 100 XP. Your journey has begun.",
    rarity: "common", xpReward: 10, coinReward: 5,
    category: "xp_milestones", secret: false,
    requirement: { type: "total_xp", value: 100 },
  },
  {
    id: "xp_500", name: "Grinding", icon: "⚙️",
    description: "Earn 500 XP. The grind is real.",
    rarity: "common", xpReward: 40, coinReward: 20,
    category: "xp_milestones", secret: false,
    requirement: { type: "total_xp", value: 500 },
  },
  {
    id: "xp_1000", name: "Experienced", icon: "🎓",
    description: "Earn 1,000 XP. You know what you're doing.",
    rarity: "uncommon", xpReward: 100, coinReward: 50,
    category: "xp_milestones", secret: false,
    requirement: { type: "total_xp", value: 1000 },
  },
  {
    id: "xp_5000", name: "Veteran", icon: "🎖️",
    description: "Earn 5,000 XP. Veterans are forged in the gym.",
    rarity: "rare", xpReward: 200, coinReward: 100,
    category: "xp_milestones", secret: false,
    requirement: { type: "total_xp", value: 5000 },
  },
  {
    id: "xp_10000", name: "Elite", icon: "🏅",
    description: "Earn 10,000 XP. Elite status achieved.",
    rarity: "epic", xpReward: 500, coinReward: 200,
    category: "xp_milestones", secret: false,
    requirement: { type: "total_xp", value: 10000 },
  },
  {
    id: "xp_25000", name: "Legend", icon: "🌟",
    description: "Earn 25,000 XP. Your name echoes in the halls of strength.",
    rarity: "legendary", xpReward: 1500, coinReward: 500,
    category: "xp_milestones", secret: false,
    requirement: { type: "total_xp", value: 25000 },
  },
  {
    id: "xp_50000", name: "XP God", icon: "⚡",
    description: "Earn 50,000 XP. You have ascended beyond normal comprehension.",
    rarity: "secret_legendary", xpReward: 3000, coinReward: 1000,
    category: "xp_milestones", secret: true,
    hint: "Earn an enormous amount of XP...",
  },

  // ─── LEVEL MILESTONES ─────────────────────────────────────────────────────

  {
    id: "level_5", name: "Level 5", icon: "5️⃣",
    description: "Reach Level 5. The foundation is set.",
    rarity: "common", xpReward: 30, coinReward: 15,
    category: "level_milestones", secret: false,
    requirement: { type: "player_level", value: 5 },
  },
  {
    id: "level_10", name: "Level 10", icon: "🔟",
    description: "Reach Level 10. Double digits. Keep going.",
    rarity: "uncommon", xpReward: 80, coinReward: 35,
    category: "level_milestones", secret: false,
    requirement: { type: "player_level", value: 10 },
  },
  {
    id: "level_20", name: "Level 20", icon: "🎯",
    description: "Reach Level 20. You're in the top tier of beginners.",
    rarity: "rare", xpReward: 200, coinReward: 80,
    category: "level_milestones", secret: false,
    requirement: { type: "player_level", value: 20 },
  },
  {
    id: "level_30", name: "Level 30", icon: "🔱",
    description: "Reach Level 30. Halfway to the impossible.",
    rarity: "rare", xpReward: 300, coinReward: 120,
    category: "level_milestones", secret: false,
    requirement: { type: "player_level", value: 30 },
  },
  {
    id: "level_50", name: "Level 50", icon: "🌠",
    description: "Reach Level 50. Half a century of levels earned.",
    rarity: "epic", xpReward: 700, coinReward: 300,
    category: "level_milestones", secret: false,
    requirement: { type: "player_level", value: 50 },
  },
  {
    id: "level_75", name: "Level 75", icon: "💎",
    description: "Reach Level 75. You are an elite athlete.",
    rarity: "legendary", xpReward: 1500, coinReward: 600,
    category: "level_milestones", secret: false,
    requirement: { type: "player_level", value: 75 },
  },
  {
    id: "level_100", name: "Living Legend", icon: "👑",
    description: "Reach Level 100. Maximum level achieved. You are a living legend.",
    rarity: "secret_legendary", xpReward: 5000, coinReward: 2000,
    category: "level_milestones", secret: true,
    hint: "Reach the maximum level...",
  },

  // ─── SKILL UNLOCKS ────────────────────────────────────────────────────────

  {
    id: "skill_first", name: "First Unlock", icon: "🔓",
    description: "Complete your first skill tree node.",
    rarity: "common", xpReward: 25, coinReward: 10,
    category: "skill_unlocks", secret: false,
    requirement: { type: "skills_completed", value: 1 },
  },
  {
    id: "skills_10", name: "Explorer", icon: "🗺️",
    description: "Complete 10 skill tree nodes. You're branching out.",
    rarity: "uncommon", xpReward: 100, coinReward: 50,
    category: "skill_unlocks", secret: false,
    requirement: { type: "skills_completed", value: 10 },
  },
  {
    id: "skills_25", name: "Specialist", icon: "🏹",
    description: "Complete 25 skill tree nodes. Specialization level: high.",
    rarity: "rare", xpReward: 250, coinReward: 100,
    category: "skill_unlocks", secret: false,
    requirement: { type: "skills_completed", value: 25 },
  },
  {
    id: "skills_50", name: "Master", icon: "🧙",
    description: "Complete 50 skill tree nodes. A true master of movement.",
    rarity: "epic", xpReward: 600, coinReward: 250,
    category: "skill_unlocks", secret: false,
    requirement: { type: "skills_completed", value: 50 },
  },
  {
    id: "skills_all", name: "Completionist", icon: "🏆",
    description: "Complete every single skill in the tree. The ultimate achievement.",
    rarity: "secret_legendary", xpReward: 5000, coinReward: 2000,
    category: "skill_unlocks", secret: true,
    hint: "Complete every skill in existence...",
  },

  // ─── BRANCH COMPLETION ────────────────────────────────────────────────────

  {
    id: "push_25", name: "Push Apprentice", icon: "💪",
    description: "Complete 25% of the Push Tree.",
    rarity: "common", xpReward: 50, coinReward: 20,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 25, branch: "push" },
  },
  {
    id: "push_50", name: "Push Specialist", icon: "💪",
    description: "Complete 50% of the Push Tree.",
    rarity: "uncommon", xpReward: 120, coinReward: 50,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 50, branch: "push" },
  },
  {
    id: "push_75", name: "Push Expert", icon: "💪",
    description: "Complete 75% of the Push Tree.",
    rarity: "rare", xpReward: 280, coinReward: 110,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 75, branch: "push" },
  },
  {
    id: "push_100", name: "Push Master", icon: "💪",
    description: "Complete 100% of the Push Tree. Every push skill mastered.",
    rarity: "epic", xpReward: 700, coinReward: 280,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 100, branch: "push" },
  },
  {
    id: "pull_25", name: "Pull Apprentice", icon: "🧲",
    description: "Complete 25% of the Pull Tree.",
    rarity: "common", xpReward: 50, coinReward: 20,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 25, branch: "pull" },
  },
  {
    id: "pull_50", name: "Pull Specialist", icon: "🧲",
    description: "Complete 50% of the Pull Tree.",
    rarity: "uncommon", xpReward: 120, coinReward: 50,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 50, branch: "pull" },
  },
  {
    id: "pull_75", name: "Pull Expert", icon: "🧲",
    description: "Complete 75% of the Pull Tree.",
    rarity: "rare", xpReward: 280, coinReward: 110,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 75, branch: "pull" },
  },
  {
    id: "pull_100", name: "Pull Master", icon: "🧲",
    description: "Complete 100% of the Pull Tree. Every pull skill mastered.",
    rarity: "epic", xpReward: 700, coinReward: 280,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 100, branch: "pull" },
  },
  {
    id: "core_25", name: "Core Apprentice", icon: "🔥",
    description: "Complete 25% of the Core Tree.",
    rarity: "common", xpReward: 50, coinReward: 20,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 25, branch: "core" },
  },
  {
    id: "core_50", name: "Core Specialist", icon: "🔥",
    description: "Complete 50% of the Core Tree.",
    rarity: "uncommon", xpReward: 120, coinReward: 50,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 50, branch: "core" },
  },
  {
    id: "core_75", name: "Core Expert", icon: "🔥",
    description: "Complete 75% of the Core Tree.",
    rarity: "rare", xpReward: 280, coinReward: 110,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 75, branch: "core" },
  },
  {
    id: "core_100", name: "Core Master", icon: "🔥",
    description: "Complete 100% of the Core Tree. Every core skill mastered.",
    rarity: "epic", xpReward: 700, coinReward: 280,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 100, branch: "core" },
  },
  {
    id: "skill_25", name: "Balance Apprentice", icon: "🤸",
    description: "Complete 25% of the Skill & Balance Tree.",
    rarity: "common", xpReward: 50, coinReward: 20,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 25, branch: "skill" },
  },
  {
    id: "skill_50", name: "Balance Specialist", icon: "🤸",
    description: "Complete 50% of the Skill & Balance Tree.",
    rarity: "uncommon", xpReward: 120, coinReward: 50,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 50, branch: "skill" },
  },
  {
    id: "skill_75", name: "Balance Expert", icon: "🤸",
    description: "Complete 75% of the Skill & Balance Tree.",
    rarity: "rare", xpReward: 280, coinReward: 110,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 75, branch: "skill" },
  },
  {
    id: "skill_100", name: "Balance Master", icon: "🤸",
    description: "Complete 100% of the Skill & Balance Tree. Every balance skill mastered.",
    rarity: "epic", xpReward: 700, coinReward: 280,
    category: "branch_completion", secret: false,
    requirement: { type: "branch_percent", value: 100, branch: "skill" },
  },

  // ─── ADVANCED SKILLS ──────────────────────────────────────────────────────

  {
    id: "adv_muscle_up", name: "Bar Master", icon: "🏋️",
    description: "Unlock the Muscle-Up. You've crossed from pulling to flying.",
    rarity: "rare", xpReward: 350, coinReward: 150,
    category: "advanced_skills", secret: false,
    requirement: { type: "specific_skill", value: 1, skillId: "muscle-up" },
  },
  {
    id: "adv_strict_muscle_up", name: "Perfect Muscle-Up", icon: "🎯",
    description: "Unlock the Strict Muscle-Up. No kip. Pure power.",
    rarity: "epic", xpReward: 600, coinReward: 250,
    category: "advanced_skills", secret: false,
    requirement: { type: "specific_skill", value: 1, skillId: "strict-muscle-up" },
  },
  {
    id: "adv_front_lever", name: "Levitation", icon: "🌊",
    description: "Unlock the Front Lever. Defy gravity horizontally.",
    rarity: "epic", xpReward: 700, coinReward: 280,
    category: "advanced_skills", secret: false,
    requirement: { type: "specific_skill", value: 1, skillId: "front-lever" },
  },
  {
    id: "adv_human_flag", name: "Flag Bearer", icon: "🚩",
    description: "Unlock the Human Flag. The most visually stunning bodyweight skill.",
    rarity: "epic", xpReward: 800, coinReward: 320,
    category: "advanced_skills", secret: false,
    requirement: { type: "specific_skill", value: 1, skillId: "human-flag" },
  },
  {
    id: "adv_hspu", name: "Upside Down", icon: "🙃",
    description: "Unlock the Handstand Push-Up. Press the world away.",
    rarity: "epic", xpReward: 750, coinReward: 300,
    category: "advanced_skills", secret: false,
    requirement: { type: "specific_skill", value: 1, skillId: "handstand-push-up" },
  },
  {
    id: "adv_back_lever", name: "Backwards Strength", icon: "🔄",
    description: "Unlock the Back Lever. Iron shoulders forged.",
    rarity: "rare", xpReward: 400, coinReward: 160,
    category: "advanced_skills", secret: false,
    requirement: { type: "specific_skill", value: 1, skillId: "back-lever" },
  },

  // ─── ENDGAME SKILLS ───────────────────────────────────────────────────────

  {
    id: "end_oafu", name: "One Arm Wonder", icon: "☝️",
    description: "Unlock the One-Arm Pull-Up. World-class pulling strength.",
    rarity: "legendary", xpReward: 2000, coinReward: 800,
    category: "endgame_skills", secret: false,
    requirement: { type: "specific_skill", value: 1, skillId: "one-arm-pull-up" },
  },
  {
    id: "end_oapu", name: "Lone Warrior", icon: "⚔️",
    description: "Unlock the One-Arm Push-Up. One arm. All power.",
    rarity: "legendary", xpReward: 2000, coinReward: 800,
    category: "endgame_skills", secret: false,
    requirement: { type: "specific_skill", value: 1, skillId: "one-arm-push-up" },
  },
  {
    id: "end_planche", name: "Planche Master", icon: "✈️",
    description: "Unlock the Full Planche. You have conquered gravity.",
    rarity: "legendary", xpReward: 2500, coinReward: 1000,
    category: "endgame_skills", secret: false,
    requirement: { type: "specific_skill", value: 1, skillId: "full-planche" },
  },
  {
    id: "end_oahs", name: "Gravity Defier", icon: "🌌",
    description: "Unlock the One-Arm Handstand. The rarest skill in existence.",
    rarity: "secret_legendary", xpReward: 4000, coinReward: 1500,
    category: "endgame_skills", secret: true,
    hint: "Master the impossible...",
  },
  {
    id: "end_flpu", name: "Pulling Beyond Limits", icon: "🚀",
    description: "Unlock the Front Lever Pull-Up. Elite pulling mastery.",
    rarity: "legendary", xpReward: 2500, coinReward: 1000,
    category: "endgame_skills", secret: false,
    requirement: { type: "specific_skill", value: 1, skillId: "front-lever-pull-up" },
  },
  {
    id: "end_hefesto", name: "Ancient Strength", icon: "🔱",
    description: "Unlock the Hefesto. Named after the god of fire. You have become one.",
    rarity: "secret_legendary", xpReward: 5000, coinReward: 2000,
    category: "endgame_skills", secret: true,
    hint: "Achieve a feat named after a god...",
  },

  // ─── STREAKS ──────────────────────────────────────────────────────────────

  {
    id: "streak_3", name: "3 Day Streak", icon: "🔥",
    description: "Work out 3 days in a row. The habit is forming.",
    rarity: "common", xpReward: 30, coinReward: 15,
    category: "streaks", secret: false,
    requirement: { type: "streak_days", value: 3 },
  },
  {
    id: "streak_7", name: "7 Day Streak", icon: "🔥",
    description: "Work out 7 days in a row. A full week of dedication.",
    rarity: "uncommon", xpReward: 80, coinReward: 35,
    category: "streaks", secret: false,
    requirement: { type: "streak_days", value: 7 },
  },
  {
    id: "streak_14", name: "14 Day Streak", icon: "🔥",
    description: "Work out 14 days in a row. Two solid weeks.",
    rarity: "uncommon", xpReward: 130, coinReward: 55,
    category: "streaks", secret: false,
    requirement: { type: "streak_days", value: 14 },
  },
  {
    id: "streak_30", name: "30 Day Streak", icon: "🔥",
    description: "Work out 30 days in a row. A full month of consistency.",
    rarity: "rare", xpReward: 300, coinReward: 120,
    category: "streaks", secret: false,
    requirement: { type: "streak_days", value: 30 },
  },
  {
    id: "streak_60", name: "60 Day Streak", icon: "🔥",
    description: "Work out 60 days in a row. Two months of fire.",
    rarity: "epic", xpReward: 600, coinReward: 250,
    category: "streaks", secret: false,
    requirement: { type: "streak_days", value: 60 },
  },
  {
    id: "streak_100", name: "Unstoppable", icon: "💥",
    description: "Work out 100 days in a row. Nothing can stop you.",
    rarity: "secret_legendary", xpReward: 2500, coinReward: 1000,
    category: "streaks", secret: true,
    hint: "Maintain an incredible streak...",
  },
  {
    id: "streak_365", name: "365 Day Streak", icon: "🌅",
    description: "Work out every day for a full year. You are beyond human.",
    rarity: "secret_legendary", xpReward: 5000, coinReward: 2000,
    category: "streaks", secret: true,
    hint: "Work out every single day for a year...",
  },

  // ─── EXERCISE TOTALS ──────────────────────────────────────────────────────

  {
    id: "pushup_1000", name: "Push-Up King", icon: "👊",
    description: "Complete 1,000 total push-ups. Your chest is iron.",
    rarity: "rare", xpReward: 300, coinReward: 120,
    category: "exercise_totals", secret: false,
    requirement: { type: "exercise_reps", value: 1000, exercise: "push-up" },
  },
  {
    id: "pushup_5000", name: "Push-Up Emperor", icon: "👑",
    description: "Complete 5,000 total push-ups. You are the emperor of push.",
    rarity: "epic", xpReward: 800, coinReward: 350,
    category: "exercise_totals", secret: false,
    requirement: { type: "exercise_reps", value: 5000, exercise: "push-up" },
  },
  {
    id: "pullup_500", name: "Pull-Up King", icon: "🦅",
    description: "Complete 500 total pull-ups. Your back is a wall.",
    rarity: "rare", xpReward: 300, coinReward: 120,
    category: "exercise_totals", secret: false,
    requirement: { type: "exercise_reps", value: 500, exercise: "pull-up" },
  },
  {
    id: "pullup_2500", name: "Pull-Up Emperor", icon: "🦅",
    description: "Complete 2,500 total pull-ups. Emperor of the bar.",
    rarity: "epic", xpReward: 800, coinReward: 350,
    category: "exercise_totals", secret: false,
    requirement: { type: "exercise_reps", value: 2500, exercise: "pull-up" },
  },
  {
    id: "core_500", name: "Core Crusher", icon: "🔥",
    description: "Complete 500 total core exercises. Abs of steel.",
    rarity: "rare", xpReward: 300, coinReward: 120,
    category: "exercise_totals", secret: false,
    requirement: { type: "exercise_reps", value: 500, exercise: "core" },
  },
  {
    id: "core_2500", name: "Core Destroyer", icon: "💥",
    description: "Complete 2,500 total core exercises. Nothing is left.",
    rarity: "epic", xpReward: 800, coinReward: 350,
    category: "exercise_totals", secret: false,
    requirement: { type: "exercise_reps", value: 2500, exercise: "core" },
  },
  {
    id: "hang_3600", name: "Hang Time", icon: "⏱️",
    description: "Accumulate 1 hour of dead hangs. Iron grip forged.",
    rarity: "rare", xpReward: 350, coinReward: 140,
    category: "exercise_totals", secret: false,
    requirement: { type: "hang_time_seconds", value: 3600 },
  },
  {
    id: "hang_36000", name: "Hang Master", icon: "⏰",
    description: "Accumulate 10 hours of dead hangs. You live on the bar.",
    rarity: "legendary", xpReward: 1200, coinReward: 500,
    category: "exercise_totals", secret: false,
    requirement: { type: "hang_time_seconds", value: 36000 },
  },

  // ─── COMPLETIONIST ────────────────────────────────────────────────────────

  {
    id: "tree_climber", name: "Tree Climber", icon: "🌿",
    description: "Complete your first full branch. You've planted your flag.",
    rarity: "uncommon", xpReward: 150, coinReward: 60,
    category: "completionist", secret: false,
    requirement: { type: "all_branches_complete", value: 1 },
  },
  {
    id: "branch_master", name: "Branch Master", icon: "🌳",
    description: "Complete all four branches of the skill tree.",
    rarity: "legendary", xpReward: 2000, coinReward: 800,
    category: "completionist", secret: false,
    requirement: { type: "all_branches_complete", value: 4 },
  },
  {
    id: "skill_tree_100", name: "100 Percent", icon: "💯",
    description: "Complete the entire skill tree. Every node. Every skill. Total mastery.",
    rarity: "secret_legendary", xpReward: 5000, coinReward: 2000,
    category: "completionist", secret: true,
    hint: "Achieve total completion of the skill tree...",
  },
  {
    id: "all_endgame", name: "Final Boss", icon: "☠️",
    description: "Unlock every endgame skill. You have defeated the game.",
    rarity: "secret_legendary", xpReward: 5000, coinReward: 2000,
    category: "completionist", secret: true,
    hint: "Unlock every endgame skill...",
  },
  {
    id: "perfectionist", name: "Perfectionist", icon: "🎯",
    description: "Reach 100% completion in every single branch. Flawless.",
    rarity: "secret_legendary", xpReward: 5000, coinReward: 2000,
    category: "completionist", secret: true,
    hint: "Perfect every branch completely...",
  },
  {
    id: "the_collector", name: "The Collector", icon: "📦",
    description: "Unlock every achievement. The meta-achievement. Truly complete.",
    rarity: "secret_legendary", xpReward: 5000, coinReward: 2000,
    category: "completionist", secret: true,
    hint: "Collect them all...",
  },
];

export const ACHIEVEMENT_MAP: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a])
);

export const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length;
export const TOTAL_SECRET = ACHIEVEMENTS.filter((a) => a.secret).length;
export const ENDGAME_SKILL_IDS = [
  "one-arm-pull-up", "one-arm-push-up", "full-planche",
  "one-arm-handstand", "front-lever-pull-up", "hefesto", "planche-push-up",
];
