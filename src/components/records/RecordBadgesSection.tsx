"use client";

import { RecordBadge } from "@/lib/records-types";

const RARITY_COLORS: Record<RecordBadge["rarity"], { border: string; glow: string; label: string; text: string }> = {
  common:    { border: "border-green-500/40",  glow: "shadow-green-500/20",  label: "Common",    text: "text-green-400"  },
  rare:      { border: "border-blue-500/40",   glow: "shadow-blue-500/20",   label: "Rare",      text: "text-blue-400"   },
  epic:      { border: "border-purple-500/40", glow: "shadow-purple-500/20", label: "Epic",      text: "text-purple-400" },
  legendary: { border: "border-amber-500/40",  glow: "shadow-amber-500/20",  label: "Legendary", text: "text-amber-400"  },
};

interface Props {
  badges: RecordBadge[];
}

function BadgeCard({ badge }: { badge: RecordBadge }) {
  const rarity = RARITY_COLORS[badge.rarity];
  const date   = badge.earnedDate
    ? new Date(badge.earnedDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;

  if (!badge.earned) {
    return (
      <div className="bg-surface-800 border border-white/6 rounded-2xl p-4 opacity-40">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-700 border border-white/8 flex items-center justify-center text-lg flex-shrink-0">
            🔒
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-body text-sm font-semibold text-white/40 truncate">{badge.name}</p>
              <span className={`font-mono text-[7px] uppercase tracking-widest ${rarity.text} border ${rarity.border} px-1.5 py-0.5 rounded-full flex-shrink-0`}>
                {rarity.label}
              </span>
            </div>
            <p className="font-mono text-[9px] text-white/25">{badge.description}</p>
            <p className="font-mono text-[8px] text-white/20 mt-1">Locked</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface-800 border ${rarity.border} rounded-2xl p-4 shadow-lg ${rarity.glow}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl border ${rarity.border} bg-surface-700 flex items-center justify-center text-xl flex-shrink-0`}>
          {badge.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-body text-sm font-semibold text-white truncate">{badge.name}</p>
            <span className={`font-mono text-[7px] uppercase tracking-widest ${rarity.text} border ${rarity.border} px-1.5 py-0.5 rounded-full flex-shrink-0`}>
              {rarity.label}
            </span>
          </div>
          <p className="font-mono text-[9px] text-white/40">{badge.description}</p>
          {date && (
            <p className={`font-mono text-[8px] mt-1 ${rarity.text}`}>Earned {date}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RecordBadgesSection({ badges }: Props) {
  const earned  = badges.filter((b) => b.earned);
  const locked  = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
          Badges — {earned.length}/{badges.length} earned
        </span>
      </div>

      {earned.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {earned.map((b) => <BadgeCard key={b.id} badge={b} />)}
        </div>
      )}

      {locked.length > 0 && (
        <>
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mt-4">
            Locked ({locked.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {locked.map((b) => <BadgeCard key={b.id} badge={b} />)}
          </div>
        </>
      )}

      {badges.length === 0 && (
        <div className="text-center py-10 border border-dashed border-white/8 rounded-2xl">
          <p className="text-3xl mb-2">🏅</p>
          <p className="font-mono text-[9px] text-white/25">No badges yet — log more workouts!</p>
        </div>
      )}
    </div>
  );
}
