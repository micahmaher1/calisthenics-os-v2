"use client";

import Link from "next/link";
import { ActiveProgram, PROGRAM_THEME_META } from "@/lib/program-types";

interface Props {
  program: ActiveProgram;
}

export default function ProgramProgressCard({ program }: Props) {
  const meta        = PROGRAM_THEME_META[program.theme];
  const workoutDays = program.days.filter((d) => !d.isRest);
  const completed   = workoutDays.filter((d) => d.completedAt);
  const pct         = workoutDays.length > 0 ? Math.round((completed.length / workoutDays.length) * 100) : 0;

  const todayWorkout = program.days.find((d) => !d.isRest && !d.completedAt);
  const currentWeek = todayWorkout?.weekNumber ?? program.durationWeeks;

  return (
    <div className={`bg-surface-800 border ${meta.borderClass} rounded-2xl overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{meta.icon}</span>
          <div className="flex-1 min-w-0">
            <p className={`font-display text-sm tracking-wider ${meta.color} truncate`}>{meta.label}</p>
            <p className="font-mono text-[8px] text-white/30">Week {currentWeek} of {program.durationWeeks}</p>
          </div>
          <div className={`font-mono text-sm ${meta.color}`}>{pct}%</div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-700 ${meta.color.replace("text-","bg-")}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mb-3">
          <span className="font-mono text-[8px] text-white/25">{completed.length}/{workoutDays.length} sessions</span>
          <span className={`font-mono text-[8px] ${meta.color} opacity-70`}>{pct >= 100 ? "Complete!" : `${100 - pct}% left`}</span>
        </div>

        {todayWorkout?.workout && (
          <div className="p-2 bg-white/3 border border-white/8 rounded-xl mb-3">
            <p className="font-mono text-[8px] text-white/30 uppercase tracking-wider mb-0.5">Next Session</p>
            <p className="font-mono text-[9px] text-white/60 truncate">{todayWorkout.label}</p>
          </div>
        )}

        <Link
          href="/workouts"
          className={`block w-full text-center font-mono text-[9px] uppercase tracking-wider ${meta.color} ${meta.bgClass} border ${meta.borderClass} rounded-xl px-3 py-2 hover:opacity-80 transition-all`}
        >
          View Program →
        </Link>
      </div>
    </div>
  );
}
