"use client";

import Link from "next/link";
import { MasteryState, MasteryCategory, MASTERY_CATEGORY_META, calcGlobalMasteryScore } from "@/lib/mastery-types";

export default function MasterySidebarCard({ masteryState }: { masteryState: MasteryState }) {
  const cats     = Object.entries(masteryState.categories) as [MasteryCategory, { level: number; totalXP: number; rank: string }][];
  const sorted   = [...cats].sort((a, b) => b[1].level - a[1].level);
  const top3     = sorted.slice(0, 3);
  const weakest  = sorted[sorted.length - 1];
  const globalScore = calcGlobalMasteryScore(masteryState);
  const maxLevel = Math.max(...cats.map((c) => c[1].level), 1);

  return (
    <div className="bg-surface-800 border border-indigo-500/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>⭐</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">Mastery</span>
        </div>
        <span className="font-mono text-[10px] text-white/40 stat-number">Score: {globalScore}</span>
      </div>
      <div className="space-y-2 mb-3">
        {top3.map(([cat, cm]) => {
          const meta = MASTERY_CATEGORY_META[cat];
          return (
            <div key={cat} className="flex items-center gap-2">
              <span className="text-sm flex-shrink-0">{meta.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between font-mono text-[9px] text-white/40 mb-0.5">
                  <span>{meta.label}</span><span>Lv {cm.level}</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${meta.color.replace("text-", "bg-").replace("-400", "-500/60")}`} style={{ width: `${(cm.level / Math.max(maxLevel, 10)) * 100}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {weakest && (
        <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-3">
          <div className="font-mono text-[9px] text-amber-400 mb-0.5">⚠ Weakest: {MASTERY_CATEGORY_META[weakest[0]].label}</div>
          <div className="font-mono text-[9px] text-white/30">Lv {weakest[1].level} — needs training</div>
        </div>
      )}
      <Link href="/mastery" className="block font-mono text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors">
        View Mastery →
      </Link>
    </div>
  );
}
