"use client";

import { formatXP } from "@/lib/utils";

interface HeroStatsProps {
  totalXP: number;
  level: number;
  rank: string;
  levelProgress: number;
  xpToNext: number;
  workoutCount: number;
}

export default function HeroStats({
  totalXP,
  level,
  rank,
  levelProgress,
  xpToNext,
  workoutCount,
}: HeroStatsProps) {
  return (
    <section className="mt-8 animate-slide-up">
      {/* Main hero card */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-800 border border-white/5 p-6 sm:p-8 noise shimmer">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          {/* Rank + Level row */}
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2 mb-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">
                Level
              </p>
              <div className="font-display text-7xl sm:text-8xl leading-none text-white">
                {level}
              </div>
            </div>
            <div className="mb-3">
              <div className="font-display text-3xl sm:text-4xl text-green-400 tracking-wide">
                {rank}
              </div>
              <p className="font-mono text-xs text-white/30 mt-1">
                {formatXP(totalXP)} XP total
              </p>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                XP to Level {level + 1}
              </span>
              <span className="font-mono text-xs text-green-400">
                {xpToNext} XP remaining
              </span>
            </div>
            <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full progress-bar glow-green"
                style={{ "--bar-width": `${levelProgress}%` } as React.CSSProperties}
              />
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[9px] text-white/20">
                Level {level}
              </span>
              <span className="font-mono text-[9px] text-white/20">
                Level {level + 1}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stat pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
        <StatPill
          label="Total XP"
          value={formatXP(totalXP)}
          accent="text-green-400"
          icon="✦"
        />
        <StatPill
          label="Workouts Logged"
          value={workoutCount.toString()}
          accent="text-white"
          icon="📋"
        />
        <StatPill
          label="Progress"
          value={`${Math.round(levelProgress)}%`}
          accent="text-green-400"
          icon="📈"
          className="col-span-2 sm:col-span-1"
        />
      </div>
    </section>
  );
}

function StatPill({
  label,
  value,
  accent,
  icon,
  className = "",
}: {
  label: string;
  value: string;
  accent: string;
  icon: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-surface-800 border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3 noise ${className}`}
    >
      <span className="text-lg">{icon}</span>
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">
          {label}
        </p>
        <p className={`font-display text-xl tracking-wide ${accent}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
