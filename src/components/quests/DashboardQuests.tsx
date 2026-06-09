"use client";

import Link from "next/link";
import { QuestState } from "@/lib/quest-types";
import { timeUntilMidnight, timeUntilMonday } from "@/lib/quest-engine";
import { DAILY_BONUS_XP, DAILY_BONUS_COINS } from "@/lib/quest-data";
import QuestCard from "./QuestCard";

interface Props {
  questState: QuestState;
}

export default function DashboardQuests({ questState }: Props) {
  const { daily, weekly, streak } = questState;
  const dailyDone   = daily.quests.filter((q) => q.completed).length;
  const weeklyDone  = weekly.quests.filter((q) => q.completed).length;
  const dailyPct    = Math.round((dailyDone  / 3) * 100);
  const weeklyPct   = Math.round((weeklyDone / 3) * 100);
  const timeDaily   = timeUntilMidnight();
  const timeWeekly  = timeUntilMonday();

  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">Today's Quests</p>
          </div>
          <div className="flex items-center gap-2">
            {streak.current > 0 && (
              <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-lg px-2 py-1">
                <span className="text-sm">🔥</span>
                <span className="font-display text-sm text-orange-400">{streak.current}</span>
              </div>
            )}
            <Link
              href="/quests"
              className="font-mono text-[8px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors border border-white/10 rounded-lg px-2.5 py-1"
            >
              All Quests →
            </Link>
          </div>
        </div>

        {/* Progress summary */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-surface-700 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">Daily</span>
              <span className="font-mono text-[9px] text-green-400">{dailyDone}/3</span>
            </div>
            <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-500"
                style={{ width: `${dailyPct}%` }}
              />
            </div>
            <p className="font-mono text-[8px] text-white/20 mt-1">Resets in {timeDaily}</p>
          </div>
          <div className="bg-surface-700 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">Weekly</span>
              <span className="font-mono text-[9px] text-sky-400">{weeklyDone}/3</span>
            </div>
            <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${weeklyPct}%` }}
              />
            </div>
            <p className="font-mono text-[8px] text-white/20 mt-1">Resets in {timeWeekly}</p>
          </div>
        </div>

        {/* Daily quests — show compact */}
        <div className="space-y-2.5">
          {daily.quests.map((q, i) => (
            <QuestCard key={q.templateId + i} quest={q} timeLeft={timeDaily} />
          ))}
        </div>

        {/* Daily bonus indicator */}
        {daily.bonusClaimed ? (
          <div className="mt-3 text-center py-2 bg-green-500/5 border border-green-500/20 rounded-xl">
            <p className="font-mono text-[9px] text-green-400 uppercase tracking-widest">✓ Daily Bonus Claimed</p>
          </div>
        ) : dailyDone === 3 ? (
          <div className="mt-3 text-center py-2 bg-yellow-500/10 border border-yellow-500/25 rounded-xl animate-pulse">
            <p className="font-mono text-[9px] text-yellow-400 uppercase tracking-widest">🎉 Bonus Reward Ready!</p>
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-center gap-1.5 py-2">
            <span className="font-mono text-[8px] text-white/20">Complete all 3 for bonus:</span>
            <span className="font-mono text-[8px] text-green-400/50">+{DAILY_BONUS_XP} XP</span>
            <span className="font-mono text-[8px] text-yellow-400/50">+{DAILY_BONUS_COINS} 🪙</span>
          </div>
        )}
      </div>
    </div>
  );
}
