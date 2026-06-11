"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadMasteryState } from "@/lib/mastery-storage";
import { checkMasteryRewards, MASTERY_REWARDS } from "@/lib/mastery-engine";
import {
  MasteryState, MasteryCategory, MASTERY_CATEGORY_META, MASTERY_RANK_META,
  masteryXPForLevel, masteryXPToNextLevel, calcGlobalMasteryScore,
  getGlobalMasteryRank, GLOBAL_MASTERY_RANK_META, getMasteryRank,
} from "@/lib/mastery-types";
import { loadState } from "@/lib/storage";
import PageHeader from "@/components/ui/PageHeader";

const ALL_CATS: MasteryCategory[] = [
  "strength","power","balance","mobility","endurance",
  "coordination","grip","static_strength","explosiveness","athleticism",
];

export default function MasteryPage() {
  const [masteryState, setMasteryState] = useState<MasteryState | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "rewards">("overview");
  const [appLevel, setAppLevel] = useState(1);
  const [howToExpanded, setHowToExpanded] = useState(false);

  useEffect(() => {
    const ms = loadMasteryState();
    setMasteryState(ms);
    const app = loadState();
    setAppLevel(app.level);
  }, []);

  if (!masteryState) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">⭐</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING MASTERY</span>
        </div>
      </div>
    );
  }

  const globalScore = calcGlobalMasteryScore(masteryState);
  const globalRank  = getGlobalMasteryRank(globalScore);
  const globalMeta  = GLOBAL_MASTERY_RANK_META[globalRank];

  const sortedCats = [...ALL_CATS].sort(
    (a, b) => masteryState.categories[b].level - masteryState.categories[a].level
  );
  const highestCat = sortedCats[0];
  const lowestCat  = sortedCats[sortedCats.length - 1];

  const totalLevelUps = ALL_CATS.reduce(
    (sum, cat) => sum + Math.max(0, masteryState.categories[cat].level - 1),
    0
  );

  const pendingRewards = checkMasteryRewards(masteryState);

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#818cf8 1px,transparent 1px),linear-gradient(90deg,#818cf8 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-indigo-500/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <PageHeader icon="⭐" title="MASTERY SYSTEM" subtitle="Deep Expertise Progression" />

        {/* Global rank banner */}
        <section className="mb-5 bg-surface-800 border border-indigo-500/20 rounded-2xl overflow-hidden">
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
          <div className="p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="flex-1 flex items-center gap-4">
              <div className="text-4xl">{globalMeta.icon}</div>
              <div>
                <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1">Global Mastery Rank</p>
                <p className={`font-display text-3xl tracking-wider ${globalMeta.color}`}>{globalMeta.label}</p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-8 flex-wrap justify-center">
              <StatPill label="Global Score"      value={globalScore.toString()}                      color="text-indigo-400" />
              <StatPill label="Highest Category"  value={`${MASTERY_CATEGORY_META[highestCat].icon} ${MASTERY_CATEGORY_META[highestCat].label}`} color="text-white" />
              <StatPill label="Total Level-Ups"   value={totalLevelUps.toString()}                    color="text-green-400" />
              <StatPill label="Pending Rewards"   value={pendingRewards.length.toString()}            color={pendingRewards.length > 0 ? "text-yellow-400" : "text-white/40"} />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(["overview", "rewards"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-mono text-[9px] uppercase tracking-widest border transition-all ${
                activeTab === tab
                  ? "border-indigo-500/40 text-indigo-400 bg-indigo-500/10"
                  : "border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
              }`}
            >
              {tab === "overview" ? "📊 Overview" : "🏆 Rewards"}
              {tab === "rewards" && pendingRewards.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-[8px]">
                  {pendingRewards.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedCats.map((cat) => (
                <CategoryCard key={cat} cat={cat} masteryState={masteryState} />
              ))}
            </div>

            {/* How to earn section — collapsible */}
            <section className="mt-6 bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
                onClick={() => setHowToExpanded((v) => !v)}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">
                  How to Earn Mastery XP
                </p>
                <span className={`text-white/30 transition-transform ${howToExpanded ? "rotate-180" : ""}`}>▼</span>
              </button>
              {howToExpanded && (
                <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ALL_CATS.map((cat) => {
                    const m = MASTERY_CATEGORY_META[cat];
                    return (
                      <div key={cat} className="flex items-start gap-2.5">
                        <span className="text-lg">{m.icon}</span>
                        <div>
                          <p className={`font-mono text-[9px] uppercase tracking-widest ${m.color} mb-0.5`}>{m.label}</p>
                          <p className="font-body text-xs text-white/40 leading-relaxed">
                            {m.keywords.slice(0, 4).join(", ")}
                            {m.keywords.length > 4 ? "…" : ""}
                            {" "}· +{m.xpPerRep} XP/rep, +{m.xpPerWorkout} XP/workout
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {/* Rewards Tab */}
        {activeTab === "rewards" && (
          <div className="space-y-4">
            {ALL_CATS.map((cat) => {
              const catRewards = MASTERY_REWARDS.filter((r) => r.category === cat);
              if (catRewards.length === 0) return null;
              const m = MASTERY_CATEGORY_META[cat];
              return (
                <section key={cat} className={`bg-surface-800 border ${m.border} rounded-2xl overflow-hidden`}>
                  <div className={`h-0.5 w-full bg-gradient-to-r from-transparent via-current to-transparent ${m.color} opacity-40`} />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{m.icon}</span>
                      <p className={`font-mono text-[9px] uppercase tracking-widest ${m.color}`}>{m.label}</p>
                    </div>
                    <div className="space-y-2">
                      {catRewards.map((reward) => {
                        const claimed = masteryState.grantedRewardKeys.includes(reward.key);
                        const catLevel = masteryState.categories[cat].level;
                        const available = !claimed && catLevel >= reward.level;
                        return (
                          <div
                            key={reward.key}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                              claimed
                                ? "border-white/5 bg-white/2 opacity-50"
                                : available
                                ? "border-yellow-500/30 bg-yellow-500/5 animate-glow-pulse"
                                : "border-white/8 bg-surface-700"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                              claimed ? "bg-white/5" : available ? "bg-yellow-500/15" : "bg-white/5"
                            }`}>
                              {claimed ? "✓" : available ? "🎁" : "🔒"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-mono text-[9px] uppercase tracking-widest ${
                                claimed ? "text-white/30" : available ? "text-yellow-400" : "text-white/50"
                              }`}>
                                {reward.label}
                              </p>
                              <p className="font-mono text-[8px] text-white/25">
                                Level {reward.level} required · +{reward.xpBonus} XP · +{reward.coinBonus} coins
                              </p>
                            </div>
                            <div className="text-right">
                              {claimed ? (
                                <span className="font-mono text-[8px] text-white/25 border border-white/8 rounded px-1.5 py-0.5">CLAIMED</span>
                              ) : available ? (
                                <span className="font-mono text-[8px] text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 rounded px-1.5 py-0.5 animate-pulse">READY</span>
                              ) : (
                                <span className="font-mono text-[8px] text-white/20">Lv. {reward.level}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryCard({ cat, masteryState }: { cat: MasteryCategory; masteryState: MasteryState }) {
  const m   = MASTERY_CATEGORY_META[cat];
  const cm  = masteryState.categories[cat];
  const rm  = MASTERY_RANK_META[cm.rank];

  const xpThisLevel  = masteryXPForLevel(cm.level);
  const xpNextLevel  = masteryXPForLevel(cm.level + 1);
  const xpIntoLevel  = cm.totalXP - xpThisLevel;
  const xpForThisLvl = xpNextLevel - xpThisLevel;
  const pct = xpForThisLvl > 0 ? Math.min(100, Math.round((xpIntoLevel / xpForThisLvl) * 100)) : 100;
  const xpToNext = masteryXPToNextLevel(cm.level, cm.totalXP);

  return (
    <div className={`bg-surface-800 border ${m.border} rounded-2xl overflow-hidden`}>
      <div className={`h-0.5 w-full`} style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)`, opacity: 0.4 }} />
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{m.icon}</span>
            <div>
              <p className={`font-display text-base tracking-wider ${m.color}`}>{m.label}</p>
              <p className="font-mono text-[8px] text-white/30">Level {cm.level}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${rm.border} ${rm.bg}`}>
            <span className="text-sm">{rm.icon}</span>
            <span className={`font-mono text-[8px] uppercase tracking-widest ${rm.color}`}>{rm.label}</span>
          </div>
        </div>

        {/* Description */}
        <p className="font-body text-xs text-white/35 mb-3 leading-relaxed">{m.description}</p>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="font-mono text-[8px] text-white/30 stat-number">{xpIntoLevel.toLocaleString()} / {xpForThisLvl.toLocaleString()} XP to Lv {cm.level + 1}</span>
            <span className="font-mono text-[8px] text-white/25 stat-number">{xpToNext.toLocaleString()} left</span>
          </div>
          <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                pct >= 75 ? "req-met" : pct >= 50 ? "req-close" : "req-far"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Total XP */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] text-white/20 stat-number">Total: {cm.totalXP.toLocaleString()} XP</span>
          <span className={`font-mono text-[9px] ${m.color}`}>{pct}%</span>
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <p className="font-mono text-[8px] text-white/25 uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`font-display text-lg ${color}`}>{value}</p>
    </div>
  );
}
