"use client";

import { useState } from "react";
import { Workout, SkillName } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface WorkoutHistoryProps {
  workouts: Workout[];
}

const SKILL_COLORS: Record<SkillName, string> = {
  "push-ups": "text-green-400 bg-green-500/10 border-green-500/20",
  "pull-ups": "text-sky-400 bg-sky-500/10 border-sky-500/20",
  dips: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const SKILL_ICONS: Record<SkillName, string> = {
  "push-ups": "🤜",
  "pull-ups": "🦅",
  dips: "⚡",
};

const PAGE_SIZE = 5;

export default function WorkoutHistory({ workouts }: WorkoutHistoryProps) {
  const [page, setPage] = useState(1);

  const total = workouts.length;
  const visible = workouts.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < total;

  return (
    <section className="animate-slide-up stagger-2">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
          History
        </span>
        <div className="flex-1 h-px bg-white/5" />
        {total > 0 && (
          <span className="font-mono text-[9px] text-white/20">
            {total} workout{total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {total === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {visible.map((workout, i) => (
            <WorkoutRow key={workout.id} workout={workout} index={i} />
          ))}

          {hasMore && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-full py-3 rounded-xl border border-white/5 bg-surface-800 font-mono text-[11px] text-white/30 hover:text-white/50 hover:border-white/10 transition-all"
            >
              Load more ({total - visible.length} remaining)
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function WorkoutRow({ workout, index }: { workout: Workout; index: number }) {
  const skillColor = workout.skillName
    ? SKILL_COLORS[workout.skillName]
    : "text-white/40 bg-white/5 border-white/10";
  const skillIcon = workout.skillName ? SKILL_ICONS[workout.skillName] : "💪";

  return (
    <div
      className="group relative overflow-hidden bg-surface-800 border border-white/5 rounded-xl px-4 py-3 flex items-center gap-4 hover:border-white/10 transition-all animate-fade-in"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Skill badge */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center text-sm ${skillColor}`}
      >
        {skillIcon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-body text-sm font-medium text-white truncate">
            {workout.name}
          </p>
          {workout.skillName && (
            <span
              className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${skillColor}`}
            >
              {workout.skillName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="font-mono text-[10px] text-white/30">
            {workout.reps} reps
          </span>
          {workout.notes && (
            <span className="font-mono text-[10px] text-white/20 truncate max-w-[180px]">
              "{workout.notes}"
            </span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        <span className="font-mono text-xs text-green-400">
          +{workout.xpEarned} XP
        </span>
        <span className="font-mono text-[9px] text-white/20">
          {formatDate(workout.timestamp)}
        </span>
      </div>

      {/* Hover accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-500/0 group-hover:bg-green-500/40 transition-all rounded-l-xl" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-800 border border-white/5 border-dashed rounded-2xl px-6 py-10 flex flex-col items-center justify-center text-center">
      <div className="text-3xl mb-3 opacity-40">📋</div>
      <p className="font-display text-xl tracking-wider text-white/20 mb-1">
        NO WORKOUTS YET
      </p>
      <p className="font-mono text-[10px] text-white/15">
        Log your first workout above to start earning XP
      </p>
    </div>
  );
}
