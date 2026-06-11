"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadAchievementState } from "@/lib/achievement-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { loadState } from "@/lib/storage";
import { ACHIEVEMENT_MAP } from "@/lib/achievement-data";

interface ActivityItem {
  icon:        string;
  description: string;
  timestamp:   number;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60)  return "just now";
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function RecentActivityCard() {
  const [items, setItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    try {
      const all: ActivityItem[] = [];

      // Recent achievement unlocks
      const achState = loadAchievementState();
      for (const p of Object.values(achState.progress)) {
        if (p.unlocked && p.unlockedAt) {
          const def = ACHIEVEMENT_MAP[p.id];
          if (def) {
            all.push({ icon: def.icon, description: `Unlocked: ${def.name}`, timestamp: p.unlockedAt });
          }
        }
      }

      // Recent records broken
      const recState = loadRecordsState();
      for (const r of Object.values(recState.records)) {
        if (r.current) {
          const ts = new Date(r.current.dateAchieved).getTime();
          if (!isNaN(ts)) {
            const improved = r.current.improvement !== null && r.current.improvement > 0;
            all.push({
              icon:        improved ? "📈" : "📊",
              description: improved
                ? `New record: ${r.exerciseName} (${r.current.value}${r.unit === "seconds" ? "s" : ""})`
                : `Logged: ${r.exerciseName} (${r.current.value})`,
              timestamp:   ts,
            });
          }
        }
      }

      // Recent workouts
      const appState = loadState();
      for (const w of appState.workouts.slice(-5)) {
        all.push({ icon: "🏋️", description: `Workout: ${w.name}`, timestamp: w.timestamp });
      }

      // Sort by recency and deduplicate (take most recent 8)
      all.sort((a, b) => b.timestamp - a.timestamp);
      setItems(all.slice(0, 8));
    } catch {
      // ignore
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span>📜</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Recent Activity</span>
        </div>
        <div className="text-center py-4 border border-dashed border-white/8 rounded-xl">
          <p className="text-xs text-white/30">No recent activity</p>
          <p className="font-mono text-[9px] text-white/20 mt-1">Log your first workout to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span>📜</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Recent Activity</span>
      </div>
      <div className="space-y-2">
        {items.map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-base flex-shrink-0">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/70 truncate">{a.description}</div>
            </div>
            <span className="font-mono text-[9px] text-white/20 flex-shrink-0">{timeAgo(a.timestamp)}</span>
          </div>
        ))}
      </div>
      <Link href="/progress" className="mt-3 flex items-center justify-end gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors font-mono">
        VIEW ALL →
      </Link>
    </div>
  );
}
