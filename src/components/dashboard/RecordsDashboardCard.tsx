"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadRecordsState } from "@/lib/records-storage";
import { RecordsState, TrackedRecord } from "@/lib/records-types";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)   return "just now";
  const m = Math.floor(s / 60);
  if (m < 60)   return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)   return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const CATEGORY_ICONS: Record<string, string> = {
  strength: "💪", core: "🔥", hanging: "🧗", skills: "⭐",
  consistency: "📅", xp: "⚡", workouts: "🏋️", custom: "📊",
};

export default function RecordsDashboardCard() {
  const [recState, setRecState] = useState<RecordsState | null>(null);

  useEffect(() => {
    try {
      setRecState(loadRecordsState());
    } catch {
      // ignore
    }
  }, []);

  const records: TrackedRecord[] = recState
    ? Object.values(recState.records)
        .filter((r) => r.current !== null)
        .sort((a, b) => {
          const ta = a.current?.dateAchieved ?? "";
          const tb = b.current?.dateAchieved ?? "";
          return tb.localeCompare(ta);
        })
        .slice(0, 5)
    : [];

  const improved = (r: TrackedRecord) => {
    if (!r.current || r.current.improvement === null) return null;
    return r.current.improvement;
  };

  return (
    <div className="bg-surface-800 border border-cyan-500/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>⚡</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Personal Records</span>
        </div>
        <Link href="/records" className="font-mono text-[9px] text-cyan-400/60 hover:text-cyan-400 transition-colors">
          All →
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-white/8 rounded-xl">
          <p className="text-xs text-white/30">No records yet</p>
          <p className="font-mono text-[9px] text-white/20 mt-1">Log workouts to set records</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map((r) => {
            const imp = improved(r);
            const icon = CATEGORY_ICONS[r.category] ?? "📊";
            const unitLabel = r.unit === "seconds" ? "s" : r.unit === "minutes" ? "min" : "";
            return (
              <div key={r.exerciseName} className="flex items-center gap-2 p-2 rounded-xl bg-white/3 border border-white/5">
                <span className="text-sm flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/70 truncate">{r.exerciseName}</div>
                  {r.current && (
                    <div className="font-mono text-[9px] text-white/30">
                      {timeAgo(r.current.dateAchieved)}
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-sm text-cyan-400 stat-number">
                    {r.current?.value}{unitLabel}
                  </div>
                  {imp !== null && imp > 0 && (
                    <div className="font-mono text-[9px] text-green-400">▲ +{imp}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link href="/records" className="mt-3 flex items-center justify-center gap-1 text-cyan-400 font-mono text-[10px] hover:text-cyan-300 transition-colors">
        <span>View All Records</span><span>→</span>
      </Link>
    </div>
  );
}
