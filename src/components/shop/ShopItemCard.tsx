"use client";

import { ShopItem, SHOP_RARITY_META, THEMES, BORDERS, THEME_MAP, BORDER_MAP } from "@/lib/shop-types";

interface Props {
  item:        ShopItem;
  owned:       boolean;
  equipped:    boolean;
  canAfford:   boolean;
  locked:      boolean;
  lockReason?: string;
  onBuy:       (item: ShopItem) => void;
  onEquip:     (item: ShopItem) => void;
  onUnequip:   (item: ShopItem) => void;
}

export default function ShopItemCard({
  item, owned, equipped, canAfford, locked, lockReason, onBuy, onEquip, onUnequip,
}: Props) {
  const rm = SHOP_RARITY_META[item.rarity];

  return (
    <div
      className={`relative overflow-hidden border rounded-2xl flex flex-col transition-all duration-200 ${
        equipped
          ? "border-green-500/40 bg-green-500/6 shadow-lg shadow-green-500/10"
          : locked
          ? "border-white/5 bg-surface-800/40 opacity-60"
          : `${rm.border} ${rm.bg} ${rm.glow ? `shadow-md ${rm.glow}` : ""}`
      }`}
    >
      {/* Legendary shimmer */}
      {item.rarity === "legendary" && !locked && (
        <div className="absolute inset-0 animate-shimmer-fast pointer-events-none opacity-60" />
      )}

      {/* Top accent line */}
      <div className={`h-0.5 w-full flex-shrink-0 ${
        item.rarity === "legendary"
          ? "bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          : item.rarity === "epic"
          ? "bg-gradient-to-r from-transparent via-purple-400/60 to-transparent"
          : item.rarity === "rare"
          ? "bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"
          : "bg-gradient-to-r from-transparent via-white/10 to-transparent"
      }`} />

      <div className="p-4 flex flex-col flex-1">
        {/* Icon + preview */}
        <div className="flex items-start gap-3 mb-3">
          {/* Visual preview for borders/themes */}
          {item.category === "border" && item.borderId ? (
            <BorderPreview borderId={item.borderId} />
          ) : item.category === "theme" && item.themeId ? (
            <ThemePreview themeId={item.themeId} />
          ) : (
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${rm.border} ${rm.bg}`}>
              {item.icon}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5 mb-1">
              <p className="font-body text-sm font-semibold text-white leading-snug">{item.name}</p>
              <span className={`flex-shrink-0 font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${rm.bg} ${rm.border} ${rm.color}`}>
                {rm.label}
              </span>
            </div>
            <p className="font-mono text-[9px] text-white/35 leading-relaxed">{item.description}</p>
          </div>
        </div>

        {/* Requirements */}
        {item.requirements && item.requirements.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {item.requirements.map((req, i) => (
              <span
                key={i}
                className={`font-mono text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                  locked ? "border-red-500/25 bg-red-500/8 text-red-400/70" : "border-white/10 bg-white/5 text-white/30"
                }`}
              >
                {req.label}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom: price + action */}
        <div className="flex items-center justify-between gap-2 mt-2">
          {/* Price */}
          <div className="flex items-center gap-1">
            <span className="text-base">🪙</span>
            <span className={`font-display text-xl ${owned ? "text-white/30 line-through" : canAfford ? "text-yellow-400" : "text-red-400"}`}>
              {item.price.toLocaleString()}
            </span>
          </div>

          {/* Action */}
          {locked ? (
            <span className="font-mono text-[8px] text-white/25 uppercase tracking-widest">🔒 Locked</span>
          ) : owned ? (
            <button
              onClick={() => equipped ? onUnequip(item) : onEquip(item)}
              className={`px-3 py-1.5 rounded-xl font-mono text-[8px] uppercase tracking-widest transition-all ${
                equipped
                  ? "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                  : "bg-white/8 border border-white/12 text-white/50 hover:bg-white/15 hover:text-white/80"
              }`}
            >
              {equipped ? "Equipped ✓" : "Equip"}
            </button>
          ) : (
            <button
              onClick={() => canAfford && onBuy(item)}
              disabled={!canAfford}
              className={`px-3 py-1.5 rounded-xl font-mono text-[8px] uppercase tracking-widest transition-all ${
                canAfford
                  ? "bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/25 active:scale-[0.97]"
                  : "bg-white/4 border border-white/8 text-white/20 cursor-not-allowed"
              }`}
            >
              {canAfford ? "Buy" : "Can't Afford"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Preview sub-components ───────────────────────────────────────────────────

function BorderPreview({ borderId }: { borderId: string }) {
  const b = BORDER_MAP[borderId];
  if (!b) return null;
  return (
    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
      <div
        className="w-10 h-10 rounded-full bg-surface-600 flex items-center justify-center"
        style={{ boxShadow: b.glowStyle }}
      >
        <div
          className="w-7 h-7 rounded-full"
          style={{ background: b.previewGrad }}
        />
      </div>
    </div>
  );
}

function ThemePreview({ themeId }: { themeId: string }) {
  const t = THEME_MAP[themeId];
  if (!t) return null;
  return (
    <div
      className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden border border-white/10"
      style={{ background: t.previewBg }}
    >
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${t.accentHex}, transparent)` }} />
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 rounded-full" style={{ background: t.accentHex, boxShadow: `0 0 12px ${t.accentHex}` }} />
      </div>
    </div>
  );
}
