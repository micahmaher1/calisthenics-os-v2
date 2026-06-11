"use client";

import { BadgeDef, TITLE_RARITY_META } from "@/lib/title-types";

interface Props {
  def:              BadgeDef;
  unlocked:         boolean;
  favorited:        boolean;
  onToggleFavorite: () => void;
}

export default function BadgeCard({ def, unlocked, favorited, onToggleFavorite }: Props) {
  const rarity = TITLE_RARITY_META[def.rarity];

  return (
    <button
      onClick={unlocked ? onToggleFavorite : undefined}
      disabled={!unlocked}
      className={`
        relative w-full text-left rounded-2xl p-3 border transition-all duration-200
        ${unlocked
          ? `${rarity.border} ${rarity.bg} ${rarity.glow ? `shadow-md ${rarity.glow}` : ""} hover:scale-[1.03] cursor-pointer`
          : "border-white/8 bg-surface-800 opacity-50 cursor-default"}
        ${favorited ? "ring-2 ring-yellow-400/40" : ""}
        ${rarity.shimmer && unlocked ? "shimmer" : ""}
      `}
    >
      {favorited && (
        <div className="absolute top-2 right-2 text-yellow-400 text-xs">★</div>
      )}
      {!unlocked && (
        <div className="absolute top-2 right-2 text-white/20 text-xs">🔒</div>
      )}

      <div className="flex flex-col items-center gap-2 text-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl border ${unlocked ? `${rarity.bg} ${rarity.border}` : "bg-white/5 border-white/10"}`}>
          {def.icon}
        </div>
        <div>
          <p className={`font-display text-[11px] tracking-wider leading-tight ${unlocked ? rarity.color : "text-white/30"}`}>
            {def.name}
          </p>
          <p className={`font-mono text-[8px] uppercase tracking-widest mt-0.5 ${rarity.color} opacity-70`}>
            {rarity.label}
          </p>
        </div>
        {unlocked && (
          <p className="font-mono text-[9px] text-white/35 leading-snug line-clamp-2">
            {def.description}
          </p>
        )}
      </div>
    </button>
  );
}
