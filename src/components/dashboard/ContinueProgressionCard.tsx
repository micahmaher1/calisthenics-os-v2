"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { v2LoadTreeState, v2FindNextUnlock } from "@/lib/v2-skilltree-engine";
import { loadJourneyState } from "@/lib/journey-storage";
import { loadStandardsState } from "@/lib/movement-standards-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { loadTitleState } from "@/lib/title-storage";
import { loadState } from "@/lib/storage";
import { loadStreakState } from "@/lib/streak-storage";
import { loadAchievementState } from "@/lib/achievement-storage";
import { loadTreeState, getTotalCompleted } from "@/lib/skilltree-engine";
import { JOURNEY_MAP } from "@/lib/journey-data";
import { calcAllStandardsProgress } from "@/lib/movement-standards-engine";
import { MOVEMENT_STANDARDS } from "@/lib/movement-standards-data";
import { getClosestLockedTitle, buildTitleSnapshot } from "@/lib/title-utils";

interface ProgressionItem {
  icon:  string;
  label: string;
  sub:   string;
  pct:   number;
  href:  string;
}

export default function ContinueProgressionCard() {
  const [items, setItems] = useState<ProgressionItem[]>([]);

  useEffect(() => {
    try {
      const list: ProgressionItem[] = [];

      // 1. Next skill unlock (v2 tree)
      const v2State = v2LoadTreeState();
      const nextSkill = v2FindNextUnlock(v2State);
      if (nextSkill) {
        list.push({
          icon:  nextSkill.icon,
          label: nextSkill.name,
          sub:   "Next skill to unlock",
          pct:   0,
          href:  "/tree",
        });
      }

      // 2. Current journey stage
      const journeyState = loadJourneyState();
      if (journeyState.activeJourneyId) {
        const def  = JOURNEY_MAP[journeyState.activeJourneyId];
        const prog = journeyState.journeyProgress[journeyState.activeJourneyId];
        if (def && prog) {
          const pct = Math.round((prog.completedStageIds.length / def.stages.length) * 100);
          const stage = def.stages[prog.currentStageIndex];
          list.push({
            icon:  def.icon,
            label: def.name,
            sub:   stage ? `Stage ${prog.currentStageIndex + 1}: ${stage.name}` : "In progress",
            pct,
            href:  "/journeys",
          });
        }
      }

      // 3. Closest movement standard upgrade
      const recState     = loadRecordsState();
      const stdState     = loadStandardsState();
      const progressMap  = calcAllStandardsProgress(recState, stdState);
      let closestStd: ProgressionItem | null = null;
      let closestPct = -1;
      for (const std of MOVEMENT_STANDARDS) {
        const p = progressMap[std.id];
        if (p && p.nextRank && p.pct > closestPct && p.pct < 100) {
          closestPct = p.pct;
          closestStd = {
            icon:  std.icon,
            label: std.name,
            sub:   `${p.currentRank} → ${p.nextRank}`,
            pct:   p.pct,
            href:  "/standards",
          };
        }
      }
      if (closestStd) list.push(closestStd);

      // 4. Current title progress
      const appState  = loadState();
      const streakSt  = loadStreakState();
      const achState  = loadAchievementState();
      const treeSt    = loadTreeState();
      const questSt   = { daily: { dateKey: "", quests: [], bonusClaimed: false }, weekly: { dateKey: "", quests: [], bonusClaimed: false }, streak: { current: 0, longest: 0, lastCompletedDate: null }, stats: { totalCompleted: 0, dailyCompleted: 0, weeklyCompleted: 0, totalXPEarned: 0, totalCoinsEarned: 0, perfectDays: 0, perfectWeeks: 0 } };
      const titleState = loadTitleState();
      const snap = buildTitleSnapshot(appState, streakSt, treeSt, achState, questSt, recState);
      const closest = getClosestLockedTitle(titleState, snap);
      if (closest) {
        list.push({
          icon:  closest.title.icon,
          label: closest.title.name,
          sub:   closest.title.description,
          pct:   closest.progress.pct,
          href:  "/titles",
        });
      }

      setItems(list.slice(0, 5));
    } catch {
      // ignore
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="bg-surface-800 border border-green-500/20 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span>🎯</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-green-400">Continue Progression</span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <Link key={i} href={item.href} className="block group">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/80 truncate group-hover:text-white transition-colors">{item.label}</span>
                  {item.pct > 0 && (
                    <span className="font-mono text-[9px] text-white/30 ml-2 stat-number">{item.pct}%</span>
                  )}
                </div>
                <div className="text-[10px] text-white/30 truncate">{item.sub}</div>
              </div>
              <span className="text-white/20 group-hover:text-green-400 transition-colors text-[10px]">→</span>
            </div>
            {item.pct > 0 && (
              <div className="ml-7 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500/50 rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
