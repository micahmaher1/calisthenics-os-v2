"use client";

import { useEffect, useState, CSSProperties } from "react";
import { Workout } from "@/lib/types";
import { getRankInfo, calcLevelProgress, calcXPIntoLevel, XP_PER_LEVEL } from "@/lib/xp";
import { AchievementDef, RARITY_META } from "@/lib/achievement-types";
import { getRewardForLevel } from "@/lib/progression";
import { NewRecordResult } from "@/lib/records-types";

export interface WorkoutResult {
  workout:         Workout;
  prevLevel:       number;
  newLevel:        number;
  prevRank:        string;
  newRank:         string;
  streak:          number;
  coinsEarned:     number;
  newAchievements: AchievementDef[];
  totalXP:         number;
  newRecords?:     NewRecordResult[];
}

interface Props {
  result:   WorkoutResult | null;
  onClose:  () => void;
}

export default function WorkoutCompleteModal({ result, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"enter" | "show">("enter");

  useEffect(() => {
    if (!result) { setVisible(false); return; }
    setPhase("enter");
    setVisible(true);
    const t = setTimeout(() => setPhase("show"), 60);
    return () => clearTimeout(t);
  }, [result?.workout.id]);

  if (!result || !visible) return null;

  const { workout, prevLevel, newLevel, prevRank, newRank, streak, coinsEarned, newAchievements, totalXP, newRecords } = result;
  const leveledUp   = newLevel > prevLevel;
  const rankChanged = newRank !== prevRank;
  const newRankInfo = getRankInfo(newLevel);
  const levelReward = leveledUp ? getRewardForLevel(newLevel) : null;

  // XP bar: show progress within new level
  const newLevelProgress = calcLevelProgress(totalXP);
  const xpInNewLevel     = calcXPIntoLevel(totalXP);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 transition-all duration-300 ${
        phase === "show" ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-sm bg-surface-800 border border-white/8 rounded-2xl overflow-hidden shadow-2xl transition-all duration-400 ${
          phase === "show" ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-green-400 to-transparent" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-3xl mx-auto mb-3 shadow-[0_0_24px_rgba(74,222,128,0.2)]">
            ✓
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">
            Workout Complete
          </p>
          <p className="font-body text-lg font-semibold text-white">{workout.name}</p>
          <p className="font-mono text-sm text-white/40 mt-0.5">{workout.reps} reps</p>
        </div>

        {/* Reward row */}
        <div className="flex gap-3 px-6 pb-4">
          <RewardChip value={`+${workout.xpEarned}`} label="XP" color="text-green-400" bg="bg-green-500/10" border="border-green-500/25" icon="⚡" big />
          <RewardChip value={`+${coinsEarned}`} label="Coins" color="text-yellow-400" bg="bg-yellow-500/10" border="border-yellow-500/25" icon="🪙" />
          {streak > 0 && (
            <RewardChip value={`${streak}`} label="Streak" color="text-orange-400" bg="bg-orange-500/10" border="border-orange-500/25" icon="🔥" />
          )}
        </div>

        {/* Level Progress */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
              Level {newLevel} Progress
            </span>
            <span className="font-mono text-[9px] text-green-400">
              {xpInNewLevel} / {XP_PER_LEVEL} XP
            </span>
          </div>
          <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600 via-green-400 to-green-300 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${newLevelProgress}%` } as CSSProperties}
            />
          </div>
        </div>

        {/* Epic Level Up Section */}
        {leveledUp && (
          <div className="mx-6 mb-4 relative overflow-hidden rounded-2xl bg-gradient-to-b from-yellow-500/20 via-yellow-400/10 to-transparent border border-yellow-400/40 px-4 pt-5 pb-4 text-center">
            {/* Glow blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-12 bg-yellow-400/30 blur-2xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-20 h-8 bg-yellow-500/20 blur-xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-20 h-8 bg-yellow-500/20 blur-xl rounded-full pointer-events-none" />

            {/* Label */}
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-yellow-400/70 mb-2 relative">
              ✦ Level Up ✦
            </p>

            {/* Level numbers */}
            <div className="flex items-center justify-center gap-4 mb-3 relative">
              <div className="text-center">
                <div className="font-display text-4xl text-white/25">{prevLevel}</div>
                <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">was</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-yellow-400 text-lg">→</span>
              </div>
              <div className="text-center">
                <div className="font-display text-6xl text-yellow-300 animate-num-pop drop-shadow-[0_0_12px_rgba(253,224,71,0.5)]">
                  {newLevel}
                </div>
                <div className="font-mono text-[8px] text-yellow-400/60 uppercase tracking-widest">now</div>
              </div>
            </div>

            {/* Rank change */}
            {rankChanged ? (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${newRankInfo.bgColor} ${newRankInfo.borderColor} shadow-lg mb-2`}>
                <span className="text-xl">{newRankInfo.icon}</span>
                <div className="text-left">
                  <p className="font-mono text-[8px] text-white/40 uppercase tracking-widest">Rank Up!</p>
                  <p className={`font-display text-lg ${newRankInfo.color}`}>{newRank}</p>
                </div>
              </div>
            ) : (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${newRankInfo.bgColor} ${newRankInfo.borderColor}`}>
                <span>{newRankInfo.icon}</span>
                <span className={`font-display text-sm ${newRankInfo.color}`}>{newRank}</span>
              </div>
            )}

            {/* Level reward */}
            {levelReward && (
              <div className="mt-3 flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/25 rounded-xl px-3 py-2">
                <span className="text-xl">{levelReward.icon}</span>
                <div className="flex-1 text-left">
                  <p className="font-body text-xs font-semibold text-yellow-200">{levelReward.title}</p>
                  <p className="font-mono text-[8px] text-yellow-400/60">{levelReward.desc}</p>
                </div>
                {levelReward.coins > 0 && (
                  <span className="font-display text-base text-yellow-300">+{levelReward.coins.toLocaleString()}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* New personal records */}
        {newRecords && newRecords.length > 0 && (
          <div className="px-6 pb-4 space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">
              🏅 Personal Record{newRecords.length > 1 ? "s" : ""} Broken
            </p>
            {newRecords.slice(0, 3).map((pr, i) => (
              <div key={i} className="flex items-center gap-3 bg-green-500/8 border border-green-500/20 rounded-xl px-3 py-2">
                <span className="text-xl">🏅</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs font-semibold text-white truncate">{pr.exerciseName}</p>
                  <p className="font-mono text-[8px] text-green-400">
                    {pr.oldValue} → {pr.newValue} (+{pr.improvement})
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Achievement unlocks */}
        {newAchievements.length > 0 && (
          <div className="px-6 pb-4 space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">
              Achievement{newAchievements.length > 1 ? "s" : ""} Unlocked
            </p>
            {newAchievements.slice(0, 3).map((ach) => {
              const m = RARITY_META[ach.rarity];
              return (
                <div key={ach.id} className={`flex items-center gap-3 ${m.bg} border ${m.border} rounded-xl px-3 py-2`}>
                  <span className="text-xl">{ach.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs font-semibold text-white truncate">{ach.name}</p>
                    <p className={`font-mono text-[8px] ${m.color}`}>{m.label} · +{ach.xpReward} XP</p>
                  </div>
                </div>
              );
            })}
            {newAchievements.length > 3 && (
              <p className="font-mono text-[8px] text-white/20 text-center">+{newAchievements.length - 3} more</p>
            )}
          </div>
        )}

        {/* Close */}
        <div className="px-6 pb-6">
          <button
            onClick={handleClose}
            className="w-full py-3.5 rounded-xl font-display text-lg tracking-widest bg-green-500 hover:bg-green-400 text-black transition-all active:scale-[0.98] glow-green"
          >
            {leveledUp ? "LEVEL UP! 🎉" : (newRecords && newRecords.length > 0) ? "NEW RECORD! 🏅" : newAchievements.length > 0 ? "ACHIEVEMENT!" : "LET'S GO!"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RewardChip({ value, label, color, bg, border, icon, big }: {
  value: string; label: string; color: string; bg: string; border: string; icon: string; big?: boolean;
}) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center ${bg} border ${border} rounded-xl py-3 gap-0.5`}>
      <span className="text-lg leading-none">{icon}</span>
      <span className={`font-display ${big ? "text-2xl" : "text-xl"} leading-none ${color}`}>{value}</span>
      <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">{label}</span>
    </div>
  );
}
