"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StandardsState, StandardProgress, StandardsAnalytics, STANDARD_RANK_META } from "@/lib/movement-standards-types";
import { FEATURED_STANDARDS } from "@/lib/movement-standards-data";
import { calcAllStandardsProgress, calcStandardsAnalytics } from "@/lib/movement-standards-engine";
import { loadStandardsState } from "@/lib/movement-standards-storage";
import { loadRecordsState } from "@/lib/records-storage";
import RankBadge from "./RankBadge";

export default function StandardsDashboardCard() {
  const [progressMap, setProgressMap] = useState<Record<string, StandardProgress>>({});
  const [analytics,   setAnalytics]   = useState<StandardsAnalytics | null>(null);

  useEffect(() => {
    const sState = loadStandardsState();
    const rState = loadRecordsState();
    const pm = calcAllStandardsProgress(rState, sState);
    const an = calcStandardsAnalytics(pm);
    setProgressMap(pm);
    setAnalytics(an);
  }, []);

  const topStandards = FEATURED_STANDARDS.slice(0, 3);

  return (
    <div className="bg-surface-800 border border-amber-500/20 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏅</span>
          <div>
            <div className="font-display text-sm tracking-wide text-white">Movement Standards</div>
            <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Universal Rankings</div>
          </div>
        </div>
        {analytics && (
          <div className="text-right">
            <div className="font-display text-xl text-amber-400">{analytics.totalScore}</div>
            <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Score</div>
          </div>
        )}
      </div>

      {/* Top standards */}
      <div className="space-y-2 mb-3">
        {topStandards.map(standard => {
          const progress = progressMap[standard.id];
          if (!progress) return null;
          const rankMeta = STANDARD_RANK_META[progress.currentRank];
          const nextMeta = progress.nextRank ? STANDARD_RANK_META[progress.nextRank] : null;

          return (
            <div key={standard.id} className="flex items-center gap-2">
              <span className="text-sm w-5">{standard.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-mono text-[10px] text-white/60 truncate">{standard.name}</span>
                  <RankBadge rank={progress.currentRank} size="sm" />
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      progress.currentRank === "legendary" ? "bg-purple-400" :
                      progress.currentRank === "elite" ? "bg-sky-400" :
                      progress.currentRank === "gold" ? "bg-yellow-400" :
                      progress.currentRank === "silver" ? "bg-slate-400" :
                      progress.currentRank === "bronze" ? "bg-amber-600" : "bg-slate-700"
                    }`}
                    style={{ width: `${progress.pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Closest upgrade */}
      {analytics?.closestUpgrade && (
        <div className="mb-3 bg-amber-900/15 border border-amber-500/20 rounded-lg px-3 py-2">
          <div className="font-mono text-[9px] text-amber-400/80 uppercase tracking-widest mb-0.5">Closest Upgrade</div>
          <div className="font-mono text-[10px] text-white/50">
            {analytics.closestUpgrade.progress.remaining !== null && analytics.closestUpgrade.standard.measureType !== "qualitative"
              ? `${analytics.closestUpgrade.progress.remaining} ${analytics.closestUpgrade.standard.unit} from `
              : "Next level toward "}
            <span className={STANDARD_RANK_META[analytics.closestUpgrade.progress.nextRank!].color}>
              {STANDARD_RANK_META[analytics.closestUpgrade.progress.nextRank!].label}
            </span>
            {" "}{analytics.closestUpgrade.standard.name}
          </div>
        </div>
      )}

      {/* Stats row */}
      {analytics && (
        <div className="flex gap-3 mb-3">
          <div className="flex-1 text-center">
            <div className="font-display text-sm text-yellow-400">{analytics.totalGold}</div>
            <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Gold</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-display text-sm text-sky-400">{analytics.totalElite}</div>
            <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Elite</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-display text-sm text-purple-400">{analytics.totalLegendary}</div>
            <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Legend</div>
          </div>
        </div>
      )}

      <Link
        href="/standards"
        className="block w-full text-center px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-900/15 text-amber-400 font-mono text-[9px] uppercase tracking-widest hover:bg-amber-900/25 transition-colors"
      >
        VIEW STANDARDS →
      </Link>
    </div>
  );
}
