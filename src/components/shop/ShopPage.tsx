"use client";

import { useEffect, useState, useCallback } from "react";
import { loadState, saveState } from "@/lib/storage";
import { loadShopState, saveShopState, purchaseItem, equipItem } from "@/lib/shop-storage";
import { loadQuestState } from "@/lib/quest-storage";
import { loadAchievementState } from "@/lib/achievement-storage";
import { getRankLabel, getRankInfo } from "@/lib/xp";
import {
  ShopItem, ShopState, EquippedCosmetics, ItemCategory,
  CATEGORY_META, SHOP_RARITY_META, THEMES, BORDERS, BORDER_MAP, THEME_MAP,
} from "@/lib/shop-types";
import { SHOP_ITEMS, FEATURED_ITEMS } from "@/lib/shop-data";
import { AppState } from "@/lib/types";
import Header from "@/components/Header";
import ShopItemCard from "./ShopItemCard";
import PurchaseModal from "./PurchaseModal";

const TABS: { key: ItemCategory | "all" | "owned"; label: string; icon: string }[] = [
  { key: "all",      label: "All Items",   icon: "🛒"  },
  { key: "featured", label: "Featured",    icon: "⭐"  },
  { key: "title",    label: "Titles",      icon: "🏷️"  },
  { key: "border",   label: "Borders",     icon: "🖼️"  },
  { key: "theme",    label: "Themes",      icon: "🎨"  },
  { key: "badge",    label: "Badges",      icon: "📛"  },
  { key: "owned",    label: "Owned",       icon: "✅"  },
];

type TabKey = typeof TABS[number]["key"];

function checkRequirements(item: ShopItem, appState: AppState, questCount: number): boolean {
  if (!item.requirements || item.requirements.length === 0) return true;
  const rankLabel = getRankLabel(appState.level);
  const RANK_ORDER = ["Beginner","Trainee","Athlete","Advanced Athlete","Elite","Master","Grandmaster","Legend"];
  return item.requirements.every((req) => {
    switch (req.type) {
      case "level":         return appState.level >= (req.value as number);
      case "rank":          return RANK_ORDER.indexOf(rankLabel) >= RANK_ORDER.indexOf(req.value as string);
      case "quest_count":   return questCount >= (req.value as number);
      case "workout_count": return appState.workouts.length >= (req.value as number);
      default:              return true;
    }
  });
}

export default function ShopPage() {
  const [appState,   setAppState]   = useState<AppState | null>(null);
  const [shopState,  setShopState]  = useState<ShopState | null>(null);
  const [activeTab,  setActiveTab]  = useState<TabKey>("all");
  const [buying,     setBuying]     = useState<ShopItem | null>(null);
  const [questCount, setQuestCount] = useState(0);
  const [justBought, setJustBought] = useState<string | null>(null);
  const [justEquipped, setJustEquipped] = useState<string | null>(null);

  useEffect(() => {
    setAppState(loadState());
    setShopState(loadShopState());
    const qs = loadQuestState();
    setQuestCount(qs.stats.totalCompleted);
  }, []);

  const handleBuy = useCallback((item: ShopItem) => {
    setBuying(item);
  }, []);

  const handleConfirmPurchase = useCallback(() => {
    if (!buying || !appState || !shopState) return;
    if (appState.coins < buying.price) return;

    // Deduct coins
    const newAppState = { ...appState, coins: appState.coins - buying.price };
    saveState(newAppState);
    setAppState(newAppState);

    // Add to owned
    const newShopState = purchaseItem(shopState, buying.id, buying.price);
    saveShopState(newShopState);
    setShopState(newShopState);

    setJustBought(buying.id);
    setTimeout(() => setJustBought(null), 2000);
    setBuying(null);
  }, [buying, appState, shopState]);

  const handleEquip = useCallback((item: ShopItem) => {
    if (!shopState) return;
    const catMap: Record<ItemCategory, keyof EquippedCosmetics> = {
      title: "titleId", border: "borderId", theme: "themeId", badge: "badgeId", featured: "titleId",
    };
    const key = catMap[item.category];
    if (!key) return;
    const newShopState = equipItem(shopState, key, item.id);
    saveShopState(newShopState);
    setShopState(newShopState);

    // Apply theme immediately
    if (item.category === "theme" && item.themeId) {
      if (item.themeId === "default") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", item.themeId);
      }
    }
    setJustEquipped(item.id);
    setTimeout(() => setJustEquipped(null), 1500);
  }, [shopState]);

  const handleUnequip = useCallback((item: ShopItem) => {
    if (!shopState) return;
    const catMap: Record<ItemCategory, keyof EquippedCosmetics> = {
      title: "titleId", border: "borderId", theme: "themeId", badge: "badgeId", featured: "titleId",
    };
    const key = catMap[item.category];
    if (!key) return;
    const newShopState = equipItem(shopState, key, null);
    saveShopState(newShopState);
    setShopState(newShopState);

    if (item.category === "theme") {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [shopState]);

  if (!appState || !shopState) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🛒</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING SHOP</span>
        </div>
      </div>
    );
  }

  const rank    = getRankLabel(appState.level);

  // Filter items for current tab
  const displayItems = (() => {
    if (activeTab === "owned")    return SHOP_ITEMS.filter((i) => shopState.ownedItemIds.includes(i.id));
    if (activeTab === "featured") return FEATURED_ITEMS;
    if (activeTab === "all")      return SHOP_ITEMS;
    return SHOP_ITEMS.filter((i) => i.category === activeTab);
  })();

  const isEquipped = (item: ShopItem): boolean => {
    const { equipped } = shopState;
    return (
      equipped.titleId  === item.id ||
      equipped.borderId === item.id ||
      equipped.themeId  === item.id ||
      equipped.badgeId  === item.id
    );
  };

  const equippedBorder = shopState.equipped.borderId ? SHOP_ITEMS.find((i) => i.id === shopState.equipped.borderId) : null;
  const equippedTitle  = shopState.equipped.titleId  ? SHOP_ITEMS.find((i) => i.id === shopState.equipped.titleId)  : null;
  const equippedTheme  = shopState.equipped.themeId  ? THEME_MAP[
    SHOP_ITEMS.find((i) => i.id === shopState.equipped.themeId)?.themeId ?? "default"
  ] ?? THEME_MAP["default"] : THEME_MAP["default"];
  const equippedBadge  = shopState.equipped.badgeId  ? SHOP_ITEMS.find((i) => i.id === shopState.equipped.badgeId)  : null;

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#4ade80 1px,transparent 1px),linear-gradient(90deg,#4ade80 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-yellow-500/3 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Header rank={rank} level={appState.level} />

        {/* Shop header */}
        <div className="mt-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30 mb-1">Cosmetics Store</p>
              <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider">SHOP</h1>
            </div>

            {/* Coin balance — prominent */}
            <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/25 rounded-2xl px-5 py-3">
              <span className="text-3xl">🪙</span>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-widest text-yellow-400/60">Balance</p>
                <p className="font-display text-3xl text-yellow-400 leading-none">{appState.coins.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipped cosmetics summary */}
        <div className="mb-6 bg-surface-800 border border-white/8 rounded-2xl p-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-3">Currently Equipped</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <EquippedSlot icon="🏷️" label="Title"  value={equippedTitle?.name ?? "None"} />
            <EquippedSlot icon="🖼️" label="Border" value={equippedBorder?.name ?? "Default"} />
            <EquippedSlot
              icon="🎨"
              label="Theme"
              value={equippedTheme?.name ?? "Emerald"}
              accentHex={equippedTheme?.accentHex}
            />
            <EquippedSlot icon="📛" label="Badge"  value={equippedBadge?.name ?? "None"} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-[9px] uppercase tracking-widest transition-all ${
                activeTab === tab.key
                  ? "bg-white/12 border border-white/20 text-white"
                  : "border border-white/8 text-white/35 hover:text-white/60 hover:border-white/15"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.key === "owned" && shopState.ownedItemIds.length > 0 && (
                <span className="bg-green-500/20 border border-green-500/25 text-green-400 px-1.5 rounded-full text-[7px]">
                  {shopState.ownedItemIds.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Featured banner */}
        {activeTab === "featured" && (
          <div className="mb-6 relative overflow-hidden border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-2xl p-5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-yellow-400/20 blur-2xl pointer-events-none" />
            <div className="animate-shimmer-fast absolute inset-0 pointer-events-none" />
            <div className="relative">
              <p className="font-mono text-[8px] uppercase tracking-widest text-yellow-400/70 mb-1">✦ Limited Selection ✦</p>
              <p className="font-display text-xl text-yellow-300">Featured Items</p>
              <p className="font-mono text-[9px] text-white/30 mt-1">Rare cosmetics handpicked for legends.</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {displayItems.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/8 rounded-2xl">
            <p className="text-4xl mb-3">🛒</p>
            <p className="font-body text-base text-white/30">
              {activeTab === "owned" ? "You haven't purchased anything yet." : "No items in this category."}
            </p>
            {activeTab === "owned" && (
              <button
                onClick={() => setActiveTab("all")}
                className="mt-4 px-4 py-2 border border-yellow-500/25 rounded-xl font-mono text-[9px] uppercase tracking-widest text-yellow-400 hover:bg-yellow-500/10 transition-all"
              >
                Browse Shop
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayItems.map((item) => {
            const owned   = shopState.ownedItemIds.includes(item.id);
            const eq      = isEquipped(item);
            const canAff  = appState.coins >= item.price;
            const locked  = !owned && !checkRequirements(item, appState, questCount);
            const lockReason = locked
              ? item.requirements?.map((r) => r.label).join(", ")
              : undefined;

            return (
              <div
                key={item.id}
                className={justBought === item.id ? "animate-purchase-pop" : justEquipped === item.id ? "scale-[1.02] transition-transform" : ""}
              >
                <ShopItemCard
                  item={item}
                  owned={owned}
                  equipped={eq}
                  canAfford={canAff}
                  locked={locked}
                  lockReason={lockReason}
                  onBuy={handleBuy}
                  onEquip={handleEquip}
                  onUnequip={handleUnequip}
                />
              </div>
            );
          })}
        </div>

        {/* Shop stats */}
        <div className="mt-10 bg-surface-800 border border-white/8 rounded-2xl p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-4">Shop Stats</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ShopStat label="Items Owned"    value={shopState.ownedItemIds.length.toString()}          color="text-green-400" />
            <ShopStat label="Total Spent"    value={`🪙 ${shopState.totalSpent.toLocaleString()}`}     color="text-yellow-400" />
            <ShopStat label="Purchases"      value={shopState.purchaseHistory.length.toString()}        color="text-sky-400" />
            <ShopStat label="Coin Balance"   value={appState.coins.toLocaleString()}                   color="text-white" />
          </div>
        </div>
      </div>

      <PurchaseModal
        item={buying}
        coins={appState.coins}
        onConfirm={handleConfirmPurchase}
        onCancel={() => setBuying(null)}
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EquippedSlot({ icon, label, value, accentHex }: {
  icon: string; label: string; value: string; accentHex?: string;
}) {
  return (
    <div className="bg-surface-700 rounded-xl px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {accentHex && (
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: accentHex }} />
        )}
        <p className="font-body text-xs font-semibold text-white truncate">{value}</p>
      </div>
    </div>
  );
}

function ShopStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="font-mono text-[8px] uppercase tracking-widest text-white/25 mb-0.5">{label}</p>
      <p className={`font-display text-xl ${color}`}>{value}</p>
    </div>
  );
}
