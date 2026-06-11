"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadState } from "@/lib/storage";
import { loadMasteryState } from "@/lib/mastery-storage";
import { loadStreakState } from "@/lib/streak-storage";
import { v2LoadTreeState } from "@/lib/v2-skilltree-engine";
import { loadStandardsState } from "@/lib/movement-standards-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { calcGlobalMasteryScore } from "@/lib/mastery-types";
import { calcStandardsAnalytics, calcAllStandardsProgress } from "@/lib/movement-standards-engine";
import { loadJourneyState } from "@/lib/journey-storage";
import { JOURNEY_MAP } from "@/lib/journey-data";

interface Stat {
  label: string;
  value: string | number;
  icon:  string;
  color: string;
}

export default function TrainingAnalyticsCard() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    try {
      const appState     = loadState();
      const masteryState = loadMasteryState();
      const streakState  = loadStreakState();
      const v2State      = v2LoadTreeState();
      const stdState     = loadStandardsState();
      const recState     = loadRecordsState();
      const journeyState = loadJourneyState();

      const masteryScore = calcGlobalMasteryScore(masteryState);
      const pm  = calcAllStandardsProgress(recState, stdState);
      const analytics = calcStandardsAnalytics(pm);

      const skillsUnlocked = v2State.unlockedNodes.length + v2State.completedNodes.length;

      let journeyStages = 0;
      if (journeyState.activeJourneyId) {
        const prog = journeyState.journeyProgress[journeyState.activeJourneyId];
        if (prog) journeyStages = prog.completedStageIds.length;
      }

      setStats([
        { label: "Workouts",        value: appState.workouts.length,         icon: "💪", color: "text-green-400"  },
        { label: "Total XP",        value: appState.totalXP.toLocaleString(), icon: "⚡", color: "text-yellow-400" },
        { label: "Best Streak",     value: `${streakState.daily.longest}d`,  icon: "🔥", color: "text-red-400"    },
        { label: "Skills Unlocked", value: skillsUnlocked,                   icon: "🌳", color: "text-emerald-400" },
        { label: "Standards Score", value: analytics.totalScore,             icon: "🏅", color: "text-amber-400"  },
        { label: "Mastery Score",   value: masteryScore,                     icon: "⭐", color: "text-indigo-400" },
      ]);
    } catch {
      // ignore
    }
  }, []);

  if (stats.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d1117] overflow-hidden">
      <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #22d3ee, transparent)" }} />
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="text-base">📊</span>
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-white/50">Training Analytics</span>
        </div>
        <Link href="/progress" className="font-mono text-[9px] tracking-widest uppercase text-white/20 hover:text-white/50 transition-colors">
          VIEW →
        </Link>
      </div>
      <div className="px-4 py-3 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-base mb-1">{s.icon}</div>
            <div className={`font-display text-xl leading-tight ${s.color}`}>{s.value}</div>
            <div className="font-mono text-[8px] text-white/30 uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
