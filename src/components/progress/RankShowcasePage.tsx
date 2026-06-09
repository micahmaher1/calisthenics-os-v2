"use client";

import { useEffect, useState } from "react";
import { loadState } from "@/lib/storage";
import { RANK_TABLE } from "@/lib/xp";
import { LEVEL_REWARDS, calcRankProgress } from "@/lib/progression";
import Header from "@/components/Header";
import { getRankLabel } from "@/lib/xp";

export default function RankShowcasePage() {
  const [level, setLevel] = useState(1);
  const [rank,  setRank]  = useState("Beginner");

  useEffect(() => {
    const s = loadState();
    setLevel(s.level);
    setRank(getRankLabel(s.level));
  }, []);

  const rp = calcRankProgress(level);

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      {/* Grid bg */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#4ade80 1px,transparent 1px),linear-gradient(90deg,#4ade80 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-green-500/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Header rank={rank} level={level} />

        {/* Title */}
        <div className="mt-8 mb-8 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30 mb-2">Rank System</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider">PROGRESSION PATH</h1>
          <p className="font-body text-sm text-white/40 mt-2">Your journey from Beginner to Legend</p>
        </div>

        {/* Rank Cards */}
        <div className="space-y-4 mb-12">
          {RANK_TABLE.map((r, i) => {
            const isUnlocked = level >= r.minLevel;
            const isCurrent  = level >= r.minLevel && (r.nextLevel == null || level < r.nextLevel);
            const rankSize   = r.nextLevel != null ? r.nextLevel - r.minLevel : null;
            const levelRange = r.nextLevel ? `Levels ${r.minLevel}–${r.nextLevel - 1}` : `Level ${r.minLevel}+`;

            // progress within this rank
            let pctFill = 0;
            if (isUnlocked && isCurrent && rp.rankSize > 0) {
              pctFill = rp.pct;
            } else if (isUnlocked && !isCurrent) {
              pctFill = 100;
            }

            return (
              <div
                key={r.label}
                className={`relative overflow-hidden border rounded-2xl transition-all duration-300 ${
                  isCurrent
                    ? `${r.borderColor} ${r.bgColor} shadow-lg`
                    : isUnlocked
                    ? `border-white/10 bg-surface-800/50`
                    : "border-white/5 bg-surface-800/30"
                }`}
              >
                {/* Locked overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 backdrop-blur-[1px] bg-black/40 z-10 flex items-center justify-end pr-5">
                    <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Locked · Lv. {r.minLevel}</span>
                  </div>
                )}

                {/* Current indicator line */}
                {isCurrent && (
                  <div className={`h-0.5 w-full bg-gradient-to-r from-transparent via-current to-transparent ${r.color}`} />
                )}

                <div className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                      isUnlocked ? r.bgColor : "bg-white/5"
                    } border ${isUnlocked ? r.borderColor : "border-white/5"}`}>
                      <span className={isUnlocked ? "" : "grayscale opacity-30"}>{r.icon}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`font-display text-xl tracking-wider ${isUnlocked ? r.color : "text-white/20"}`}>
                          {r.label}
                        </span>
                        {isCurrent && (
                          <span className={`font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full ${r.bgColor} ${r.color} border ${r.borderColor}`}>
                            Current
                          </span>
                        )}
                        {!isUnlocked && i === RANK_TABLE.findIndex(x => !( level >= x.minLevel)) && (
                          <span className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/10">
                            Next
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[9px] text-white/30">{levelRange}</p>

                      {/* Progress bar for current/unlocked ranks */}
                      {isUnlocked && pctFill > 0 && (
                        <div className="mt-2 h-1.5 bg-black/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isCurrent ? r.bgColor.replace("/10", "/60") : "bg-white/20"
                            }`}
                            style={{ width: `${pctFill}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Right: size / levels */}
                    <div className="text-right flex-shrink-0">
                      {rankSize && (
                        <p className="font-display text-2xl text-white/20">{rankSize}</p>
                      )}
                      <p className="font-mono text-[8px] text-white/20 uppercase">
                        {rankSize ? "levels" : "∞"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Level Rewards section */}
        <div className="mb-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-4">Level Rewards</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LEVEL_REWARDS.map((reward) => {
              const unlocked = level >= reward.level;
              return (
                <div
                  key={reward.level}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all ${
                    unlocked
                      ? "border-yellow-500/25 bg-yellow-500/8"
                      : "border-white/5 bg-surface-800/40 opacity-50"
                  }`}
                >
                  <span className={`text-2xl ${unlocked ? "" : "grayscale"}`}>{reward.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-body text-sm font-semibold truncate ${unlocked ? "text-white" : "text-white/40"}`}>
                      {reward.title}
                    </p>
                    <p className="font-mono text-[8px] text-white/30">Level {reward.level}</p>
                  </div>
                  {reward.coins > 0 && (
                    <span className={`font-display text-sm ${unlocked ? "text-yellow-300" : "text-white/20"}`}>
                      +{reward.coins.toLocaleString()}
                    </span>
                  )}
                  {unlocked && (
                    <span className="font-mono text-[9px] text-green-400">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
