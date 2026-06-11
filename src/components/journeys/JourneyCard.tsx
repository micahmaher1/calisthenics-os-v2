"use client";

import { JourneyDef, JourneyProgress } from "@/lib/journey-types";
import { JourneySnapshot, getJourneyOverallProgress } from "@/lib/journey-utils";
import { JOURNEY_DIFFICULTY_META } from "@/lib/journey-data";

interface JourneyCardProps {
  def:        JourneyDef;
  progress:   JourneyProgress | null;
  snap:       JourneySnapshot;
  onStart:    () => void;
  onContinue: () => void;
  isActive:   boolean;
}

export default function JourneyCard({
  def, progress, snap, onStart, onContinue, isActive,
}: JourneyCardProps) {
  const meta     = JOURNEY_DIFFICULTY_META[def.difficulty];
  const overall  = getJourneyOverallProgress(def, progress, snap);
  const hasStarted = !!progress;
  const isComplete = overall.isComplete;

  const categoryLabel: Record<string, string> = {
    push: "Push", pull: "Pull", balance: "Balance", core: "Core", full_body: "Full Body",
  };

  return (
    <div
      className={`
        relative rounded-2xl border bg-surface-800 overflow-hidden transition-all duration-200
        ${meta.border}
        ${def.featured ? "shadow-lg" : ""}
        ${isActive ? "ring-1 ring-cyan-500/40" : ""}
      `}
    >
      {/* Difficulty-colored top line */}
      <div className={`h-0.5 w-full bg-gradient-to-r from-transparent via-current to-transparent ${meta.color} opacity-60`} />

      {/* Featured badge */}
      {def.featured && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/30">
          <span className="text-[8px]">⭐</span>
          <span className="font-mono text-[8px] text-yellow-400 uppercase tracking-widest">Featured</span>
        </div>
      )}
      {isActive && (
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30">
          <span className="font-mono text-[8px] text-cyan-400 uppercase tracking-widest">Active</span>
        </div>
      )}

      <div className="p-4 pt-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${meta.bg} border ${meta.border}`}>
            {def.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-md ${meta.bg} ${meta.color} border ${meta.border}`}>
                {meta.icon} {meta.label}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">
                {categoryLabel[def.category] ?? def.category}
              </span>
            </div>
            <h3 className="font-display text-lg tracking-wide text-white mt-1 leading-tight">{def.name}</h3>
            <p className="font-mono text-[9px] text-white/40 mt-0.5">{def.subtitle}</p>
          </div>
        </div>

        {/* Description */}
        <p className="font-body text-xs text-white/50 leading-relaxed mb-3 line-clamp-2">
          {def.description}
        </p>

        {/* Progress bar */}
        {hasStarted && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Progress</span>
              <span className="font-mono text-[9px] text-white/60">
                {overall.completedStages}/{overall.totalStages} stages
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isComplete ? "bg-green-400" : "bg-cyan-400"
                }`}
                style={{ width: `${overall.pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Current stage or complete */}
        {hasStarted && !isComplete && (
          <div className="text-xs font-mono text-white/40 mb-3">
            Stage {overall.currentStageIndex + 1}: {def.stages[overall.currentStageIndex]?.name ?? ""}
          </div>
        )}
        {isComplete && (
          <div className="flex items-center gap-1.5 text-green-400 mb-3">
            <span>✅</span>
            <span className="font-mono text-[9px] uppercase tracking-widest">Journey Complete!</span>
          </div>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-3 mb-4 text-white/30">
          <span className="font-mono text-[9px]">⏱️ {def.estimatedWeeks}w</span>
          <span className="font-mono text-[9px]">📍 {def.stages.length} stages</span>
          <span className="font-mono text-[9px]">⚡ {def.completionReward.xp.toLocaleString()} XP</span>
        </div>

        {/* Button */}
        {isComplete ? (
          <div className="w-full py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
            <span className="font-mono text-[10px] text-green-400 uppercase tracking-widest">Completed 🏆</span>
          </div>
        ) : hasStarted ? (
          <button
            onClick={isActive ? onContinue : onStart}
            className="w-full py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
          >
            <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
              {isActive ? "View Map →" : "Continue →"}
            </span>
          </button>
        ) : (
          <button
            onClick={onStart}
            className={`w-full py-2 rounded-xl border transition-all hover:opacity-90 ${meta.bg} ${meta.border}`}
          >
            <span className={`font-mono text-[10px] uppercase tracking-widest ${meta.color}`}>
              Start Journey →
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
