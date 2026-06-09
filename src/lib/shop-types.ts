// ─── Rarity (shop uses its own — excludes secret_legendary) ─────────────────

export type ShopRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const SHOP_RARITY_META: Record<ShopRarity, {
  label:    string;
  color:    string;
  border:   string;
  bg:       string;
  glow:     string;
  shimmer:  boolean;
}> = {
  common:    { label: "Common",    color: "text-white/60",   border: "border-white/10",     bg: "bg-white/3",      glow: "",                      shimmer: false },
  uncommon:  { label: "Uncommon",  color: "text-green-400",  border: "border-green-500/30", bg: "bg-green-500/6",  glow: "shadow-green-500/15",   shimmer: false },
  rare:      { label: "Rare",      color: "text-sky-400",    border: "border-sky-500/30",   bg: "bg-sky-500/6",    glow: "shadow-sky-500/20",     shimmer: false },
  epic:      { label: "Epic",      color: "text-purple-400", border: "border-purple-500/30",bg: "bg-purple-500/6", glow: "shadow-purple-500/20",  shimmer: false },
  legendary: { label: "Legendary", color: "text-yellow-400", border: "border-yellow-500/40",bg: "bg-yellow-500/6", glow: "shadow-yellow-500/30",  shimmer: true  },
};

// ─── Categories ───────────────────────────────────────────────────────────────

export type ItemCategory = "title" | "border" | "theme" | "badge" | "featured";

export const CATEGORY_META: Record<ItemCategory, { label: string; icon: string }> = {
  title:    { label: "Titles",          icon: "🏷️"  },
  border:   { label: "Profile Borders", icon: "🖼️"  },
  theme:    { label: "Themes",          icon: "🎨"  },
  badge:    { label: "Badges",          icon: "📛"  },
  featured: { label: "Featured",        icon: "⭐"  },
};

// ─── Requirements ─────────────────────────────────────────────────────────────

export type RequirementType = "level" | "rank" | "achievement" | "quest_count" | "workout_count";

export interface ShopRequirement {
  type:  RequirementType;
  value: number | string;
  label: string;
}

// ─── Theme Definition ─────────────────────────────────────────────────────────

export interface ThemeDef {
  id:          string;
  name:        string;
  accentHex:   string;   // primary accent (hex, for inline preview swatches)
  accentRgb:   string;   // "r g b" for CSS var
  accentDark:  string;   // darker shade rgb
  glowColor:   string;   // rgba string for box-shadow
  gradientFrom:string;   // Tailwind gradient class segment
  previewBg:   string;   // background color hex for preview card
}

export const THEMES: ThemeDef[] = [
  { id: "default",  name: "Emerald",    accentHex: "#4ade80", accentRgb: "74 222 128",   accentDark: "22 163 74",    glowColor: "rgba(74,222,128,0.3)",   gradientFrom: "from-green-500",   previewBg: "#0a1f0f" },
  { id: "crimson",  name: "Crimson",    accentHex: "#f87171", accentRgb: "248 113 113",  accentDark: "185 28 28",    glowColor: "rgba(248,113,113,0.3)",  gradientFrom: "from-red-400",     previewBg: "#1f0a0a" },
  { id: "midnight", name: "Midnight",   accentHex: "#818cf8", accentRgb: "129 140 248",  accentDark: "79 70 229",    glowColor: "rgba(129,140,248,0.3)",  gradientFrom: "from-indigo-400",  previewBg: "#0a0a1f" },
  { id: "gold",     name: "Royal Gold", accentHex: "#fbbf24", accentRgb: "251 191 36",   accentDark: "180 130 6",    glowColor: "rgba(251,191,36,0.3)",   gradientFrom: "from-amber-400",   previewBg: "#1f180a" },
  { id: "neon",     name: "Neon Blue",  accentHex: "#38bdf8", accentRgb: "56 189 248",   accentDark: "2 132 199",    glowColor: "rgba(56,189,248,0.3)",   gradientFrom: "from-sky-400",     previewBg: "#0a141f" },
  { id: "obsidian", name: "Obsidian",   accentHex: "#a78bfa", accentRgb: "167 139 250",  accentDark: "109 40 217",   glowColor: "rgba(167,139,250,0.3)",  gradientFrom: "from-violet-400",  previewBg: "#0f0a1f" },
];

export const THEME_MAP: Record<string, ThemeDef> = Object.fromEntries(THEMES.map((t) => [t.id, t]));

// ─── Border Definition ────────────────────────────────────────────────────────

export interface BorderDef {
  id:           string;
  name:         string;
  ringClass:    string;   // Tailwind ring-color class
  glowStyle:    string;   // inline box-shadow style value
  animClass?:   string;   // optional animation class
  previewGrad:  string;   // CSS gradient for preview
}

export const BORDERS: BorderDef[] = [
  { id: "default",  name: "Default",  ringClass: "ring-green-500/40",    glowStyle: "0 0 0 2px rgba(74,222,128,0.4)",                               previewGrad: "linear-gradient(135deg,#4ade80,#22c55e)" },
  { id: "bronze",   name: "Bronze",   ringClass: "ring-amber-600/60",     glowStyle: "0 0 0 2px rgba(180,83,9,0.6), 0 0 12px rgba(180,83,9,0.3)",    previewGrad: "linear-gradient(135deg,#b45309,#92400e)" },
  { id: "silver",   name: "Silver",   ringClass: "ring-slate-300/70",     glowStyle: "0 0 0 2px rgba(203,213,225,0.7), 0 0 16px rgba(203,213,225,0.3)", previewGrad: "linear-gradient(135deg,#cbd5e1,#94a3b8)" },
  { id: "gold",     name: "Gold",     ringClass: "ring-yellow-400/70",    glowStyle: "0 0 0 2px rgba(250,204,21,0.7), 0 0 20px rgba(250,204,21,0.35)", previewGrad: "linear-gradient(135deg,#fde047,#facc15)" },
  { id: "diamond",  name: "Diamond",  ringClass: "ring-sky-300/80",       glowStyle: "0 0 0 2px rgba(125,211,252,0.8), 0 0 24px rgba(125,211,252,0.4)", previewGrad: "linear-gradient(135deg,#7dd3fc,#38bdf8)" },
  { id: "obsidian", name: "Obsidian", ringClass: "ring-violet-500/70",    glowStyle: "0 0 0 2px rgba(139,92,246,0.7), 0 0 24px rgba(139,92,246,0.4)", previewGrad: "linear-gradient(135deg,#8b5cf6,#6d28d9)" },
  { id: "inferno",  name: "Inferno",  ringClass: "ring-orange-500/70",    glowStyle: "0 0 0 2px rgba(249,115,22,0.7), 0 0 24px rgba(249,115,22,0.4)", previewGrad: "linear-gradient(135deg,#f97316,#ef4444)" },
  { id: "legend",   name: "Legend",   ringClass: "ring-yellow-300/80",    glowStyle: "0 0 0 2px rgba(253,224,71,0.8), 0 0 32px rgba(253,224,71,0.5)", previewGrad: "linear-gradient(135deg,#fde047,#fbbf24,#f97316)", animClass: "animate-spin-slow" },
];

export const BORDER_MAP: Record<string, BorderDef> = Object.fromEntries(BORDERS.map((b) => [b.id, b]));

// ─── Shop Item ────────────────────────────────────────────────────────────────

export interface ShopItem {
  id:           string;
  name:         string;
  description:  string;
  category:     ItemCategory;
  rarity:       ShopRarity;
  price:        number;
  icon:         string;
  featured?:    boolean;
  requirements?: ShopRequirement[];
  // payload — what the item actually *is*
  themeId?:     string;
  borderId?:    string;
  titleText?:   string;
  badgeIcon?:   string;
  badgeLabel?:  string;
}

// ─── Equipped Cosmetics ───────────────────────────────────────────────────────

export interface EquippedCosmetics {
  titleId:  string | null;
  borderId: string | null;
  themeId:  string | null;
  badgeId:  string | null;
}

// ─── Shop State ───────────────────────────────────────────────────────────────

export interface ShopState {
  ownedItemIds:     string[];
  equipped:         EquippedCosmetics;
  totalSpent:       number;
  purchaseHistory:  { itemId: string; timestamp: number; price: number }[];
}

export function defaultShopState(): ShopState {
  return {
    ownedItemIds:    [],
    equipped:        { titleId: null, borderId: null, themeId: "default", badgeId: null },
    totalSpent:      0,
    purchaseHistory: [],
  };
}
