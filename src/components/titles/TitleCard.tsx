"use client";

import { TitleDef, TITLE_RARITY_META, TITLE_CATEGORY_META } from "@/lib/title-types";
import { TitleProgress } from "@/lib/title-utils";

interface Props {
  def:       TitleDef;
  unlocked:  boolean;
  equipped:  boolean;
  progress?: TitleProgress;
  onEquip:   () => void;
}

export default function TitleCard({ def, unlocked, equipped, progress, onEquip }: Props) {
  const rarity   = TITLE_RARITY_META[def.rarity];
  const category = TITLE_CATEGORY_META[def.category];
  const isSecret = def.secret && !unlocked;

  if (isSecret) {
    return (
      <div className="relative bg-surface-800 border border-white/8 rounded-2xl p-4 opacity-60">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
            🔒
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display text-sm text-white/30">???</span>
              <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full ${rarity.badgeClass} ${rarity.color}`}>
                {rarity.label}
              </span>
            </div>
            <p className="font-mono text-[10px] text-white/25 leading-relaxed">{def.hint ?? "Secret title — keep training to unlock."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={unlocked ? onEquip : undefined}
      disabled={!unlocked}
      className={`
        relative w-full text-left bg-surface-800 border rounded-2xl p-4 transition-all duration-200
        ${unlocked ? `${rarity.border} ${rarity.bg} ${rarity.glow ? `shadow-lg ${rarity.glow}` : ""} hover:scale-[1.02] cursor-pointer` : "border-white/8 opacity-60 cursor-default"}
        ${equipped ? "ring-2 ring-yellow-400/50" : ""}
        ${rarity.shimmer && unlocked ? "shimmer" : ""}
      `}
    >
      {equipped && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          <span className="font-mono text-[8px] text-yellow-400 uppercase tracking-widest">Equipped</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border ${unlocked ? `${rarity.bg} ${rarity.border}` : "bg-white/5 border-white/10"}`}>
          {def.icon}
        </div>

        <div className="flex-1 min-w-0 pr-8">
          {/* Name + rarity */}
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={`font-display text-sm tracking-wider ${unlocked ? rarity.color : "text-white/40"}`}>
              {def.name}
            </span>
            <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full ${rarity.badgeClass} ${rarity.color}`}>
              {rarity.label}
            </span>
          </div>

          {/* Category */}
          <div className={`flex items-center gap-1 mb-1.5 ${category.color}`}>
            <span className="text-[10px]">{category.icon}</span>
            <span className="font-mono text-[9px] uppercase tracking-widest">{category.label}</span>
          </div>

          {/* Description */}
          <p className={`font-mono text-[10px] leading-relaxed ${unlocked ? "text-white/50" : "text-white/25"}`}>
            {def.description}
          </p>

          {/* Requirements / progress */}
          {!unlocked && progress && (
            <div className="mt-2.5">
              {def.requirements.map((req, i) => (
                <div key={i} className="mb-1.5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[9px] text-white/30">{req.label}</span>
                    {i === 0 && (
                      <span className="font-mono text-[9px] text-white/40">
                        {progress.current.toLocaleString()} / {progress.max.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {i === 0 && (
                    <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          def.rarity === "rare" ? "bg-sky-400" :
                          def.rarity === "epic" ? "bg-purple-400" :
                          def.rarity === "legendary" ? "bg-yellow-400" :
                          def.rarity === "mythic" ? "bg-pink-400" : "bg-white/40"
                        }`}
                        style={{ width: `${progress.pct}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {unlocked && !equipped && (
            <div className="mt-2">
              <span className={`font-mono text-[9px] uppercase tracking-widest ${rarity.color} opacity-70`}>
                Click to equip
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
