// ─── Category ─────────────────────────────────────────────────────────────────

export type SkillCategory =
  | "strength"
  | "balance"
  | "mobility"
  | "endurance"
  | "coordination"
  | "grip"
  | "static_strength"
  | "power"
  | "explosiveness"
  | "athleticism"
  | "hybrid"
  | "special";

export const CATEGORY_META: Record<
  SkillCategory,
  { label: string; color: string; icon: string }
> = {
  strength:        { label: "Strength",        color: "#f97316", icon: "💪" },
  balance:         { label: "Balance",          color: "#38bdf8", icon: "🤸" },
  mobility:        { label: "Mobility",         color: "#4ade80", icon: "🧘" },
  endurance:       { label: "Endurance",        color: "#22d3ee", icon: "🏃" },
  coordination:    { label: "Coordination",     color: "#a855f7", icon: "🐻" },
  grip:            { label: "Grip",             color: "#f59e0b", icon: "✊" },
  static_strength: { label: "Static Strength",  color: "#94a3b8", icon: "🗿" },
  power:           { label: "Power",            color: "#facc15", icon: "⚡" },
  explosiveness:   { label: "Explosiveness",    color: "#ec4899", icon: "💥" },
  athleticism:     { label: "Athleticism",      color: "#818cf8", icon: "🏅" },
  hybrid:          { label: "Hybrid",           color: "#e879f9", icon: "🔀" },
  special:         { label: "Special",          color: "#fbbf24", icon: "⭐" },
};

// ─── Skill Node Status ────────────────────────────────────────────────────────

export type V2NodeStatus = "locked" | "available" | "unlocked" | "completed";

// ─── Skill Node ───────────────────────────────────────────────────────────────

export interface V2SkillNode {
  id:            string;
  name:          string;
  category:      SkillCategory;
  tier:          number;           // 0=foundation, 1=beginner ... 7=legendary
  prerequisites: string[];         // array of skill ids
  x:             number;           // pixel position for rendering
  y:             number;
  xpCost:        number;
  description:   string;
  icon:          string;
}

// ─── Tree State ───────────────────────────────────────────────────────────────

export interface V2SkillTreeState {
  unlockedNodes:  string[];
  completedNodes: string[];
  totalXP:        number;
}
