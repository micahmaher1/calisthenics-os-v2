import {
  SkillNode, NodeProgress, ProgressMap, SkillTreeState,
  Branch, BranchStats, NodeStatus, UnlockRequirement,
} from "./skilltree-types";
import { ALL_NODES, NODE_MAP, BRANCH_NODES, BRANCH_ROOTS } from "./skilltree-data";

// ─── Storage ──────────────────────────────────────────────────────────────────

const TREE_KEY = "calisthenics-os:skilltree:v1";

export function loadTreeState(): SkillTreeState {
  if (typeof window === "undefined") return buildDefaultState();
  try {
    const raw = localStorage.getItem(TREE_KEY);
    if (!raw) return buildDefaultState();
    return JSON.parse(raw) as SkillTreeState;
  } catch {
    return buildDefaultState();
  }
}

export function saveTreeState(state: SkillTreeState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TREE_KEY, JSON.stringify(state));
  } catch {}
}

export function clearTreeState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TREE_KEY);
}

// ─── Default State ────────────────────────────────────────────────────────────

function buildDefaultState(): SkillTreeState {
  const progress: ProgressMap = {};

  // Foundation Training is virtual — initialise root nodes per branch as available
  // BUT only up to 3 total unlocked at one time.
  // Start: push-up, dead-hang, plank as available (3 max), frog-stand locked.
  const initialAvailable = ["push-up", "dead-hang", "plank"];

  ALL_NODES.forEach((node) => {
    const isAvailable = initialAvailable.includes(node.id);
    progress[node.id] = {
      nodeId:      node.id,
      currentReps: node.currentReps, // seed with player's current ability
      status:      isAvailable ? "available" : "locked",
    };
  });

  return { progress, totalTreeXP: 0, treeLevel: 1 };
}

// ─── Branch Stats ─────────────────────────────────────────────────────────────

export function getBranchStats(branch: Branch, progress: ProgressMap): BranchStats {
  const nodes    = BRANCH_NODES[branch];
  const total    = nodes.length;
  const completed = nodes.filter((n) => progress[n.id]?.status === "completed").length;
  const percent  = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { branch, total, completed, percent, mastered: percent === 100 };
}

export function getAllBranchStats(progress: ProgressMap): Record<Branch, BranchStats> {
  return {
    push:  getBranchStats("push",  progress),
    pull:  getBranchStats("pull",  progress),
    core:  getBranchStats("core",  progress),
    skill: getBranchStats("skill", progress),
  };
}

// ─── Unlock Logic ─────────────────────────────────────────────────────────────

export function countAvailableNodes(progress: ProgressMap): number {
  return ALL_NODES.filter(
    (n) => progress[n.id]?.status === "available" || progress[n.id]?.status === "in_progress"
  ).length;
}

function checkRequirement(req: UnlockRequirement, progress: ProgressMap): boolean {
  const branchStats = getAllBranchStats(progress);

  if (req.type === "nodes" || req.type === "both") {
    const nodesOk = req.nodes.every((r) => progress[r.nodeId]?.status === "completed");
    if (!nodesOk) return false;
  }

  if (req.type === "branches" || req.type === "both") {
    const branchesOk = req.branches.every((r) => branchStats[r.branch].mastered);
    if (!branchesOk) return false;
  }

  return true;
}

/**
 * After a node is completed, recalculate which new nodes should unlock.
 * Respects the MAX 3 concurrently available limit.
 */
export function recalcUnlocks(progress: ProgressMap): ProgressMap {
  const updated = { ...progress };
  const MAX_AVAILABLE = 3;

  let changed = true;
  // Iterate until stable (handles cascading unlocks)
  while (changed) {
    changed = false;
    const currentAvailable = countAvailableNodes(updated);
    if (currentAvailable >= MAX_AVAILABLE) break;

    for (const node of ALL_NODES) {
      const prog = updated[node.id];
      if (prog.status !== "locked") continue;

      // Check if prerequisites are met
      const prereqsMet = node.unlockReqs
        ? checkRequirement(node.unlockReqs, updated)
        : false;

      if (prereqsMet) {
        const nowAvailable = countAvailableNodes(updated);
        if (nowAvailable < MAX_AVAILABLE) {
          updated[node.id] = { ...prog, status: "available", unlockedAt: Date.now() };
          changed = true;
          if (countAvailableNodes(updated) >= MAX_AVAILABLE) break;
        }
      }
    }
  }

  return updated;
}

// ─── Progress Update ──────────────────────────────────────────────────────────

export interface UpdateResult {
  state:      SkillTreeState;
  xpGained:   number;
  justCompleted: boolean;
  node:       SkillNode;
}

export function updateNodeProgress(
  state: SkillTreeState,
  nodeId: string,
  newReps: number
): UpdateResult {
  const node = NODE_MAP[nodeId];
  if (!node) throw new Error(`Unknown node: ${nodeId}`);

  const prog = state.progress[nodeId];
  const wasCompleted = prog.status === "completed";
  const clampedReps  = Math.max(0, newReps);
  const justCompleted = !wasCompleted && clampedReps >= node.requiredReps;

  let updatedProgress: ProgressMap = {
    ...state.progress,
    [nodeId]: {
      ...prog,
      currentReps: clampedReps,
      status:      justCompleted ? "completed"
                 : clampedReps > 0 ? "in_progress"
                 : prog.status === "available" ? "available"
                 : prog.status,
      completedAt: justCompleted ? Date.now() : prog.completedAt,
    },
  };

  const xpGained = justCompleted ? node.xpReward : 0;

  // Recalculate unlocks after completion
  if (justCompleted) {
    updatedProgress = recalcUnlocks(updatedProgress);
  }

  const totalTreeXP = state.totalTreeXP + xpGained;
  const treeLevel   = Math.floor(totalTreeXP / 500) + 1;

  const newState: SkillTreeState = { progress: updatedProgress, totalTreeXP, treeLevel };
  saveTreeState(newState);

  return { state: newState, xpGained, justCompleted, node };
}

// ─── Derived Helpers ──────────────────────────────────────────────────────────

export function getNodeStatus(nodeId: string, progress: ProgressMap): NodeStatus {
  return progress[nodeId]?.status ?? "locked";
}

export function getNodeProgress(nodeId: string, progress: ProgressMap): NodeProgress {
  const node = NODE_MAP[nodeId];
  return progress[nodeId] ?? {
    nodeId,
    currentReps: node?.currentReps ?? 0,
    status: "locked",
  };
}

export function getProgressPercent(nodeId: string, progress: ProgressMap): number {
  const node = NODE_MAP[nodeId];
  if (!node) return 0;
  const prog = progress[nodeId];
  if (!prog) return 0;
  if (prog.status === "completed") return 100;
  return Math.min(100, Math.round((prog.currentReps / node.requiredReps) * 100));
}

export function getTotalNodes(): number {
  return ALL_NODES.length;
}

export function getTotalCompleted(progress: ProgressMap): number {
  return ALL_NODES.filter((n) => progress[n.id]?.status === "completed").length;
}
