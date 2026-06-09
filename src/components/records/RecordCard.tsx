"use client";

import { TrackedRecord } from "@/lib/records-types";

const UNIT_LABEL: Record<string, string> = {
  reps:    "reps",
  seconds: "sec",
  minutes: "min",
  count:   "",
  custom:  "",
};

const CATEGORY_ICON: Record<string, string> = {
  strength:    "💪",
  core:        "🧘",
  hanging:     "🧗",
  skills:      "⭐",
  consistency: "📅",
  xp:          "✨",
  workouts:    "🏋️",
  custom:      "⚙️",
};

interface Props {
  record:      TrackedRecord;
  isNew?:      boolean;
}

export default function RecordCard({ record, isNew }: Props) {
  const { current } = record;
  if (!current) return null;

  const unit       = UNIT_LABEL[record.unit] ?? record.unit;
  const catIcon    = CATEGORY_ICON[record.category] ?? "📊";
  const hasImprove = current.improvement !== null && current.improvement > 0;
  const date       = current.dateAchieved
    ? new Date(current.dateAchieved).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;

  // Sparkline — last 5 history entries
  const histSlice = record.history.slice(-5);
  const maxVal    = Math.max(...histSlice.map((h) => h.value), current.value, 1);

  return (
    <div
      className={`relative overflow-hidden border rounded-2xl p-4 transition-all duration-200 ${
        isNew
          ? "border-green-500/40 bg-green-500/6 shadow-lg shadow-green-500/10"
          : "border-white/8 bg-surface-800 hover:border-white/15"
      }`}
    >
      {isNew && (
        <div className="absolute top-2 right-2">
          <span className="font-mono text-[7px] uppercase tracking-widest text-green-400 bg-green-500/15 border border-green-500/25 px-1.5 py-0.5 rounded-full">
            New PR
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-surface-700 border border-white/8 flex items-center justify-center text-lg flex-shrink-0">
          {catIcon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body text-sm font-semibold text-white leading-tight truncate">
            {record.exerciseName}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 mt-0.5">
            {record.category}
          </p>
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-2 mb-2">
        <span className="font-display text-4xl t-text leading-none">{current.value.toLocaleString()}</span>
        <span className="font-mono text-xs text-white/40 mb-1">{unit}</span>
      </div>

      {/* Improvement */}
      {hasImprove && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-green-400 text-xs">↑</span>
          <span className="font-mono text-[9px] text-green-400">
            +{current.improvement} {unit} from {current.previousValue} {unit}
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

      {/* Sparkline */}
      {histSlice.length > 1 && (
        <div className="flex items-end gap-0.5 h-6 mb-2">
          {histSlice.map((h, i) => (
            <div
              key={i}
              className="flex-1 t-bar rounded-sm opacity-70 transition-all"
              style={{ height: `${Math.max(15, (h.value / maxVal) * 100)}%` }}
            />
          ))}
        </div>
      )}

      {/* Date */}
      {date && (
        <p className="font-mono text-[8px] text-white/25">{date}</p>
      )}
    </div>
  );
}
