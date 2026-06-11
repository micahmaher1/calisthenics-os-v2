"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import LoadingCard from "@/components/ui/LoadingCard";
import { loadState } from "@/lib/storage";
import { loadStreakState } from "@/lib/streak-storage";
import { loadQuestState, loadWeekBaseline } from "@/lib/quest-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { loadMasteryState } from "@/lib/mastery-storage";
import { loadJourneyState } from "@/lib/journey-storage";
import { loadCoachSettings } from "@/lib/coach-storage";
import { loadTitleState } from "@/lib/title-storage";
import { loadAchievementState } from "@/lib/achievement-storage";
import { loadTreeState, getTotalCompleted } from "@/lib/skilltree-engine";
import { evaluateQuests, thisWeekKey } from "@/lib/quest-engine";
import { evaluateStreak } from "@/lib/streak-engine";
import { runCoachAnalysis } from "@/lib/coach-engine";
import { loadProfile } from "@/lib/profile-storage";
import { MASTERY_CATEGORY_META, calcGlobalMasteryScore, MasteryCategory } from "@/lib/mastery-types";
import { TITLE_RARITY_META } from "@/lib/title-types";
import { TITLE_MAP } from "@/lib/title-data";
import { HubState } from "@/lib/training-hub-types";
import {
  calcTrainingScore,
  calcSmartPriority,
  findLegendaryTarget,
  buildRecentActivity,
} from "@/lib/training-hub-utils";
import { calcLevelProgress, calcXPToNextLevel, getRankInfo } from "@/lib/xp";

// ─── Urgency Styles ──────────────────────────────────────────────────────────

function urgencyStyles(urgency: string) {
  switch (urgency) {
    case "critical": return { border: "border-red-500/60",    bg: "bg-red-500/10",    text: "text-red-400",    glow: "shadow-red-500/20"    };
    case "high":     return { border: "border-orange-500/50", bg: "bg-orange-500/8",  text: "text-orange-400", glow: "shadow-orange-500/15" };
    case "medium":   return { border: "border-sky-500/40",    bg: "bg-sky-500/8",     text: "text-sky-400",    glow: "shadow-sky-500/15"    };
    default:         return { border: "border-white/15",      bg: "bg-white/5",       text: "text-white/50",   glow: ""                     };
  }
}

// ─── SmartPriorityCard ───────────────────────────────────────────────────────

function SmartPriorityCard({ hub }: { hub: HubState }) {
  const p = hub.smartPriority;
  const s = urgencyStyles(p.urgency);
  return (
    <div className={`border rounded-2xl p-5 shadow-lg ${s.border} ${s.bg} ${s.glow}`}>
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">{p.icon}</div>
        <div className="flex-1 min-w-0">
          <div className={`font-mono text-[10px] uppercase tracking-widest mb-1 ${s.text}`}>
            Top Priority
          </div>
          <h2 className="font-display text-lg tracking-wide text-white leading-tight mb-1">
            {p.action}
          </h2>
          <p className="text-sm text-white/50 mb-3">{p.reason}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {p.benefits.map((b, i) => (
              <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/60">
                {b}
              </span>
            ))}
          </div>
          {p.href && (
            <Link
              href={p.href}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-[11px] uppercase tracking-widest transition-all ${s.border} ${s.text} hover:bg-white/10`}
            >
              <span>Start Now</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TodaysFocusCard ─────────────────────────────────────────────────────────

function TodaysFocusCard({ hub }: { hub: HubState }) {
  const focus = hub.coachAnalysis?.todayFocus;
  if (!focus) return null;
  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{focus.icon}</span>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-purple-400">
            Coach Focus
          </div>
          <div className="text-sm font-medium text-white">{focus.title}</div>
        </div>
        {focus.xpReward && (
          <span className="ml-auto font-mono text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
            +{focus.xpReward} XP
          </span>
        )}
      </div>
      <p className="text-xs text-white/50 leading-relaxed">{focus.subtitle}</p>
      {focus.urgent && (
        <div className="mt-2 text-xs text-orange-400 font-mono">⚠ URGENT</div>
      )}
    </div>
  );
}

// ─── DailyMissionsCard ───────────────────────────────────────────────────────

function DailyMissionsCard({ hub }: { hub: HubState }) {
  const quests = hub.questState.daily.quests;
  const completed = quests.filter((q) => q.completed).length;
  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>⚔️</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">Daily Missions</span>
        </div>
        <span className="font-mono text-[10px] text-white/40">{completed}/{quests.length}</span>
      </div>
      <div className="space-y-2">
        {quests.map((q) => (
          <div key={q.templateId} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${q.completed ? "border-green-500/20 bg-green-500/5" : "border-white/8 bg-white/3"}`}>
            <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${q.completed ? "bg-green-500 border-green-500 text-white" : "border-white/20"}`}>
              {q.completed && <span className="text-[10px]">✓</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-medium ${q.completed ? "line-through text-white/30" : "text-white/80"}`}>
                {q.title}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500/60 rounded-full"
                    style={{ width: `${Math.min(100, q.target > 0 ? (q.progress / q.target) * 100 : 0)}%` }}
                  />
                </div>
                <span className="font-mono text-[9px] text-white/30">{q.progress}/{q.target}</span>
              </div>
            </div>
            <span className="font-mono text-[9px] text-yellow-400 flex-shrink-0">+{q.rewardXP}</span>
          </div>
        ))}
      </div>
      <Link href="/quests" className="mt-3 flex items-center justify-center gap-1 text-orange-400 font-mono text-[10px] hover:text-orange-300 transition-colors">
        <span>View All Quests</span><span>→</span>
      </Link>
    </div>
  );
}

// ─── ActiveJourneyCard ───────────────────────────────────────────────────────

import { JOURNEY_MAP } from "@/lib/journey-data";

function ActiveJourneyCard({ hub }: { hub: HubState }) {
  const { journeyState } = hub;
  if (!journeyState.activeJourneyId) {
    return (
      <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span>🗺️</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Active Journey</span>
        </div>
        <p className="text-sm text-white/40 mb-3">No active journey. Start one to track your long-term progress.</p>
        <Link href="/journeys" className="inline-flex items-center gap-1 text-cyan-400 font-mono text-[10px] hover:text-cyan-300 transition-colors">
          <span>Browse Journeys</span><span>→</span>
        </Link>
      </div>
    );
  }

  const def  = JOURNEY_MAP[journeyState.activeJourneyId];
  const prog = journeyState.journeyProgress[journeyState.activeJourneyId];
  if (!def || !prog) return null;

  const pct          = Math.round((prog.completedStageIds.length / def.stages.length) * 100);
  const currentStage = def.stages[prog.currentStageIndex];

  return (
    <div className="bg-surface-800 border border-cyan-500/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{def.icon}</span>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Active Journey</div>
            <div className="text-sm font-medium text-white">{def.name}</div>
          </div>
        </div>
        <span className="font-mono text-[10px] text-cyan-400">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full mb-3">
        <div className="h-full bg-cyan-500/70 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      {currentStage && (
        <div>
          <div className="text-xs text-white/60 mb-2">Current Stage: <span className="text-white/80">{currentStage.name}</span></div>
          <div className="space-y-1">
            {currentStage.requirements.slice(0, 3).map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                <span className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0" />
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <Link href="/journeys" className="mt-3 flex items-center gap-1 text-cyan-400 font-mono text-[10px] hover:text-cyan-300 transition-colors">
        <span>View Journey</span><span>→</span>
      </Link>
    </div>
  );
}

// ─── RecentProgressTimeline ──────────────────────────────────────────────────

function RecentProgressTimeline({ hub }: { hub: HubState }) {
  const items = hub.recentActivity;
  if (items.length === 0) return null;
  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span>📜</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Recent Activity</span>
      </div>
      <div className="space-y-2">
        {items.slice(0, 6).map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-base flex-shrink-0">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/70 truncate">{a.title}</div>
              {a.subtitle && <div className="text-[10px] text-white/30 truncate">{a.subtitle}</div>}
            </div>
            <span className="font-mono text-[9px] text-white/20 flex-shrink-0">
              {new Date(a.timestamp).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ProfileShowcase ─────────────────────────────────────────────────────────

function ProfileShowcase({ hub }: { hub: HubState }) {
  const { appState, titleState, trainingScore } = hub;
  const equippedTitle = titleState.equippedTitleId
    ? TITLE_MAP[titleState.equippedTitleId]
    : null;
  const rarityMeta = equippedTitle ? TITLE_RARITY_META[equippedTitle.rarity] : null;
  const rankInfo   = getRankInfo(appState.level);
  const pct        = calcLevelProgress(appState.totalXP);

  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-3">
        <span className="font-display text-2xl text-green-400">
          {rankInfo.icon ?? "⚡"}
        </span>
      </div>
      <div className="font-display text-sm tracking-wide text-white mb-1">
        {rankInfo.label}
      </div>
      {equippedTitle && rarityMeta && (
        <div className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded-full border mb-2 ${rarityMeta.color} ${rarityMeta.border} ${rarityMeta.bg}`}>
          {equippedTitle.icon} {equippedTitle.name}
        </div>
      )}
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="text-center">
          <div className="font-display text-lg text-white">{appState.level}</div>
          <div className="font-mono text-[9px] text-white/30 uppercase">Level</div>
        </div>
        <div className="text-center">
          <div className={`font-display text-sm ${trainingScore.rankColor}`}>{trainingScore.total}</div>
          <div className="font-mono text-[9px] text-white/30 uppercase">Score</div>
        </div>
        <div className="text-center">
          <div className="font-display text-lg text-white">{appState.coins}</div>
          <div className="font-mono text-[9px] text-white/30 uppercase">Coins</div>
        </div>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-green-500/70 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="font-mono text-[9px] text-white/30 mt-1">{calcXPToNextLevel(appState.totalXP)} XP to next level</div>
      <div className={`mt-2 font-mono text-[10px] ${trainingScore.rankColor}`}>{trainingScore.rank}</div>
      <Link href="/profile" className="mt-3 block text-center font-mono text-[10px] text-white/40 hover:text-white/70 transition-colors">
        View Profile →
      </Link>
    </div>
  );
}

// ─── StreakCommandCard ────────────────────────────────────────────────────────

import { DAILY_MILESTONES } from "@/lib/streak-engine";

function StreakCommandCard({ hub }: { hub: HubState }) {
  const { streakState } = hub;
  const { daily } = streakState;
  const nextMilestone = DAILY_MILESTONES.find((m) => m.days > daily.current);
  const prevMilestone = DAILY_MILESTONES.slice().reverse().find((m) => m.days <= daily.current);
  const milestoneMin  = prevMilestone?.days ?? 0;
  const milestoneMax  = nextMilestone?.days ?? milestoneMin + 7;
  const milestonePct  = milestoneMax > milestoneMin
    ? Math.round(((daily.current - milestoneMin) / (milestoneMax - milestoneMin)) * 100)
    : 100;

  return (
    <div className="bg-surface-800 border border-red-500/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span>🔥</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-red-400">Streak</span>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-display text-4xl text-white">{daily.current}</span>
        <span className="text-sm text-white/40">days</span>
      </div>
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 7 }).map((_, i) => {
          const filled = i < Math.min(daily.current % 7 || (daily.current > 0 ? 7 : 0), 7);
          return (
            <div key={i} className={`flex-1 h-2 rounded-full ${filled ? "bg-red-400" : "bg-white/10"}`} />
          );
        })}
      </div>
      {nextMilestone && (
        <>
          <div className="flex justify-between font-mono text-[9px] text-white/30 mb-1">
            <span>{daily.current} days</span>
            <span>→ {nextMilestone.days} days</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-red-500/60 rounded-full" style={{ width: `${milestonePct}%` }} />
          </div>
          <div className="font-mono text-[9px] text-white/30 mt-1">
            Next: {nextMilestone.label} (+{nextMilestone.xpReward} XP)
          </div>
        </>
      )}
      <div className="mt-2 font-mono text-[9px] text-white/20">Longest: {daily.longest} days</div>
      <Link href="/streaks" className="mt-3 block font-mono text-[10px] text-red-400 hover:text-red-300 transition-colors">
        View Streaks →
      </Link>
    </div>
  );
}

// ─── MasteryOverviewCard ──────────────────────────────────────────────────────

function MasteryOverviewCard({ hub }: { hub: HubState }) {
  const { masteryState } = hub;
  const cats = Object.entries(masteryState.categories) as [MasteryCategory, { level: number; totalXP: number; rank: string }][];
  const sorted    = [...cats].sort((a, b) => b[1].level - a[1].level);
  const top3      = sorted.slice(0, 3);
  const weakest   = sorted[sorted.length - 1];
  const globalScore = calcGlobalMasteryScore(masteryState);
  const maxLevel  = Math.max(...cats.map((c) => c[1].level), 1);

  return (
    <div className="bg-surface-800 border border-indigo-500/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>⭐</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">Mastery</span>
        </div>
        <span className="font-mono text-[10px] text-white/40">Score: {globalScore}</span>
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
        <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div className="font-mono text-[9px] text-amber-400 mb-0.5">⚠ Weakest: {MASTERY_CATEGORY_META[weakest[0]].label}</div>
          <div className="font-mono text-[9px] text-white/30">Lv {weakest[1].level} — needs training</div>
        </div>
      )}
      <Link href="/mastery" className="mt-3 block font-mono text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors">
        View Mastery →
      </Link>
    </div>
  );
}

// ─── LegendaryTargetCard ──────────────────────────────────────────────────────

function LegendaryTargetCard({ hub }: { hub: HubState }) {
  const target = hub.legendaryTarget;
  if (!target) return null;
  const { journeyDef, overallPct, stageName, stagesLeft, topRequirements } = target;

  return (
    <div className="bg-surface-800 border border-yellow-500/30 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{journeyDef.icon}</span>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-yellow-400">Goal Journey</div>
          <div className="text-sm font-medium text-white">{journeyDef.name}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="14" fill="none" stroke="rgb(234 179 8 / 0.7)"
              strokeWidth="3" strokeDasharray={`${(overallPct / 100) * 88} 88`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] text-yellow-400">{overallPct}%</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-white/60">Stage: <span className="text-white/80">{stageName}</span></div>
          <div className="font-mono text-[9px] text-white/30">{stagesLeft} stages remaining</div>
        </div>
      </div>
      {topRequirements.length > 0 && (
        <div className="space-y-1 mb-3">
          {topRequirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-white/40">
              <span className="w-2 h-2 rounded-full bg-yellow-500/30 flex-shrink-0" />
              {req}
            </div>
          ))}
        </div>
      )}
      <Link href="/journeys" className="block font-mono text-[10px] text-yellow-400 hover:text-yellow-300 transition-colors">
        Continue Journey →
      </Link>
    </div>
  );
}

// ─── AICoachPanel ─────────────────────────────────────────────────────────────

function AICoachPanel({ hub }: { hub: HubState }) {
  const recs = hub.coachAnalysis?.recommendations.slice(0, 3) ?? [];
  if (recs.length === 0) return null;
  return (
    <div className="bg-surface-800 border border-purple-500/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span>🧠</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-purple-400">AI Coach</span>
      </div>
      <div className="space-y-2">
        {recs.map((r) => (
          <div key={r.id} className="flex items-start gap-2 p-2 rounded-xl bg-white/3 border border-white/5">
            <span className="text-base flex-shrink-0">{r.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/70 font-medium">{r.title}</div>
              <div className="text-[10px] text-white/40 line-clamp-2">{r.message}</div>
            </div>
          </div>
        ))}
      </div>
      <Link href="/coach" className="mt-3 block font-mono text-[10px] text-purple-400 hover:text-purple-300 transition-colors">
        Open Coach →
      </Link>
    </div>
  );
}

// ─── RewardsReadyCard ─────────────────────────────────────────────────────────

function RewardsReadyCard({ hub }: { hub: HubState }) {
  const questsWithReward  = hub.questState.daily.quests.filter((q) => q.completed && !q.rewarded).length;
  const weeklyWithReward  = hub.questState.weekly.quests.filter((q) => q.completed && !q.rewarded).length;
  const total = questsWithReward + weeklyWithReward;

  if (total === 0) return null;

  return (
    <div className="bg-surface-800 border border-green-500/30 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span>🎁</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-green-400">Rewards Ready</span>
      </div>
      <div className="font-display text-2xl text-white mb-1">{total}</div>
      <div className="text-xs text-white/40 mb-3">unclaimed rewards</div>
      <Link href="/quests" className="block font-mono text-[10px] text-green-400 hover:text-green-300 transition-colors">
        Claim Rewards →
      </Link>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function HubLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {[...Array(4)].map((_, i) => <LoadingCard key={i} rows={2} />)}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrainingHubPage() {
  const [hubData, setHubData] = useState<HubState | null>(null);

  useEffect(() => {
    const appState     = loadState();
    const treeState    = loadTreeState();
    const achState     = loadAchievementState();
    const rawQuestState = loadQuestState();
    const recState     = loadRecordsState();
    const rawStreakState = loadStreakState();
    const masteryState = loadMasteryState();
    const journeyState = loadJourneyState();
    const coachSettings = loadCoachSettings();
    const titleState   = loadTitleState();

    // Evaluate quests
    const wk         = thisWeekKey();
    const skillCount  = getTotalCompleted(treeState.progress);
    const baseline    = loadWeekBaseline(wk, skillCount, appState.level);
    const { newState: questState } = evaluateQuests(
      rawQuestState, appState, treeState, appState.level, baseline.skillsUnlocked, baseline.level,
    );

    // Evaluate streak
    const { newState: streakState } = evaluateStreak(rawStreakState, appState.workouts);

    // Build coach analysis
    const profile      = loadProfile();
    const coachAnalysis = runCoachAnalysis(
      appState, streakState, achState, questState, recState, profile, coachSettings,
    );

    const partial = {
      appState,
      streakState,
      questState,
      recState,
      masteryState,
      journeyState,
      coachAnalysis,
      coachSettings,
      titleState,
      achState,
      treeState,
    };

    const trainingScore   = calcTrainingScore(partial);
    const smartPriority   = calcSmartPriority(partial);
    const legendaryTarget = findLegendaryTarget(journeyState);
    const recentActivity  = buildRecentActivity(appState, achState, journeyState);

    setHubData({
      ...partial,
      trainingScore,
      smartPriority,
      legendaryTarget,
      recentActivity,
    });
  }, []);

  return (
    <div className="min-h-screen bg-surface-900 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <PageHeader
          icon="⚡"
          title="TRAINING HUB"
          subtitle="Your Command Center"
          backHref="/"
          backLabel="Dashboard"
        />

        {!hubData ? (
          <>
            <HubLoadingSkeleton />
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(4)].map((_, i) => <LoadingCard key={i} rows={4} />)}
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <LoadingCard key={i} rows={3} />)}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-surface-800 border border-white/8 rounded-xl p-3 text-center">
                <div className={`font-display text-2xl ${hubData.trainingScore.rankColor}`}>
                  {hubData.trainingScore.total}
                </div>
                <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">Training Score</div>
              </div>
              <div className="bg-surface-800 border border-white/8 rounded-xl p-3 text-center">
                <div className="font-display text-2xl text-green-400">{hubData.appState.level}</div>
                <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">Level</div>
              </div>
              <div className="bg-surface-800 border border-white/8 rounded-xl p-3 text-center">
                <div className="font-display text-2xl text-red-400">{hubData.streakState.daily.current}</div>
                <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">Day Streak</div>
              </div>
              <div className="bg-surface-800 border border-white/8 rounded-xl p-3 text-center">
                <div className="font-display text-2xl text-indigo-400">
                  {calcGlobalMasteryScore(hubData.masteryState)}
                </div>
                <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">Mastery Score</div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Left — main content */}
              <div className="lg:col-span-2 space-y-4">
                <SmartPriorityCard hub={hubData} />
                <TodaysFocusCard hub={hubData} />
                <DailyMissionsCard hub={hubData} />
                <ActiveJourneyCard hub={hubData} />
                <RecentProgressTimeline hub={hubData} />
              </div>

              {/* Right — sidebar */}
              <div className="space-y-4">
                <ProfileShowcase hub={hubData} />
                <StreakCommandCard hub={hubData} />
                <MasteryOverviewCard hub={hubData} />
                <RewardsReadyCard hub={hubData} />
                <LegendaryTargetCard hub={hubData} />
                <AICoachPanel hub={hubData} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
