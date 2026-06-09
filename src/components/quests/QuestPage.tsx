"use client";

import { useEffect, useState, useCallback } from "react";
import { loadState, saveState, addWorkoutToState } from "@/lib/storage";
import { loadQuestState, saveQuestState, loadWeekBaseline } from "@/lib/quest-storage";
import { loadTreeState, getTotalCompleted } from "@/lib/skilltree-engine";
import { evaluateQuests, timeUntilMidnight, timeUntilMonday, thisWeekKey } from "@/lib/quest-engine";
import { QuestState, ActiveQuest, QUEST_RARITY_META } from "@/lib/quest-types";
import { DAILY_BONUS_XP, DAILY_BONUS_COINS, WEEKLY_BONUS_XP, WEEKLY_BONUS_COINS } from "@/lib/quest-data";
import { getRankLabel } from "@/lib/xp";
import Header from "@/components/Header";
import QuestCard from "./QuestCard";
import QuestToast, { QuestNotification } from "./QuestToast";

export default function QuestPage() {
  const [questState, setQuestState] = useState<QuestState | null>(null);
  const [level, setLevel]     = useState(1);
  const [rank,  setRank]      = useState("Beginner");
  const [notif, setNotif]     = useState<QuestNotification | null>(null);
  const [notifQueue, setNotifQueue] = useState<QuestNotification[]>([]);

  const enqueue = useCallback((items: QuestNotification[]) => {
    setNotifQueue((q) => [...q, ...items]);
  }, []);

  // Drain queue
  useEffect(() => {
    if (!notif && notifQueue.length > 0) {
      setNotif(notifQueue[0]);
      setNotifQueue((q) => q.slice(1));
    }
  }, [notif, notifQueue]);

  useEffect(() => {
    const appState  = loadState();
    const treeState = loadTreeState();
    const wk        = thisWeekKey();
    const skillCount = getTotalCompleted(treeState.progress);
    const baseline  = loadWeekBaseline(wk, skillCount, appState.level);
    const raw       = loadQuestState();

    const { newState, newlyCompleted, bonusXP, bonusCoins } = evaluateQuests(
      raw, appState, treeState, appState.level, baseline.skillsUnlocked, baseline.level
    );

    // Grant rewards for anything that just completed
    if (newlyCompleted.length > 0 || bonusXP > 0) {
      let state = appState;
      const totalXP    = newlyCompleted.reduce((s, q) => s + q.rewardXP, 0) + bonusXP;
      const totalCoins = newlyCompleted.reduce((s, q) => s + q.rewardCoins, 0) + bonusCoins;
      if (totalXP > 0 || totalCoins > 0) {
        // Apply rewards as a synthetic workout entry of XP/coins
        // We directly mutate state to add XP and coins without a workout entry
        state = {
          ...state,
          totalXP:  state.totalXP + totalXP,
          coins:    state.coins + totalCoins,
          level:    Math.floor((state.totalXP + totalXP) / 100) + 1,
        };
        saveState(state);
      }
      saveQuestState(newState);
    }

    setQuestState(newState);
    setLevel(appState.level);
    setRank(getRankLabel(appState.level));
  }, []);

  if (!questState) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">⚔️</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING QUESTS</span>
        </div>
      </div>
    );
  }

  const { daily, weekly, streak, stats } = questState;
  const dailyDone  = daily.quests.filter((q) => q.completed).length;
  const weeklyDone = weekly.quests.filter((q) => q.completed).length;
  const timeDaily  = timeUntilMidnight();
  const timeWeekly = timeUntilMonday();

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#4ade80 1px,transparent 1px),linear-gradient(90deg,#4ade80 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-purple-500/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Header rank={rank} level={level} />

        {/* Page title */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30 mb-1">Daily & Weekly</p>
              <h1 className="font-display text-4xl text-white tracking-wider">QUESTS</h1>
            </div>
            {streak.current > 0 && (
              <div className="text-center">
                <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/25 rounded-2xl px-4 py-2">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <div className="font-display text-2xl text-orange-400 leading-none">{streak.current}</div>
                    <div className="font-mono text-[8px] text-white/30 uppercase tracking-widest">Day Streak</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatTile label="Total Done"   value={stats.totalCompleted.toString()} color="text-green-400" />
          <StatTile label="Perfect Days" value={stats.perfectDays.toString()}    color="text-sky-400" />
          <StatTile label="Weekly Done"  value={stats.weeklyCompleted.toString()} color="text-purple-400" />
          <StatTile label="Best Streak"  value={streak.longest.toString()} color="text-orange-400" sub="days" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Quests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display text-xl text-white tracking-wider">Daily Quests</p>
                <p className="font-mono text-[9px] text-white/30">Resets in {timeDaily}</p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl text-green-400">{dailyDone}</span>
                <span className="font-display text-lg text-white/20">/3</span>
              </div>
            </div>

            {/* Daily progress bar */}
            <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.round((dailyDone / 3) * 100)}%` }}
              />
            </div>

            <div className="space-y-3">
              {daily.quests.map((q, i) => (
                <div key={q.templateId + i} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <QuestCard quest={q} timeLeft={timeDaily} />
                </div>
              ))}
            </div>

            {/* Daily bonus */}
            <BonusCard
              claimed={daily.bonusClaimed}
              allDone={dailyDone === 3}
              bonusXP={DAILY_BONUS_XP}
              bonusCoins={DAILY_BONUS_COINS}
              label="Daily Completion Bonus"
            />
          </div>

          {/* Weekly Quests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display text-xl text-white tracking-wider">Weekly Quests</p>
                <p className="font-mono text-[9px] text-white/30">Resets in {timeWeekly}</p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl text-sky-400">{weeklyDone}</span>
                <span className="font-display text-lg text-white/20">/3</span>
              </div>
            </div>

            {/* Weekly progress bar */}
            <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.round((weeklyDone / 3) * 100)}%` }}
              />
            </div>

            <div className="space-y-3">
              {weekly.quests.map((q, i) => (
                <div key={q.templateId + i} className="animate-fade-in" style={{ animationDelay: `${(i + 3) * 60}ms` }}>
                  <QuestCard quest={q} timeLeft={timeWeekly} />
                </div>
              ))}
            </div>

            {/* Weekly bonus */}
            <BonusCard
              claimed={weekly.bonusClaimed}
              allDone={weeklyDone === 3}
              bonusXP={WEEKLY_BONUS_XP}
              bonusCoins={WEEKLY_BONUS_COINS}
              label="Weekly Completion Bonus"
            />
          </div>
        </div>

        {/* Quest Streak Section */}
        {streak.longest > 0 && (
          <div className="mt-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-3">Quest Streak Milestones</p>
            <div className="flex flex-wrap gap-3">
              {[3, 7, 14, 30].map((n) => {
                const reached = streak.longest >= n;
                return (
                  <div
                    key={n}
                    className={`flex items-center gap-2 border rounded-xl px-4 py-2 transition-all ${
                      reached
                        ? "border-orange-500/30 bg-orange-500/10"
                        : "border-white/5 bg-surface-800/50 opacity-40"
                    }`}
                  >
                    <span className={reached ? "" : "grayscale"}>🔥</span>
                    <div>
                      <p className={`font-display text-base ${reached ? "text-orange-400" : "text-white/30"}`}>
                        {n}-Day Streak
                      </p>
                      {reached && <p className="font-mono text-[8px] text-orange-400/60">Achieved</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats breakdown */}
        <div className="mt-8 bg-surface-800 border border-white/8 rounded-2xl p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-4">Quest Statistics</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatRow label="Total XP from Quests"   value={`${stats.totalXPEarned.toLocaleString()} XP`} />
            <StatRow label="Total Coins from Quests" value={`${stats.totalCoinsEarned.toLocaleString()} 🪙`} />
            <StatRow label="Perfect Days"           value={stats.perfectDays.toString()} />
            <StatRow label="Perfect Weeks"          value={stats.perfectWeeks.toString()} />
            <StatRow label="Current Streak"         value={`${streak.current} days`} />
            <StatRow label="Best Streak"            value={`${streak.longest} days`} />
          </div>
        </div>
      </div>

      <QuestToast notification={notif} onDismiss={() => setNotif(null)} />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatTile({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl px-4 py-3 text-center">
      <p className="font-mono text-[8px] uppercase tracking-widest text-white/30 mb-1">{label}</p>
      <p className={`font-display text-2xl ${color} leading-none`}>{value}</p>
      {sub && <p className="font-mono text-[8px] text-white/20 mt-0.5">{sub}</p>}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[8px] text-white/30 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="font-body text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function BonusCard({ claimed, allDone, bonusXP, bonusCoins, label }: {
  claimed: boolean; allDone: boolean; bonusXP: number; bonusCoins: number; label: string;
}) {
  return (
    <div className={`mt-4 border rounded-xl px-4 py-3 flex items-center gap-3 transition-all ${
      claimed
        ? "border-green-500/20 bg-green-500/5"
        : allDone
        ? "border-yellow-500/40 bg-yellow-500/10 animate-pulse"
        : "border-white/5 bg-surface-700/50 opacity-50"
    }`}>
      <span className="text-xl">{claimed ? "✅" : allDone ? "🎁" : "🔒"}</span>
      <div className="flex-1">
        <p className={`font-body text-xs font-semibold ${claimed ? "text-green-400" : allDone ? "text-yellow-300" : "text-white/30"}`}>
          {label}
        </p>
        <p className="font-mono text-[8px] text-white/30">
          {claimed ? "Claimed!" : `+${bonusXP} XP · +${bonusCoins} Coins`}
        </p>
      </div>
    </div>
  );
}
