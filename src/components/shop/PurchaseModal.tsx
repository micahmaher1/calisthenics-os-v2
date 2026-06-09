"use client";

import { useEffect, useState } from "react";
import { ShopItem, SHOP_RARITY_META } from "@/lib/shop-types";

interface Props {
  item:         ShopItem | null;
  coins:        number;
  onConfirm:    () => void;
  onCancel:     () => void;
}

export default function PurchaseModal({ item, coins, onConfirm, onCancel }: Props) {
  const [phase, setPhase]     = useState<"enter" | "show" | "success">("enter");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!item) { setVisible(false); setPhase("enter"); return; }
    setVisible(true);
    setPhase("enter");
    const t = setTimeout(() => setPhase("show"), 40);
    return () => clearTimeout(t);
  }, [item?.id]);

  if (!item || !visible) return null;

  const rm         = SHOP_RARITY_META[item.rarity];
  const remaining  = coins - item.price;
  const canAfford  = coins >= item.price;

  const handleConfirm = () => {
    setPhase("success");
    setTimeout(() => {
      onConfirm();
      setVisible(false);
    }, 900);
  };

  if (phase === "success") {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="animate-purchase-pop text-center">
          <div className="text-6xl mb-3">{item.icon}</div>
          <p className="font-display text-3xl text-white tracking-wider">PURCHASED!</p>
          <p className={`font-mono text-sm mt-1 ${rm.color}`}>{item.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 transition-all duration-300 ${
        phase === "show" ? "opacity-100" : "opacity-0"
      }`}
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div
        className={`relative z-10 w-full max-w-sm bg-surface-800 border ${rm.border} rounded-2xl overflow-hidden shadow-2xl transition-all duration-350 ${
          phase === "show" ? "translate-y-0 scale-100" : "translate-y-6 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Rarity top line */}
        <div className={`h-0.5 w-full ${
          item.rarity === "legendary"
            ? "bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
            : `bg-gradient-to-r from-transparent via-current to-transparent ${rm.color}`
        }`} />

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-5">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl border ${rm.border} ${rm.bg}`}>
              {item.icon}
            </div>
            <p className={`font-mono text-[8px] uppercase tracking-[0.3em] mb-1 ${rm.color}`}>{rm.label}</p>
            <p className="font-display text-2xl text-white tracking-wider">{item.name}</p>
            <p className="font-mono text-[10px] text-white/35 mt-1">{item.description}</p>
          </div>

          {/* Cost summary */}
          <div className={`border ${rm.border} ${rm.bg} rounded-xl p-4 space-y-2 mb-5`}>
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-white/40">Item Cost</span>
              <span className="font-display text-lg text-yellow-400">🪙 {item.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-white/40">Your Balance</span>
              <span className="font-display text-lg text-white">{coins.toLocaleString()}</span>
            </div>
            <div className="h-px bg-white/8" />
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-white/40">After Purchase</span>
              <span className={`font-display text-xl ${remaining >= 0 ? "text-green-400" : "text-red-400"}`}>
                {remaining.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-white/10 font-mono text-sm text-white/40 hover:text-white/60 hover:border-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canAfford}
              className={`flex-1 py-3 rounded-xl font-display text-xl tracking-widest transition-all active:scale-[0.97] ${
                canAfford
                  ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              {canAfford ? "CONFIRM" : "NOT ENOUGH"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
