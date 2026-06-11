"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JourneyState } from "@/lib/journey-types";
import { JourneySnapshot, buildJourneySnapshot, getJourneyOverallProgress } from "@/lib/journey-utils";
import { loadJourneyState } from "@/lib/journey-storage";
import { ALL_JOURNEYS, FEATURED_JOURNEYS, JOURNEY_DIFFICULTY_META } from "@/lib/journey-data";
import { loadState } from "@/lib/storage";
import { loadStreakState } from "@/lib/streak-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { loadTreeState } from "@/lib/skilltree-engine";

export default function JourneyDashboardCard() {
  const [journeyState, setJourneyState] = useState<JourneyState | null>(null);
  const [snap,         setSnap]         = useState<JourneySnapshot | null>(null);

  useEffect(() => {
    const appState    = loadState();
    const streakState = loadStreakState();
    const recState    = loadRecordsState();
    const treeState   = loadTreeState();
    const jState      = loadJourneyState();

    const activeId     = jState.activeJourneyId;
    const manualChecks = activeId ? (jState.journeyProgress[activeId]?.manualChecks ?? {}) : {};
    const snapshot     = buildJourneySnapshot(appState, streakState, recState, treeState, manualChecks);

    setJourneyState(jState);
    setSnap(snapshot);
  }, []);

  if (!journeyState || !snap) return null;

  const activeId  = journeyState.activeJourneyId;
  const activeDef = activeId ? ALL_JOURNEYS.find((j) => j.id === activeId) : null;
  const activeProgress = activeId ? (journeyState.journeyProgress[activeId] ?? null) : null;

  if (!activeDef || !activeProgress) {
    // No active journey — show CTA with featured journeys
    return (
      <div className="bg-surface-800 border border-cyan-500/20 rounded-2xl overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🗺️</span>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">Skill Journeys</p>
            </div>
            <Link
              href="/journeys"
              className="font-mono text-[9px] text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Explore →
            </Link>
          </div>

          <p className="font-display text-sm tracking-wide text-white mb-1">Start a Journey</p>
          <p className="font-body text-xs text-white/40 mb-3">Epic progression campaigns towards calisthenics mastery.</p>

          <div className="space-y-1.5">
            {FEATURED_JOURNEYS.slice(0, 3).map((j) => {
              const meta = JOURNEY_DIFFICULTY_META[j.difficulty];
              return (
                <Link
                  key={j.id}
                  href="/journeys"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all"
                >
                  <span className="text-base">{j.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] text-white truncate">{j.name}</p>
                    <p className={`font-mono text-[8px] ${meta.color}`}>{meta.icon} {meta.label}</p>
                  </div>
                  <span className="font-mono text-[8px] text-white/25">{j.estimatedWeeks}w</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active journey
  const overall = getJourneyOverallProgress(activeDef, activeProgress, snap);
  const meta    = JOURNEY_DIFFICULTY_META[activeDef.difficulty];
  const currentStage = activeDef.stages[overall.currentStageIndex];
  const nextReq = overall.nextUnmetRequirements[0];

  return (
    <div className="bg-surface-800 border border-cyan-500/20 rounded-2xl overflow-hidden">
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🗺️</span>
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">Active Journey</p>
          </div>
          <Link
            href="/journeys"
            className="font-mono text-[9px] text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View Map →
          </Link>
        </div>

        {/* Journey identity */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${meta.bg} border ${meta.border} flex-shrink-0`}>
            {activeDef.icon}
          </div>
          <div>
            <p className="font-display text-sm tracking-wide text-white">{activeDef.name}</p>
            <p className={`font-mono text-[8px] ${meta.color}`}>{meta.icon} {meta.label}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[8px] text-white/30">Progress</span>
            <span className="font-mono text-[8px] text-white/50">
              {overall.completedStages}/{overall.totalStages}
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${overall.pct}%` }}
            />
          </div>
        </div>

        {/* Current stage */}
        {currentStage && !overall.isComplete && (
          <p className="font-mono text-[9px] text-white/40 mb-2">
            Stage {overall.currentStageIndex + 1}: {currentStage.name}
          </p>
        )}

        {/* Next requirement */}
        {nextReq && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/3 border border-white/5">
            <span className="text-sm">🎯</span>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[8px] text-white/30 uppercase tracking-widest">Next Goal</p>
              <p className="font-mono text-[10px] text-white truncate">{nextReq.req.label}</p>
            </div>
            {nextReq.req.type !== "manual" && (
              <span className="font-mono text-[8px] text-white/25 flex-shrink-0">
                {nextReq.current}/{nextReq.req.value}
              </span>
            )}
          </div>
        )}

        {overall.isComplete && (
          <div className="flex items-center gap-2 text-green-400">
            <span>🏆</span>
            <span className="font-mono text-[9px] uppercase tracking-widest">Journey Complete!</span>
          </div>
        )}
      </div>
    </div>
  );
}
