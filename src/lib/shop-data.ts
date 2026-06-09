import { ShopItem } from "./shop-types";

// ─── Titles ───────────────────────────────────────────────────────────────────

const TITLES: ShopItem[] = [
  {
    id: "t_athlete",      name: "Athlete",              description: "The classic calisthenics title.",
    category: "title",    rarity: "common",              price: 150,
    icon: "💪",           titleText: "Athlete",
  },
  {
    id: "t_warrior",      name: "Iron Warrior",          description: "For those who never skip a session.",
    category: "title",    rarity: "common",              price: 200,
    icon: "⚔️",            titleText: "Iron Warrior",
  },
  {
    id: "t_grinder",      name: "The Grinder",           description: "Progress through pure consistency.",
    category: "title",    rarity: "common",              price: 250,
    icon: "🔧",           titleText: "The Grinder",
  },
  {
    id: "t_pullup_king",  name: "Pull-Up King",          description: "Dominate the bar.",
    category: "title",    rarity: "uncommon",            price: 400,
    icon: "👑",           titleText: "Pull-Up King",
  },
  {
    id: "t_core_crusher", name: "Core Crusher",          description: "A titan of the core.",
    category: "title",    rarity: "uncommon",            price: 450,
    icon: "🔥",           titleText: "Core Crusher",
  },
  {
    id: "t_dead_hang",    name: "Dead Hang Master",      description: "Time under tension, perfected.",
    category: "title",    rarity: "uncommon",            price: 500,
    icon: "🦅",           titleText: "Dead Hang Master",
  },
  {
    id: "t_fl_apprentice", name: "Front Lever Apprentice", description: "On the path to mastery.",
    category: "title",    rarity: "rare",                price: 900,
    icon: "🎯",           titleText: "Front Lever Apprentice",
    requirements: [{ type: "level", value: 15, label: "Level 15" }],
  },
  {
    id: "t_mu_chaser",    name: "Muscle-Up Chaser",      description: "Always reaching higher.",
    category: "title",    rarity: "rare",                price: 1000,
    icon: "🏋️",           titleText: "Muscle-Up Chaser",
    requirements: [{ type: "level", value: 20, label: "Level 20" }],
  },
  {
    id: "t_hf_aspirant",  name: "Human Flag Aspirant",   description: "Few dare attempt it.",
    category: "title",    rarity: "rare",                price: 1100,
    icon: "🚩",           titleText: "Human Flag Aspirant",
    requirements: [{ type: "level", value: 20, label: "Level 20" }],
  },
  {
    id: "t_quest_champ",  name: "Quest Champion",        description: "No quest left undone.",
    category: "title",    rarity: "epic",                price: 1800,
    icon: "⚔️",            titleText: "Quest Champion",
    requirements: [{ type: "quest_count", value: 50, label: "50 Quests Completed" }],
  },
  {
    id: "t_ach_hunter",   name: "Achievement Hunter",    description: "Collect them all.",
    category: "title",    rarity: "epic",                price: 2000,
    icon: "🏆",           titleText: "Achievement Hunter",
    requirements: [{ type: "level", value: 30, label: "Level 30" }],
  },
  {
    id: "t_the_unstoppable", name: "The Unstoppable",   description: "Nothing stands in your way.",
    category: "title",    rarity: "epic",                price: 2500,
    icon: "💎",           titleText: "The Unstoppable",
    requirements: [{ type: "rank", value: "Elite", label: "Elite Rank" }],
  },
  {
    id: "t_legend",       name: "Legend",                description: "The highest honour.",
    category: "title",    rarity: "legendary",           price: 5000,
    icon: "🌟",           titleText: "Legend",
    requirements: [{ type: "rank", value: "Master", label: "Master Rank" }],
  },
  {
    id: "t_transcendent", name: "The Transcendent",      description: "Beyond all limits.",
    category: "title",    rarity: "legendary",           price: 8000,
    icon: "✨",           titleText: "The Transcendent",
    requirements: [{ type: "rank", value: "Grandmaster", label: "Grandmaster Rank" }],
  },
];

// ─── Borders ──────────────────────────────────────────────────────────────────

const BORDERS: ShopItem[] = [
  {
    id: "b_bronze",     name: "Bronze Frame",     description: "A bronze-hued border for your avatar.",
    category: "border", rarity: "common",         price: 200,
    icon: "🥉",         borderId: "bronze",
  },
  {
    id: "b_silver",     name: "Silver Frame",     description: "Cool silver ring with a subtle glow.",
    category: "border", rarity: "uncommon",       price: 500,
    icon: "🥈",         borderId: "silver",
  },
  {
    id: "b_gold",       name: "Gold Frame",       description: "A gleaming gold ring. You've earned it.",
    category: "border", rarity: "rare",           price: 1200,
    icon: "🥇",         borderId: "gold",
    requirements: [{ type: "level", value: 10, label: "Level 10" }],
  },
  {
    id: "b_diamond",    name: "Diamond Frame",    description: "Crystal clear, impossibly sharp.",
    category: "border", rarity: "epic",           price: 2200,
    icon: "💎",         borderId: "diamond",
    requirements: [{ type: "level", value: 25, label: "Level 25" }],
  },
  {
    id: "b_obsidian",   name: "Obsidian Halo",   description: "Dark violet energy crackles around you.",
    category: "border", rarity: "epic",           price: 2500,
    icon: "🌑",         borderId: "obsidian",
    requirements: [{ type: "rank", value: "Advanced Athlete", label: "Advanced Athlete Rank" }],
  },
  {
    id: "b_inferno",    name: "Inferno Ring",     description: "Wreathed in flames.",
    category: "border", rarity: "legendary",      price: 4000,
    icon: "🔥",         borderId: "inferno",
    requirements: [{ type: "rank", value: "Elite", label: "Elite Rank" }],
  },
  {
    id: "b_legend",     name: "Legend Crown",     description: "The rarest border. Animated golden halo.",
    category: "border", rarity: "legendary",      price: 9000,
    icon: "👑",         borderId: "legend",
    requirements: [{ type: "rank", value: "Master", label: "Master Rank" }],
    featured: true,
  },
];

// ─── Themes ───────────────────────────────────────────────────────────────────

const THEMES: ShopItem[] = [
  {
    id: "th_crimson",   name: "Crimson",          description: "Blood-red accents. Intense and focused.",
    category: "theme",  rarity: "uncommon",       price: 600,
    icon: "🔴",         themeId: "crimson",
  },
  {
    id: "th_midnight",  name: "Midnight",         description: "Deep indigo. Calm and precise.",
    category: "theme",  rarity: "uncommon",       price: 700,
    icon: "🌙",         themeId: "midnight",
  },
  {
    id: "th_neon",      name: "Neon Blue",        description: "Electric cyan. Sharp and modern.",
    category: "theme",  rarity: "rare",           price: 1000,
    icon: "⚡",         themeId: "neon",
  },
  {
    id: "th_gold",      name: "Royal Gold",       description: "Golden accents worthy of a champion.",
    category: "theme",  rarity: "rare",           price: 1400,
    icon: "🏆",         themeId: "gold",
    requirements: [{ type: "level", value: 15, label: "Level 15" }],
  },
  {
    id: "th_obsidian",  name: "Obsidian",         description: "Deep violet. Power made visible.",
    category: "theme",  rarity: "epic",           price: 2500,
    icon: "💜",         themeId: "obsidian",
    requirements: [{ type: "rank", value: "Advanced Athlete", label: "Advanced Athlete Rank" }],
    featured: true,
  },
];

// ─── Badges ───────────────────────────────────────────────────────────────────

const BADGES: ShopItem[] = [
  {
    id: "ba_quest_master",  name: "Quest Master",      description: "For those who conquer every quest.",
    category: "badge",      rarity: "rare",            price: 1000,
    icon: "⚔️",              badgeIcon: "⚔️",           badgeLabel: "Quest Master",
    requirements: [{ type: "quest_count", value: 25, label: "25 Quests Completed" }],
  },
  {
    id: "ba_ach_hunter",    name: "Achievement Hunter", description: "A collector of rare achievements.",
    category: "badge",      rarity: "rare",            price: 1200,
    icon: "🏆",             badgeIcon: "🏆",           badgeLabel: "Achievement Hunter",
    requirements: [{ type: "level", value: 20, label: "Level 20" }],
  },
  {
    id: "ba_tree_veteran",  name: "Skill Tree Veteran", description: "Deep roots in the skill tree.",
    category: "badge",      rarity: "uncommon",        price: 750,
    icon: "🌳",             badgeIcon: "🌳",           badgeLabel: "Skill Tree Veteran",
    requirements: [{ type: "workout_count", value: 30, label: "30 Workouts" }],
  },
  {
    id: "ba_elite_athlete", name: "Elite Athlete",     description: "Reserved for the dedicated few.",
    category: "badge",      rarity: "epic",            price: 2000,
    icon: "🔥",             badgeIcon: "🔥",           badgeLabel: "Elite Athlete",
    requirements: [{ type: "rank", value: "Elite", label: "Elite Rank" }],
  },
  {
    id: "ba_century",       name: "Centurion",         description: "100 workouts logged. Legendary.",
    category: "badge",      rarity: "epic",            price: 2500,
    icon: "💯",             badgeIcon: "💯",           badgeLabel: "Centurion",
    requirements: [{ type: "workout_count", value: 100, label: "100 Workouts" }],
  },
  {
    id: "ba_legend_rank",   name: "Legend Badge",      description: "Only legends wear this.",
    category: "badge",      rarity: "legendary",       price: 7500,
    icon: "🌟",             badgeIcon: "🌟",           badgeLabel: "Legend",
    requirements: [{ type: "rank", value: "Master", label: "Master Rank" }],
    featured: true,
  },
];

// ─── Full catalogue ───────────────────────────────────────────────────────────

export const SHOP_ITEMS: ShopItem[] = [
  ...TITLES,
  ...BORDERS,
  ...THEMES,
  ...BADGES,
];

export const SHOP_ITEM_MAP: Record<string, ShopItem> = Object.fromEntries(
  SHOP_ITEMS.map((i) => [i.id, i])
);

export const FEATURED_ITEMS: ShopItem[] = SHOP_ITEMS.filter((i) => i.featured);
