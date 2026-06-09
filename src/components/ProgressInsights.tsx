"use client";

import { Workout } from "@/lib/types";
import { calcProgressionInsights } from "@/lib/progression";
import { calcXPToNextLevel } from "@/lib/xp";

interface Props {
  workouts:  Workout[];
  level:     number;
  totalXP:   number;
}

export default function ProgressInsights({ workouts, level, totalXP }: Props) {
  const xpToNext  = calcXPToNextLevel(totalXP);
  const insights  = calcProgressionInsights(workouts, level, xpToNext);

  const {
    monthXP, monthWorkouts, avgDailyXP,
    daysToNextLevel, nextReward, levelsToNextReward, levelsToNextRank,
  } = insights;

  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
      <div className="p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-4">Progression Insights</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <InsightTile
            label="Month XP"
            value={monthXP.toLocaleString()}
            sub="Last 30 days"
            color="text-green-400"
          />
          <InsightTile
            label="Workouts"
            value={monthWorkouts.toString()}
            sub="Last 30 days"
            color="text-sky-400"
          />
          <InsightTile
            label="Avg/Day"
            value={`${avgDailyXP} XP`}
            sub="Daily average"
            color="text-purple-400"
          />
          <InsightTile
            label="Next Level"
            value={daysToNextLevel != null ? `~${daysToNextLevel}d` : "—"}
            sub={`${xpToNext} XP needed`}
            color="text-yellow-400"
          />
        </div>

        {/* Next reward teaser */}
        {nextReward && (
          <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{nextReward.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs font-semibold text-white truncate">{nextReward.title}</p>
              <p className="font-mono text-[8px] text-yellow-400/70">
                Level {nextReward.level} · {levelsToNextReward} level{levelsToNextReward !== 1 ? "s" : ""} away
              </p>
            </div>
            {nextReward.coins > 0 && (
              <span className="font-display text-sm text-yellow-300">+{nextReward.coins.toLocaleString()}</span>
            )}
          </div>
        )}

        {/* Rank distance */}
        {levelsToNextRank > 0 && (
          <p className="font-mono text-[8px] text-white/25 text-center mt-3">
            {levelsToNextRank} level{levelsToNextRank !== 1 ? "s" : ""} until next rank promotion
          </p>
        )}
      </div>
    </div>
  );
}

function InsightTile({ label, value, sub, color }: {
  label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="bg-surface-700 rounded-xl px-3 py-2.5">
      <p className="font-mono text-[8px] uppercase tracking-widest text-white/30 mb-0.5">{label}</p>
      <p className={`font-display text-xl leading-none ${color}`}>{value}</p>
      <p className="font-mono text-[8px] text-white/20 mt-0.5">{sub}</p>
    </div>
  );
}
