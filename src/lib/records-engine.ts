import { Workout } from "./types";
import {
  RecordsState, TrackedRecord, RecordCategory, Milestone, MilestoneGroup,
  SkillMilestone, NewRecordResult, RecordHistoryEntry,
  RecordDisplayCategory, CategoryStrength, RecordBadge,
} from "./records-types";

// ─── Skill milestone definitions ─────────────────────────────────────────────

export interface SkillMilestoneDef {
  id:          string;
  name:        string;
  description: string;
  icon:        string;
  xpReward:    number;
  // detector: return true if this milestone is unlocked given workout history
  detect:      (workouts: Workout[]) => boolean;
}

export const SKILL_MILESTONES_DEF: SkillMilestoneDef[] = [
  {
    id: "first_workout",
    name: "First Workout",
    description: "Logged your very first workout",
    icon: "🎯",
    xpReward: 50,
    detect: (ws) => ws.length >= 1,
  },
  {
    id: "first_pullup",
    name: "First Pull-up",
    description: "Logged your first pull-up rep",
    icon: "💪",
    xpReward: 100,
    detect: (ws) => ws.some((w) => matchesExercise(w, "pull-up") && w.reps >= 1),
  },
  {
    id: "ten_pullups",
    name: "10 Pull-ups in a Set",
    description: "Performed 10 or more pull-ups in one set",
    icon: "🔟",
    xpReward: 150,
    detect: (ws) => ws.some((w) => matchesExercise(w, "pull-up") && w.reps >= 10),
  },
  {
    id: "twenty_pullups",
    name: "20 Pull-ups in a Set",
    description: "Performed 20 or more pull-ups in one set",
    icon: "🏅",
    xpReward: 200,
    detect: (ws) => ws.some((w) => matchesExercise(w, "pull-up") && w.reps >= 20),
  },
  {
    id: "first_pushup",
    name: "First Push-up",
    description: "Logged your first push-up rep",
    icon: "🤜",
    xpReward: 50,
    detect: (ws) => ws.some((w) => matchesExercise(w, "push-up") && w.reps >= 1),
  },
  {
    id: "fifty_pushups",
    name: "50 Push-ups in a Set",
    description: "Performed 50 or more push-ups in one set",
    icon: "🦾",
    xpReward: 200,
    detect: (ws) => ws.some((w) => matchesExercise(w, "push-up") && w.reps >= 50),
  },
  {
    id: "hundred_pushups",
    name: "100 Push-ups in a Set",
    description: "The century mark — 100 push-ups without stopping",
    icon: "💯",
    xpReward: 500,
    detect: (ws) => ws.some((w) => matchesExercise(w, "push-up") && w.reps >= 100),
  },
  {
    id: "first_dip",
    name: "First Dip",
    description: "Logged your first dip rep",
    icon: "🤸",
    xpReward: 50,
    detect: (ws) => ws.some((w) => matchesExercise(w, "dip") && w.reps >= 1),
  },
  {
    id: "fifty_workouts",
    name: "50 Workouts",
    description: "Logged 50 total workouts",
    icon: "📅",
    xpReward: 250,
    detect: (ws) => ws.length >= 50,
  },
  {
    id: "hundred_workouts",
    name: "100 Workouts",
    description: "Logged 100 total workouts",
    icon: "🏆",
    xpReward: 500,
    detect: (ws) => ws.length >= 100,
  },
  {
    id: "first_chinup",
    name: "First Chin-Up",
    description: "Logged your first chin-up rep",
    icon: "🙌",
    xpReward: 100,
    detect: (ws) => ws.some((w) => matchesExercise(w, "chin-up") && w.reps >= 1),
  },
  {
    id: "first_muscleup",
    name: "First Muscle-Up",
    description: "Achieved your first muscle-up",
    icon: "🔥",
    xpReward: 300,
    detect: (ws) => ws.some((w) => /muscle.?up/i.test(w.name) && w.reps >= 1),
  },
  {
    id: "first_handstand_10s",
    name: "First 10s Handstand",
    description: "Held a handstand for 10 seconds",
    icon: "🤸",
    xpReward: 150,
    detect: (ws) => ws.some((w) => /handstand/i.test(w.name) && w.reps >= 10),
  },
  {
    id: "first_lsit_15s",
    name: "First L-Sit (15 sec)",
    description: "Held an L-sit for 15 seconds",
    icon: "🧘",
    xpReward: 150,
    detect: (ws) => ws.some((w) => /l.?sit/i.test(w.name) && w.reps >= 15),
  },
  {
    id: "first_front_lever",
    name: "First Front Lever Hold",
    description: "Held a front lever for 5 seconds",
    icon: "⚡",
    xpReward: 400,
    detect: (ws) => ws.some((w) => /front.?lever/i.test(w.name) && w.reps >= 5),
  },
];

// ─── Milestone thresholds ─────────────────────────────────────────────────────

interface MilestoneDef {
  exerciseName: string;
  icon:         string;
  unit:         "reps" | "seconds" | "minutes";
  thresholds:   { value: number; label: string; xp: number; coins: number }[];
}

export const MILESTONE_DEFS: MilestoneDef[] = [
  {
    exerciseName: "Chin-Ups",
    icon: "🙌",
    unit: "reps",
    thresholds: [
      { value: 5,  label: "5 Chin-Ups",  xp: 50,  coins: 15 },
      { value: 10, label: "10 Chin-Ups", xp: 100, coins: 30 },
      { value: 15, label: "15 Chin-Ups", xp: 150, coins: 50 },
      { value: 20, label: "20 Chin-Ups", xp: 200, coins: 70 },
    ],
  },
  {
    exerciseName: "Muscle-Ups",
    icon: "🔥",
    unit: "reps",
    thresholds: [
      { value: 1,  label: "1 Muscle-Up",   xp: 150, coins: 50  },
      { value: 3,  label: "3 Muscle-Ups",  xp: 200, coins: 70  },
      { value: 5,  label: "5 Muscle-Ups",  xp: 300, coins: 100 },
      { value: 10, label: "10 Muscle-Ups", xp: 500, coins: 150 },
    ],
  },
  {
    exerciseName: "Handstand Hold",
    icon: "🤸",
    unit: "seconds",
    thresholds: [
      { value: 10,  label: "10s Handstand",   xp: 50,  coins: 15  },
      { value: 30,  label: "30s Handstand",   xp: 100, coins: 30  },
      { value: 60,  label: "60s Handstand",   xp: 200, coins: 60  },
      { value: 90,  label: "90s Handstand",   xp: 300, coins: 100 },
      { value: 120, label: "2 Min Handstand", xp: 500, coins: 150 },
    ],
  },
  {
    exerciseName: "L-Sit",
    icon: "🧘",
    unit: "seconds",
    thresholds: [
      { value: 10, label: "10s L-Sit", xp: 50,  coins: 15  },
      { value: 20, label: "20s L-Sit", xp: 100, coins: 30  },
      { value: 30, label: "30s L-Sit", xp: 150, coins: 50  },
      { value: 60, label: "60s L-Sit", xp: 300, coins: 100 },
    ],
  },
  {
    exerciseName: "Hollow Hold",
    icon: "🌊",
    unit: "seconds",
    thresholds: [
      { value: 20, label: "20s Hollow Hold", xp: 25,  coins: 10 },
      { value: 30, label: "30s Hollow Hold", xp: 50,  coins: 15 },
      { value: 60, label: "60s Hollow Hold", xp: 100, coins: 30 },
      { value: 90, label: "90s Hollow Hold", xp: 200, coins: 60 },
    ],
  },
  {
    exerciseName: "Hanging Leg Raises",
    icon: "🦵",
    unit: "reps",
    thresholds: [
      { value: 5,  label: "5 Leg Raises",  xp: 25,  coins: 10 },
      { value: 10, label: "10 Leg Raises", xp: 50,  coins: 15 },
      { value: 15, label: "15 Leg Raises", xp: 100, coins: 30 },
      { value: 20, label: "20 Leg Raises", xp: 150, coins: 50 },
      { value: 25, label: "25 Leg Raises", xp: 200, coins: 70 },
    ],
  },
  {
    exerciseName: "Front Lever Hold",
    icon: "⚡",
    unit: "seconds",
    thresholds: [
      { value: 5,  label: "5s Front Lever",  xp: 150, coins: 50  },
      { value: 10, label: "10s Front Lever", xp: 250, coins: 80  },
      { value: 20, label: "20s Front Lever", xp: 400, coins: 125 },
      { value: 30, label: "30s Front Lever", xp: 600, coins: 200 },
    ],
  },
  {
    exerciseName: "Human Flag",
    icon: "🚩",
    unit: "seconds",
    thresholds: [
      { value: 3,  label: "3s Human Flag",  xp: 200, coins: 70  },
      { value: 5,  label: "5s Human Flag",  xp: 300, coins: 100 },
      { value: 10, label: "10s Human Flag", xp: 500, coins: 150 },
      { value: 20, label: "20s Human Flag", xp: 800, coins: 250 },
    ],
  },
  {
    exerciseName: "Push-ups",
    icon: "🤜",
    unit: "reps",
    thresholds: [
      { value: 10,  label: "10 Push-ups",  xp: 25,  coins: 10 },
      { value: 20,  label: "20 Push-ups",  xp: 50,  coins: 15 },
      { value: 30,  label: "30 Push-ups",  xp: 75,  coins: 20 },
      { value: 40,  label: "40 Push-ups",  xp: 100, coins: 25 },
      { value: 50,  label: "50 Push-ups",  xp: 150, coins: 40 },
      { value: 75,  label: "75 Push-ups",  xp: 200, coins: 60 },
      { value: 100, label: "100 Push-ups", xp: 500, coins: 150 },
    ],
  },
  {
    exerciseName: "Pull-ups",
    icon: "💪",
    unit: "reps",
    thresholds: [
      { value: 5,  label: "5 Pull-ups",  xp: 50,  coins: 15 },
      { value: 10, label: "10 Pull-ups", xp: 100, coins: 30 },
      { value: 15, label: "15 Pull-ups", xp: 150, coins: 50 },
      { value: 20, label: "20 Pull-ups", xp: 200, coins: 70 },
      { value: 25, label: "25 Pull-ups", xp: 300, coins: 100 },
      { value: 30, label: "30 Pull-ups", xp: 500, coins: 150 },
    ],
  },
  {
    exerciseName: "Dips",
    icon: "🤸",
    unit: "reps",
    thresholds: [
      { value: 10, label: "10 Dips",  xp: 25,  coins: 10 },
      { value: 20, label: "20 Dips",  xp: 50,  coins: 15 },
      { value: 30, label: "30 Dips",  xp: 75,  coins: 20 },
      { value: 40, label: "40 Dips",  xp: 100, coins: 30 },
      { value: 50, label: "50 Dips",  xp: 150, coins: 50 },
    ],
  },
  {
    exerciseName: "Plank",
    icon: "🧘",
    unit: "minutes",
    thresholds: [
      { value: 1,  label: "1 Min Plank",  xp: 25,  coins: 10 },
      { value: 2,  label: "2 Min Plank",  xp: 50,  coins: 20 },
      { value: 3,  label: "3 Min Plank",  xp: 100, coins: 35 },
      { value: 5,  label: "5 Min Plank",  xp: 200, coins: 75 },
      { value: 10, label: "10 Min Plank", xp: 500, coins: 200 },
    ],
  },
  {
    exerciseName: "Dead Hang",
    icon: "🧗",
    unit: "seconds",
    thresholds: [
      { value: 30,  label: "30s Dead Hang",  xp: 25,  coins: 10 },
      { value: 60,  label: "1 Min Dead Hang", xp: 50,  coins: 20 },
      { value: 90,  label: "90s Dead Hang",  xp: 75,  coins: 30 },
      { value: 120, label: "2 Min Dead Hang", xp: 100, coins: 40 },
      { value: 180, label: "3 Min Dead Hang", xp: 200, coins: 75 },
      { value: 300, label: "5 Min Dead Hang", xp: 400, coins: 150 },
    ],
  },
];

// ─── Exercise keyword detection ───────────────────────────────────────────────

type ExerciseKey =
  | "push-up" | "pull-up" | "chin-up" | "dip" | "squat" | "lunge"
  | "plank" | "side-plank" | "hollow-hold" | "arch-hold" | "l-sit" | "tuck-hold"
  | "dead-hang" | "active-hang" | "flexed-hang" | "towel-hang";

const EXERCISE_PATTERNS: Record<ExerciseKey, RegExp> = {
  "push-up":     /push.?up/i,
  "pull-up":     /pull.?up/i,
  "chin-up":     /chin.?up/i,
  "dip":         /\bdip\b/i,
  "squat":       /squat/i,
  "lunge":       /lunge/i,
  "plank":       /\bplank\b(?!.*side)/i,
  "side-plank":  /side.?plank/i,
  "hollow-hold": /hollow/i,
  "arch-hold":   /arch.?hold/i,
  "l-sit":       /l.?sit/i,
  "tuck-hold":   /tuck.?hold/i,
  "dead-hang":   /dead.?hang/i,
  "active-hang": /active.?hang/i,
  "flexed-hang": /flexed.?hang/i,
  "towel-hang":  /towel.?hang/i,
};

export function matchesExercise(w: Workout, key: ExerciseKey): boolean {
  // First check skillName
  if (key === "push-up"  && w.skillName === "push-ups") return true;
  if (key === "pull-up"  && w.skillName === "pull-ups") return true;
  if (key === "dip"      && w.skillName === "dips")     return true;
  // Then check name text
  return EXERCISE_PATTERNS[key]?.test(w.name) ?? false;
}

function normalizeExerciseName(name: string): string {
  return name.toLowerCase().trim();
}

// ─── Category assignment ──────────────────────────────────────────────────────

function getCategoryForExercise(normalizedName: string): RecordCategory {
  if (/push.?up|pull.?up|chin.?up|dip|squat|lunge/.test(normalizedName)) return "strength";
  if (/plank|hollow|arch.?hold|l.?sit|tuck.?hold/.test(normalizedName)) return "core";
  if (/hang/.test(normalizedName)) return "hanging";
  return "strength";
}

function getUnitForExercise(normalizedName: string): "reps" | "seconds" | "minutes" {
  if (/plank|hang|hold|sit/.test(normalizedName)) return "seconds";
  return "reps";
}

function getCanonicalName(w: Workout): string {
  const name = w.name.trim();
  if (!name && w.skillName) {
    const map: Record<string, string> = {
      "push-ups": "Push-ups",
      "pull-ups": "Pull-ups",
      "dips":     "Dips",
    };
    return map[w.skillName] ?? w.skillName;
  }
  // Capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// ─── Milestone key ────────────────────────────────────────────────────────────

function milestoneKey(exerciseName: string, value: number): string {
  return `${normalizeExerciseName(exerciseName)}:${value}`;
}

// ─── Main evaluation ──────────────────────────────────────────────────────────

export interface EvaluateRecordsResult {
  newState:    RecordsState;
  newRecords:  NewRecordResult[];
  totalXP:     number;
  totalCoins:  number;
}

export function evaluateRecords(
  state: RecordsState,
  workouts: Workout[],
): EvaluateRecordsResult {
  const newState: RecordsState = JSON.parse(JSON.stringify(state));
  const newRecords: NewRecordResult[] = [];
  let totalXP    = 0;
  let totalCoins = 0;
  const today    = new Date().toISOString();

  // Build per-exercise max map from all workouts
  const maxPerExercise: Record<string, { value: number; workout: Workout }> = {};
  for (const w of workouts) {
    const canonical = getCanonicalName(w);
    const existing  = maxPerExercise[canonical];
    if (!existing || w.reps > existing.value) {
      maxPerExercise[canonical] = { value: w.reps, workout: w };
    }
  }

  for (const [canonical, { value, workout }] of Object.entries(maxPerExercise)) {
    const normalized = normalizeExerciseName(canonical);
    const category   = getCategoryForExercise(normalized);
    const unit       = getUnitForExercise(normalized);

    const existing: TrackedRecord = newState.records[canonical] ?? {
      exerciseName: canonical,
      category,
      unit,
      current: null,
      history: [],
    };

    const prevValue = existing.current?.value ?? null;
    const workoutDate = workout.timestamp
      ? new Date(workout.timestamp).toISOString()
      : today;

    if (prevValue === null || value > prevValue) {
      const historyEntry: RecordHistoryEntry = {
        value,
        dateAchieved: workoutDate,
      };

      // Only add to history if it's a new max
      if (prevValue === null || value > prevValue) {
        existing.history = [...existing.history, historyEntry];
      }

      existing.current = {
        id:            `rec_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
        category,
        exerciseName:  canonical,
        unit,
        value,
        previousValue: prevValue,
        improvement:   prevValue !== null ? value - prevValue : null,
        dateAchieved:  workoutDate,
        workoutId:     workout.id,
      };

      newState.records[canonical] = existing;

      // Check milestones for this exercise
      const milestoneDef = MILESTONE_DEFS.find(
        (m) => normalizeExerciseName(m.exerciseName) === normalized,
      );

      const unlockedMilestones: Milestone[] = [];
      if (milestoneDef) {
        for (const t of milestoneDef.thresholds) {
          const mKey = milestoneKey(canonical, t.value);
          if (!newState.milestones[mKey] && value >= t.value) {
            newState.milestones[mKey]     = true;
            newState.milestoneDates[mKey] = workoutDate;
            unlockedMilestones.push({
              exerciseName: canonical,
              value:        t.value,
              label:        t.label,
              achieved:     true,
              dateAchieved: workoutDate,
              xpReward:     t.xp,
              coinReward:   t.coins,
            });
            totalXP    += t.xp;
            totalCoins += t.coins;
          }
        }
      }

      // XP/coin for breaking a personal record (only when improving)
      let xpReward    = 0;
      let coinReward  = 0;
      if (prevValue !== null && value > prevValue) {
        xpReward   = 10;
        coinReward = 5;
        totalXP    += xpReward;
        totalCoins += coinReward;
      }

      newRecords.push({
        exerciseName: canonical,
        newValue:     value,
        oldValue:     prevValue,
        improvement:  prevValue !== null ? value - prevValue : null,
        xpReward,
        coinReward,
        milestonesUnlocked:      unlockedMilestones,
        skillMilestonesUnlocked: [],
      });
    }
  }

  // Evaluate skill milestones
  for (const def of SKILL_MILESTONES_DEF) {
    if (!newState.skillMilestones[def.id]) {
      newState.skillMilestones[def.id] = {
        id:          def.id,
        name:        def.name,
        description: def.description,
        icon:        def.icon,
        achieved:    false,
        dateAchieved: null,
        xpReward:    def.xpReward,
      };
    }
    const sm = newState.skillMilestones[def.id];
    if (!sm.achieved && def.detect(workouts)) {
      sm.achieved     = true;
      sm.dateAchieved = today;
      totalXP        += def.xpReward;
      // Attach to last newRecord entry or create synthetic
      if (newRecords.length > 0) {
        newRecords[newRecords.length - 1].skillMilestonesUnlocked.push(sm);
      } else {
        newRecords.push({
          exerciseName: "Skill Milestone",
          newValue:     0,
          oldValue:     null,
          improvement:  null,
          xpReward:     def.xpReward,
          coinReward:   0,
          milestonesUnlocked: [],
          skillMilestonesUnlocked: [sm],
        });
      }
    }
  }

  newState.lastEvaluated = today;

  return { newState, newRecords, totalXP, totalCoins };
}

// ─── Build milestone groups for display ──────────────────────────────────────

export function buildMilestoneGroups(state: RecordsState): MilestoneGroup[] {
  return MILESTONE_DEFS.map((def) => {
    const currentRecord = state.records[def.exerciseName];
    const currentValue  = currentRecord?.current?.value ?? 0;

    const milestones: Milestone[] = def.thresholds.map((t) => {
      const mKey    = milestoneKey(def.exerciseName, t.value);
      const achieved = !!state.milestones[mKey];
      return {
        exerciseName: def.exerciseName,
        value:        t.value,
        label:        t.label,
        achieved,
        dateAchieved: state.milestoneDates[mKey] ?? null,
        xpReward:     t.xp,
        coinReward:   t.coins,
      };
    });

    const nextMilestone = milestones.find((m) => !m.achieved) ?? null;

    return {
      exerciseName:  def.exerciseName,
      icon:          def.icon,
      unit:          def.unit,
      milestones,
      currentValue,
      nextMilestone,
    };
  });
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export interface RecordInsight {
  icon:    string;
  title:   string;
  message: string;
  type:    "milestone" | "improvement" | "streak" | "general";
}

export function buildInsights(state: RecordsState): RecordInsight[] {
  const insights: RecordInsight[] = [];

  for (const group of buildMilestoneGroups(state)) {
    if (group.nextMilestone) {
      const gap = group.nextMilestone.value - group.currentValue;
      if (gap > 0 && group.currentValue > 0) {
        const unit = group.unit === "reps" ? "reps" : group.unit === "seconds" ? "seconds" : "minutes";
        insights.push({
          icon:    group.icon,
          title:   `${gap} ${unit} from next milestone`,
          message: `You need ${gap} more ${unit} of ${group.exerciseName} to reach: "${group.nextMilestone.label}" (+${group.nextMilestone.xpReward} XP)`,
          type:    "milestone",
        });
      } else if (group.currentValue === 0) {
        insights.push({
          icon:    group.icon,
          title:   `Start tracking ${group.exerciseName}`,
          message: `Log your first ${group.exerciseName} workout to begin tracking your record.`,
          type:    "general",
        });
      }
    }
  }

  // Most improved record
  const allRecords = Object.values(state.records).filter(
    (r) => r.current?.improvement !== null && (r.current?.improvement ?? 0) > 0,
  );
  if (allRecords.length > 0) {
    const best = allRecords.reduce((a, b) =>
      (a.current?.improvement ?? 0) > (b.current?.improvement ?? 0) ? a : b,
    );
    if (best.current?.improvement) {
      insights.push({
        icon:    "📈",
        title:   `Best improvement: ${best.exerciseName}`,
        message: `You improved your ${best.exerciseName} PR by ${best.current.improvement} ${best.unit}.`,
        type:    "improvement",
      });
    }
  }

  return insights.slice(0, 6);
}

// ─── Display category helpers ─────────────────────────────────────────────────

const DISPLAY_CATEGORY_MAP: { pattern: RegExp; cat: RecordDisplayCategory }[] = [
  { pattern: /push.?up|pike.?push|handstand.?push|planche|dip/i,   cat: "push" },
  { pattern: /pull.?up|chin.?up|muscle.?up|row|front.?lever/i,     cat: "pull" },
  { pattern: /plank|l.?sit|hollow|leg.?raise|dragon.?flag|ab/i,    cat: "core" },
  { pattern: /handstand|human.?flag|frog.?stand|crow/i,            cat: "skill" },
];

export function getDisplayCategory(exerciseName: string): RecordDisplayCategory {
  for (const { pattern, cat } of DISPLAY_CATEGORY_MAP) {
    if (pattern.test(exerciseName)) return cat;
  }
  return "push";
}

const EXPECTED_MAX: Record<string, number> = {
  "push-ups": 100, "pull-ups": 30, "chin-ups": 25, "dips": 50,
  "plank": 300, "dead hang": 300, "l-sit": 60, "hollow hold": 90,
  "muscle-ups": 10, "handstand hold": 120, "human flag": 20,
  "front lever hold": 30, "hanging leg raises": 25,
};

function getExpectedMax(exerciseName: string): number {
  const lower = exerciseName.toLowerCase();
  for (const [key, val] of Object.entries(EXPECTED_MAX)) {
    if (lower.includes(key)) return val;
  }
  return 50;
}

const CATEGORY_META: Record<RecordDisplayCategory, { label: string; icon: string; color: string; border: string; bg: string }> = {
  push:  { label: "Push",  icon: "🔵", color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/5" },
  pull:  { label: "Pull",  icon: "🟢", color: "text-sky-400",    border: "border-sky-500/30",    bg: "bg-sky-500/5"   },
  core:  { label: "Core",  icon: "🟡", color: "text-teal-400",   border: "border-teal-500/30",   bg: "bg-teal-500/5"  },
  skill: { label: "Skill", icon: "🟣", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/5"},
};

export function buildCategoryStrengths(state: RecordsState): CategoryStrength[] {
  const cats: RecordDisplayCategory[] = ["push", "pull", "core", "skill"];
  return cats.map((cat) => {
    const meta = CATEGORY_META[cat];
    const matching = Object.values(state.records).filter(
      (r) => r.current !== null && getDisplayCategory(r.exerciseName) === cat,
    );

    let score = 0;
    let topRecord: CategoryStrength["topRecord"] = null;

    if (matching.length > 0) {
      const scores = matching.map((r) => {
        const max = getExpectedMax(r.exerciseName);
        return Math.min(100, ((r.current?.value ?? 0) / max) * 100);
      });
      score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

      const best = matching.reduce((a, b) =>
        (a.current?.value ?? 0) / getExpectedMax(a.exerciseName) >
        (b.current?.value ?? 0) / getExpectedMax(b.exerciseName)
          ? a : b,
      );
      topRecord = best.current
        ? { exerciseName: best.exerciseName, value: best.current.value, unit: best.unit }
        : null;
    }

    return { id: cat, label: meta.label, icon: meta.icon, score, color: meta.color, border: meta.border, bg: meta.bg, topRecord };
  });
}

export function buildBadges(state: RecordsState): RecordBadge[] {
  const records = state.records;
  const sm      = state.skillMilestones;

  const getVal = (name: string) => {
    const r = Object.values(records).find((r) =>
      r.exerciseName.toLowerCase().includes(name.toLowerCase()),
    );
    return r?.current?.value ?? 0;
  };

  const badges: RecordBadge[] = [
    {
      id: "first_pr",
      name: "First PR",
      icon: "🏅",
      description: "Set your first personal record",
      earned: Object.values(records).some((r) => r.current !== null),
      earnedDate: Object.values(records).find((r) => r.current !== null)?.current?.dateAchieved,
      rarity: "common",
    },
    {
      id: "ten_pullups_badge",
      name: "10 Pull-Ups",
      icon: "💪",
      description: "Achieved 10 pull-ups in a set",
      earned: getVal("pull-up") >= 10 || getVal("pull up") >= 10,
      rarity: "rare",
    },
    {
      id: "twenty_pullups_badge",
      name: "20 Pull-Ups",
      icon: "🏅",
      description: "Achieved 20 pull-ups in a set",
      earned: getVal("pull-up") >= 20 || getVal("pull up") >= 20,
      rarity: "epic",
    },
    {
      id: "fifty_pushups_badge",
      name: "50 Push-Ups",
      icon: "🤜",
      description: "Achieved 50 push-ups in a set",
      earned: getVal("push-up") >= 50 || getVal("push up") >= 50,
      rarity: "rare",
    },
    {
      id: "hundred_pushups_badge",
      name: "100 Push-Ups",
      icon: "💯",
      description: "The century mark — 100 push-ups",
      earned: getVal("push-up") >= 100 || getVal("push up") >= 100,
      rarity: "legendary",
    },
    {
      id: "plank_master",
      name: "Plank Master",
      icon: "🧘",
      description: "Held a plank for 2 minutes (120s)",
      earned: getVal("plank") >= 120,
      rarity: "rare",
    },
    {
      id: "first_muscleup_badge",
      name: "First Muscle-Up",
      icon: "🔥",
      description: "Achieved your first muscle-up",
      earned: sm["first_muscleup"]?.achieved ?? false,
      earnedDate: sm["first_muscleup"]?.dateAchieved ?? undefined,
      rarity: "epic",
    },
    {
      id: "handstand_badge",
      name: "Handstand 30s",
      icon: "🤸",
      description: "Held a handstand for 30 seconds",
      earned: getVal("handstand") >= 30,
      rarity: "epic",
    },
    {
      id: "lsit_badge",
      name: "L-Sit 30s",
      icon: "🪑",
      description: "Held an L-sit for 30 seconds",
      earned: getVal("l-sit") >= 30 || getVal("l sit") >= 30,
      rarity: "rare",
    },
    {
      id: "front_lever_badge",
      name: "Front Lever",
      icon: "⚡",
      description: "Achieved a front lever hold",
      earned: sm["first_front_lever"]?.achieved ?? false,
      earnedDate: sm["first_front_lever"]?.dateAchieved ?? undefined,
      rarity: "legendary",
    },
    {
      id: "five_records",
      name: "Record Collector",
      icon: "📚",
      description: "Set records in 5 different exercises",
      earned: Object.values(records).filter((r) => r.current !== null).length >= 5,
      rarity: "common",
    },
    {
      id: "consistency_warrior",
      name: "Consistency Warrior",
      icon: "⚔️",
      description: "Logged workouts for 10 different exercises",
      earned: Object.values(records).filter((r) => r.current !== null).length >= 10,
      rarity: "rare",
    },
  ];

  return badges;
}

export function getTopRecords(state: RecordsState, n = 3): TrackedRecord[] {
  return Object.values(state.records)
    .filter((r) => r.current !== null)
    .sort((a, b) => {
      const scoreA = (a.current?.value ?? 0) / getExpectedMax(a.exerciseName);
      const scoreB = (b.current?.value ?? 0) / getExpectedMax(b.exerciseName);
      return scoreB - scoreA;
    })
    .slice(0, n);
}

export function getRecentPRs(state: RecordsState, n = 3): TrackedRecord[] {
  return Object.values(state.records)
    .filter((r) => r.current !== null)
    .sort((a, b) => {
      const ta = a.current?.dateAchieved ?? "";
      const tb = b.current?.dateAchieved ?? "";
      return tb.localeCompare(ta);
    })
    .slice(0, n);
}
