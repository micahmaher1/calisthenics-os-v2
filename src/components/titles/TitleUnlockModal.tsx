"use client";

import { useState } from "react";
import { TitleUnlockResult, TitleDef, BadgeDef, TITLE_RARITY_META } from "@/lib/title-types";

interface Props {
  unlocks:  TitleUnlockResult[];
  onEquip:  (id: string) => void;
  onClose:  () => void;
}

export default function TitleUnlockModal({ unlocks, onEquip, onClose }: Props) {
  const [idx, setIdx] = useState(0);

  if (unlocks.length === 0) return null;

  const current = unlocks[idx];
  if (!current) return null;

  const isTitle = current.type === "title";
  const def     = current.def as TitleDef | BadgeDef;
  const rarity  = TITLE_RARITY_META[def.rarity];

  function handleNext() {
    if (idx + 1 < unlocks.length) {
      setIdx(idx + 1);
    } else {
      onClose();
    }
  }

  function handleEquip() {
    if (isTitle) {
      onEquip(def.id);
    }
    handleNext();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleNext} />

      {/* Modal */}
      <div className={`relative w-full max-w-sm bg-surface-800 border ${rarity.border} rounded-3xl p-8 text-center animate-modal-up shadow-2xl ${rarity.glow ? `shadow-2xl ${rarity.glow}` : ""} ${rarity.shimmer ? "shimmer" : ""}`}>
        {/* Top accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-transparent via-current to-transparent ${rarity.color}`} />

        {/* Type badge */}
        <div className="flex justify-center mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${rarity.border} ${rarity.bg}`}>
            <span className={`font-mono text-[9px] uppercase tracking-widest ${rarity.color}`}>
              {isTitle ? "Title Unlocked" : "Badge Unlocked"}
            </span>
          </div>
        </div>

        {/* Icon */}
        <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl border ${rarity.border} ${rarity.bg} shadow-lg animate-num-pop`}>
          {def.icon}
        </div>

        {/* Name */}
        <h2 className={`font-display text-2xl tracking-widest mb-1 ${rarity.color}`}>
          {def.name}
        </h2>

        {/* Rarity */}
        <div className={`inline-block font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${rarity.badgeClass} ${rarity.color}`}>
          {rarity.label}
        </div>

        {/* Description */}
        <p className="font-mono text-[11px] text-white/50 leading-relaxed mb-6">
          {def.description}
        </p>

        {/* Queue indicator */}
        {unlocks.length > 1 && (
          <p className="font-mono text-[9px] text-white/25 mb-4">
            {idx + 1} / {unlocks.length}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {isTitle && (
            <button
              onClick={handleEquip}
              className={`flex-1 py-3 rounded-xl font-display text-sm tracking-wider border ${rarity.border} ${rarity.bg} ${rarity.color} hover:opacity-90 transition-opacity`}
            >
              EQUIP NOW
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl font-display text-sm tracking-wider border border-white/10 bg-white/5 text-white/50 hover:text-white/70 transition-colors"
          >
            {idx + 1 < unlocks.length ? "NEXT" : "DISMISS"}
          </button>
        </div>
      </div>
    </div>
  );
}
