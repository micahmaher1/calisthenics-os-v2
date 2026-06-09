// ─── Tree Branches ────────────────────────────────────────────────────────────

export type Branch = "push" | "pull" | "core" | "skill";

export const BRANCH_META: Record<Branch, { label: string; icon: string; color: string; glow: string; border: string; bg: string }> = {
  push:  { label: "Push",            icon: "💪", color: "text-orange-400",  glow: "shadow-orange-500/40",  border: "border-orange-500/40",  bg: "bg-orange-500/10" },
  pull:  { label: "Pull",            icon: "🧲", color: "text-sky-400",     glow: "shadow-sky-500/40",     border: "border-sky-500/40",     bg: "bg-sky-500/10"    },
  core:  { label: "Core",            icon: "🔥", color: "text-red-400",     glow: "shadow-red-500/40",     border: "border-red-500/40",     bg: "bg-red-500/10"    },
  skill: { label: "Skill & Balance", icon: "🤸", color: "text-purple-400",  glow: "shadow-purple-500/40",  border: "border-purple-500/40",  bg: "bg-purple-500/10" },
};

// ─── Node Status ──────────────────────────────────────────────────────────────

export type NodeStatus = "locked" | "available" | "in_progress" | "completed";

// ─── Requirement Types ────────────────────────────────────────────────────────

export interface NodeRequirement {
  nodeId: string;
  label:  string;
}

export interface BranchRequirement {
  branch: Branch;
  label:  string;
}

export type UnlockRequirement =
  | { type: "nodes";    nodes: NodeRequirement[] }
  | { type: "branches"; branches: BranchRequirement[] }
  | { type: "both";     nodes: NodeRequirement[]; branches: BranchRequirement[] };

// ─── Skill Node ───────────────────────────────────────────────────────────────

export interface SkillNode {
  id:          string;
  name:        string;
  description: string;
  branch:      Branch;
  tier:        number;          // visual row (0 = root)
  col:         number;          // visual column within tier
  xpReward:    number;
  skillLevel:  number;          // 1–5 difficulty rating
  // Progress
  requiredReps:   number;       // target reps / seconds
  currentReps:    number;       // player's current best
  unit:           string;       // "reps" | "seconds" | "steps" | "hold"
  // State
  status:         NodeStatus;
  isEndgame:      boolean;
  // Relations
  parents:        string[];     // node IDs
  unlockReqs:     UnlockRequirement | null;
  // Position (set by layout engine, px)
  x?: number;
  y?: number;
}

// ─── Persisted Progress ───────────────────────────────────────────────────────

export interface NodeProgress {
  nodeId:      string;
  currentReps: number;
  status:      NodeStatus;
  unlockedAt?: number;
  completedAt?: number;
}

export type ProgressMap = Record<string, NodeProgress>;

// ─── Branch Stats ─────────────────────────────────────────────────────────────

export interface BranchStats {
  branch:     Branch;
  total:      number;
  completed:  number;
  percent:    number;
  mastered:   boolean; // 100% complete
}

// ─── Full Skill Tree State ────────────────────────────────────────────────────

export interface SkillTreeState {
  progress:    ProgressMap;
  totalTreeXP: number;
  treeLevel:   number;
}
