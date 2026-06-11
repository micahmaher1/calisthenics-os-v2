"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { loadState } from "@/lib/storage";
import { loadStreakState } from "@/lib/streak-storage";
import { loadAchievementState } from "@/lib/achievement-storage";
import { loadQuestState } from "@/lib/quest-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { loadProfile } from "@/lib/profile-storage";
import { loadShopState } from "@/lib/shop-storage";
import { loadCoachSettings, saveCoachSettings, dismissRecommendation } from "@/lib/coach-storage";
import { runCoachAnalysis } from "@/lib/coach-engine";
import {
  CoachAnalysis, CoachSettings, CoachGoalType, CoachPersonality,
  COACH_PERSONALITY_META, COACH_GOAL_META, TRAINING_CATEGORY_META,
  TrainingCategory,
} from "@/lib/coach-types";
import { PRIORITY_STYLES } from "./coach-utils";
import PageHeader from "@/components/ui/PageHeader";
import { CoachRecommendation } from "@/lib/coach-types";
import { ShopState } from "@/lib/shop-types";

const ALL_TRAINING_CATS: TrainingCategory[] = ["push","pull","core","legs","mobility","balance","explosive"];

export default function CoachPage() {
  const [analysis,  setAnalysis]  = useState<CoachAnalysis | null>(null);
  const [settings,  setSettings]  = useState<CoachSettings | null>(null);
  const [shopState, setShopState] = useState<ShopState | null>(null);
  const [activeTab, setActiveTab] = useState<"focus" | "balance" | "forecasts" | "settings">("focus");

  const rebuild = useCallback((newSettings?: CoachSettings) => {
    const s = newSettings ?? loadCoachSettings();
    const appState    = loadState();
    const streakState = loadStreakState();
    const achState    = loadAchievementState();
    const questState  = loadQuestState();
    const recState    = loadRecordsState();
    const profile     = loadProfile();
    const result      = runCoachAnalysis(appState, streakState, achState, questState, recState, profile, s);
    setAnalysis(result);
  }, []);

  useEffect(() => {
    const appState = loadState();
    const s = loadCoachSettings();
    setSettings(s);
    setShopState(loadShopState());
    rebuild(s);
  }, [rebuild]);

  const updateSettings = useCallback((patch: Partial<CoachSettings>) => {
    setSettings((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      saveCoachSettings(next);
      rebuild(next);
      return next;
    });
  }, [rebuild]);

  const handleDismiss = useCallback((id: string) => {
    dismissRecommendation(id);
    setAnalysis((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        recommendations: prev.recommendations.map((r) =>
          r.id === id ? { ...r, dismissed: true } : r
        ),
      };
    });
  }, []);

  if (!analysis || !settings) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🧠</span>
          <span className="font-display text-xl tracking-widest text-white/40">ANALYZING...</span>
        </div>
      </div>
    );
  }

  const personality = COACH_PERSONALITY_META[settings.personality];
  const { todayFocus, recommendations, trainingBalance, milestoneForecasts,
          strengths, weaknesses, recentImprovements } = analysis;

  const ownedPersonalities = shopState
    ? (Object.entries(COACH_PERSONALITY_META) as [CoachPersonality, typeof COACH_PERSONALITY_META[CoachPersonality]][])
        .filter(([, meta]) => meta.shopItemId === null || shopState.ownedItemIds.includes(meta.shopItemId))
        .map(([key]) => key)
    : (["rpg_mentor"] as CoachPersonality[]);

  const activeRecs = recommendations.filter((r) => !r.dismissed);

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(#818cf8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-purple-500/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <PageHeader
          icon="🧠"
          title="AI COACH"
          subtitle="Personalized Training Intelligence"
          actions={
            <div className={`flex items-center gap-2 ${personality.bgClass} ${personality.borderClass} border rounded-xl px-3 py-1.5`}>
              <span className="text-lg">{personality.icon}</span>
              <p className={`font-mono text-[9px] uppercase tracking-widest ${personality.accentColor}`}>{personality.label}</p>
            </div>
          }
        />

        {/* Coach greeting banner */}
        <div className={`${personality.bgClass} border ${personality.borderClass} rounded-2xl px-5 py-4 mb-6 flex items-center gap-4`}>
          <span className="text-4xl flex-shrink-0">{personality.icon}</span>
          <div>
            <p className={`font-body text-sm font-semibold ${personality.accentColor}`}>
              {personality.greeting}
            </p>
            <p className="font-body text-xs text-white/40 mt-0.5">
              {activeRecs.length} recommendation{activeRecs.length !== 1 ? "s" : ""} ready · {milestoneForecasts.length} milestone{milestoneForecasts.length !== 1 ? "s" : ""} forecasted
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {(["focus", "balance", "forecasts", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 font-mono text-[9px] uppercase tracking-widest px-4 py-2 rounded-xl border transition-all ${
                activeTab === tab
                  ? `${personality.bgClass} ${personality.borderClass} ${personality.accentColor}`
                  : "bg-surface-800 border-white/8 text-white/40 hover:text-white/60"
              }`}
            >
              {tab === "focus" ? "🎯 Today" : tab === "balance" ? "⚖️ Balance" : tab === "forecasts" ? "🔮 Forecasts" : "⚙️ Settings"}
            </button>
          ))}
        </div>

        {/* ── Tab: Today's Focus ─────────────────────────────────────────────── */}
        {activeTab === "focus" && (
          <div className="space-y-5">
            {/* Hero focus card */}
            {todayFocus ? (
              <div className={`${personality.bgClass} border ${todayFocus.urgent ? "border-red-500/40" : personality.borderClass} rounded-2xl overflow-hidden`}>
                <div className={`${todayFocus.urgent ? "bg-red-500/10" : ""} px-5 pt-5 pb-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">Today's Priority</span>
                    {todayFocus.urgent && (
                      <span className="font-mono text-[9px] text-red-400 bg-red-500/15 border border-red-500/25 rounded-full px-2 py-0.5 animate-pulse">
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-5xl flex-shrink-0">{todayFocus.icon}</span>
                    <div className="flex-1">
                      <p className={`font-display text-2xl sm:text-3xl tracking-wider ${personality.accentColor}`}>
                        {todayFocus.title}
                      </p>
                      <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">
                        {todayFocus.subtitle}
                      </p>
                      {todayFocus.xpReward && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="font-mono text-[10px] text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1">
                            +{todayFocus.xpReward} XP Potential
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {todayFocus.recommendation.actionHref && (
                    <Link
                      href={todayFocus.recommendation.actionHref}
                      className={`mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-xl border transition-all ${personality.bgClass} ${personality.borderClass} ${personality.accentColor} hover:opacity-80`}
                    >
                      {todayFocus.recommendation.actionLabel ?? "Take Action"} →
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-green-500/8 border border-green-500/20 rounded-2xl p-8 text-center">
                <span className="text-5xl block mb-3">🎉</span>
                <p className="font-display text-2xl text-green-400 tracking-wider">Excellent Form!</p>
                <p className="font-body text-sm text-white/50 mt-2">Your training is well-balanced. Keep up the great work!</p>
              </div>
            )}

            {/* All recommendations */}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-3">
                All Recommendations ({activeRecs.length})
              </p>
              <div className="space-y-3">
                {activeRecs.length === 0 ? (
                  <EmptyState icon="✅" message="No active recommendations. You're crushing it!" />
                ) : (
                  activeRecs.map((rec, i) => (
                    <RecommendationCard
                      key={rec.id}
                      rec={rec}
                      onDismiss={() => handleDismiss(rec.id)}
                      delay={i * 50}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Strengths / Weaknesses / Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InsightGroup title="Strengths" icon="💪" insights={strengths} color="text-green-400" bg="bg-green-500/8" border="border-green-500/20" emptyMsg="Log more workouts to reveal strengths." />
              <InsightGroup title="Areas to Improve" icon="⚠️" insights={weaknesses} color="text-orange-400" bg="bg-orange-500/8" border="border-orange-500/20" emptyMsg="No weaknesses detected — great balance!" />
              <InsightGroup title="Recent Wins" icon="🎯" insights={recentImprovements} color="text-sky-400" bg="bg-sky-500/8" border="border-sky-500/20" emptyMsg="Log workouts to track improvements." />
            </div>
          </div>
        )}

        {/* ── Tab: Training Balance ─────────────────────────────────────────── */}
        {activeTab === "balance" && (
          <div className="space-y-5">
            <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <div className="border-b border-white/5 px-5 py-3">
                <p className="font-display text-lg text-white tracking-wider">Training Balance</p>
                <p className="font-mono text-[9px] text-white/30">Last 14 days · {trainingBalance.total14} total workouts</p>
              </div>
              <div className="p-5">
                {/* Bar chart */}
                <div className="space-y-3">
                  {ALL_TRAINING_CATS.map((cat) => {
                    const count  = trainingBalance.counts[cat];
                    const count7 = trainingBalance.counts7[cat];
                    const max    = Math.max(1, ...ALL_TRAINING_CATS.map((c) => trainingBalance.counts[c]));
                    const pct    = Math.round((count / max) * 100);
                    const meta   = TRAINING_CATEGORY_META[cat];
                    const days   = trainingBalance.daysSince[cat];
                    return (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="w-5 text-center text-sm flex-shrink-0">{meta.icon}</span>
                        <span className={`font-mono text-[9px] w-16 flex-shrink-0 ${meta.color}`}>{meta.label}</span>
                        <div className="flex-1 h-4 bg-surface-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              cat === "push" ? "bg-orange-400" :
                              cat === "pull" ? "bg-sky-400" :
                              cat === "core" ? "bg-red-400" :
                              cat === "legs" ? "bg-green-400" :
                              cat === "mobility" ? "bg-teal-400" :
                              cat === "balance" ? "bg-purple-400" :
                              "bg-yellow-400"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-white/50 w-6 text-right flex-shrink-0">{count}</span>
                        <span className="font-mono text-[8px] text-white/25 w-24 flex-shrink-0 hidden sm:block">
                          {days === null ? "never" : days === 0 ? "today" : `${days}d ago`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Push/Pull ratio insight */}
                {(trainingBalance.counts.push + trainingBalance.counts.pull) >= 2 && (
                  <div className="mt-5 border-t border-white/5 pt-4">
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-2">Push/Pull Ratio</p>
                    {(() => {
                      const push = trainingBalance.counts.push;
                      const pull = trainingBalance.counts.pull;
                      const ratio = pull === 0 ? 999 : push / pull;
                      const balanced = ratio >= 0.5 && ratio <= 2;
                      return (
                        <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${balanced ? "bg-green-500/8 border-green-500/20" : "bg-orange-500/8 border-orange-500/20"}`}>
                          <span className="text-xl">{balanced ? "✅" : "⚠️"}</span>
                          <div>
                            <p className={`font-body text-sm font-semibold ${balanced ? "text-green-400" : "text-orange-400"}`}>
                              {balanced ? "Well Balanced" : ratio > 2 ? "Too Much Push" : "Too Much Pull"}
                            </p>
                            <p className="font-mono text-[9px] text-white/40">
                              {push} push · {pull} pull · ratio {pull === 0 ? "∞" : (push / pull).toFixed(1)}:1
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Category tips */}
                <div className="mt-5 border-t border-white/5 pt-4">
                  <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-3">Category Guidance</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_TRAINING_CATS.slice(0,4).map((cat) => {
                      const meta = TRAINING_CATEGORY_META[cat];
                      return (
                        <div key={cat} className="flex items-start gap-2 p-3 bg-surface-700 rounded-xl border border-white/5">
                          <span className="text-base mt-0.5">{meta.icon}</span>
                          <div>
                            <p className={`font-mono text-[9px] uppercase tracking-widest ${meta.color}`}>{meta.label}</p>
                            <p className="font-body text-[11px] text-white/40 mt-0.5">{meta.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Forecasts ────────────────────────────────────────────────── */}
        {activeTab === "forecasts" && (
          <div className="space-y-4">
            <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
              Milestone predictions based on your current training pace
            </p>
            {milestoneForecasts.length === 0 ? (
              <EmptyState icon="🔮" message="Log more workouts to unlock milestone predictions." />
            ) : (
              milestoneForecasts.map((f, i) => (
                <ForecastCard key={f.id} forecast={f} delay={i * 80} />
              ))
            )}

            {/* Manual goal set */}
            <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden mt-6">
              <div className="border-b border-white/5 px-5 py-3">
                <p className="font-display text-lg text-white tracking-wider">Training Goal</p>
                <p className="font-mono text-[9px] text-white/30">Your goal shapes coaching recommendations</p>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.entries(COACH_GOAL_META) as [CoachGoalType, typeof COACH_GOAL_META[CoachGoalType]][]).map(([key, meta]) => (
                  <button
                    key={key}
                    onClick={() => updateSettings({ selectedGoal: key })}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 border text-left transition-all ${
                      settings.selectedGoal === key
                        ? `${personality.bgClass} ${personality.borderClass} ${personality.accentColor}`
                        : "bg-surface-700 border-white/5 text-white/40 hover:border-white/15 hover:text-white/70"
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{meta.icon}</span>
                    <div className="min-w-0">
                      <p className="font-body text-xs font-semibold truncate">{meta.label}</p>
                    </div>
                    {settings.selectedGoal === key && <span className="ml-auto text-xs flex-shrink-0">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Settings ─────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="space-y-5">
            {/* Personality selector */}
            <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <div className="border-b border-white/5 px-5 py-3">
                <p className="font-display text-lg text-white tracking-wider">Coach Personality</p>
                <p className="font-mono text-[9px] text-white/30">Each personality has a different coaching style</p>
              </div>
              <div className="p-4 space-y-2">
                {(Object.entries(COACH_PERSONALITY_META) as [CoachPersonality, typeof COACH_PERSONALITY_META[CoachPersonality]][]).map(([key, meta]) => {
                  const owned   = ownedPersonalities.includes(key);
                  const active  = settings.personality === key;
                  return (
                    <button
                      key={key}
                      disabled={!owned}
                      onClick={() => owned && updateSettings({ personality: key })}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border text-left transition-all ${
                        active
                          ? `${meta.bgClass} ${meta.borderClass}`
                          : owned
                          ? "bg-surface-700 border-white/8 hover:border-white/15"
                          : "bg-surface-700/50 border-white/5 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-body text-sm font-semibold ${active ? meta.accentColor : "text-white/70"}`}>
                          {meta.label}
                          {active && <span className="ml-2 font-mono text-[8px] text-white/30">ACTIVE</span>}
                        </p>
                        <p className="font-mono text-[9px] text-white/30 truncate">{meta.description}</p>
                      </div>
                      {!owned && meta.shopItemId && (
                        <Link
                          href="/shop"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-shrink-0 font-mono text-[8px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1"
                        >
                          Shop
                        </Link>
                      )}
                      {owned && !active && (
                        <span className="flex-shrink-0 font-mono text-[8px] text-white/30">Select</span>
                      )}
                      {active && (
                        <span className={`flex-shrink-0 text-sm ${meta.accentColor}`}>✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Training goal */}
            <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <div className="border-b border-white/5 px-5 py-3">
                <p className="font-display text-lg text-white tracking-wider">Training Goal</p>
                <p className="font-mono text-[9px] text-white/30">Your primary fitness objective</p>
              </div>
              <div className="p-4 space-y-2">
                {(Object.entries(COACH_GOAL_META) as [CoachGoalType, typeof COACH_GOAL_META[CoachGoalType]][]).map(([key, meta]) => {
                  const active = settings.selectedGoal === key;
                  return (
                    <button
                      key={key}
                      onClick={() => updateSettings({ selectedGoal: key })}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border text-left transition-all ${
                        active
                          ? `${personality.bgClass} ${personality.borderClass}`
                          : "bg-surface-700 border-white/8 hover:border-white/15"
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-body text-sm font-semibold ${active ? personality.accentColor : "text-white/70"}`}>
                          {meta.label}
                        </p>
                        <p className="font-mono text-[9px] text-white/30">{meta.description}</p>
                      </div>
                      {active && <span className={`flex-shrink-0 ${personality.accentColor}`}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RecommendationCard({ rec, onDismiss, delay }: {
  rec: CoachRecommendation; onDismiss: () => void; delay: number;
}) {
  const style = PRIORITY_STYLES[rec.priority];
  return (
    <div
      className={`animate-fade-in ${style.bg} border ${style.border} rounded-2xl overflow-hidden`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">{rec.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className={`font-display text-base tracking-wider ${style.text}`}>{rec.title}</p>
              <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${style.dot}`} />
              <span className="font-mono text-[8px] text-white/25 uppercase">{rec.priority}</span>
            </div>
            <p className="font-body text-xs text-white/50 leading-relaxed">{rec.message}</p>
            {rec.detail && (
              <p className="font-mono text-[9px] text-white/30 mt-1">{rec.detail}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {rec.xpReward && (
                <span className="font-mono text-[9px] text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2 py-0.5">
                  +{rec.xpReward} XP
                </span>
              )}
              {rec.actionHref && (
                <Link
                  href={rec.actionHref}
                  className={`font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-lg border transition-all ${style.bg} ${style.border} ${style.text} hover:opacity-80`}
                >
                  {rec.actionLabel ?? "View"} →
                </Link>
              )}
              <button
                onClick={onDismiss}
                className="ml-auto font-mono text-[8px] text-white/20 hover:text-white/40 transition-colors"
              >
                dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightGroup({ title, icon, insights, color, bg, border, emptyMsg }: {
  title: string; icon: string; insights: { id: string; message: string; metric?: string }[];
  color: string; bg: string; border: string; emptyMsg: string;
}) {
  return (
    <div className={`${bg} border ${border} rounded-2xl overflow-hidden`}>
      <div className="border-b border-white/5 px-4 py-3 flex items-center gap-2">
        <span>{icon}</span>
        <p className={`font-display text-sm tracking-wider ${color}`}>{title}</p>
      </div>
      <div className="p-4 space-y-2">
        {insights.length === 0 ? (
          <p className="font-mono text-[9px] text-white/25 text-center py-2">{emptyMsg}</p>
        ) : (
          insights.map((ins) => (
            <div key={ins.id} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-white/30 mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-body text-xs text-white/60 leading-snug">{ins.message}</p>
                {ins.metric && <p className="font-mono text-[8px] text-white/30">{ins.metric}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ForecastCard({ forecast, delay }: {
  forecast: import("@/lib/coach-types").MilestoneForecast; delay: number;
}) {
  const { label, icon, estimatedDays, current, target, description, confidence } = forecast;
  const pct = Math.min(100, Math.round((current / Math.max(1, target)) * 100));
  const confColors = { high: "text-green-400", medium: "text-yellow-400", low: "text-white/30" };
  return (
    <div
      className="bg-surface-800 border border-white/8 rounded-2xl p-4 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="font-display text-base text-white tracking-wider">{label}</p>
          <p className="font-mono text-[9px] text-white/40">{description}</p>
        </div>
        {estimatedDays !== null && (
          <div className="text-right flex-shrink-0">
            <p className="font-display text-xl text-white">{estimatedDays}</p>
            <p className="font-mono text-[8px] text-white/30">days</p>
          </div>
        )}
      </div>
      <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden mb-1.5">
        <div
          className="h-full bg-white/20 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-white/30">{current} / {target}</span>
        <span className={`font-mono text-[8px] uppercase tracking-wider ${confColors[confidence]}`}>
          {confidence} confidence
        </span>
      </div>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="bg-surface-800 border border-dashed border-white/10 rounded-2xl p-10 text-center">
      <span className="text-4xl block mb-3">{icon}</span>
      <p className="font-body text-sm text-white/30">{message}</p>
    </div>
  );
}
