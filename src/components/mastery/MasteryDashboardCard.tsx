"use client";

import Link from "next/link";
import {
  MasteryState, MasteryCategory, MASTERY_CATEGORY_META,
  calcGlobalMasteryScore, getGlobalMasteryRank, GLOBAL_MASTERY_RANK_META,
  masteryXPForLevel, masteryXPToNextLevel,
} from "@/lib/mastery-types";

const ALL_CATS: MasteryCategory[] = [
  "strength","power","balance","mobility","endurance",
  "coordination","grip","static_strength","explosiveness","athleticism",
];

interface Props {
  masteryState: MasteryState;
}

export default function MasteryDashboardCard({ masteryState }: Props) {
  const globalScore = calcGlobalMasteryScore(masteryState);
  const globalRank  = getGlobalMasteryRank(globalScore);
  const globalMeta  = GLOBAL_MASTERY_RANK_META[globalRank];

  const sortedCats = [...ALL_CATS].sort(
    (a, b) => masteryState.categories[b].level - masteryState.categories[a].level
  );
  const top3   = sortedCats.slice(0, 3);
  const weakest = sortedCats[sortedCats.length - 1];

  return (
    <div className="bg-surface-800 border border-indigo-500/20 rounded-2xl overflow-hidden">
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">Mastery</p>
              <p className="font-mono text-[8px] text-white/20">Global Score</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-display text-2xl ${globalMeta.color}`}>{globalScore}</p>
            <p className={`font-mono text-[8px] ${globalMeta.color} opacity-70`}>{globalMeta.label}</p>
          </div>
        </div>

        {/* Top 3 */}
        <div className="space-y-2 mb-3">
          {top3.map((cat) => {
            const m  = MASTERY_CATEGORY_META[cat];
            const cm = masteryState.categories[cat];
            const xpThisLevel  = masteryXPForLevel(cm.level);
            const xpNextLevel  = masteryXPForLevel(cm.level + 1);
            const xpIntoLevel  = cm.totalXP - xpThisLevel;
            const xpForThisLvl = xpNextLevel - xpThisLevel;
            const pct = xpForThisLvl > 0 ? Math.min(100, Math.round((xpIntoLevel / xpForThisLvl) * 100)) : 100;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{m.icon}</span>
                    <span className={`font-mono text-[8px] uppercase tracking-widest ${m.color}`}>{m.label}</span>
                  </div>
                  <span className="font-mono text-[8px] text-white/30">Lv. {cm.level}</span>
                </div>
                <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: "currentColor" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Weakest */}
        <div className="flex items-center justify-between py-2 border-t border-white/5 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[8px] text-white/25 uppercase tracking-widest">Weakest</span>
            <span className="text-sm">{MASTERY_CATEGORY_META[weakest].icon}</span>
            <span className={`font-mono text-[8px] ${MASTERY_CATEGORY_META[weakest].color}`}>
              {MASTERY_CATEGORY_META[weakest].label}
            </span>
          </div>
          <span className="font-mono text-[8px] text-white/30">
            Lv. {masteryState.categories[weakest].level}
          </span>
        </div>

        <Link
          href="/mastery"
          className="flex items-center justify-between px-3 py-2 rounded-xl border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 transition-all"
        >
          <span className="font-mono text-[9px] uppercase tracking-widest">View All</span>
          <span className="font-mono text-[9px]">→</span>
        </Link>
      </div>
    </div>
  );
}
