"use client";

import { CSSProperties } from "react";
import { formatXP } from "@/lib/utils";
import { getRankInfo, XP_PER_LEVEL, calcXPIntoLevel } from "@/lib/xp";
import { calcWeekDots } from "@/lib/stats";
import { Workout } from "@/lib/types";

interface HeroStatsProps {
  totalXP:       number;
  level:         number;
  rank:          string;
  levelProgress: number;
  xpToNext:      number;
  workoutCount:  number;
  coins:         number;
  streak:        number;
  todayXP:       number;
  todayWorkouts: number;
  treePercent:   number;
  achPercent:    number;
  workouts:      Workout[];
}

export default function HeroStats({
  totalXP, level, rank, levelProgress, xpToNext, workoutCount,
  coins, streak, todayXP, todayWorkouts, treePercent, achPercent, workouts,
}: HeroStatsProps) {
  const rankInfo  = getRankInfo(level);
  const xpInLevel = calcXPIntoLevel(totalXP);
  const weekDots  = calcWeekDots(workouts);

  return (
    <section className="mt-6 space-y-3 animate-slide-up">
      {/* ── Main Profile Card ── */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-800 border border-white/5 p-5 sm:p-7 noise">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/3 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Row 1: Level + Rank + Streak */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            {/* Level + Rank */}
            <div className="flex items-end gap-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 mb-1">Level</p>
                <div className="font-display text-[5.5rem] sm:text-[7rem] leading-none text-white tabular-nums">
                  {level}
                </div>
              </div>
              <div className="mb-3 flex flex-col gap-1">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${rankInfo.bgColor} ${rankInfo.borderColor}`}>
                  <span className="text-base">{rankInfo.icon}</span>
                  <span className={`font-display text-xl sm:text-2xl tracking-wide ${rankInfo.color}`}>
                    {rank}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-white/30 pl-1">
                  {formatXP(totalXP)} Total XP
                </p>
              </div>
            </div>

            {/* Streak */}
            {streak > 0 ? (
              <div className="flex items-center gap-2.5 bg-orange-500/10 border border-orange-500/25 rounded-2xl px-4 py-3">
                <span className="text-3xl leading-none">🔥</span>
                <div>
                  <p className="font-display text-3xl text-orange-400 leading-none">{streak}</p>
                  <p className="font-mono text-[9px] text-white/30 mt-0.5">day streak</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 bg-white/3 border border-white/5 border-dashed rounded-2xl px-4 py-3">
                <span className="text-2xl opacity-30">🔥</span>
                <div>
                  <p className="font-mono text-[9px] text-white/25 uppercase tracking-widest">No Streak</p>
                  <p className="font-mono text-[8px] text-white/15">Work out today!</p>
                </div>
              </div>
            )}
          </div>

          {/* Row 2: XP Bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/25">
                Level Progress
              </span>
              <span className="font-mono text-[10px] t-text">
                {xpInLevel} / {XP_PER_LEVEL} XP · {xpToNext} to next
              </span>
            </div>
            <div className="relative h-3 bg-surface-600 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 t-bar rounded-full progress-bar"
                style={{ "--bar-width": `${levelProgress}%` } as CSSProperties}
              />
              {/* Scan line */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-fast" />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="font-mono text-[8px] text-white/20">Lv {level}</span>
              <span className="font-mono text-[8px] text-white/20">Lv {level + 1}</span>
            </div>
          </div>

          {/* Row 3: Stat chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatChip icon="💰" label="Coins"      value={coins.toLocaleString()} color="text-yellow-400" bg="bg-yellow-500/8"  border="border-yellow-500/15" />
            <StatChip icon="📋" label="Workouts"   value={workoutCount.toString()} color="text-white"     bg="bg-white/4"       border="border-white/8" />
            <StatChip icon="🌳" label="Skill Tree" value={`${treePercent}%`}       color="text-purple-400" bg="bg-purple-500/8"  border="border-purple-500/15" />
            <StatChip icon="🏆" label="Achievements" value={`${achPercent}%`}      color="text-amber-400" bg="bg-amber-500/8"   border="border-amber-500/15" />
          </div>
        </div>
      </div>

      {/* ── Today Strip ── */}
      <div className="relative overflow-hidden rounded-xl bg-surface-800 border border-white/5 px-5 py-3.5 flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-green-400 font-display text-lg leading-none">+{todayXP}</span>
          <span className="font-mono text-[9px] text-white/30">XP</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-display text-lg leading-none">{todayWorkouts}</span>
          <span className="font-mono text-[9px] text-white/30">workout{todayWorkouts !== 1 ? "s" : ""}</span>
        </div>
        {/* Week dots */}
        <div className="flex items-center gap-2.5 ml-auto">
          {weekDots.map((d) => (
            <div key={d.label} className="flex flex-col items-center gap-1">
              <div
                className={`w-5 h-5 rounded-full border transition-all ${
                  d.isToday
                    ? d.hasWorkout
                      ? "bg-green-400 border-green-300 shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                      : "bg-transparent border-green-500/50 border-dashed"
                    : d.hasWorkout
                      ? "bg-green-500/40 border-green-500/40"
                      : "bg-white/5 border-white/10"
                }`}
              />
              <span className={`font-mono text-[7px] ${d.isToday ? "text-green-400" : "text-white/20"}`}>
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatChip({ icon, label, value, color, bg, border }: {
  icon: string; label: string; value: string;
  color: string; bg: string; border: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${bg} border ${border} rounded-xl px-3 py-2.5`}>
      <span className="text-base leading-none">{icon}</span>
      <div>
        <p className="font-mono text-[8px] uppercase tracking-widest text-white/25 leading-none mb-0.5">{label}</p>
        <p className={`font-display text-lg leading-none ${color}`}>{value}</p>
      </div>
    </div>
  );
}
