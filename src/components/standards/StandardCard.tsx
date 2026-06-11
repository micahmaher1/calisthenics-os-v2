"use client";

import { MovementStandard, StandardProgress, STANDARD_RANK_META, MOVEMENT_CATEGORY_META } from "@/lib/movement-standards-types";
import RankBadge from "./RankBadge";

interface StandardCardProps {
  standard: MovementStandard;
  progress: StandardProgress;
  onClick: () => void;
  selected?: boolean;
}

const rankBarColor: Record<string, string> = {
  unranked:  "bg-slate-600",
  bronze:    "bg-amber-600",
  silver:    "bg-slate-400",
  gold:      "bg-yellow-400",
  elite:     "bg-sky-400",
  legendary: "bg-purple-400",
};

export default function StandardCard({ standard, progress, onClick, selected }: StandardCardProps) {
  const catMeta = MOVEMENT_CATEGORY_META[standard.category];
  const rankMeta = STANDARD_RANK_META[progress.currentRank];
  const nextMeta = progress.nextRank ? STANDARD_RANK_META[progress.nextRank] : null;
  const barColor = rankBarColor[progress.nextRank ?? progress.currentRank] ?? "bg-slate-600";

  const isLegendary = progress.currentRank === "legendary";

  // Format value display
  function formatValue(): string {
    if (standard.measureType === "qualitative") {
      const idx = progress.currentValue;
      if (idx < 0) return "Unranked";
      return standard.qualitativeLabels?.[idx] ?? `Level ${idx}`;
    }
    if (standard.unit === "seconds") {
      return `${progress.currentValue}s`;
    }
    return `${progress.currentValue} ${standard.unit}`;
  }

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl border transition-all
        ${selected
          ? "border-amber-500/50 bg-amber-900/10 shadow-lg shadow-amber-500/10"
          : isLegendary
            ? "border-purple-500/40 bg-purple-900/10 hover:border-purple-400/60"
            : "border-white/8 bg-surface-800 hover:border-white/20 hover:bg-surface-700"
        }
        ${isLegendary ? "animate-pulse-subtle" : ""}
      `}
    >
      {/* Top row: icon + name + badges */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{standard.icon}</span>
          <div>
            <div className="font-display text-sm tracking-wide text-white">{standard.name}</div>
            <div className={`font-mono text-[9px] uppercase tracking-widest ${catMeta.color}`}>
              {catMeta.icon} {catMeta.label}
            </div>
          </div>
        </div>
        <RankBadge rank={progress.currentRank} size="sm" />
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className={`font-mono text-[9px] uppercase tracking-widest ${rankMeta.color}`}>
            {rankMeta.label}
          </span>
          {nextMeta && (
            <span className={`font-mono text-[9px] uppercase tracking-widest ${nextMeta.color}`}>
              {nextMeta.label}
            </span>
          )}
          {!nextMeta && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-purple-400">
              MAX
            </span>
          )}
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </div>

      {/* Bottom: value + remaining */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/60">{formatValue()}</span>
        {progress.remaining !== null && progress.remaining > 0 && progress.nextRank && (
          <span className="font-mono text-[9px] text-white/30">
            {standard.measureType === "seconds"
              ? `${progress.remaining}s`
              : standard.measureType === "qualitative"
                ? `next level`
                : `${progress.remaining} more`
            } → {STANDARD_RANK_META[progress.nextRank].label}
          </span>
        )}
        {isLegendary && (
          <span className="font-mono text-[9px] text-purple-400">👑 Legendary</span>
        )}
      </div>
    </button>
  );
}
