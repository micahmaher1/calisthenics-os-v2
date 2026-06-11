"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import V2SkillTreeCanvas from "./V2SkillTreeCanvas";
import {
  v2LoadTreeState,
  v2GetTotalUnlocked,
  v2GetTotalCompleted,
  v2GetLevel,
  v2GetCategoryProgress,
} from "@/lib/v2-skilltree-engine";
import { V2SkillTreeState, CATEGORY_META } from "@/lib/v2-skilltree-types";
import { V2_SKILL_NODES } from "@/lib/v2-skilltree-data";

export default function V2SkillTreePage() {
  const [treeState, setTreeState] = useState<V2SkillTreeState | null>(null);

  useEffect(() => {
    setTreeState(v2LoadTreeState());
  }, []);

  if (!treeState) {
    return (
      <div className="flex h-screen bg-slate-900 items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🌳</span>
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500">Loading Skill Tree</span>
        </div>
      </div>
    );
  }

  const totalNodes     = V2_SKILL_NODES.length;
  const totalUnlocked  = v2GetTotalUnlocked(treeState);
  const totalCompleted = v2GetTotalCompleted(treeState);
  const level          = v2GetLevel(treeState);
  const catProgress    = v2GetCategoryProgress(treeState);

  // Count categories with at least one completion
  const activeCats = Object.values(catProgress).filter((c) => c.completed > 0).length;

  return (
    <div className="flex flex-col h-screen bg-slate-900 overflow-hidden">
      <PageHeader icon="🌳" title="SKILL TREE" subtitle="Unlock New Abilities" />

      {/* Stats bar */}
      <div className="flex gap-4 px-4 py-2 bg-slate-800 border-b border-slate-700/50 overflow-x-auto scrollbar-hide flex-shrink-0">
        <StatBadge icon="🔓" label="Unlocked" value={`${totalUnlocked} / ${totalNodes}`} color="text-emerald-400" />
        <StatBadge icon="✅" label="Completed" value={String(totalCompleted)} color="text-green-400" />
        <StatBadge icon="🏅" label="Categories" value={`${activeCats} / 10`} color="text-purple-400" />
        <StatBadge icon="⭐" label="Level" value={String(level)} color="text-yellow-400" />
        <StatBadge icon="⚡" label="Total XP" value={treeState.totalXP.toLocaleString()} color="text-cyan-400" />
      </div>

      {/* Category legend */}
      <div className="flex gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800 overflow-x-auto scrollbar-hide flex-shrink-0">
        {Object.entries(CATEGORY_META)
          .filter(([k]) => k !== "special" && k !== "hybrid")
          .map(([key, meta]) => {
            const prog = catProgress[key] ?? { total: 0, unlocked: 0, completed: 0 };
            return (
              <div key={key} className="flex items-center gap-1.5 flex-shrink-0">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <span className="font-mono text-[8px] text-slate-400 whitespace-nowrap">
                  {meta.label} <span style={{ color: meta.color }}>{prog.completed}/{prog.total}</span>
                </span>
              </div>
            );
          })}
      </div>

      {/* Tree canvas — takes remaining height */}
      <div className="flex-1 overflow-hidden">
        <V2SkillTreeCanvas
          treeState={treeState}
          onStateChange={setTreeState}
        />
      </div>
    </div>
  );
}

// ─── Stat Badge ───────────────────────────────────────────────────────────────

function StatBadge({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-base">{icon}</span>
      <div>
        <p className="font-mono text-[7px] uppercase tracking-widest text-slate-500 leading-none">{label}</p>
        <p className={`font-mono text-xs font-bold leading-tight ${color}`}>{value}</p>
      </div>
    </div>
  );
}
