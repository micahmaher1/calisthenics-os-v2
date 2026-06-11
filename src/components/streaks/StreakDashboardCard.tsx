"use client";

import Link from "next/link";
import { StreakState } from "@/lib/streak-types";
import { nextDailyMilestone, weeklyWorkoutsNeeded } from "@/lib/streak-engine";

interface Props {
  streakState: StreakState;
}

export default function StreakDashboardCard({ streakState }: Props) {
  const { daily, weekly, freezesAvailable } = streakState;
  const nextMs  = nextDailyMilestone(streakState);
  const needWk  = weeklyWorkoutsNeeded(streakState);

  return (
    <section className="animate-slide-up stagger-2">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Streaks</span>
        <div className="flex-1 h-px bg-white/5" />
        <Link href="/streaks" className="font-mono text-[9px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors">
          View All →
        </Link>
      </div>

      <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
        {/* Hero flame counter */}
        <div className="relative px-5 pt-5 pb-4">
          <div className="flex items-center justify-between">
            {/* Daily streak */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`text-5xl leading-none transition-all ${daily.current > 0 ? "" : "grayscale opacity-40"}`}>
                  🔥
                </div>
                {daily.current > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-orange-300" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-display text-4xl text-white leading-none">
                  {daily.current}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-white/30 mt-0.5">
                  Day Streak
                </div>
                {daily.longest > daily.current && (
                  <div className="font-mono text-[8px] text-white/20 mt-0.5">
                    Best: {daily.longest}
                  </div>
                )}
              </div>
            </div>

            {/* Weekly streak + freeze */}
            <div className="flex items-center gap-3">
              {freezesAvailable > 0 && (
                <div className="text-center">
                  <div className="flex items-center gap-1 bg-sky-500/10 border border-sky-500/20 rounded-xl px-2.5 py-1.5">
                    <span className="text-sm">🧊</span>
                    <span className="font-display text-lg text-sky-400 leading-none">{freezesAvailable}</span>
                  </div>
                  <div className="font-mono text-[8px] text-white/25 mt-1">Freeze{freezesAvailable !== 1 ? "s" : ""}</div>
                </div>
              )}
              <div className="text-center">
                <div className={`flex items-center gap-1.5 border rounded-xl px-3 py-2 ${
                  weekly.current > 0
                    ? "bg-sky-500/10 border-sky-500/25"
                    : "bg-surface-700 border-white/5"
                }`}>
                  <span className={`text-lg ${weekly.current === 0 ? "grayscale opacity-40" : ""}`}>⚔️</span>
                  <span className={`font-display text-2xl leading-none ${weekly.current > 0 ? "text-sky-400" : "text-white/30"}`}>
                    {weekly.current}
                  </span>
                </div>
                <div className="font-mono text-[8px] text-white/25 mt-1">Week Streak</div>
              </div>
            </div>
          </div>

          {/* Weekly progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[9px] text-white/30">
                This week: {weekly.currentWeekWorkouts}/3 workouts
              </span>
              {needWk > 0 ? (
                <span className="font-mono text-[9px] text-orange-400/70">
                  {needWk} more to maintain weekly streak
                </span>
              ) : (
                <span className="font-mono text-[9px] text-green-400/70">✓ Weekly streak safe</span>
              )}
            </div>
            <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (weekly.currentWeekWorkouts / 3) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Next milestone */}
        {nextMs && daily.current > 0 && (
          <div className="border-t border-white/5 px-5 py-3 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
                Next milestone
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm">{nextMs.icon}</span>
                <span className="font-body text-sm text-white/70">{nextMs.label}</span>
                <span className="font-mono text-[9px] text-white/30">
                  in {nextMs.days - daily.current} day{nextMs.days - daily.current !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] text-yellow-300">+{nextMs.xpReward} XP</span>
              {nextMs.coinReward > 0 && (
                <div className="font-mono text-[9px] text-amber-400/70">+{nextMs.coinReward} 🪙</div>
              )}
            </div>
          </div>
        )}

        {/* Empty state: no streak yet */}
        {daily.current === 0 && (
          <div className="border-t border-white/5 px-5 py-3 text-center">
            <p className="font-body text-xs text-white/30">
              Log a workout today to start your streak!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
