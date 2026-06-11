"use client";

import Link from "next/link";
import { StreakState } from "@/lib/streak-types";
import { DAILY_MILESTONES } from "@/lib/streak-engine";

export default function StreakSidebarCard({ streakState }: { streakState: StreakState }) {
  const { daily } = streakState;
  const nextMilestone = DAILY_MILESTONES.find((m) => m.days > daily.current);
  const prevMilestone = DAILY_MILESTONES.slice().reverse().find((m) => m.days <= daily.current);
  const milestoneMin  = prevMilestone?.days ?? 0;
  const milestoneMax  = nextMilestone?.days ?? milestoneMin + 7;
  const milestonePct  = milestoneMax > milestoneMin
    ? Math.round(((daily.current - milestoneMin) / (milestoneMax - milestoneMin)) * 100)
    : 100;

  // Weekly dots: show how many of the last 7 days of streak progress
  const weekDots = Array.from({ length: 7 }).map((_, i) => {
    if (daily.current <= 0) return false;
    const mod = daily.current % 7;
    const filled = mod === 0 ? true : i < mod;
    return i < Math.min(daily.current, 7) ? true : false;
  });

  return (
    <div className="bg-surface-800 border border-red-500/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span>🔥</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-red-400">Streak</span>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-display text-4xl text-white stat-number">{daily.current}</span>
        <span className="text-sm text-white/40">days</span>
      </div>
      {/* Weekly progress dots */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 7 }).map((_, i) => {
          const filled = i < Math.min(daily.current, 7);
          return (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-all ${filled ? "bg-red-400" : "bg-white/10"}`}
            />
          );
        })}
      </div>
      {nextMilestone && (
        <>
          <div className="flex justify-between font-mono text-[9px] text-white/30 mb-1">
            <span className="stat-number">{daily.current} days</span>
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
      <div className="mt-2 font-mono text-[9px] text-white/20 stat-number">Longest: {daily.longest} days</div>
      <Link href="/streaks" className="mt-3 block font-mono text-[10px] text-red-400 hover:text-red-300 transition-colors">
        View Streaks →
      </Link>
    </div>
  );
}
