"use client";

import { Branch, BranchStats, BRANCH_META } from "@/lib/skilltree-types";

interface BranchStatsBarProps {
  stats: Record<Branch, BranchStats>;
}

const BRANCHES: Branch[] = ["push", "pull", "core", "skill"];

const BAR_COLORS: Record<Branch, string> = {
  push:  "bg-orange-400",
  pull:  "bg-sky-400",
  core:  "bg-red-400",
  skill: "bg-purple-400",
};

export default function BranchStatsBar({ stats }: BranchStatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {BRANCHES.map((branch) => {
        const s    = stats[branch];
        const meta = BRANCH_META[branch];
        const bar  = BAR_COLORS[branch];

        return (
          <div
            key={branch}
            className={`relative overflow-hidden bg-surface-800 border rounded-xl px-4 py-3 ${meta.border} noise`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{meta.icon}</span>
                <span className={`font-mono text-[9px] uppercase tracking-widest ${meta.color}`}>
                  {meta.label}
                </span>
              </div>
              {s.mastered && (
                <span className="font-mono text-[8px] text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-1.5">
                  ✓
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mb-1.5">
              <span className={`font-display text-2xl ${meta.color}`}>{s.completed}</span>
              <span className="font-mono text-xs text-white/30">/ {s.total}</span>
            </div>

            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${bar} rounded-full transition-all duration-700`}
                style={{ width: `${s.percent}%` }}
              />
            </div>
            <p className="font-mono text-[9px] text-white/20 mt-1">{s.percent}% complete</p>
          </div>
        );
      })}
    </div>
  );
}
