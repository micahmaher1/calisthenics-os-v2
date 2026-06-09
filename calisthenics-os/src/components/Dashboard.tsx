"use client";

import { useEffect, useState, useCallback } from "react";
import { AppState, SkillName, Workout } from "@/lib/types";
import { loadState, saveState, addWorkoutToState } from "@/lib/storage";
import { calcLevelProgress, calcXPToNextLevel, getRankLabel, XP_PER_WORKOUT } from "@/lib/xp";
import { generateId } from "@/lib/utils";

import Header from "./Header";
import HeroStats from "./HeroStats";
import SkillsGrid from "./SkillsGrid";
import WorkoutLogger from "./WorkoutLogger";
import WorkoutHistory from "./WorkoutHistory";
import XPToast from "./XPToast";

export default function Dashboard() {
  const [state, setState] = useState<AppState | null>(null);
  const [toastKey, setToastKey] = useState(0);
  const [lastXP, setLastXP] = useState(0);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setState(loadState());
  }, []);

  const handleAddWorkout = useCallback(
    (data: { name: string; skillName: SkillName | null; reps: number; notes: string }) => {
      setState((prev) => {
        if (!prev) return prev;
        const workout: Workout = {
          id: generateId(),
          name: data.name,
          skillName: data.skillName,
          reps: data.reps,
          notes: data.notes,
          xpEarned: XP_PER_WORKOUT,
          timestamp: Date.now(),
        };
        const next = addWorkoutToState(prev, workout);
        saveState(next);
        return next;
      });
      setLastXP(XP_PER_WORKOUT);
      setToastKey((k) => k + 1);
    },
    []
  );

  if (!state) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">⚡</span>
          <span className="font-display text-xl tracking-widest text-white/40">
            LOADING OS
          </span>
        </div>
      </div>
    );
  }

  const levelProgress = calcLevelProgress(state.totalXP);
  const xpToNext = calcXPToNextLevel(state.totalXP);
  const rank = getRankLabel(state.level);

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      {/* Background grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-green-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Header rank={rank} level={state.level} />

        <HeroStats
          totalXP={state.totalXP}
          level={state.level}
          rank={rank}
          levelProgress={levelProgress}
          xpToNext={xpToNext}
          workoutCount={state.workouts.length}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Logger + History */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <WorkoutLogger onAdd={handleAddWorkout} />
            <WorkoutHistory workouts={state.workouts} />
          </div>

          {/* Right column: Skills */}
          <div className="flex flex-col gap-6">
            <SkillsGrid skills={state.skills} />
          </div>
        </div>
      </div>

      {/* XP Toast notification */}
      <XPToast key={toastKey} xp={lastXP} />
    </div>
  );
}
