"use client";

import Link from "next/link";
import { TitleState, TITLE_RARITY_META } from "@/lib/title-types";
import { getEquippedTitle, TitleSnapshot, getClosestLockedTitle } from "@/lib/title-utils";
import { ALL_BADGES } from "@/lib/title-data";
import { BadgeDef } from "@/lib/title-types";

interface Props {
  titleState: TitleState;
  snap:       TitleSnapshot;
}

export default function TitleDashboardCard({ titleState, snap }: Props) {
  const equipped  = getEquippedTitle(titleState);
  const equippedR = equipped ? TITLE_RARITY_META[equipped.rarity] : null;

  // Recent badge unlocks (last 2)
  const recentBadges: BadgeDef[] = titleState.unlockedBadgeIds
    .slice(-2)
    .map((id) => ALL_BADGES.find((b) => b.id === id))
    .filter((b): b is BadgeDef => !!b);

  const closestTitle = getClosestLockedTitle(titleState, snap);

  return (
    <section className="animate-slide-up stagger-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Titles</span>
        <div className="flex-1 h-px bg-white/5" />
        <Link
          href="/titles"
          className="font-mono text-[9px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">
        {/* Top accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

        <div className="p-4">
          {/* Equipped Title */}
          {equipped && equippedR ? (
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${equippedR.border} ${equippedR.bg} mb-3`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg border ${equippedR.border} ${equippedR.bg}`}>
                {equipped.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-white/30">Equipped</span>
                  <span className={`font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-full ${equippedR.badgeClass} ${equippedR.color}`}>
                    {equippedR.label}
                  </span>
                </div>
                <p className={`font-display text-sm tracking-wider ${equippedR.color}`}>{equipped.name}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/3 mb-3 opacity-60">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg">🏷️</div>
              <p className="font-mono text-[10px] text-white/30">No title equipped</p>
            </div>
          )}

          {/* Counts */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white/3 border border-white/8 rounded-xl p-2.5 text-center">
              <p className="font-display text-xl text-white/80">{titleState.unlockedTitleIds.length}</p>
              <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Titles</p>
            </div>
            <div className="bg-white/3 border border-white/8 rounded-xl p-2.5 text-center">
              <p className="font-display text-xl text-white/80">{titleState.unlockedBadgeIds.length}</p>
              <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Badges</p>
            </div>
          </div>

          {/* Recent badges */}
          {recentBadges.length > 0 && (
            <div className="mb-3">
              <p className="font-mono text-[9px] text-white/25 uppercase tracking-widest mb-2">Recent Badges</p>
              <div className="flex gap-2">
                {recentBadges.map((b) => {
                  const br = TITLE_RARITY_META[b.rarity];
                  return (
                    <div key={b.id} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${br.border} ${br.bg}`}>
                      <span>{b.icon}</span>
                      <span className={`font-mono text-[9px] ${br.color}`}>{b.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Next title progress */}
          {closestTitle && (
            <div>
              <p className="font-mono text-[9px] text-white/25 uppercase tracking-widest mb-2">Next Title</p>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">{closestTitle.title.icon}</span>
                <span className={`font-mono text-[10px] ${TITLE_RARITY_META[closestTitle.title.rarity].color}`}>
                  {closestTitle.title.name}
                </span>
                <span className="ml-auto font-mono text-[9px] text-white/30">
                  {closestTitle.progress.pct}%
                </span>
              </div>
              <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    closestTitle.title.rarity === "rare" ? "bg-sky-400" :
                    closestTitle.title.rarity === "epic" ? "bg-purple-400" :
                    closestTitle.title.rarity === "legendary" ? "bg-yellow-400" :
                    closestTitle.title.rarity === "mythic" ? "bg-pink-400" : "bg-white/40"
                  }`}
                  style={{ width: `${closestTitle.progress.pct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
