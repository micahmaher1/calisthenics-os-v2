"use client";

import { useEffect, useState } from "react";
import { MovementStandard, StandardProgress, StandardsState, StandardsAnalytics, MOVEMENT_CATEGORY_META, STANDARD_RANK_META, MovementCategory, RANK_ORDER } from "@/lib/movement-standards-types";
import { MOVEMENT_STANDARDS } from "@/lib/movement-standards-data";
import { calcAllStandardsProgress, calcStandardsAnalytics } from "@/lib/movement-standards-engine";
import { loadStandardsState, setManualValue } from "@/lib/movement-standards-storage";
import { loadRecordsState } from "@/lib/records-storage";
import PageHeader from "@/components/ui/PageHeader";
import StandardCard from "./StandardCard";
import RankBadge from "./RankBadge";

const ALL_CATS = ["all", ...Object.keys(MOVEMENT_CATEGORY_META)] as const;

export default function StandardsPage() {
  const [stdState,     setStdState]     = useState<StandardsState | null>(null);
  const [progressMap,  setProgressMap]  = useState<Record<string, StandardProgress>>({});
  const [analytics,    setAnalytics]    = useState<StandardsAnalytics | null>(null);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [catFilter,    setCatFilter]    = useState<string>("all");

  function reload() {
    const sState = loadStandardsState();
    const rState = loadRecordsState();
    const pm = calcAllStandardsProgress(rState, sState);
    const an = calcStandardsAnalytics(pm);
    setStdState(sState);
    setProgressMap(pm);
    setAnalytics(an);
  }

  useEffect(() => { reload(); }, []);

  function handleSetManualValue(standardId: string, value: number) {
    setManualValue(standardId, value);
    reload();
  }

  const filtered = MOVEMENT_STANDARDS.filter(s =>
    catFilter === "all" || s.category === catFilter
  );

  const selectedStandard = selectedId ? MOVEMENT_STANDARDS.find(s => s.id === selectedId) : null;
  const selectedProgress = selectedId ? progressMap[selectedId] : null;

  return (
    <div className="min-h-screen bg-surface-900 relative">
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: "linear-gradient(#f59e0b 1px,transparent 1px),linear-gradient(90deg,#f59e0b 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-amber-500/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <PageHeader icon="🏅" title="MOVEMENT STANDARDS" subtitle="Universal Ranking Framework" />

        {/* Stats Bar */}
        {analytics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-surface-800 border border-white/8 rounded-xl p-3 text-center">
              <div className="font-display text-2xl text-amber-400">{analytics.totalScore}</div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">Standards Score</div>
            </div>
            <div className="bg-surface-800 border border-yellow-500/20 rounded-xl p-3 text-center">
              <div className="font-display text-2xl text-yellow-400">{analytics.totalGold}</div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">🥇 Gold+</div>
            </div>
            <div className="bg-surface-800 border border-sky-500/20 rounded-xl p-3 text-center">
              <div className="font-display text-2xl text-sky-400">{analytics.totalElite}</div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">💎 Elite+</div>
            </div>
            <div className="bg-surface-800 border border-purple-500/20 rounded-xl p-3 text-center">
              <div className="font-display text-2xl text-purple-400">{analytics.totalLegendary}</div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">👑 Legendary</div>
            </div>
          </div>
        )}

        {/* Closest upgrade banner */}
        {analytics?.closestUpgrade && (
          <div className="mb-5 bg-amber-900/20 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{analytics.closestUpgrade.standard.icon}</span>
            <div>
              <div className="font-display text-sm text-amber-400 tracking-wide">Closest Upgrade</div>
              <div className="font-mono text-xs text-white/60">
                {analytics.closestUpgrade.standard.name} — {analytics.closestUpgrade.progress.pct}% toward{" "}
                <span className={STANDARD_RANK_META[analytics.closestUpgrade.progress.nextRank!].color}>
                  {STANDARD_RANK_META[analytics.closestUpgrade.progress.nextRank!].label}
                </span>
                {analytics.closestUpgrade.progress.remaining !== null && (
                  <span className="text-white/40"> ({analytics.closestUpgrade.progress.remaining} {analytics.closestUpgrade.standard.unit} away)</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          {ALL_CATS.map(cat => {
            const meta = cat === "all" ? null : MOVEMENT_CATEGORY_META[cat as MovementCategory];
            return (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-[9px] uppercase tracking-widest transition-all ${
                  catFilter === cat
                    ? "border-amber-500/50 bg-amber-900/20 text-amber-400"
                    : "border-white/10 bg-surface-800 text-white/40 hover:bg-surface-700 hover:text-white/60"
                }`}
              >
                {meta ? `${meta.icon} ${meta.label}` : "All"}
              </button>
            );
          })}
        </div>

        {/* Main layout: grid + optional detail panel */}
        <div className="flex gap-5">
          {/* Standards grid */}
          <div className={`grid gap-3 ${selectedStandard ? "hidden lg:grid lg:flex-1" : "flex-1"} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}
            style={selectedStandard ? { minWidth: 0 } : {}}
          >
            {filtered.map(standard => (
              <StandardCard
                key={standard.id}
                standard={standard}
                progress={progressMap[standard.id] ?? {
                  standardId: standard.id, currentValue: 0, currentRank: "unranked",
                  nextRank: "bronze", nextValue: null, remaining: null, pct: 0, overallPct: 0,
                }}
                onClick={() => setSelectedId(selectedId === standard.id ? null : standard.id)}
                selected={selectedId === standard.id}
              />
            ))}
          </div>

          {/* Mobile: Show detail on top of list */}
          {selectedStandard && selectedProgress && (
            <div className="lg:hidden fixed inset-0 z-50 bg-surface-900/95 overflow-y-auto p-4">
              <button
                onClick={() => setSelectedId(null)}
                className="mb-4 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white/40 font-mono text-[9px] uppercase tracking-widest"
              >
                ← Back
              </button>
              <DetailPanel
                standard={selectedStandard}
                progress={selectedProgress}
                onSetManualValue={handleSetManualValue}
              />
            </div>
          )}

          {/* Desktop: sidebar detail panel */}
          {selectedStandard && selectedProgress && (
            <div className="hidden lg:block w-80 flex-shrink-0">
              <DetailPanel
                standard={selectedStandard}
                progress={selectedProgress}
                onSetManualValue={handleSetManualValue}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailPanel({
  standard,
  progress,
  onSetManualValue,
}: {
  standard: MovementStandard;
  progress: StandardProgress;
  onSetManualValue: (id: string, value: number) => void;
}) {
  const catMeta = MOVEMENT_CATEGORY_META[standard.category];

  return (
    <div className="bg-surface-800 border border-white/10 rounded-xl p-5 space-y-5 sticky top-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{standard.icon}</span>
        <div>
          <div className="font-display text-lg tracking-wide text-white">{standard.name}</div>
          <div className={`font-mono text-[9px] uppercase tracking-widest ${catMeta.color}`}>
            {catMeta.icon} {catMeta.label}
          </div>
        </div>
      </div>

      {/* Current rank */}
      <div className="flex items-center gap-3">
        <RankBadge rank={progress.currentRank} size="lg" />
        {progress.currentRank === "unranked" && (
          <span className="font-mono text-xs text-white/30">Not ranked yet</span>
        )}
      </div>

      {/* Overall progress ring (CSS circles) */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <circle
              cx="32" cy="32" r="28" fill="none"
              stroke={progress.currentRank === "legendary" ? "#a855f7" : progress.currentRank === "elite" ? "#38bdf8" : progress.currentRank === "gold" ? "#facc15" : progress.currentRank === "silver" ? "#94a3b8" : progress.currentRank === "bronze" ? "#d97706" : "#475569"}
              strokeWidth="4"
              strokeDasharray={`${(progress.overallPct / 100) * 175.9} 175.9`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-xs text-white/70">{progress.overallPct}%</span>
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Overall Progress</div>
          <div className="font-mono text-xs text-white/60 mt-0.5">
            {standard.thresholds.filter(t => progress.currentValue >= t.value).length}/{standard.thresholds.length} ranks
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="font-mono text-xs text-white/40 leading-relaxed">{standard.description}</p>

      {/* Rank thresholds */}
      <div>
        <div className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-2">Rank Thresholds</div>
        <div className="space-y-2">
          {standard.thresholds.map(threshold => {
            const met = standard.measureType === "qualitative"
              ? progress.currentValue >= threshold.value
              : progress.currentValue >= threshold.value;
            const isCurrent = progress.currentRank === threshold.rank;
            const rankMeta = STANDARD_RANK_META[threshold.rank];
            return (
              <div
                key={threshold.rank}
                className={`flex items-center gap-2 p-2 rounded-lg border ${
                  isCurrent ? `${rankMeta.bg} ${rankMeta.border}` : "border-white/5 bg-white/2"
                }`}
              >
                <span className="text-base w-5 text-center">{rankMeta.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`font-mono text-[10px] uppercase tracking-widest ${rankMeta.color}`}>
                    {rankMeta.label}
                  </div>
                  <div className="font-mono text-[9px] text-white/30 truncate">{threshold.description}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-white/50">{threshold.label}</span>
                  {met ? (
                    <span className="text-green-400 text-xs">✓</span>
                  ) : (
                    <span className="text-white/20 text-xs">○</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Self-report for qualitative */}
      {standard.measureType === "qualitative" && standard.qualitativeLabels && (
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-2">
            Self-Report Your Level
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {standard.qualitativeLabels.map((label, idx) => {
              const isSelected = progress.currentValue === idx;
              const threshold = standard.thresholds[idx];
              const rankMeta = threshold ? STANDARD_RANK_META[threshold.rank] : null;
              return (
                <button
                  key={idx}
                  onClick={() => onSetManualValue(standard.id, isSelected ? -1 : idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                    isSelected
                      ? `${rankMeta?.bg ?? "bg-white/10"} ${rankMeta?.border ?? "border-white/20"} ${rankMeta?.color ?? "text-white"}`
                      : "border-white/5 bg-white/2 text-white/40 hover:bg-white/5 hover:text-white/60"
                  }`}
                >
                  <span className="font-mono text-[10px]">{idx + 1}.</span>
                  <span className="font-mono text-[10px] flex-1">{label}</span>
                  {isSelected && <span className="text-xs">✓</span>}
                </button>
              );
            })}
          </div>
          <div className="font-mono text-[9px] text-white/20 mt-1.5">
            Click to set your current level. Click again to unset.
          </div>
        </div>
      )}

      {/* Current value for reps/seconds */}
      {standard.measureType !== "qualitative" && (
        <div className="bg-white/3 border border-white/5 rounded-lg p-3">
          <div className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-1">Personal Best</div>
          <div className="font-display text-xl text-white">
            {progress.currentValue} <span className="text-sm text-white/40">{standard.unit}</span>
          </div>
          {progress.nextRank && progress.remaining !== null && (
            <div className="font-mono text-[10px] text-white/30 mt-1">
              {progress.remaining} {standard.unit} to {STANDARD_RANK_META[progress.nextRank].label}
            </div>
          )}
          <div className="font-mono text-[9px] text-white/20 mt-1">
            Records auto-populate from your Personal Records page
          </div>
        </div>
      )}

      {/* Tips */}
      {standard.tips.length > 0 && (
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-2">Tips</div>
          <ul className="space-y-1">
            {standard.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500/60 text-xs mt-0.5">→</span>
                <span className="font-mono text-[10px] text-white/40">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related links */}
      {(standard.relatedSkillId || standard.relatedJourneyId) && (
        <div className="flex gap-2 flex-wrap">
          {standard.relatedSkillId && (
            <a href="/skills" className="px-2.5 py-1 rounded-lg border border-teal-500/20 bg-teal-900/10 text-teal-400 font-mono text-[9px] uppercase tracking-widest hover:bg-teal-900/20 transition-colors">
              🎯 Skills
            </a>
          )}
          {standard.relatedJourneyId && (
            <a href="/journeys" className="px-2.5 py-1 rounded-lg border border-cyan-500/20 bg-cyan-900/10 text-cyan-400 font-mono text-[9px] uppercase tracking-widest hover:bg-cyan-900/20 transition-colors">
              🗺️ Journey
            </a>
          )}
        </div>
      )}
    </div>
  );
}
