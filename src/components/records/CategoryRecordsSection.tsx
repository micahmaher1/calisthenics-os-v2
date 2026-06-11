"use client";

import { TrackedRecord, RecordDisplayCategory } from "@/lib/records-types";
import { getDisplayCategory } from "@/lib/records-engine";
import RecordCard, { CATEGORY_COLORS } from "./RecordCard";

// Canonical exercises per category shown as placeholders if no record yet
const CATEGORY_EXERCISES: Record<RecordDisplayCategory, string[]> = {
  push:  ["Push-Ups", "Dips", "Pike Push-Ups", "Handstand Push-Ups"],
  pull:  ["Pull-Ups", "Chin-Ups", "Muscle-Ups", "Front Lever Hold"],
  core:  ["Plank", "L-Sit", "Hollow Hold", "Hanging Leg Raises"],
  skill: ["Handstand Hold", "Human Flag", "Crow Pose", "Front Lever"],
};

const CATEGORY_HEADER: Record<RecordDisplayCategory, { icon: string; label: string; color: string }> = {
  push:  { icon: "🔵", label: "PUSH",          color: "text-orange-400" },
  pull:  { icon: "🟢", label: "PULL",          color: "text-sky-400"    },
  core:  { icon: "🟡", label: "CORE",          color: "text-teal-400"   },
  skill: { icon: "🟣", label: "SKILL & BALANCE", color: "text-purple-400" },
};

interface Props {
  records:  Record<string, TrackedRecord>;
  category: RecordDisplayCategory;
}

function PlaceholderCard({ exerciseName, category }: { exerciseName: string; category: RecordDisplayCategory }) {
  const colors = CATEGORY_COLORS[category];
  return (
    <div className={`rounded-2xl border ${colors.border} bg-white/[0.02] p-4 opacity-40 flex items-center gap-3`}>
      <div className="w-8 h-8 rounded-lg border border-white/10 bg-surface-700 flex items-center justify-center text-base">
        📊
      </div>
      <div>
        <p className="font-body text-sm text-white/50 truncate">{exerciseName}</p>
        <p className="font-mono text-[8px] text-white/25 uppercase tracking-widest mt-0.5">Start Tracking — Log a workout</p>
      </div>
    </div>
  );
}

export default function CategoryRecordsSection({ records, category }: Props) {
  const header    = CATEGORY_HEADER[category];
  const exercises = CATEGORY_EXERCISES[category];
  const colors    = CATEGORY_COLORS[category];

  // Find matching records by display category
  const matchedRecords = Object.values(records).filter(
    (r) => r.current !== null && getDisplayCategory(r.exerciseName) === category,
  );

  // Build a set of exercise names already tracked (normalized)
  const trackedNames = new Set(matchedRecords.map((r) => r.exerciseName.toLowerCase()));

  // Placeholder exercises = canonical list minus what's tracked
  const placeholders = exercises.filter((e) => !trackedNames.has(e.toLowerCase()));

  return (
    <div className="mb-8">
      {/* Category header */}
      <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${colors.border}`}>
        <span className="text-lg">{header.icon}</span>
        <span className={`font-mono text-[10px] uppercase tracking-widest ${header.color}`}>
          {header.label}
        </span>
        <span className="font-mono text-[8px] text-white/25 ml-auto">
          {matchedRecords.length} record{matchedRecords.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {matchedRecords.map((record) => (
          <RecordCard key={record.exerciseName} record={record} />
        ))}
        {placeholders.map((name) => (
          <PlaceholderCard key={name} exerciseName={name} category={category} />
        ))}
      </div>

      {matchedRecords.length === 0 && placeholders.length === 0 && (
        <p className="font-mono text-[9px] text-white/20 text-center py-6">
          No {header.label.toLowerCase()} exercises tracked yet.
        </p>
      )}
    </div>
  );
}
