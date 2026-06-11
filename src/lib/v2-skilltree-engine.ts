import { V2SkillNode, V2SkillTreeState, V2NodeStatus } from "./v2-skilltree-types";
import { V2_SKILL_NODES, V2_NODE_MAP } from "./v2-skilltree-data";

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "calisthenics-os:v2-skilltree:v1";

export function v2LoadTreeState(): V2SkillTreeState {
  if (typeof window === "undefined") return v2DefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return v2DefaultState();
    return JSON.parse(raw) as V2SkillTreeState;
  } catch {
    return v2DefaultState();
  }
}

export function v2SaveTreeState(state: V2SkillTreeState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function v2ClearTreeState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Default State ────────────────────────────────────────────────────────────

function v2DefaultState(): V2SkillTreeState {
  return {
    unlockedNodes:  ["foundation"],
    completedNodes: [],
    totalXP:        0,
  };
}

// ─── Status Calculation ───────────────────────────────────────────────────────

export function v2GetNodeStatus(nodeId: string, state: V2SkillTreeState): V2NodeStatus {
  if (state.completedNodes.includes(nodeId)) return "completed";
  if (state.unlockedNodes.includes(nodeId)) return "unlocked";
  // Check if available (all prereqs unlocked or completed)
  const node = V2_NODE_MAP[nodeId];
  if (!node) return "locked";
  const prereqsMet = node.prerequisites.every(
    (pid) => state.unlockedNodes.includes(pid) || state.completedNodes.includes(pid)
  );
  return prereqsMet ? "available" : "locked";
}

// ─── Unlock a node ────────────────────────────────────────────────────────────

export function v2UnlockNode(state: V2SkillTreeState, nodeId: string): V2SkillTreeState {
  const status = v2GetNodeStatus(nodeId, state);
  if (status !== "available") return state;

  const node = V2_NODE_MAP[nodeId];
  if (!node) return state;

  const newState: V2SkillTreeState = {
    ...state,
    unlockedNodes: [...state.unlockedNodes, nodeId],
  };
  v2SaveTreeState(newState);
  return newState;
}

// ─── Complete a node ──────────────────────────────────────────────────────────

export function v2CompleteNode(state: V2SkillTreeState, nodeId: string): V2SkillTreeState {
  const status = v2GetNodeStatus(nodeId, state);
  if (status !== "unlocked") return state;

  const node = V2_NODE_MAP[nodeId];
  if (!node) return state;

  const newState: V2SkillTreeState = {
    ...state,
    completedNodes: [...state.completedNodes, nodeId],
    totalXP: state.totalXP + node.xpCost,
  };
  v2SaveTreeState(newState);
  return newState;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function v2GetTotalUnlocked(state: V2SkillTreeState): number {
  return state.unlockedNodes.length + state.completedNodes.length;
}

export function v2GetTotalCompleted(state: V2SkillTreeState): number {
  return state.completedNodes.length;
}

export function v2GetLevel(state: V2SkillTreeState): number {
  return Math.floor(state.totalXP / 500) + 1;
}

export function v2GetCategoryProgress(
  state: V2SkillTreeState
): Record<string, { total: number; unlocked: number; completed: number }> {
  const result: Record<string, { total: number; unlocked: number; completed: number }> = {};
  for (const node of V2_SKILL_NODES) {
    if (!result[node.category]) result[node.category] = { total: 0, unlocked: 0, completed: 0 };
    result[node.category].total++;
    if (state.unlockedNodes.includes(node.id)) result[node.category].unlocked++;
    if (state.completedNodes.includes(node.id)) result[node.category].completed++;
  }
  return result;
}

/** Find the closest "available" skill — fewest locked prerequisites */
export function v2FindNextUnlock(state: V2SkillTreeState): V2SkillNode | null {
  const available = V2_SKILL_NODES.filter(
    (n) => v2GetNodeStatus(n.id, state) === "available"
  );
  if (available.length === 0) return null;
  // Pick lowest tier available
  available.sort((a, b) => a.tier - b.tier || a.xpCost - b.xpCost);
  return available[0];
}
