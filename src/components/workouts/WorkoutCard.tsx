"use client";

import { useState } from "react";
import {
  GeneratedWorkout, WORKOUT_GOAL_META, DIFFICULTY_META,
  WorkoutBlock, WorkoutBlockType,
} from "@/lib/workout-types";

interface Props {
  workout:       GeneratedWorkout;
  onComplete?:   (workout: GeneratedWorkout) => void;
  onSave?:       (workout: GeneratedWorkout) => void;
  onFavorite?:   (id: string) => void;
  onDelete?:     (id: string) => void;
  showActions?:  boolean;
  compact?:      boolean;
}

const BLOCK_ICONS: Record<WorkoutBlockType, string> = {
  warmup:   "🔥",
  main:     "💪",
  accessory:"⚡",
  skill:    "🎯",
  finisher: "💥",
  cooldown: "🧘",
};

const BLOCK_COLORS: Record<WorkoutBlockType, string> = {
  warmup:   "text-orange-400",
  main:     "text-green-400",
  accessory:"text-sky-400",
  skill:    "text-purple-400",
  finisher: "text-red-400",
  cooldown: "text-teal-400",
};

const DIFF_BORDER: Record<string, string> = {
  beginner:     "border-green-500/25",
  intermediate: "border-yellow-500/25",
  advanced:     "border-orange-500/30",
  elite:        "border-red-500/35",
};

export default function WorkoutCard({
  workout, onComplete, onSave, onFavorite, onDelete, showActions = true, compact = false,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const goalMeta = WORKOUT_GOAL_META[workout.goal];
  const diffMeta = DIFFICULTY_META[workout.difficulty];
  const isCompleted = !!workout.completedAt;
  const borderClass = DIFF_BORDER[workout.difficulty] ?? "border-white/10";

  const workoutBlocks = workout.blocks.filter((b) => !compact || b.type === "main");
  const totalExercises = workout.blocks.reduce((s, b) => s + b.exercises.length, 0);

  return (
    <div className={`bg-surface-800 border ${borderClass} rounded-2xl overflow-hidden transition-all`}>
      {/* Difficulty accent bar */}
      <div className={`h-0.5 w-full ${
        workout.difficulty === "elite" ? "bg-gradient-to-r from-red-500 via-pink-500 to-red-500" :
        workout.difficulty === "advanced" ? "bg-gradient-to-r from-orange-500 to-amber-500" :
        workout.difficulty === "intermediate" ? "bg-gradient-to-r from-yellow-500 to-lime-500" :
        "bg-gradient-to-r from-green-500 to-teal-500"
      }`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="text-2xl flex-shrink-0 mt-0.5">{goalMeta.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-base tracking-wider text-white truncate">
                {workout.name}
              </h3>
              {isCompleted && (
                <span className="text-[9px] font-mono uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
                  Completed
                </span>
              )}
              {workout.isFavorite && <span className="text-yellow-400 text-xs">★</span>}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`font-mono text-[9px] uppercase tracking-wider ${goalMeta.color}`}>
                {goalMeta.label}
              </span>
              <span className="text-white/20">·</span>
              <span className={`font-mono text-[9px] uppercase tracking-wider ${diffMeta.color}`}>
                {diffMeta.label}
              </span>
              <span className="text-white/20">·</span>
              <span className="font-mono text-[9px] text-white/40">{workout.durationMins} min</span>
              <span className="text-white/20">·</span>
              <span className="font-mono text-[9px] text-white/40">{totalExercises} exercises</span>
            </div>
          </div>
          {/* Rewards */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="font-mono text-[9px] text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2 py-0.5">
              +{workout.xpReward} XP
            </span>
            <span className="font-mono text-[9px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
              +{workout.coinReward} coins
            </span>
          </div>
        </div>

        {/* Block summary pills */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {workout.blocks.map((block) => (
            <span
              key={block.type}
              className={`font-mono text-[8px] uppercase tracking-wider ${BLOCK_COLORS[block.type]} bg-white/5 rounded-full px-2 py-0.5`}
            >
              {BLOCK_ICONS[block.type]} {block.label}
            </span>
          ))}
        </div>

        {/* Expandable exercise list */}
        {!compact && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full text-left font-mono text-[9px] uppercase tracking-wider text-white/30 hover:text-white/60 transition-colors flex items-center gap-2 mb-2"
            >
              <span>{expanded ? "▲" : "▼"}</span>
              <span>{expanded ? "Hide Exercises" : "Show Exercises"}</span>
            </button>

            {expanded && (
              <div className="space-y-3 mb-3">
                {workoutBlocks.map((block, bi) => (
                  <BlockSection key={bi} block={block} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 flex-wrap pt-2 border-t border-white/5">
            {onComplete && !isCompleted && (
              <button
                onClick={() => onComplete(workout)}
                className="flex-1 font-mono text-[9px] uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 hover:bg-green-500/20 transition-all"
              >
                ✓ Complete
              </button>
            )}
            {onSave && !workout.isSaved && (
              <button
                onClick={() => onSave(workout)}
                className="font-mono text-[9px] uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-xl px-3 py-2 hover:bg-sky-500/20 transition-all"
              >
                Save
              </button>
            )}
            {onFavorite && workout.isSaved && (
              <button
                onClick={() => onFavorite(workout.id)}
                className={`font-mono text-[9px] uppercase tracking-wider rounded-xl px-3 py-2 transition-all border ${
                  workout.isFavorite
                    ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                    : "text-white/30 bg-white/5 border-white/10 hover:text-yellow-400"
                }`}
              >
                {workout.isFavorite ? "★" : "☆"}
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(workout.id)}
                className="font-mono text-[9px] uppercase tracking-wider text-white/20 bg-white/5 border border-white/8 rounded-xl px-3 py-2 hover:text-red-400 hover:border-red-500/20 transition-all"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BlockSection({ block }: { block: WorkoutBlock }) {
  const color = BLOCK_COLORS[block.type];
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm">{BLOCK_ICONS[block.type]}</span>
        <span className={`font-mono text-[9px] uppercase tracking-wider ${color}`}>{block.label}</span>
        <span className="font-mono text-[8px] text-white/20">~{block.duration} min</span>
      </div>
      <div className="space-y-1 pl-6">
        {block.exercises.map((ex, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <span className="text-white/60 font-mono">{ex.sets}×</span>
            <span className="text-white/80">{ex.name}</span>
            <span className="text-white/30 font-mono ml-auto">{ex.reps}</span>
            <span className="text-white/20 font-mono">{ex.rest}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
