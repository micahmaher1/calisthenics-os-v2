"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadStreakState } from "@/lib/streak-storage";
import { StreakState } from "@/lib/streak-types";
import { DAILY_MILESTONES } from "@/lib/streak-engine";

export default function StreakDashboardCard() {
  const [streakState, setStreakState] = useState<StreakState | null>(null);

  useEffect(() => {
    try {
      setStreakState(loadStreakState());
    } catch {
      // ignore
    }
  }, []);

  if (!streakState) return null;

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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>🔥</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-red-400">Streak</span>
        </div>
        <Link href="/streaks" className="font-mono text-[9px] text-red-400/60 hover:text-red-400 transition-colors">
          View →
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl text-white stat-number">{daily.current}</span>
            <span className="text-xs text-white/40">days</span>
          </div>
          <div className="font-mono text-[9px] text-white/20 stat-number">Best: {daily.longest}</div>
        </div>
      </div>

      {/* 7-day dots */}
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
    </div>
  );
}
