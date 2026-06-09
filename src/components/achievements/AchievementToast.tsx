"use client";

import { useEffect, useState } from "react";
import { AchievementNotification } from "@/lib/achievement-types";
import { ACHIEVEMENT_MAP } from "@/lib/achievement-data";
import { RARITY_META } from "@/lib/achievement-types";

interface Props {
  notification: AchievementNotification | null;
  onDismiss: () => void;
}

export default function AchievementToast({ notification, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!notification) {
      setVisible(false);
      setExiting(false);
      return;
    }
    setExiting(false);
    const show = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(show);
  }, [notification?.id]);

  if (!notification) return null;
  const ach = ACHIEVEMENT_MAP[notification.id];
  if (!ach) return null;

  const meta = RARITY_META[ach.rarity];
  const isSecret = ach.rarity === "secret_legendary";
  const isLegendary = ach.rarity === "legendary";

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(onDismiss, 350);
  };

  if (isSecret) {
    return (
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${visible && !exiting ? "opacity-100" : "opacity-0"}`}
        onClick={handleDismiss}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        {/* Card */}
        <div
          className={`relative z-10 max-w-sm w-full mx-4 transition-all duration-500 ${visible && !exiting ? "scale-100 translate-y-0" : "scale-90 translate-y-8"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated border */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 opacity-70 animate-spin-slow" />
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 opacity-40 blur-sm" />

          <div className="relative bg-[#0d0a00] border border-yellow-400/40 rounded-2xl p-6 text-center overflow-hidden">
            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-yellow-400/20 blur-2xl rounded-full" />

            <div className="relative">
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-yellow-300/60 mb-3">
                Secret Achievement Unlocked
              </p>
              <div className="text-5xl mb-4 filter drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]">
                {ach.icon}
              </div>
              <h3 className="font-display text-2xl tracking-widest text-yellow-300 mb-1">
                {ach.name}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-yellow-400/60 mb-3">
                {meta.label}
              </p>
              <p className="font-body text-sm text-white/70 mb-4 leading-relaxed">
                {ach.description}
              </p>
              <div className="flex items-center justify-center gap-4">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                  <span className="text-yellow-400 font-mono text-[10px] uppercase tracking-widest">+{ach.xpReward} XP</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                  <span className="text-yellow-300 font-mono text-[10px] uppercase tracking-widest">+{ach.coinReward} 🪙</span>
                </span>
              </div>
              <p className="font-mono text-[9px] text-white/20 mt-4">Tap anywhere to continue</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal / Rare / Epic / Legendary toast (bottom-left slide-up)
  const glowClass = isLegendary
    ? "shadow-[0_0_30px_rgba(234,179,8,0.3)]"
    : meta.glow ? `shadow-[0_0_20px_rgba(74,222,128,0.15)]` : "";

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4 transition-all duration-350 ${
        visible && !exiting
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-surface-800 border ${meta.border} rounded-2xl p-4 ${glowClass} cursor-pointer`}
        onClick={handleDismiss}
      >
        {/* Shimmer for legendary */}
        {isLegendary && (
          <div className="absolute inset-0 shimmer pointer-events-none" />
        )}

        {/* Rarity glow line */}
        <div className={`absolute top-0 left-0 right-0 h-[1px] ${meta.bg} opacity-60`}
          style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }}
        />

        <div className="relative flex items-start gap-3">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center text-2xl`}>
            {ach.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`font-mono text-[8px] uppercase tracking-widest ${meta.color}`}>
                Achievement Unlocked
              </span>
            </div>
            <p className="font-body text-sm font-semibold text-white truncate">{ach.name}</p>
            <p className="font-mono text-[9px] text-white/40 mt-0.5 line-clamp-1">{ach.description}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`font-mono text-[8px] ${meta.color}`}>+{ach.xpReward} XP</span>
              <span className="text-white/20 text-[8px]">·</span>
              <span className="font-mono text-[8px] text-white/40">+{ach.coinReward} 🪙</span>
              <span className="text-white/20 text-[8px]">·</span>
              <span className={`font-mono text-[8px] ${meta.color}`}>{meta.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
