"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppState } from "@/lib/types";
import { calcLevelProgress, calcXPToNextLevel, getRankInfo } from "@/lib/xp";
import { TitleState, TITLE_RARITY_META } from "@/lib/title-types";
import { TITLE_MAP } from "@/lib/title-data";
import { MasteryState, calcGlobalMasteryScore } from "@/lib/mastery-types";
import { StreakState } from "@/lib/streak-types";
import { TrainingScore } from "@/lib/training-hub-types";

interface Props {
  appState:      AppState;
  streakState:   StreakState | null;
  masteryState:  MasteryState | null;
  titleState:    TitleState | null;
  trainingScore: TrainingScore | null;
  rank:          string;
}

export default function HeroCommandCenter({
  appState, streakState, masteryState, titleState, trainingScore, rank,
}: Props) {
  const [initials,   setInitials]   = useState("?");
  const [avatarUrl,  setAvatarUrl]  = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("Warrior");

  useEffect(() => {
    const { loadProfile: lp, loadAvatar: la } = require("@/lib/profile-storage");
    const { getInitials: gi } = require("@/lib/profile-utils");
    const p = lp();
    setInitials(gi(p.name, p.displayName));
    setAvatarUrl(la());
    setPlayerName(p.displayName || p.name || "Warrior");
  }, []);

  const equippedTitle = titleState?.equippedTitleId ? TITLE_MAP[titleState.equippedTitleId] : null;
  const rarityMeta    = equippedTitle ? TITLE_RARITY_META[equippedTitle.rarity] : null;
  const rankInfo      = getRankInfo(appState.level);
  const pct           = calcLevelProgress(appState.totalXP);
  const xpToNext      = calcXPToNextLevel(appState.totalXP);
  const streak        = streakState?.daily.current ?? 0;
  const masteryScore  = masteryState ? calcGlobalMasteryScore(masteryState) : 0;

  return (
    <div className="mt-5 bg-surface-800 border border-white/8 rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar + identity */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full ring-2 ${rankInfo.borderColor} overflow-hidden bg-surface-700 border border-white/10 flex items-center justify-center`}>
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-2xl text-white/60">{initials}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface-800 border border-white/15 flex items-center justify-center text-[10px]">
              {rankInfo.icon}
            </div>
          </div>
          <div>
            <div className="font-display text-lg tracking-wide text-white leading-tight">{playerName}</div>
            {equippedTitle && rarityMeta && (
              <div className={`inline-block font-mono text-[9px] px-2 py-0.5 rounded-full border mt-0.5 ${rarityMeta.color} ${rarityMeta.border} ${rarityMeta.bg}`}>
                {equippedTitle.icon} {equippedTitle.name}
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className={`font-mono text-[10px] uppercase tracking-widest ${rankInfo.color}`}>{rank}</span>
              <span className="text-white/20">·</span>
              <span className="font-mono text-[10px] text-white/40">Lv. {appState.level}</span>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between font-mono text-[9px] text-white/30 mb-1">
            <span className="stat-number">{appState.totalXP} XP</span>
            <span>{xpToNext} to next level</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-green-500/70 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {trainingScore && (
            <div className="text-center">
              <div className={`font-display text-xl leading-tight stat-number ${trainingScore.rankColor}`}>{trainingScore.total}</div>
              <div className="font-mono text-[9px] text-white/30 uppercase">Score</div>
            </div>
          )}
          <div className="text-center">
            <div className="font-display text-xl text-red-400 leading-tight stat-number">{streak}</div>
            <div className="font-mono text-[9px] text-white/30 uppercase">🔥 Streak</div>
          </div>
          <div className="text-center">
            <div className="font-display text-xl text-indigo-400 leading-tight stat-number">{masteryScore}</div>
            <div className="font-mono text-[9px] text-white/30 uppercase">⭐ Mastery</div>
          </div>
          <div className="text-center">
            <div className="font-display text-xl text-yellow-400 leading-tight stat-number">{appState.coins}</div>
            <div className="font-mono text-[9px] text-white/30 uppercase">🪙 Coins</div>
          </div>
        </div>
      </div>

      {trainingScore && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className={`font-mono text-[10px] ${trainingScore.rankColor}`}>{trainingScore.rank}</span>
          <Link href="/profile" className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors">
            View Profile →
          </Link>
        </div>
      )}
    </div>
  );
}
