"use client";

import { useEffect, useState, useCallback } from "react";
import { loadState, saveState } from "@/lib/storage";
import { loadStreakState, saveStreakState } from "@/lib/streak-storage";
import { evaluateStreak, DAILY_MILESTONES, WEEKLY_MILESTONES, getConsistencyRank, nextDailyMilestone, nextWeeklyMilestone, weeklyWorkoutsNeeded } from "@/lib/streak-engine";
import { StreakState } from "@/lib/streak-types";
import PageHeader from "@/components/ui/PageHeader";
import StreakToast from "./StreakToast";
import { StreakNotification } from "@/lib/streak-types";

export default function StreakPage() {
  const [streakState, setStreakState] = useState<StreakState | null>(null);
  const [notif,  setNotif]  = useState<StreakNotification | null>(null);
  const [queue,  setQueue]  = useState<StreakNotification[]>([]);

  // Drain notification queue
  useEffect(() => {
    if (!notif && queue.length > 0) {
      setNotif(queue[0]);
      setQueue((q) => q.slice(1));
    }
  }, [notif, queue]);

  useEffect(() => {
    const appState = loadState();
    const raw = loadStreakState();
    const { newState, totalXP, totalCoins, notifications } = evaluateStreak(raw, appState.workouts);

    // Grant XP/coin rewards
    if (totalXP > 0 || totalCoins > 0) {
      const updated = {
        ...appState,
        totalXP: appState.totalXP + totalXP,
        coins:   appState.coins   + totalCoins,
        level:   Math.floor((appState.totalXP + totalXP) / 100) + 1,
      };
      saveState(updated);
    }

    saveStreakState(newState);
    setStreakState(newState);
    if (notifications.length > 0) setQueue(notifications);
  }, []);

  if (!streakState) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🔥</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING STREAKS</span>
        </div>
      </div>
    );
  }

  const { daily, weekly, freezesAvailable, freezesUsed, totalDaysWorkedOut } = streakState;
  const consistencyRank = getConsistencyRank(daily.longest);
  const nextDailyMs     = nextDailyMilestone(streakState);
  const nextWeeklyMs    = nextWeeklyMilestone(streakState);
  const weeklyNeed      = weeklyWorkoutsNeeded(streakState);

  // Compute which days of this week (Mon-Sun) have workouts
  const today    = new Date();
  const dayOfWk  = today.getDay(); // 0=Sun
  const monOffset = dayOfWk === 0 ? -6 : 1 - dayOfWk;
  const weekDays  = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + monOffset + i);
    return d.toISOString().slice(0, 10);
  });
  // Use daily streak lastDate to infer today is worked out
  const todayStr = today.toISOString().slice(0, 10);
  const workedDates = new Set<string>();
  if (daily.lastDate) workedDates.add(daily.lastDate);
  // Mark consecutive streak days back from lastDate
  if (daily.lastDate && daily.current > 0) {
    const last = new Date(daily.lastDate);
    for (let i = 0; i < Math.min(daily.current, 7); i++) {
      const d = new Date(last);
      d.setDate(last.getDate() - i);
      workedDates.add(d.toISOString().slice(0, 10));
    }
  }
  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(#fb923c 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-orange-500/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <PageHeader icon="🔥" title="STREAK TRACKER" subtitle="Consistency Is The Key" />

        {/* Hero stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatTile
            label="Daily Streak"
            value={daily.current.toString()}
            sub="days"
            color="text-orange-400"
            icon="🔥"
          />
          <StatTile
            label="Best Streak"
            value={daily.longest.toString()}
            sub="days"
            color="text-yellow-400"
            icon="⭐"
          />
          <StatTile
            label="Weekly Streak"
            value={weekly.current.toString()}
            sub="weeks"
            color="text-sky-400"
            icon="⚔️"
          />
          <StatTile
            label="Total Days"
            value={totalDaysWorkedOut.toString()}
            sub="trained"
            color="text-green-400"
            icon="📅"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Left column ── */}
          <div className="space-y-6">
            {/* Daily streak card */}
            <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <div className="border-b border-white/5 px-5 py-3 flex items-center gap-2">
                <span>🔥</span>
                <p className="font-display text-lg tracking-wider text-white">Daily Streak</p>
              </div>
              <div className="p-5">
                {/* Current */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1">Current</p>
                    <p className="font-display text-5xl text-orange-400 leading-none">{daily.current}</p>
                    <p className="font-mono text-[9px] text-white/30 mt-1">days in a row</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1">Longest</p>
                    <p className="font-display text-3xl text-white/60">{daily.longest}</p>
                    <p className="font-mono text-[9px] text-white/20">days</p>
                  </div>
                </div>

                {/* This week dots */}
                <div className="mb-4">
                  <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-2">This Week</p>
                  <div className="flex gap-1.5">
                    {weekDays.map((day, i) => {
                      const worked = workedDates.has(day);
                      const isToday = day === todayStr;
                      return (
                        <div key={day} className="flex-1 flex flex-col items-center gap-1">
                          <div className={`w-full h-7 rounded-lg flex items-center justify-center text-[9px] font-mono transition-all ${
                            worked
                              ? "bg-orange-400 text-white"
                              : isToday
                              ? "bg-white/15 border border-white/25 text-white/50"
                              : "bg-white/6 text-white/20"
                          }`}>
                            {worked ? "✓" : "·"}
                          </div>
                          <span className="font-mono text-[7px] text-white/25">{DAY_LABELS[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Freeze info */}
                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-4 ${
                  freezesAvailable > 0
                    ? "bg-sky-500/10 border border-sky-500/20"
                    : "bg-surface-700 border border-white/5"
                }`}>
                  <span className="text-xl">🧊</span>
                  <div>
                    <p className={`font-body text-sm font-semibold ${freezesAvailable > 0 ? "text-sky-400" : "text-white/30"}`}>
                      {freezesAvailable} Streak Freeze{freezesAvailable !== 1 ? "s" : ""} Available
                    </p>
                    <p className="font-mono text-[9px] text-white/30">
                      {freezesUsed > 0 ? `${freezesUsed} used all-time · ` : ""}
                      Auto-activates if you miss a day
                    </p>
                  </div>
                </div>

                {/* Next milestone */}
                {nextDailyMs ? (
                  <div>
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-2">Next Milestone</p>
                    <MilestoneProgress
                      label={nextDailyMs.label}
                      icon={nextDailyMs.icon}
                      current={daily.current}
                      target={nextDailyMs.days}
                      xp={nextDailyMs.xpReward}
                      coins={nextDailyMs.coinReward}
                    />
                  </div>
                ) : (
                  <p className="font-mono text-[9px] text-green-400 text-center py-2">
                    🏆 All daily milestones reached!
                  </p>
                )}
              </div>
            </div>

            {/* Weekly streak card */}
            <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <div className="border-b border-white/5 px-5 py-3 flex items-center gap-2">
                <span>⚔️</span>
                <p className="font-display text-lg tracking-wider text-white">Weekly Streak</p>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1">Current</p>
                    <p className="font-display text-5xl text-sky-400 leading-none">{weekly.current}</p>
                    <p className="font-mono text-[9px] text-white/30 mt-1">weeks (3+ workouts)</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1">Longest</p>
                    <p className="font-display text-3xl text-white/60">{weekly.longest}</p>
                    <p className="font-mono text-[9px] text-white/20">weeks</p>
                  </div>
                </div>

                {/* This week progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[9px] text-white/40">This week</span>
                    <span className="font-mono text-[9px] text-sky-400">{weekly.currentWeekWorkouts} / 3 workouts</span>
                  </div>
                  <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (weekly.currentWeekWorkouts / 3) * 100)}%` }}
                    />
                  </div>
                  <p className="font-mono text-[9px] text-white/30 mt-1">
                    {weeklyNeed > 0 ? `${weeklyNeed} more workout${weeklyNeed > 1 ? "s" : ""} to maintain streak` : "✓ Weekly streak safe this week"}
                  </p>
                </div>

                {nextWeeklyMs ? (
                  <div>
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-2">Next Milestone</p>
                    <MilestoneProgress
                      label={nextWeeklyMs.label}
                      icon={nextWeeklyMs.icon}
                      current={weekly.current}
                      target={nextWeeklyMs.weeks}
                      xp={nextWeeklyMs.xpReward}
                      coins={nextWeeklyMs.coinReward}
                    />
                  </div>
                ) : weekly.current > 0 ? (
                  <p className="font-mono text-[9px] text-green-400 text-center py-2">
                    🏆 All weekly milestones reached!
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">
            {/* Consistency Rank */}
            <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <div className="border-b border-white/5 px-5 py-3 flex items-center gap-2">
                <span>🎖️</span>
                <p className="font-display text-lg tracking-wider text-white">Consistency Rank</p>
              </div>
              <div className="p-5">
                <div className={`flex items-center gap-4 bg-surface-700 border border-white/8 rounded-xl px-4 py-4 mb-4`}>
                  <span className="text-4xl">{consistencyRank.icon}</span>
                  <div>
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Current Rank</p>
                    <p className={`font-display text-2xl tracking-wider ${consistencyRank.color}`}>
                      {consistencyRank.label}
                    </p>
                    <p className="font-mono text-[9px] text-white/30 mt-0.5">
                      Based on longest streak: {daily.longest} days
                    </p>
                  </div>
                </div>

                {/* Rank progression */}
                <div className="space-y-2">
                  {[
                    { label: "Beginner",   icon: "🌱", min: 0,   next: 7,   color: "text-white/40"   },
                    { label: "Consistent", icon: "🔥", min: 7,   next: 30,  color: "text-orange-400" },
                    { label: "Dedicated",  icon: "⚡", min: 30,  next: 100, color: "text-yellow-400" },
                    { label: "Elite",      icon: "💎", min: 100, next: 365, color: "text-sky-400"    },
                    { label: "Legend",     icon: "🏆", min: 365, next: null, color: "text-yellow-300" },
                  ].map((r) => {
                    const reached  = daily.longest >= r.min;
                    const isCurrent = consistencyRank.label === r.label;
                    return (
                      <div
                        key={r.label}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all ${
                          isCurrent
                            ? "border-white/15 bg-surface-600"
                            : reached
                            ? "border-white/5 bg-surface-700/50"
                            : "border-white/3 bg-surface-800/50 opacity-40"
                        }`}
                      >
                        <span className={reached ? "" : "grayscale"}>{r.icon}</span>
                        <span className={`font-body text-sm font-semibold flex-1 ${reached ? r.color : "text-white/30"}`}>
                          {r.label}
                        </span>
                        <span className="font-mono text-[9px] text-white/25">
                          {r.next ? `${r.min}–${r.next - 1}d` : `${r.min}d+`}
                        </span>
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Daily Milestones */}
            <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <div className="border-b border-white/5 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <p className="font-display text-lg tracking-wider text-white">Daily Milestones</p>
                </div>
                <span className="font-mono text-[9px] text-white/30">
                  {daily.claimedDays.length}/{DAILY_MILESTONES.length}
                </span>
              </div>
              <div className="p-4 space-y-2">
                {DAILY_MILESTONES.map((ms, i) => {
                  const claimed = daily.claimedDays.includes(ms.days);
                  const active  = daily.current >= ms.days && !claimed;
                  return (
                    <div
                      key={ms.days}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all animate-fade-in ${
                        claimed
                          ? "border-green-500/20 bg-green-500/8"
                          : active
                          ? "border-orange-500/30 bg-orange-500/8"
                          : "border-white/5 bg-surface-700/30 opacity-50"
                      }`}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <span className={claimed ? "" : active ? "" : "grayscale"}>{ms.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-body text-sm font-semibold truncate ${
                          claimed ? "text-green-400" : active ? "text-orange-400" : "text-white/40"
                        }`}>
                          {ms.label}
                        </p>
                        <p className="font-mono text-[8px] text-white/25">{ms.days} days</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[9px] text-yellow-300/80">+{ms.xpReward} XP</p>
                        {ms.coinReward > 0 && (
                          <p className="font-mono text-[8px] text-amber-400/60">+{ms.coinReward} 🪙</p>
                        )}
                      </div>
                      {claimed && <span className="text-green-400 text-xs">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Milestones */}
            <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
              <div className="border-b border-white/5 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <p className="font-display text-lg tracking-wider text-white">Weekly Milestones</p>
                </div>
                <span className="font-mono text-[9px] text-white/30">
                  {weekly.claimedWeeks.length}/{WEEKLY_MILESTONES.length}
                </span>
              </div>
              <div className="p-4 space-y-2">
                {WEEKLY_MILESTONES.map((ms, i) => {
                  const claimed = weekly.claimedWeeks.includes(ms.weeks);
                  const active  = weekly.current >= ms.weeks && !claimed;
                  return (
                    <div
                      key={ms.weeks}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-all animate-fade-in ${
                        claimed
                          ? "border-green-500/20 bg-green-500/8"
                          : active
                          ? "border-sky-500/30 bg-sky-500/8"
                          : "border-white/5 bg-surface-700/30 opacity-50"
                      }`}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <span className={claimed ? "" : active ? "" : "grayscale"}>{ms.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-body text-sm font-semibold truncate ${
                          claimed ? "text-green-400" : active ? "text-sky-400" : "text-white/40"
                        }`}>
                          {ms.label}
                        </p>
                        <p className="font-mono text-[8px] text-white/25">{ms.weeks} week{ms.weeks > 1 ? "s" : ""}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[9px] text-yellow-300/80">+{ms.xpReward} XP</p>
                        {ms.coinReward > 0 && (
                          <p className="font-mono text-[8px] text-amber-400/60">+{ms.coinReward} 🪙</p>
                        )}
                      </div>
                      {claimed && <span className="text-green-400 text-xs">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Streak freeze CTA */}
        <div className="mt-8 bg-sky-500/6 border border-sky-500/20 rounded-2xl p-5 flex items-center gap-4">
          <span className="text-4xl flex-shrink-0">🧊</span>
          <div className="flex-1">
            <p className="font-display text-lg text-sky-400 tracking-wider">Streak Freeze</p>
            <p className="font-body text-sm text-white/50 mt-0.5">
              Miss a day without losing your streak. Buy from the Shop for 100 🪙.
              You currently have <strong className="text-sky-400">{freezesAvailable}</strong> available.
            </p>
          </div>
          <a
            href="/shop"
            className="flex-shrink-0 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all"
          >
            Shop →
          </a>
        </div>
      </div>

      <StreakToast notification={notif} onDismiss={() => setNotif(null)} />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatTile({ label, value, sub, color, icon }: {
  label: string; value: string; sub?: string; color: string; icon: string;
}) {
  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl px-4 py-3 text-center">
      <p className="font-mono text-[8px] uppercase tracking-widest text-white/30 mb-1">{label}</p>
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-xl">{icon}</span>
        <p className={`font-display text-3xl ${color} leading-none`}>{value}</p>
      </div>
      {sub && <p className="font-mono text-[8px] text-white/20 mt-1">{sub}</p>}
    </div>
  );
}

function MilestoneProgress({ label, icon, current, target, xp, coins }: {
  label: string; icon: string; current: number; target: number; xp: number; coins: number;
}) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="bg-surface-700 border border-white/5 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <span className="font-body text-sm text-white/70 flex-1">{label}</span>
        <span className="font-mono text-[9px] text-white/40">{current}/{target}</span>
      </div>
      <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden mb-1.5">
        <div
          className="h-full bg-orange-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] text-yellow-300/80">+{xp} XP</span>
        {coins > 0 && <span className="font-mono text-[9px] text-amber-400/60">+{coins} 🪙</span>}
        <span className="font-mono text-[9px] text-white/25 ml-auto">{target - current} days to go</span>
      </div>
    </div>
  );
}
