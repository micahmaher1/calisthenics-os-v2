import { GeneratedWorkout, WorkoutBuilderState } from "@/lib/workout-types";

const KEY = "calisthenics-os:workouts:v1";

export function defaultWorkoutBuilderState(): WorkoutBuilderState {
  return {
    savedWorkouts:  [],
    recentWorkouts: [],
    completedIds:   [],
    totalGenerated: 0,
    totalCompleted: 0,
    favoriteGoal:   null,
  };
}

export function loadWorkoutBuilderState(): WorkoutBuilderState {
  if (typeof window === "undefined") return defaultWorkoutBuilderState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultWorkoutBuilderState();
    return { ...defaultWorkoutBuilderState(), ...(JSON.parse(raw) as WorkoutBuilderState) };
  } catch {
    return defaultWorkoutBuilderState();
  }
}

export function saveWorkoutBuilderState(state: WorkoutBuilderState): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function saveWorkout(workout: GeneratedWorkout): void {
  const state = loadWorkoutBuilderState();
  const existing = state.savedWorkouts.findIndex((w) => w.id === workout.id);
  if (existing >= 0) {
    state.savedWorkouts[existing] = { ...workout, isSaved: true };
  } else {
    state.savedWorkouts.unshift({ ...workout, isSaved: true });
  }
  saveWorkoutBuilderState(state);
}

export function deleteWorkout(id: string): void {
  const state = loadWorkoutBuilderState();
  state.savedWorkouts = state.savedWorkouts.filter((w) => w.id !== id);
  saveWorkoutBuilderState(state);
}

export function toggleFavoriteWorkout(id: string): void {
  const state = loadWorkoutBuilderState();
  state.savedWorkouts = state.savedWorkouts.map((w) =>
    w.id === id ? { ...w, isFavorite: !w.isFavorite } : w
  );
  saveWorkoutBuilderState(state);
}

export function markWorkoutCompleted(id: string): void {
  const state = loadWorkoutBuilderState();
  if (!state.completedIds.includes(id)) {
    state.completedIds.push(id);
    state.totalCompleted++;
  }
  // Mark in saved
  state.savedWorkouts = state.savedWorkouts.map((w) =>
    w.id === id ? { ...w, completedAt: Date.now() } : w
  );
  // Mark in recent
  state.recentWorkouts = state.recentWorkouts.map((w) =>
    w.id === id ? { ...w, completedAt: Date.now() } : w
  );
  saveWorkoutBuilderState(state);
}

export function addToRecent(workout: GeneratedWorkout): void {
  const state = loadWorkoutBuilderState();
  state.recentWorkouts = [workout, ...state.recentWorkouts.filter((w) => w.id !== workout.id)].slice(0, 10);
  state.totalGenerated++;
  // Track favorite goal
  const goalCounts = state.recentWorkouts.reduce((acc, w) => {
    acc[w.goal] = (acc[w.goal] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topGoal = Object.entries(goalCounts).sort((a, b) => b[1] - a[1])[0];
  if (topGoal) state.favoriteGoal = topGoal[0] as WorkoutBuilderState["favoriteGoal"];
  saveWorkoutBuilderState(state);
}
