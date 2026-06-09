"use client";

import { AchievementDef, AchievementProgress, RARITY_META } from "@/lib/achievement-types";

interface Props {
  ach:     AchievementDef;
  prog:    AchievementProgress | undefined;
  onClick?: (id: string) => void;
}

export default function AchievementCard({ ach, prog, onClick }: Props) {
  const unlocked = prog?.unlocked ?? false;
  const current  = prog?.current ?? 0;
  const target   = prog?.target ?? ach.requirement.value;
  const pct      = unlocked ? 100 : Math.min(100, Math.round((current / target) * 100));
  const meta     = RARITY_META[ach.rarity];
  const isSecret = ach.secret && !unlocked;

  const barColors: Record<string, string> = {
    common:          "bg-white/40",
    uncommon:        "bg-green-400",
    rare:            "bg-sky-400",
    epic:            "bg-purple-400",
    legendary:       "bg-yellow-400",
    secret_legendary:"bg-yellow-300",
  };

  return (
    <button
      onClick={() => onClick?.(ach.id)}
      className={`group relative overflow-hidden text-left w-full rounded-xl border transition-all duration-200 p-4
        ${unlocked
          ? `${meta.bg} ${meta.border} hover:brightness-110 ${meta.glow ? `shadow-lg ${meta.glow}` : ""}`
          : "bg-surface-800 border-white/5 hover:border-white/10 hover:bg-surface-700"
        }
      `}
    >
      {/* Shimmer on legendary unlocked */}
      {unlocked && ach.rarity === "secret_legendary" && (
        <div className="absolute inset-0 shimmer pointer-events-none opacity-60" />
      )}

      {/* Animated border for secret legendary unlocked */}
      {unlocked && ach.rarity === "secret_legendary" && (
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-300/30 to-yellow-400/0 pointer-events-none" />
      )}

      <div className="relative">
        {/* Icon + rarity badge */}
        <div className="flex items-start justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl
            ${unlocked ? `${meta.bg} border ${meta.border}` : "bg-white/5 border border-white/5"}
            ${!unlocked ? "grayscale opacity-40" : ""}
          `}>
            {isSecret ? "❓" : ach.icon}
          </div>
          <span className={`font-mono text-[8px] uppercase tracking-widest px-2 py-1 rounded-full ${meta.badgeBg} ${meta.color}`}>
            {meta.label}
          </span>
        </div>

        {/* Name & description */}
        <div className="mb-3">
          <p className={`font-body text-sm font-semibold mb-0.5 leading-tight ${unlocked ? "text-white" : "text-white/40"}`}>
            {isSecret ? "?????" : ach.name}
          </p>
          <p className="font-mono text-[9px] text-white/30 line-clamp-2 leading-relaxed">
            {isSecret ? "Hidden Achievement" : ach.description}
          </p>
        </div>

        {/* Progress bar */}
        {!unlocked && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[8px] text-white/25">Progress</span>
              <span className="font-mono text-[8px] text-white/25">
                {isSecret ? "???" : `${current} / ${target}`}
              </span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColors[ach.rarity]} rounded-full transition-all duration-500`}
                style={{ width: isSecret ? "0%" : `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Unlock status / rewards */}
        <div className="flex items-center justify-between">
          {unlocked ? (
            <span className={`font-mono text-[8px] uppercase tracking-widest ${meta.color}`}>
              ✓ Unlocked
            </span>
          ) : (
            <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">
              Locked
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className={`font-mono text-[8px] ${unlocked ? meta.color : "text-white/20"}`}>
              +{ach.xpReward} XP
            </span>
            <span className={`font-mono text-[8px] ${unlocked ? "text-white/50" : "text-white/15"}`}>
              +{ach.coinReward} 🪙
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
