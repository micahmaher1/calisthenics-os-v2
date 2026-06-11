import { AppState } from "./types";
import { StreakState } from "./streak-types";
import { RecordsState } from "./records-types";
import { SkillTreeState } from "./skilltree-types";
import {
  JourneyRequirement, JourneyStage, JourneyDef, JourneyProgress,
} from "./journey-types";

// ─── Snapshot ─────────────────────────────────────────────────────────────────

export interface JourneySnapshot {
  level:          number;
  totalXP:        number;
  workoutCount:   number;
  longestStreak:  number;
  records:        Record<string, number>;
  unlockedSkills: string[];
  manualChecks:   Record<string, boolean>;
}

export function getRecordValue(recState: RecordsState, exerciseName: string): number {
  const key = exerciseName.toLowerCase().replace(/[_\s]+/g, "");
  for (const [name, tracked] of Object.entries(recState.records)) {
    const normalised = name.toLowerCase().replace(/[_\s\-]+/g, "");
    if (normalised.includes(key) || key.includes(normalised)) {
      return tracked.current?.value ?? 0;
    }
  }
  return 0;
}

export function getUnlockedSkillNames(treeState: SkillTreeState): string[] {
  return Object.entries(treeState.progress)
    .filter(([, p]) => p.status === "completed" || p.status === "in_progress")
    .map(([id]) => id);
}

export function buildJourneySnapshot(
  appState:     AppState,
  streakState:  StreakState,
  recState:     RecordsState,
  treeState:    SkillTreeState,
  manualChecks: Record<string, boolean>,
): JourneySnapshot {
  // Build records map: exercise name variants → best value
  const records: Record<string, number> = {};
  for (const [name, tracked] of Object.entries(recState.records)) {
    if (tracked.current) {
      const key = name.toLowerCase().replace(/[\s\-]/g, "_");
      records[key] = tracked.current.value;
      // Also store without underscores for flexible matching
      records[name.toLowerCase()] = tracked.current.value;
    }
  }

  return {
    level:          appState.level,
    totalXP:        appState.totalXP,
    workoutCount:   appState.workouts.length,
    longestStreak:  streakState.daily.longest,
    records,
    unlockedSkills: getUnlockedSkillNames(treeState),
    manualChecks,
  };
}

// ─── Requirement Checking ─────────────────────────────────────────────────────

export function getCurrentValueForReq(req: JourneyRequirement, snap: JourneySnapshot): number {
  const targetKey = req.target.toLowerCase().replace(/[\s\-]/g, "_");

  switch (req.type) {
    case "record_reps":
    case "record_seconds": {
      // Try various key formats
      const candidates = [
        targetKey,
        req.target.toLowerCase(),
        req.target.toLowerCase().replace(/_/g, " "),
        req.target.toLowerCase().replace(/_/g, "-"),
      ];
      for (const c of candidates) {
        if (snap.records[c] !== undefined) return snap.records[c];
      }
      // Partial match
      for (const [k, v] of Object.entries(snap.records)) {
        if (k.includes(targetKey) || targetKey.includes(k.replace(/[\s\-]/g, "_"))) return v;
      }
      return 0;
    }
    case "workout_count":  return snap.workoutCount;
    case "level":          return snap.level;
    case "xp":             return snap.totalXP;
    case "streak_days":    return snap.longestStreak;
    case "skill_unlocked": return snap.unlockedSkills.includes(req.target) ? 1 : 0;
    case "manual":         return snap.manualChecks[req.target] ? 1 : 0;
    case "journey_stage":  return 0; // handled externally
    default:               return 0;
  }
}

export function checkJourneyRequirement(req: JourneyRequirement, snap: JourneySnapshot): boolean {
  return getCurrentValueForReq(req, snap) >= req.value;
}

// ─── Stage Completion ─────────────────────────────────────────────────────────

export function getStageCompletion(
  stage: JourneyStage,
  snap:  JourneySnapshot,
): {
  completed:    boolean;
  requirements: { req: JourneyRequirement; met: boolean; current: number }[];
} {
  const requirements = stage.requirements.map((req) => ({
    req,
    met:     checkJourneyRequirement(req, snap),
    current: getCurrentValueForReq(req, snap),
  }));
  return { completed: requirements.every((r) => r.met), requirements };
}

// ─── Overall Progress ─────────────────────────────────────────────────────────

export function getJourneyOverallProgress(
  def:      JourneyDef,
  progress: JourneyProgress | null,
  snap:     JourneySnapshot,
): {
  startedStages:          number;
  completedStages:        number;
  totalStages:            number;
  currentStageIndex:      number;
  pct:                    number;
  nextUnmetRequirements:  { req: JourneyRequirement; met: boolean; current: number }[];
  isComplete:             boolean;
} {
  const totalStages = def.stages.length;
  if (!progress) {
    return {
      startedStages:         0,
      completedStages:       0,
      totalStages,
      currentStageIndex:     0,
      pct:                   0,
      nextUnmetRequirements: def.stages[0]
        ? def.stages[0].requirements.map((req) => ({ req, met: false, current: 0 }))
        : [],
      isComplete: false,
    };
  }

  const completedStages = progress.completedStageIds.length;
  const pct = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;
  const isComplete = completedStages >= totalStages;

  const currentStageIndex = Math.min(progress.currentStageIndex, totalStages - 1);
  const currentStage = def.stages[currentStageIndex];
  const nextUnmetRequirements = currentStage
    ? getStageCompletion(currentStage, snap).requirements.filter((r) => !r.met)
    : [];

  return {
    startedStages:    completedStages,
    completedStages,
    totalStages,
    currentStageIndex,
    pct,
    nextUnmetRequirements,
    isComplete,
  };
}

// ─── Evaluate Progress ────────────────────────────────────────────────────────

export function evaluateJourneyProgress(
  def:      JourneyDef,
  progress: JourneyProgress,
  snap:     JourneySnapshot,
): {
  newProgress:          JourneyProgress;
  newlyCompletedStages: JourneyStage[];
} {
  const newProgress: JourneyProgress = { ...progress };
  const newlyCompletedStages: JourneyStage[] = [];

  // Build a fresh set of completed stage IDs
  const completedSet = new Set(progress.completedStageIds);

  // Check each stage in order
  let firstIncompleteIndex = def.stages.length;
  for (let i = 0; i < def.stages.length; i++) {
    const stage = def.stages[i];
    if (completedSet.has(stage.id)) continue;

    const { completed } = getStageCompletion(stage, snap);
    if (completed) {
      completedSet.add(stage.id);
      newlyCompletedStages.push(stage);
    } else {
      firstIncompleteIndex = i;
      break;
    }
  }

  newProgress.completedStageIds = Array.from(completedSet);
  newProgress.currentStageIndex = Math.min(firstIncompleteIndex, def.stages.length - 1);

  return { newProgress, newlyCompletedStages };
}
