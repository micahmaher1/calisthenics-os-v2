"use client";

import { calcRankProgress } from "@/lib/progression";

interface Props {
  level: number;
}

export default function RankProgressCard({ level }: Props) {
  const rp = calcRankProgress(level);
  const { current, next, pct, levelsLeft } = rp;

  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
      <div className={`h-0.5 w-full bg-gradient-to-r from-transparent via-current to-transparent ${current.color}`} />

      <div className="p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-4">Rank Progression</p>

        {/* Current rank */}
        <div className={`flex items-center gap-3 ${current.bgColor} border ${current.borderColor} rounded-xl px-4 py-3 mb-4`}>
          <span className="text-3xl">{current.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">Current Rank</p>
            <p className={`font-display text-xl tracking-wider ${current.color}`}>{current.label}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl text-white">{level}</p>
            <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Level</p>
          </div>
        </div>

        {/* Progress bar to next rank */}
        {next ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
                Progress to {next.label}
              </span>
              <span className={`font-mono text-[9px] ${current.color}`}>
                {pct}% · {levelsLeft} level{levelsLeft !== 1 ? "s" : ""} away
              </span>
            </div>
            <div className="h-2.5 bg-surface-700 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${current.bgColor.replace("bg-", "bg-").replace("/10", "/60")}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Next rank preview */}
            <div className={`flex items-center gap-2.5 border ${next.borderColor} rounded-xl px-3 py-2.5 opacity-60`}>
              <span className="text-xl grayscale">{next.icon}</span>
              <div className="flex-1">
                <p className="font-mono text-[8px] uppercase tracking-widest text-white/30">Next Rank</p>
                <p className={`font-display text-base ${next.color}`}>{next.label}</p>
              </div>
              <span className="font-mono text-xs text-white/20">Lv. {next.minLevel}</span>
            </div>
          </>
        ) : (
          <div className="text-center py-3">
            <p className="font-display text-2xl text-yellow-300">MAX RANK</p>
            <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">You are a Legend</p>
          </div>
        )}
      </div>
    </div>
  );
}
