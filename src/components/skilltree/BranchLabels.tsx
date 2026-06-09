"use client";

import { Branch, BRANCH_META } from "@/lib/skilltree-types";
import { BranchStats } from "@/lib/skilltree-types";
import { BRANCH_NODES } from "@/lib/skilltree-data";
import { BRANCH_WIDTH, BRANCH_GAP } from "@/lib/skilltree-layout";

interface BranchLabelsProps {
  branchStats: Record<Branch, BranchStats>;
}

const BRANCHES: Branch[] = ["push", "pull", "core", "skill"];

// Tailwind color → hex (for SVG use)
const COLOR_HEX: Record<string, string> = {
  "text-orange-400": "#fb923c",
  "text-sky-400":    "#38bdf8",
  "text-red-400":    "#f87171",
  "text-purple-400": "#c084fc",
};

export default function BranchLabels({ branchStats }: BranchLabelsProps) {
  return (
    <g className="branch-labels">
      {BRANCHES.map((branch, i) => {
        const meta  = BRANCH_META[branch];
        const stats = branchStats[branch];
        const xBase = i * (BRANCH_WIDTH + BRANCH_GAP);
        const cx    = xBase + BRANCH_WIDTH / 2 - 20;
        const color = COLOR_HEX[meta.color] ?? "#4ade80";
        const pct   = stats.percent;

        return (
          <g key={branch} transform={`translate(${cx}, 18)`}>
            {/* Branch background pill */}
            <rect
              x={-80} y={-14} width={170} height={28}
              rx={14} fill={color} fillOpacity={0.08}
              stroke={color} strokeOpacity={0.3} strokeWidth={1}
            />

            {/* Icon + label */}
            <text x={-60} y={5} fontSize={14} dominantBaseline="middle">
              {meta.icon}
            </text>
            <text
              x={-38} y={4}
              fontSize={11} fontWeight="800"
              fontFamily="'DM Sans', sans-serif"
              fill={color} letterSpacing="1"
            >
              {meta.label.toUpperCase()}
            </text>

            {/* Progress fraction */}
            <text
              x={80} y={4}
              textAnchor="end"
              fontSize={8.5}
              fontFamily="'JetBrains Mono', monospace"
              fill={stats.mastered ? "#22c55e" : "#666"}
            >
              {stats.completed}/{stats.total}
            </text>

            {/* Mini progress bar */}
            <rect x={-80} y={16} width={170} height={3} rx={1.5} fill="#1a1a1a" />
            <rect
              x={-80} y={16}
              width={170 * pct / 100} height={3} rx={1.5}
              fill={stats.mastered ? "#22c55e" : color}
              opacity={0.8}
            />

            {/* Mastered badge */}
            {stats.mastered && (
              <text x={-60} y={30} fontSize={8} fill="#22c55e" fontFamily="'JetBrains Mono', monospace">
                ✓ MASTERED
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
