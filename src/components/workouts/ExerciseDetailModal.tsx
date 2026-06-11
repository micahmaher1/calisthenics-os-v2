"use client";

import { useEffect } from "react";
import { Exercise, DIFFICULTY_META, WorkoutDifficulty } from "@/lib/workout-types";
import { EXERCISE_DETAIL_MAP } from "@/lib/exercise-data";

interface Props {
  exercise: Exercise | null;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  push:      "🔵",
  pull:      "🟢",
  core:      "🟡",
  legs:      "🟣",
  mobility:  "🌿",
  balance:   "⚖️",
  explosive: "⚡",
};

const DIFF_COLORS: Record<string, string> = {
  beginner:     "text-green-400 border-green-500/30 bg-green-500/8",
  intermediate: "text-yellow-400 border-yellow-500/30 bg-yellow-500/8",
  advanced:     "text-orange-400 border-orange-500/30 bg-orange-500/8",
  elite:        "text-red-400 border-red-500/30 bg-red-500/8",
};

export default function ExerciseDetailModal({ exercise, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!exercise) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [exercise, onClose]);

  if (!exercise) return null;

  const detail    = EXERCISE_DETAIL_MAP[exercise.name];
  const diffLabel = (detail?.difficulty ?? "intermediate") as WorkoutDifficulty;
  const diffMeta  = DIFFICULTY_META[diffLabel];
  const diffClass = DIFF_COLORS[diffLabel] ?? DIFF_COLORS.intermediate;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-lg bg-surface-800 border border-white/10 rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-white/15 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-white/8 flex items-start gap-3">
          <div className="text-2xl flex-shrink-0 mt-0.5">
            {CATEGORY_ICONS[exercise.category] ?? "🏋️"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-lg tracking-wide text-white leading-tight">
              {exercise.name}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`font-mono text-[8.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${diffClass}`}>
                {diffMeta.label}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/30 px-2 py-0.5 rounded-full border border-white/8 bg-white/5">
                {exercise.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/30 hover:text-white/70 transition-colors text-xl leading-none mt-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Prescription bar */}
        <div className="px-5 py-3 bg-white/3 border-b border-white/8">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="font-display text-xl text-white">{exercise.sets}</div>
              <div className="font-mono text-[8px] text-white/30 uppercase tracking-wider">Sets</div>
            </div>
            <div className="text-white/15 text-lg">×</div>
            <div className="text-center">
              <div className="font-display text-xl text-white">{exercise.reps}</div>
              <div className="font-mono text-[8px] text-white/30 uppercase tracking-wider">Reps / Time</div>
            </div>
            <div className="ml-auto text-center">
              <div className="font-display text-xl text-teal-400">{exercise.rest}</div>
              <div className="font-mono text-[8px] text-white/30 uppercase tracking-wider">Rest</div>
            </div>
          </div>
          {exercise.notes && (
            <p className="font-mono text-[9px] text-amber-400/70 mt-2 border border-amber-500/15 bg-amber-500/5 rounded-lg px-2 py-1.5">
              📌 {exercise.notes}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto space-y-5">

          {/* Description */}
          {detail?.description && (
            <div>
              <p className="text-sm text-white/65 leading-relaxed">{detail.description}</p>
            </div>
          )}

          {/* Muscles */}
          {detail && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/35 mb-2">Muscles Worked</p>
              <div className="flex flex-wrap gap-1.5">
                {detail.primaryMuscles.map((m) => (
                  <span key={m} className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-green-500/25 bg-green-500/8 text-green-400">
                    {m}
                  </span>
                ))}
                {detail.secondaryMuscles?.map((m) => (
                  <span key={m} className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/40">
                    {m}
                  </span>
                ))}
              </div>
              {detail.secondaryMuscles && detail.secondaryMuscles.length > 0 && (
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500/50 inline-block" />
                    <span className="font-mono text-[8px] text-white/25">Primary</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white/20 inline-block" />
                    <span className="font-mono text-[8px] text-white/25">Secondary</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Technique Tips */}
          {detail?.tips && detail.tips.length > 0 && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/35 mb-2">Technique Tips</p>
              <div className="space-y-1.5">
                {detail.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-white/60">
                    <span className="text-teal-400 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {detail?.commonMistakes && detail.commonMistakes.length > 0 && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/35 mb-2">Common Mistakes</p>
              <div className="space-y-1.5">
                {detail.commonMistakes.map((m, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                    <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback for unknown exercises */}
          {!detail && (
            <div className="py-4 text-center">
              <p className="text-sm text-white/30">Perform this exercise with full range of motion and controlled tempo.</p>
            </div>
          )}
        </div>

        {/* Close button */}
        <div className="px-5 py-4 border-t border-white/8">
          <button
            onClick={onClose}
            className="w-full py-3 font-mono text-[10px] uppercase tracking-widest text-white/40 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
