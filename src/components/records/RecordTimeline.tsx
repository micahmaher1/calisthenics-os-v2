"use client";

import { TrackedRecord } from "@/lib/records-types";

interface TimelineEntry {
  exerciseName: string;
  value:        number;
  unit:         string;
  dateAchieved: string;
  improvement:  number | null;
  previousValue: number | null;
}

interface Props {
  records: Record<string, TrackedRecord>;
}

const UNIT_LABEL: Record<string, string> = {
  reps: "reps", seconds: "sec", minutes: "min", count: "", custom: "",
};

export default function RecordTimeline({ records }: Props) {
  // Flatten all history entries and sort newest first
  const entries: TimelineEntry[] = [];

  for (const record of Object.values(records)) {
    const hist = record.history;
    for (let i = 0; i < hist.length; i++) {
      entries.push({
        exerciseName:  record.exerciseName,
        value:         hist[i].value,
        unit:          record.unit,
        dateAchieved:  hist[i].dateAchieved,
        improvement:   i > 0 ? hist[i].value - hist[i - 1].value : null,
        previousValue: i > 0 ? hist[i - 1].value : null,
      });
    }
  }

  entries.sort(
    (a, b) => new Date(b.dateAchieved).getTime() - new Date(a.dateAchieved).getTime(),
  );

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-white/8 rounded-2xl">
        <p className="text-3xl mb-2">📭</p>
        <p className="font-body text-sm text-white/30">No records set yet. Log workouts to build your history.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[18px] top-0 bottom-0 w-px bg-white/6 pointer-events-none" />

      <div className="space-y-3">
        {entries.slice(0, 50).map((entry, i) => (
          <TimelineRow key={`${entry.exerciseName}-${entry.dateAchieved}-${i}`} entry={entry} />
        ))}
      </div>

      {entries.length > 50 && (
        <p className="font-mono text-[9px] text-white/25 text-center mt-4">
          Showing latest 50 of {entries.length} records
        </p>
      )}
    </div>
  );
}

function TimelineRow({ entry }: { entry: TimelineEntry }) {
  const unit = UNIT_LABEL[entry.unit] ?? entry.unit;
  const date = new Date(entry.dateAchieved).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
  const isNew = entry.improvement !== null && entry.improvement > 0;

  return (
    <div className="flex gap-4 pl-1">
      {/* Dot */}
      <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm border z-10 ${
        isNew
          ? "border-green-500/30 bg-green-500/10 text-green-400"
          : "border-white/10 bg-surface-700 text-white/40"
      }`}>
        {isNew ? "↑" : "•"}
      </div>

      {/* Content */}
      <div className="flex-1 bg-surface-800 border border-white/6 rounded-xl px-4 py-2.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-body text-sm font-medium text-white">{entry.exerciseName}</p>
            {isNew && entry.previousValue !== null && (
              <p className="font-mono text-[9px] text-green-400">
                {entry.previousValue} → {entry.value} {unit} (+{entry.improvement})
              </p>
            )}
            {!isNew && (
              <p className="font-mono text-[9px] text-white/30">
                First record: {entry.value} {unit}
              </p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-display text-xl t-text">{entry.value}</p>
            <p className="font-mono text-[8px] text-white/25">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
