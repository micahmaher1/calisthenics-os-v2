"use client";

import { useEffect, useState, useMemo } from "react";
import { loadTitleState, saveTitleState, toggleFavoriteBadge, equipTitle } from "@/lib/title-storage";
import { loadState } from "@/lib/storage";
import { loadStreakState } from "@/lib/streak-storage";
import { loadTreeState } from "@/lib/skilltree-engine";
import { loadAchievementState } from "@/lib/achievement-storage";
import { loadQuestState } from "@/lib/quest-storage";
import { loadRecordsState } from "@/lib/records-storage";
import {
  buildTitleSnapshot, evaluateTitlesAndBadges, getTitleProgress,
  getEquippedTitle, TitleSnapshot,
} from "@/lib/title-utils";
import {
  TitleState, TitleDef, BadgeDef,
  TITLE_RARITY_META, TITLE_CATEGORY_META, TitleCategory, TitleRarity,
} from "@/lib/title-types";
import { ALL_TITLES, ALL_BADGES } from "@/lib/title-data";
import PageHeader from "@/components/ui/PageHeader";
import TitleCard from "./TitleCard";
import BadgeCard from "./BadgeCard";

type SortMode = "rarity" | "status" | "name";

const RARITY_ORDER: TitleRarity[] = ["mythic", "legendary", "epic", "rare", "common"];

function rarityWeight(r: TitleRarity) { return RARITY_ORDER.indexOf(r); }

export default function TitleCollectionPage() {
  const [titleState, setTitleState] = useState<TitleState | null>(null);
  const [snap,       setSnap]       = useState<TitleSnapshot | null>(null);
  const [level,      setLevel]      = useState(1);

  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState<TitleCategory | "all">("all");
  const [sort,       setSort]       = useState<SortMode>("rarity");

  useEffect(() => {
    const appState    = loadState();
    const streakState = loadStreakState();
    const treeState   = loadTreeState();
    const achState    = loadAchievementState();
    const questState  = loadQuestState();
    const recState    = loadRecordsState();

    const snapshot = buildTitleSnapshot(appState, streakState, treeState, achState, questState, recState);
    setSnap(snapshot);
    setLevel(appState.level);

    const raw = loadTitleState();
    const { newState } = evaluateTitlesAndBadges(raw, snapshot);
    saveTitleState(newState);
    setTitleState(newState);
  }, []);

  const handleEquip = (id: string) => {
    equipTitle(id);
    setTitleState((prev) => prev ? { ...prev, equippedTitleId: id } : prev);
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteBadge(id);
    setTitleState((prev) => {
      if (!prev) return prev;
      const fav = prev.favoriteBadgeIds;
      const idx = fav.indexOf(id);
      const newFav = idx >= 0 ? fav.filter((x) => x !== id) : fav.length < 4 ? [...fav, id] : fav;
      return { ...prev, favoriteBadgeIds: newFav };
    });
  };

  const filteredTitles = useMemo(() => {
    if (!titleState) return [];
    let list = [...ALL_TITLES];

    // Filter secret-locked
    list = list.filter((t) => !t.secret || titleState.unlockedTitleIds.includes(t.id));

    if (category !== "all") list = list.filter((t) => t.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      const aUnlocked = titleState.unlockedTitleIds.includes(a.id);
      const bUnlocked = titleState.unlockedTitleIds.includes(b.id);
      if (sort === "rarity") return rarityWeight(a.rarity) - rarityWeight(b.rarity);
      if (sort === "status") return (aUnlocked ? 0 : 1) - (bUnlocked ? 0 : 1);
      if (sort === "name")   return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [titleState, category, search, sort]);

  // Count categories that have titles
  const usedCategories = useMemo(() => {
    const cats = new Set<TitleCategory>();
    ALL_TITLES.forEach((t) => {
      if (!t.secret) cats.add(t.category);
    });
    return Array.from(cats);
  }, []);

  if (!titleState || !snap) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🏷️</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING TITLES</span>
        </div>
      </div>
    );
  }

  const equippedTitle    = getEquippedTitle(titleState);
  const equippedRarity   = equippedTitle ? TITLE_RARITY_META[equippedTitle.rarity] : null;
  const totalTitles      = ALL_TITLES.filter((t) => !t.secret).length;
  const unlockedTitles   = titleState.unlockedTitleIds.length;
  const unlockedBadges   = titleState.unlockedBadgeIds.length;
  const rarePlus         = titleState.unlockedTitleIds.filter((id) => {
    const t = ALL_TITLES.find((x) => x.id === id);
    return t && (t.rarity === "rare" || t.rarity === "epic" || t.rarity === "legendary" || t.rarity === "mythic");
  }).length;
  const mythicCount      = titleState.unlockedTitleIds.filter((id) => {
    const t = ALL_TITLES.find((x) => x.id === id);
    return t && t.rarity === "mythic";
  }).length;

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(#eab308 1px,transparent 1px),linear-gradient(90deg,#eab308 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <PageHeader icon="🏷️" title="TITLES & BADGES" subtitle="Collectible Prestige Rewards" />

        {/* Equipped title */}
        {equippedTitle && equippedRarity && (
          <div className={`mb-6 p-5 rounded-2xl border ${equippedRarity.border} ${equippedRarity.bg} ${equippedRarity.shimmer ? "shimmer" : ""} ${equippedRarity.glow ? `shadow-lg ${equippedRarity.glow}` : ""}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">Currently Equipped</span>
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl ${equippedRarity.border} ${equippedRarity.bg}`}>
                {equippedTitle.icon}
              </div>
              <div>
                <h2 className={`font-display text-2xl tracking-widest ${equippedRarity.color}`}>{equippedTitle.name}</h2>
                <p className="font-mono text-[10px] text-white/40">{equippedTitle.description}</p>
              </div>
              <div className="ml-auto">
                <span className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full border ${equippedRarity.border} ${equippedRarity.badgeClass} ${equippedRarity.color}`}>
                  {equippedRarity.label}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Titles", value: unlockedTitles, color: "text-white/80" },
            { label: "Badges", value: unlockedBadges, color: "text-sky-400" },
            { label: "Rare+",  value: rarePlus,        color: "text-purple-400" },
            { label: "Mythic", value: mythicCount,     color: "text-pink-400" },
          ].map((s) => (
            <div key={s.label} className="bg-surface-800 border border-white/8 rounded-xl p-3 text-center">
              <p className={`font-display text-2xl ${s.color}`}>{s.value}</p>
              <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles..."
            className="flex-1 bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-[11px] text-white/70 placeholder-white/20 focus:outline-none focus:border-yellow-500/30"
          />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-[11px] text-white/50 focus:outline-none"
          >
            <option value="rarity">Sort: Rarity</option>
            <option value="status">Sort: Status</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setCategory("all")}
            className={`px-3 py-1.5 rounded-xl border font-mono text-[9px] uppercase tracking-widest transition-all ${
              category === "all"
                ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                : "border-white/10 bg-white/3 text-white/30 hover:text-white/50"
            }`}
          >
            All
          </button>
          {usedCategories.map((cat) => {
            const meta = TITLE_CATEGORY_META[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border font-mono text-[9px] uppercase tracking-widest transition-all ${
                  category === cat
                    ? `border-yellow-500/40 bg-yellow-500/10 ${meta.color}`
                    : "border-white/10 bg-white/3 text-white/30 hover:text-white/50"
                }`}
              >
                {meta.icon} {meta.label}
              </button>
            );
          })}
        </div>

        {/* Titles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {filteredTitles.map((title) => {
            const unlocked = titleState.unlockedTitleIds.includes(title.id);
            const equipped = titleState.equippedTitleId === title.id;
            const progress = snap ? getTitleProgress(title, snap) : undefined;
            return (
              <TitleCard
                key={title.id}
                def={title}
                unlocked={unlocked}
                equipped={equipped}
                progress={progress}
                onEquip={() => handleEquip(title.id)}
              />
            );
          })}
          {filteredTitles.length === 0 && (
            <div className="col-span-2 text-center py-12 text-white/25 font-mono text-[11px]">
              No titles match your search.
            </div>
          )}
        </div>

        {/* Badges section */}
        <div className="mt-2 mb-4 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Badges</span>
          <div className="flex-1 h-px bg-white/5" />
          <span className="font-mono text-[9px] text-white/20">
            {unlockedBadges} / {ALL_BADGES.length} · click to favorite (max 4)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {ALL_BADGES.map((badge) => {
            const unlocked  = titleState.unlockedBadgeIds.includes(badge.id);
            const favorited = titleState.favoriteBadgeIds.includes(badge.id);
            return (
              <BadgeCard
                key={badge.id}
                def={badge}
                unlocked={unlocked}
                favorited={favorited}
                onToggleFavorite={() => handleToggleFavorite(badge.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
