"use client";

import { GeneratedWorkout, WORKOUT_GOAL_META, DIFFICULTY_META } from "@/lib/workout-types";
import { loadState, saveState, addWorkoutToState } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import { XP_PER_WORKOUT, COINS_PER_WORKOUT } from "@/lib/xp";

interface Props {
  workout: GeneratedWorkout | null;
  onClose: () => void;
  onLogged?: () => void;
}

export default function WorkoutCompletionModal({ workout, onClose, onLogged }: Props) {
  if (!workout) return null;

  const goalMeta = WORKOUT_GOAL_META[workout.goal];
  const diffMeta = DIFFICULTY_META[workout.difficulty];

  function handleLog() {
    if (typeof window === "undefined") return;
    // Add to main workout history
    const appState = loadState();
    const newWorkout = {
      id:        generateId(),
      name:      workout!.name,
      skillName: null,
      reps:      0,
      notes:     `Generated workout — ${goalMeta.label} / ${diffMeta.label} / ${workout!.durationMins} min`,
      xpEarned:  workout!.xpReward,
      coins:     workout!.coinReward,
      timestamp: Date.now(),
    };
    const nextState = addWorkoutToState(appState, newWorkout);
    saveState(nextState);
    // Notify Dashboard to re-hydrate
    window.dispatchEvent(new CustomEvent("workout-logged"));
    onLogged?.();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-surface-800 border border-green-500/25 rounded-2xl overflow-hidden animate-slide-up">
        {/* Accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent" />

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="font-display text-2xl tracking-widest text-green-400 mb-1">WORKOUT COMPLETE</h2>
            <p className="font-mono text-sm text-white/50">{workout.name}</p>
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-xl p-3 text-center">
              <div className="font-display text-2xl text-yellow-300">+{workout.xpReward}</div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-wider mt-0.5">XP Earned</div>
            </div>
            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 text-center">
              <div className="font-display text-2xl text-amber-300">+{workout.coinReward}</div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-wider mt-0.5">Coins Earned</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 p-3 bg-surface-700 border border-white/8 rounded-xl">
            <span className="text-2xl">{goalMeta.icon}</span>
            <div>
              <div className="font-mono text-[10px] text-white/50">{goalMeta.label} · {diffMeta.label}</div>
              <div className="font-mono text-[9px] text-white/30">{workout.durationMins} minutes</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleLog}
              className="w-full font-mono text-[10px] uppercase tracking-widest text-black bg-green-400 hover:bg-green-300 rounded-xl py-3 transition-all font-semibold"
            >
              Log This Workout
            </button>
            <button
              onClick={onClose}
              className="w-full font-mono text-[9px] uppercase tracking-wider text-white/30 bg-white/5 border border-white/8 rounded-xl py-2.5 hover:text-white/60 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
