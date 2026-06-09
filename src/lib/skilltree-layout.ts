import { SkillNode } from "./skilltree-types";
import { BRANCH_NODES } from "./skilltree-data";

export interface LayoutNode extends SkillNode {
  x: number;
  y: number;
}

// ─── Layout Constants ─────────────────────────────────────────────────────────

const BRANCH_CONFIGS = {
  push:  { xOffset: 0,    color: "#f97316" },
  pull:  { xOffset: 780,  color: "#38bdf8" },
  core:  { xOffset: 1560, color: "#f87171" },
  skill: { xOffset: 2340, color: "#c084fc" },
} as const;

const NODE_W   = 180;
const NODE_H   = 90;
const COL_GAP  = 200;
const ROW_GAP  = 140;
const COLS     = 5; // max columns per branch

export const BRANCH_WIDTH  = COLS * COL_GAP;
export const BRANCH_GAP    = 120;
export const CANVAS_WIDTH  = (BRANCH_WIDTH + BRANCH_GAP) * 4;
export const CANVAS_HEIGHT = 11 * ROW_GAP + 200;

export function layoutNodes(): LayoutNode[] {
  const result: LayoutNode[] = [];

  const branches = ["push", "pull", "core", "skill"] as const;

  branches.forEach((branch, bi) => {
    const xBase = bi * (BRANCH_WIDTH + BRANCH_GAP);
    const nodes = BRANCH_NODES[branch];

    nodes.forEach((node) => {
      const x = xBase + node.col * COL_GAP + 60;
      const y = node.tier * ROW_GAP + 80;
      result.push({ ...node, x, y });
    });
  });

  return result;
}

export function getBranchColor(branch: string): string {
  return BRANCH_CONFIGS[branch as keyof typeof BRANCH_CONFIGS]?.color ?? "#4ade80";
}

export const NODE_WIDTH  = NODE_W;
export const NODE_HEIGHT = NODE_H;
