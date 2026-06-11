"use client";

import { ActiveProgram, PROGRAM_THEME_META } from "@/lib/program-types";
import { DIFFICULTY_META } from "@/lib/workout-types";

interface Props {
  program:       ActiveProgram;
  onContinue?:   (program: ActiveProgram) => void;
  onAbandon?:    (program: ActiveProgram) => void;
  onComplete?:   (program: ActiveProgram) => void;
  isActive?:     boolean;
}

export default function ProgramCard({ program, onContinue, onAbandon, onComplete, isActive }: Props) {
  const meta     = PROGRAM_THEME_META[program.theme];
  const diffMeta = DIFFICULTY_META[program.difficulty];

  const totalDays    = program.days.length;
  const workoutDays  = program.days.filter((d) => !d.isRest);
  const completedDays = program.days.filter((d) => !d.isRest && d.completedAt);
  const pct          = workoutDays.length > 0 ? Math.round((completedDays.length / workoutDays.length) * 100) : 0;

  const currentWeek  = program.days.find((d) => !d.isRest && !d.completedAt)?.weekNumber ?? program.durationWeeks;
  const weekDays     = program.days.filter((d) => d.weekNumber === currentWeek);
  const isAllDone    = completedDays.length === workoutDays.length;

  return (
    <div className={`bg-surface-800 border ${meta.borderClass} rounded-2xl overflow-hidden`}>
      {/* Top accent */}
      <div className={`h-0.5 w-full ${meta.bgClass} opacity-80`}
        style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }}
      />
      <div className={`h-0.5 w-full bg-gradient-to-r from-transparent ${meta.color.replace("text-","via-")} to-transparent opacity-50`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="text-3xl flex-shrink-0">{meta.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-display text-lg tracking-wider ${meta.color}`}>
                {meta.label}
              </h3>
              {meta.featured && (
                <span className="font-mono text-[8px] uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2 py-0.5">
                  Featured
                </span>
              )}
            </div>
            <p className="font-body text-xs text-white/40 mt-0.5 line-clamp-2">{meta.description}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`font-mono text-[9px] uppercase tracking-wider ${diffMeta.color}`}>
                {diffMeta.label}
              </span>
              <span className="text-white/20">·</span>
              <span className="font-mono text-[9px] text-white/40">{program.durationWeeks}w</span>
              <span className="text-white/20">·</span>
              <span className="font-mono text-[9px] text-white/40">{workoutDays.length} workouts</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="font-mono text-[9px] text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2 py-0.5">
              +{program.xpBonus} XP
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {isActive && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">Progress</span>
              <span className={`font-mono text-[9px] ${meta.color}`}>{pct}%</span>
            </div>
            <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  pct >= 100 ? "bg-green-400" : meta.color.replace("text-","bg-")
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-[8px] text-white/25">{completedDays.length} / {workoutDays.length} sessions</span>
              <span className="font-mono text-[8px] text-white/25">Week {currentWeek} of {program.durationWeeks}</span>
            </div>
          </div>
        )}

        {/* Week grid (current week) */}
        {isActive && (
          <div className="mb-4">
            <p className="font-mono text-[9px] uppercase tracking-wider text-white/25 mb-2">Current Week</p>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div
                  key={day.dayNumber}
                  className={`rounded-lg p-1.5 text-center transition-all ${
                    day.isRest
                      ? "bg-white/3 border border-white/5"
                      : day.completedAt
                      ? `${meta.bgClass} border ${meta.borderClass}`
                      : "bg-white/5 border border-white/8"
                  }`}
                >
                  <div className="font-mono text-[7px] text-white/30 uppercase mb-0.5">
                    {["M","T","W","T","F","S","S"][((day.dayNumber - 1) % 7)]}
                  </div>
                  <div className="text-[10px]">
                    {day.isRest ? "—" : day.completedAt ? "✓" : "○"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-wrap pt-2 border-t border-white/5">
          {isActive && isAllDone && onComplete && (
            <button
              onClick={() => onComplete(program)}
              className="flex-1 font-mono text-[9px] uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2 hover:bg-yellow-500/20 transition-all"
            >
              🏆 Complete Program
            </button>
          )}
          {isActive && !isAllDone && onContinue && (
            <button
              onClick={() => onContinue(program)}
              className={`flex-1 font-mono text-[9px] uppercase tracking-wider ${meta.color} ${meta.bgClass} border ${meta.borderClass} rounded-xl px-3 py-2 hover:opacity-80 transition-all`}
            >
              Continue →
            </button>
          )}
          {isActive && onAbandon && (
            <button
              onClick={() => onAbandon(program)}
              className="font-mono text-[9px] uppercase tracking-wider text-white/20 bg-white/5 border border-white/8 rounded-xl px-3 py-2 hover:text-red-400 hover:border-red-500/20 transition-all"
            >
              Abandon
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
