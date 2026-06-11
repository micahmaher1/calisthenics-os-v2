"use client";

import { TrackedRecord } from "@/lib/records-types";
import { getDisplayCategory } from "@/lib/records-engine";

const UNIT_LABEL: Record<string, string> = {
  reps:    "reps",
  seconds: "sec",
  minutes: "min",
  count:   "",
  custom:  "",
};

export const CATEGORY_COLORS = {
  push:     { text: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/5", accent: "bg-orange-400" },
  pull:     { text: "text-sky-400",    border: "border-sky-500/30",    bg: "bg-sky-500/5",    accent: "bg-sky-400"    },
  core:     { text: "text-teal-400",   border: "border-teal-500/30",   bg: "bg-teal-500/5",   accent: "bg-teal-400"   },
  skill:    { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/5", accent: "bg-purple-400" },
  strength: { text: "text-white/60",   border: "border-white/10",      bg: "bg-white/[0.03]", accent: "bg-white/30"   },
} as const;

const CATEGORY_LABEL: Record<string, string> = {
  push: "Push", pull: "Pull", core: "Core", skill: "Skill", strength: "Strength",
};

const CATEGORY_ICON: Record<string, string> = {
  push: "🔵", pull: "🟢", core: "🟡", skill: "🟣", strength: "💪",
};

interface Props {
  record:        TrackedRecord;
  isNew?:        boolean;
  isTopRecord?:  boolean;
}

export default function RecordCard({ record, isNew, isTopRecord }: Props) {
  const { current } = record;
  if (!current) return null;

  const displayCat = getDisplayCategory(record.exerciseName);
  const colors     = CATEGORY_COLORS[displayCat] ?? CATEGORY_COLORS.strength;
  const unit       = UNIT_LABEL[record.unit] ?? record.unit;
  const hasImprove = current.improvement !== null && current.improvement > 0;
  const date       = current.dateAchieved
    ? new Date(current.dateAchieved).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;

  const histSlice = record.history.slice(-5);
  const maxVal    = Math.max(...histSlice.map((h) => h.value), current.value, 1);

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${colors.border} ${colors.bg} transition-all duration-200 hover:brightness-110 flex`}>
      {/* Left accent bar */}
      <div className={`w-1 flex-shrink-0 rounded-l-2xl ${colors.accent}`} />

      <div className="flex-1 p-4">
        {isTopRecord && (
          <div className="absolute top-2 right-2 text-lg">🏆</div>
        )}
        {isNew && !isTopRecord && (
          <div className="absolute top-2 right-2">
            <span className="font-mono text-[7px] uppercase tracking-widest text-green-400 bg-green-500/15 border border-green-500/25 px-1.5 py-0.5 rounded-full">
              New PR
            </span>
          </div>
        )}

        {/* Category pill */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs">{CATEGORY_ICON[displayCat]}</span>
          <span className={`font-mono text-[8px] uppercase tracking-widest ${colors.text}`}>
            {CATEGORY_LABEL[displayCat]}
          </span>
        </div>

        <p className="font-body text-sm font-semibold text-white leading-tight truncate mb-2">
          {record.exerciseName}
        </p>

        <div className="flex items-end gap-2 mb-2">
          <span className={`font-display text-5xl leading-none ${colors.text}`}>
            {current.value.toLocaleString()}
          </span>
          <span className="font-mono text-xs text-white/40 mb-1">{unit}</span>
        </div>

        {hasImprove && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-green-400 text-xs">↑</span>
            <span className="font-mono text-[9px] text-green-400">
              +{current.improvement} {unit} from {current.previousValue}
            </span>
          </div>
        )}
        {!hasImprove && current.previousValue !== null && (
          <div className="mb-2">
            <span className="font-mono text-[9px] text-white/30">
              Previous: {current.previousValue} {unit}
            </span>
          </div>
        )}

        {histSlice.length > 1 && (
          <div className="flex items-end gap-0.5 h-6 mb-2">
            {histSlice.map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-sm opacity-60 ${colors.accent}`}
                style={{ height: `${Math.max(15, (h.value / maxVal) * 100)}%` }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          {date && <p className="font-mono text-[8px] text-white/25">{date}</p>}
          <span className="text-base ml-auto">{CATEGORY_ICON[displayCat]}</span>
        </div>
      </div>
    </div>
  );
}
