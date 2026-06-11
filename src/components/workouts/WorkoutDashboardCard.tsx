"use client";

import Link from "next/link";
import { WorkoutBuilderState, WORKOUT_GOAL_META } from "@/lib/workout-types";
import { ProgramState } from "@/lib/program-types";

interface Props {
  builderState: WorkoutBuilderState;
  programState: ProgramState;
}

export default function WorkoutDashboardCard({ builderState, programState }: Props) {
  const latest     = builderState.recentWorkouts[0];
  const goalMeta   = latest ? WORKOUT_GOAL_META[latest.goal] : null;
  const hasProgram = !!programState.activeProgram;

  return (
    <section className="animate-slide-up stagger-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Workout Builder</span>
        <div className="flex-1 h-px bg-white/5" />
        <Link
          href="/workouts"
          className="font-mono text-[9px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors"
        >
          Open Builder →
        </Link>
      </div>

      <div className="bg-surface-800 border border-green-500/15 rounded-2xl overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

        <div className="p-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <div className="font-display text-xl text-green-400">{builderState.totalGenerated}</div>
              <div className="font-mono text-[8px] text-white/25 uppercase">Generated</div>
            </div>
            <div className="text-center">
              <div className="font-display text-xl text-yellow-400">{builderState.totalCompleted}</div>
              <div className="font-mono text-[8px] text-white/25 uppercase">Completed</div>
            </div>
            <div className="text-center">
              <div className="font-display text-xl text-purple-400">{builderState.savedWorkouts.length}</div>
              <div className="font-mono text-[8px] text-white/25 uppercase">Saved</div>
            </div>
          </div>

          {/* Latest workout */}
          {latest && goalMeta && (
            <div className="p-3 bg-surface-700 border border-white/8 rounded-xl mb-3">
              <p className="font-mono text-[8px] text-white/30 uppercase tracking-wider mb-1">Last Generated</p>
              <div className="flex items-center gap-2">
                <span className="text-lg">{goalMeta.icon}</span>
                <div>
                  <p className="font-mono text-[10px] text-white/70 truncate">{latest.name}</p>
                  <p className={`font-mono text-[8px] ${goalMeta.color}`}>{goalMeta.label} · {latest.durationMins}min</p>
                </div>
              </div>
            </div>
          )}

          {/* Program status */}
          {hasProgram && programState.activeProgram && (
            <div className="p-3 bg-purple-500/8 border border-purple-500/20 rounded-xl mb-3">
              <p className="font-mono text-[8px] text-white/30 uppercase tracking-wider mb-1">Active Program</p>
              <p className="font-mono text-[10px] text-purple-300 truncate">
                {programState.activeProgram.theme.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
              </p>
            </div>
          )}

          <Link
            href="/workouts"
            className="block w-full text-center font-mono text-[9px] uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl py-2.5 hover:bg-green-500/20 transition-all"
          >
            {builderState.totalGenerated === 0 ? "Build Your First Workout" : "Open Workout Builder"} →
          </Link>
        </div>
      </div>
    </section>
  );
}
