"use client";

import { useEffect, useMemo, useState } from "react";
import { AchievementState, AchievementCategory, Rarity, CATEGORY_META, RARITY_META } from "@/lib/achievement-types";
import { ACHIEVEMENTS, ACHIEVEMENT_MAP } from "@/lib/achievement-data";
import { loadAchievementState } from "@/lib/achievement-storage";
import { computeStats } from "@/lib/achievement-utils";
import { loadState } from "@/lib/storage";
import { getRankLabel } from "@/lib/xp";
import Header from "@/components/Header";
import AchievementCard from "./AchievementCard";

const RARITIES: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary", "secret_legendary"];
const CATEGORIES: AchievementCategory[] = [
  "workout_milestones", "xp_milestones", "level_milestones",
  "skill_unlocks", "branch_completion", "advanced_skills", "endgame_skills",
  "streaks", "exercise_totals", "completionist",
];

export default function AchievementPage() {
  const [achState, setAchState] = useState<AchievementState | null>(null);
  const [level,    setLevel]    = useState(1);
  const [rank,     setRank]     = useState("Beginner");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<AchievementCategory | "all">("all");
  const [filterRarity, setFilterRarity] = useState<Rarity | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "unlocked" | "locked">("all");

  useEffect(() => {
    setAchState(loadAchievementState());
    const s = loadState();
    setLevel(s.level);
    setRank(getRankLabel(s.level));
  }, []);

  const stats = useMemo(() => achState ? computeStats(achState) : null, [achState]);

  const filtered = useMemo(() => {
    if (!achState) return [];
    return ACHIEVEMENTS.filter((ach) => {
      const prog = achState.progress[ach.id];
      const unlocked = prog?.unlocked ?? false;
      if (filterStatus === "unlocked" && !unlocked) return false;
      if (filterStatus === "locked"   &&  unlocked) return false;
      if (filterCat    !== "all" && ach.category !== filterCat) return false;
      if (filterRarity !== "all" && ach.rarity   !== filterRarity) return false;
      if (search) {
        const q = search.toLowerCase();
        const isSecret = ach.secret && !unlocked;
        if (isSecret) return false;
        return ach.name.toLowerCase().includes(q) || ach.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [achState, filterCat, filterRarity, filterStatus, search]);

  if (!achState || !stats) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🏆</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING ACHIEVEMENTS</span>
        </div>
      </div>
    );
  }

  const recentUnlocks = stats.recentlyUnlocked
    .map((id) => ACHIEVEMENT_MAP[id])
    .filter(Boolean)
    .slice(0, 3);

  const rarestUnlock = ACHIEVEMENTS
    .filter((a) => achState.progress[a.id]?.unlocked)
    .sort((a, b) => RARITIES.indexOf(b.rarity) - RARITIES.indexOf(a.rarity))[0];

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Header rank={rank} level={level} />

        {/* Page title */}
        <div className="mt-8 mb-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/30 mb-1">Hall of Fame</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider">ACHIEVEMENTS</h1>
          <p className="font-mono text-xs text-white/30 mt-1">{stats.unlocked} / {stats.total} Unlocked</p>
        </div>

        {/* Stats Overview */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon="🏆" label="Unlocked" value={String(stats.unlocked)} sub={`/ ${stats.total} total`} color="text-yellow-400" />
          <StatCard icon="💯" label="Completion" value={`${stats.completionPct}%`} sub="of all achievements" color="text-green-400" />
          <StatCard icon="🔐" label="Secrets Found" value={String(stats.secretUnlocked)} sub={`/ ${stats.secret} total`} color="text-purple-400" />
          <StatCard icon="💰" label="Coins Earned" value={String(achState.totalCoins)} sub="from achievements" color="text-amber-400" />
        </div>

        {/* Completion bar */}
        <div className="mt-4 bg-surface-800 border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">Overall Progress</span>
            <span className="font-mono text-[9px] text-yellow-400">{stats.completionPct}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full transition-all duration-1000"
              style={{ width: `${stats.completionPct}%` }}
            />
          </div>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {RARITIES.map((r) => {
              const rd = stats.byRarity[r];
              if (!rd) return null;
              const m = RARITY_META[r];
              return (
                <span key={r} className="flex items-center gap-1.5 font-mono text-[8px]">
                  <span className={m.color}>{rd.unlocked}/{rd.total}</span>
                  <span className="text-white/20">{m.label}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Showcase Row */}
        {(recentUnlocks.length > 0 || rarestUnlock) && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentUnlocks[0] && (
              <ShowcaseCard
                label="Latest Unlock"
                icon={recentUnlocks[0].icon}
                name={recentUnlocks[0].name}
                rarity={recentUnlocks[0].rarity}
                unlockTime={achState.progress[recentUnlocks[0].id]?.unlockedAt}
              />
            )}
            {rarestUnlock && (
              <ShowcaseCard
                label="Rarest Unlock"
                icon={rarestUnlock.icon}
                name={rarestUnlock.name}
                rarity={rarestUnlock.rarity}
                unlockTime={achState.progress[rarestUnlock.id]?.unlockedAt}
              />
            )}
            {recentUnlocks[1] && (
              <ShowcaseCard
                label="Previous Unlock"
                icon={recentUnlocks[1].icon}
                name={recentUnlocks[1].name}
                rarity={recentUnlocks[1].rarity}
                unlockTime={achState.progress[recentUnlocks[1].id]?.unlockedAt}
              />
            )}
          </div>
        )}

        {/* Filters */}
        <div className="mt-6 space-y-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search achievements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 font-body text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-yellow-500/30 transition-colors"
          />

          {/* Status filter */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "unlocked", "locked"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${
                  filterStatus === s
                    ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-400"
                    : "bg-white/3 border-white/5 text-white/30 hover:text-white/50"
                }`}
              >
                {s}
              </button>
            ))}
            <div className="w-px bg-white/10" />
            {(["all", ...RARITIES] as const).map((r) => {
              const m = r === "all" ? null : RARITY_META[r];
              return (
                <button
                  key={r}
                  onClick={() => setFilterRarity(r)}
                  className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${
                    filterRarity === r
                      ? `${m ? m.bg : "bg-white/10"} ${m ? m.border : "border-white/20"} ${m ? m.color : "text-white"}`
                      : "bg-white/3 border-white/5 text-white/30 hover:text-white/50"
                  }`}
                >
                  {r === "all" ? "All Rarities" : RARITY_META[r].label}
                </button>
              );
            })}
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCat("all")}
              className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${
                filterCat === "all"
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-white/3 border-white/5 text-white/30 hover:text-white/50"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => {
              const catMeta = CATEGORY_META[cat];
              const catStats = stats.byCategory[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${
                    filterCat === cat
                      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                      : "bg-white/3 border-white/5 text-white/30 hover:text-white/50"
                  }`}
                >
                  {catMeta.icon} {catMeta.label}
                  {catStats && (
                    <span className="ml-1 opacity-50">{catStats.unlocked}/{catStats.total}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">
            {filtered.length} Achievement{filtered.length !== 1 ? "s" : ""}
          </span>
          {search && (
            <button onClick={() => setSearch("")} className="font-mono text-[9px] text-white/30 hover:text-white/60">
              Clear ×
            </button>
          )}
        </div>

        {/* Achievement Grid */}
        {filtered.length === 0 ? (
          <div className="mt-8 text-center py-16 border border-dashed border-white/8 rounded-2xl">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-body text-base font-semibold text-white/40 mb-1">No achievements found</p>
            <p className="font-mono text-[9px] text-white/20">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((ach, i) => (
              <div
                key={ach.id}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 25, 400)}ms` }}
              >
                <AchievementCard
                  ach={ach}
                  prog={achState.progress[ach.id]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: {
  icon: string; label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className="bg-surface-800 border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">{label}</p>
        <p className={`font-display text-xl tracking-wide ${color}`}>{value}</p>
        <p className="font-mono text-[8px] text-white/20">{sub}</p>
      </div>
    </div>
  );
}

function ShowcaseCard({ label, icon, name, rarity, unlockTime }: {
  label: string; icon: string; name: string; rarity: Rarity; unlockTime?: number;
}) {
  const meta = RARITY_META[rarity];
  const timeAgo = unlockTime ? formatTimeAgo(unlockTime) : null;
  return (
    <div className={`relative overflow-hidden bg-surface-800 border ${meta.border} rounded-xl p-4`}>
      <p className="font-mono text-[8px] uppercase tracking-widest text-white/25 mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <div>
          <p className={`font-body text-sm font-semibold ${meta.color}`}>{name}</p>
          <p className="font-mono text-[8px] text-white/25">{timeAgo ?? meta.label}</p>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
