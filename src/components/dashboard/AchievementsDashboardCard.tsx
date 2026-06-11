"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadAchievementState } from "@/lib/achievement-storage";
import { AchievementState } from "@/lib/achievement-types";
import { ACHIEVEMENTS, ACHIEVEMENT_MAP } from "@/lib/achievement-data";
import { computeStats } from "@/lib/achievement-utils";

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const s = Math.floor(diff / 1000);
  if (s < 60)  return "just now";
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function AchievementsDashboardCard() {
  const [achState, setAchState] = useState<AchievementState | null>(null);

  useEffect(() => {
    try {
      setAchState(loadAchievementState());
    } catch {
      // ignore
    }
  }, []);

  if (!achState) return null;

  const stats = computeStats(achState);
  const total = ACHIEVEMENTS.length;

  // Get 3 most recently unlocked
  const recent = Object.values(achState.progress)
    .filter((p) => p.unlocked && p.unlockedAt)
    .sort((a, b) => (b.unlockedAt ?? 0) - (a.unlockedAt ?? 0))
    .slice(0, 3);

  return (
    <div className="bg-surface-800 border border-yellow-500/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>🏆</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-yellow-400">Achievements</span>
        </div>
        <Link href="/achievements" className="font-mono text-[9px] text-yellow-400/60 hover:text-yellow-400 transition-colors">
          All →
        </Link>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between font-mono text-[9px] text-white/30 mb-1">
          <span className="stat-number">{stats.unlocked} / {total}</span>
          <span className="stat-number">{stats.completionPct}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500/60 rounded-full transition-all"
            style={{ width: `${stats.completionPct}%` }}
          />
        </div>
      </div>

      {/* Recent unlocks */}
      {recent.length > 0 ? (
        <div className="space-y-2">
          {recent.map((p) => {
            const def = ACHIEVEMENT_MAP[p.id];
            if (!def) return null;
            return (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-xl bg-white/3 border border-white/5">
                <span className="text-base flex-shrink-0">{def.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/70 truncate">{def.name}</div>
                  <div className="font-mono text-[9px] text-white/30">{p.unlockedAt ? timeAgo(p.unlockedAt) : ""}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-3 border border-dashed border-white/8 rounded-xl">
          <p className="text-xs text-white/30">No achievements yet</p>
          <p className="font-mono text-[9px] text-white/20 mt-1">Start training to unlock them</p>
        </div>
      )}

      <Link href="/achievements" className="mt-3 flex items-center justify-center gap-1 text-yellow-400 font-mono text-[10px] hover:text-yellow-300 transition-colors">
        <span>View All</span><span>→</span>
      </Link>
    </div>
  );
}
