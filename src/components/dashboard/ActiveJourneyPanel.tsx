"use client";

import Link from "next/link";
import { JourneyState } from "@/lib/journey-types";
import { JOURNEY_MAP } from "@/lib/journey-data";
export default function ActiveJourneyPanel({ journeyState }: { journeyState: JourneyState }) {
  if (!journeyState.activeJourneyId) {
    return (
      <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span>🗺️</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Active Journey</span>
        </div>
        <p className="text-sm text-white/40 mb-3">No active journey. Start one to track your long-term progress.</p>
        <Link href="/journeys" className="inline-flex items-center gap-1 text-cyan-400 font-mono text-[10px] hover:text-cyan-300 transition-colors">
          <span>Browse Journeys</span><span>→</span>
        </Link>
      </div>
    );
  }

  const def  = JOURNEY_MAP[journeyState.activeJourneyId];
  const prog = journeyState.journeyProgress[journeyState.activeJourneyId];
  if (!def || !prog) return null;

  const pct          = Math.round((prog.completedStageIds.length / def.stages.length) * 100);
  const currentStage = def.stages[prog.currentStageIndex];

  return (
    <div className="bg-surface-800 border border-cyan-500/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{def.icon}</span>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Active Journey</div>
            <div className="text-sm font-medium text-white">{def.name}</div>
          </div>
        </div>
        <span className="font-mono text-[10px] text-cyan-400 stat-number">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full mb-3">
        <div className="h-full bg-cyan-500/70 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      {currentStage && (
        <div className="space-y-1 mb-3">
          <div className="text-xs text-white/60 mb-1.5">
            Stage {prog.currentStageIndex + 1}: <span className="text-white/80">{currentStage.name}</span>
          </div>
          {currentStage.requirements.slice(0, 3).map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/50">
              <span className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0" />
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      )}
      <Link href="/journeys" className="flex items-center gap-1 text-cyan-400 font-mono text-[10px] hover:text-cyan-300 transition-colors">
        <span>Continue Journey</span><span>→</span>
      </Link>
    </div>
  );
}
