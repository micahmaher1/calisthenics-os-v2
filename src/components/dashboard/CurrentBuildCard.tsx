"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadMasteryState } from "@/lib/mastery-storage";
import {
  MasteryState, MasteryCategory, MASTERY_CATEGORY_META,
  calcGlobalMasteryScore, getGlobalMasteryRank, GLOBAL_MASTERY_RANK_META,
  masteryXPForLevel,
} from "@/lib/mastery-types";

const ALL_CATS: MasteryCategory[] = [
  "strength","power","balance","mobility","endurance",
  "coordination","grip","static_strength","explosiveness","athleticism",
];

export default function CurrentBuildCard() {
  const [masteryState, setMasteryState] = useState<MasteryState | null>(null);

  useEffect(() => {
    try {
      setMasteryState(loadMasteryState());
    } catch {
      // ignore
    }
  }, []);

  if (!masteryState) return null;

  const globalScore = calcGlobalMasteryScore(masteryState);
  const globalRank  = getGlobalMasteryRank(globalScore);
  const globalMeta  = GLOBAL_MASTERY_RANK_META[globalRank];
  const maxLevel    = Math.max(...ALL_CATS.map((c) => masteryState.categories[c]?.level ?? 0), 1);

  return (
    <div className="bg-surface-800 border border-indigo-500/20 rounded-2xl overflow-hidden">
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span>🧬</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">Current Build</span>
          </div>
          <div className="text-right">
            <span className={`font-display text-lg stat-number ${globalMeta.color}`}>{globalScore}</span>
            <span className={`ml-1 font-mono text-[9px] ${globalMeta.color} opacity-70`}>{globalMeta.icon}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          {ALL_CATS.map((cat) => {
            const m  = MASTERY_CATEGORY_META[cat];
            const cm = masteryState.categories[cat];
            if (!cm) return null;
            const xpThisLevel  = masteryXPForLevel(cm.level);
            const xpNextLevel  = masteryXPForLevel(cm.level + 1);
            const xpIntoLevel  = cm.totalXP - xpThisLevel;
            const xpForThisLvl = xpNextLevel - xpThisLevel;
            const pct = xpForThisLvl > 0 ? Math.min(100, Math.round((xpIntoLevel / xpForThisLvl) * 100)) : 100;
            const barWidth = maxLevel > 0 ? `${Math.min(100, Math.round((cm.level / maxLevel) * 100))}%` : "0%";

            return (
              <div key={cat} className="flex items-center gap-2">
                <span className="text-xs w-4 text-center flex-shrink-0">{m.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between font-mono text-[8px] text-white/30 mb-0.5">
                    <span className={m.color}>{m.label}</span>
                    <span className="stat-number">Lv {cm.level}</span>
                  </div>
                  <div className="h-1 bg-surface-600/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all opacity-70"
                      style={{
                        width: barWidth,
                        background: `var(--${m.color.replace("text-", "").replace("-400", "")}, currentColor)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href="/mastery"
          className="mt-3 flex items-center justify-between px-3 py-1.5 rounded-xl border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 transition-all"
        >
          <span className="font-mono text-[9px] uppercase tracking-widest">View Mastery</span>
          <span className="font-mono text-[9px]">→</span>
        </Link>
      </div>
    </div>
  );
}
