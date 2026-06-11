import { generateId } from "@/lib/utils";
import {
  WorkoutGoal, WorkoutDifficulty, EquipmentType, WorkoutCategory,
  WorkoutBlockType, Exercise, WorkoutBlock, GeneratedWorkout,
  WorkoutBuilderConfig, DIFFICULTY_META,
} from "@/lib/workout-types";
import { CoachAnalysis } from "@/lib/coach-types";
import { SkillTreeState } from "@/lib/skilltree-types";
import { AppState } from "@/lib/types";

// ─── Exercise Library ─────────────────────────────────────────────────────────

type ExLib = Record<WorkoutCategory, Exercise[]>;

const EXERCISE_LIBRARY: ExLib = {
  push: [
    { name: "Push-Ups",               sets: 3, reps: "10-15", rest: "60s",  category: "push", equipment: ["none"] },
    { name: "Diamond Push-Ups",       sets: 3, reps: "8-12",  rest: "60s",  category: "push", equipment: ["none"] },
    { name: "Pike Push-Ups",          sets: 3, reps: "8-10",  rest: "60s",  category: "push", equipment: ["none"] },
    { name: "Wide Push-Ups",          sets: 3, reps: "10-15", rest: "60s",  category: "push", equipment: ["none"] },
    { name: "Decline Push-Ups",       sets: 3, reps: "8-12",  rest: "60s",  category: "push", equipment: ["none"] },
    { name: "Pseudo Planche Push-Ups",sets: 3, reps: "5-8",   rest: "90s",  category: "push", equipment: ["none"], notes: "Lean forward, protract scaps" },
    { name: "Archer Push-Ups",        sets: 3, reps: "4-6 each", rest: "90s", category: "push", equipment: ["none"] },
    { name: "Incline Push-Ups",       sets: 3, reps: "12-20", rest: "45s",  category: "push", equipment: ["none"] },
    { name: "Shoulder Taps",          sets: 3, reps: "10-14", rest: "45s",  category: "push", equipment: ["none"] },
    { name: "Tricep Push-Ups",        sets: 3, reps: "8-12",  rest: "60s",  category: "push", equipment: ["none"] },
    { name: "Parallette Push-Ups",    sets: 3, reps: "10-15", rest: "60s",  category: "push", equipment: ["parallettes"] },
    { name: "Parallette Dips",        sets: 3, reps: "8-12",  rest: "75s",  category: "push", equipment: ["parallettes"] },
    { name: "L-Sit Dips",             sets: 3, reps: "5-8",   rest: "90s",  category: "push", equipment: ["parallettes"], notes: "Hold L-sit while dipping" },
    { name: "Straddle Planche Leans", sets: 3, reps: "3x10s", rest: "90s",  category: "push", equipment: ["parallettes"], notes: "Lean forward, stay on toes" },
    { name: "Ring Dips",              sets: 3, reps: "6-10",  rest: "90s",  category: "push", equipment: ["rings"] },
    { name: "Ring Push-Ups",          sets: 3, reps: "8-12",  rest: "75s",  category: "push", equipment: ["rings"] },
    { name: "Ring Fly",               sets: 3, reps: "6-8",   rest: "90s",  category: "push", equipment: ["rings"], notes: "Control the lowering phase" },
    { name: "Dips",                   sets: 3, reps: "8-15",  rest: "75s",  category: "push", equipment: ["gym","parallettes"] },
    { name: "Handstand Push-Up Negatives", sets: 3, reps: "3-5", rest: "120s", category: "push", equipment: ["none"], notes: "Wall-supported, 5s descent" },
  ],
  pull: [
    { name: "Pull-Ups",               sets: 3, reps: "5-10",  rest: "90s",  category: "pull", equipment: ["pullup_bar","rings","gym"] },
    { name: "Chin-Ups",               sets: 3, reps: "6-12",  rest: "90s",  category: "pull", equipment: ["pullup_bar","gym"] },
    { name: "Australian Rows",        sets: 3, reps: "10-15", rest: "60s",  category: "pull", equipment: ["pullup_bar","rings","gym"] },
    { name: "Dead Hangs",             sets: 3, reps: "3x30s", rest: "60s",  category: "pull", equipment: ["pullup_bar","rings","gym"], notes: "Full decompression hang" },
    { name: "Scapular Pull-Ups",      sets: 3, reps: "8-12",  rest: "60s",  category: "pull", equipment: ["pullup_bar","gym"], notes: "Depress and retract at top" },
    { name: "Archer Pull-Ups",        sets: 3, reps: "3-5 each", rest: "90s", category: "pull", equipment: ["pullup_bar","gym"] },
    { name: "L-Sit Pull-Ups",         sets: 3, reps: "3-6",   rest: "120s", category: "pull", equipment: ["pullup_bar","gym"], notes: "Maintain L-sit through full ROM" },
    { name: "Muscle-Ups",             sets: 3, reps: "2-5",   rest: "120s", category: "pull", equipment: ["pullup_bar","rings","gym"], notes: "Full ROM, lock out at top" },
    { name: "Ring Rows",              sets: 3, reps: "10-15", rest: "60s",  category: "pull", equipment: ["rings"] },
    { name: "Ring Pull-Ups",          sets: 3, reps: "5-10",  rest: "90s",  category: "pull", equipment: ["rings"] },
    { name: "Ring Muscle-Ups",        sets: 3, reps: "2-4",   rest: "120s", category: "pull", equipment: ["rings"] },
    { name: "Negative Pull-Ups",      sets: 3, reps: "5-8",   rest: "90s",  category: "pull", equipment: ["pullup_bar","gym"], notes: "5-7s controlled descent" },
    { name: "Band-Assisted Pull-Ups", sets: 3, reps: "8-12",  rest: "75s",  category: "pull", equipment: ["pullup_bar","resistance_bands"] },
    { name: "Commando Pull-Ups",      sets: 3, reps: "4-6 each", rest: "90s", category: "pull", equipment: ["pullup_bar","gym"] },
    { name: "Front Lever Tuck Hold",  sets: 3, reps: "3x10s", rest: "90s",  category: "pull", equipment: ["pullup_bar","rings","gym"], notes: "Tuck hips, straight arms" },
  ],
  core: [
    { name: "Hollow Body Hold",       sets: 3, reps: "3x30s", rest: "60s",  category: "core", equipment: ["none"] },
    { name: "Tuck Planche Hold",      sets: 3, reps: "3x10s", rest: "90s",  category: "core", equipment: ["none","parallettes"] },
    { name: "Plank",                  sets: 3, reps: "3x45s", rest: "45s",  category: "core", equipment: ["none"] },
    { name: "Side Plank",             sets: 3, reps: "3x30s each", rest: "45s", category: "core", equipment: ["none"] },
    { name: "Dragon Flag Negatives",  sets: 3, reps: "3-5",   rest: "90s",  category: "core", equipment: ["none","gym"] },
    { name: "Superman Hold",          sets: 3, reps: "3x20s", rest: "45s",  category: "core", equipment: ["none"] },
    { name: "L-Sit Tuck",             sets: 3, reps: "3x15s", rest: "75s",  category: "core", equipment: ["none","parallettes"] },
    { name: "Hanging Leg Raises",     sets: 3, reps: "8-12",  rest: "75s",  category: "core", equipment: ["pullup_bar","rings","gym"] },
    { name: "Ab Wheel Rollouts",      sets: 3, reps: "6-10",  rest: "75s",  category: "core", equipment: ["gym","none"] },
    { name: "V-Ups",                  sets: 3, reps: "10-15", rest: "60s",  category: "core", equipment: ["none"] },
    { name: "Bicycle Crunches",       sets: 3, reps: "20-30", rest: "45s",  category: "core", equipment: ["none"] },
    { name: "Parallette L-Sit",       sets: 3, reps: "3x20s", rest: "75s",  category: "core", equipment: ["parallettes"], notes: "Straight legs extended" },
    { name: "Parallette V-Sit",       sets: 3, reps: "3x10s", rest: "90s",  category: "core", equipment: ["parallettes"], notes: "Hips raised, full V" },
    { name: "Tuck Hold on Floor",     sets: 3, reps: "3x20s", rest: "60s",  category: "core", equipment: ["none"], notes: "Both hands, compressed tuck" },
    { name: "Windshield Wipers",      sets: 3, reps: "6-10",  rest: "75s",  category: "core", equipment: ["pullup_bar","gym"] },
  ],
  legs: [
    { name: "Squats",                  sets: 3, reps: "15-20", rest: "60s",  category: "legs", equipment: ["none"] },
    { name: "Lunges",                  sets: 3, reps: "10-12 each", rest: "60s", category: "legs", equipment: ["none"] },
    { name: "Bulgarian Split Squats",  sets: 3, reps: "8-12 each", rest: "75s", category: "legs", equipment: ["none"] },
    { name: "Pistol Squat Negatives",  sets: 3, reps: "4-6 each", rest: "90s", category: "legs", equipment: ["none"], notes: "5s descent, assisted if needed" },
    { name: "Nordic Curls",            sets: 3, reps: "4-6",   rest: "90s",  category: "legs", equipment: ["none","gym"], notes: "Anchor feet, slow descent" },
    { name: "Jump Squats",             sets: 3, reps: "10-15", rest: "60s",  category: "legs", equipment: ["none"] },
    { name: "Calf Raises",             sets: 3, reps: "20-30", rest: "45s",  category: "legs", equipment: ["none"] },
    { name: "Glute Bridges",           sets: 3, reps: "15-20", rest: "45s",  category: "legs", equipment: ["none"] },
    { name: "Step-Ups",                sets: 3, reps: "10-12 each", rest: "60s", category: "legs", equipment: ["none"] },
    { name: "Single-Leg Deadlift",     sets: 3, reps: "8-10 each", rest: "60s", category: "legs", equipment: ["none","dumbbells"] },
    { name: "Sumo Squats",             sets: 3, reps: "15-20", rest: "60s",  category: "legs", equipment: ["none"] },
    { name: "Reverse Lunges",          sets: 3, reps: "10-12 each", rest: "60s", category: "legs", equipment: ["none"] },
  ],
  mobility: [
    { name: "Deep Squat Hold",        sets: 3, reps: "3x60s", rest: "30s",  category: "mobility", equipment: ["none"], notes: "Work depth, hold ankles" },
    { name: "Pancake Stretch",        sets: 3, reps: "3x45s", rest: "30s",  category: "mobility", equipment: ["none"] },
    { name: "Bridge",                 sets: 3, reps: "3x30s", rest: "45s",  category: "mobility", equipment: ["none"] },
    { name: "Shoulder Dislocates",    sets: 3, reps: "10-15", rest: "30s",  category: "mobility", equipment: ["resistance_bands","none"] },
    { name: "Thoracic Rotation",      sets: 3, reps: "10 each", rest: "30s", category: "mobility", equipment: ["none"] },
    { name: "Hip Flexor Stretch",     sets: 3, reps: "3x45s each", rest: "30s", category: "mobility", equipment: ["none"] },
    { name: "Jefferson Curl",         sets: 3, reps: "5-8",   rest: "60s",  category: "mobility", equipment: ["none","dumbbells"], notes: "Slow, controlled, articulate spine" },
    { name: "Wrist Prep Circles",     sets: 2, reps: "2x20s each", rest: "20s", category: "mobility", equipment: ["none"] },
    { name: "Pigeon Pose",            sets: 3, reps: "3x60s each", rest: "30s", category: "mobility", equipment: ["none"] },
    { name: "Cat-Cow",                sets: 3, reps: "15-20", rest: "20s",  category: "mobility", equipment: ["none"] },
    { name: "Lat Stretch",            sets: 3, reps: "3x45s", rest: "30s",  category: "mobility", equipment: ["pullup_bar","none"] },
    { name: "Thoracic Bridge",        sets: 3, reps: "3x20s", rest: "45s",  category: "mobility", equipment: ["none"] },
    { name: "Couch Stretch",          sets: 3, reps: "3x60s each", rest: "30s", category: "mobility", equipment: ["none"] },
  ],
  balance: [
    { name: "Single Leg Balance",     sets: 3, reps: "3x30s each", rest: "30s", category: "balance", equipment: ["none"] },
    { name: "Handstand Wall Hold",    sets: 3, reps: "3x20s", rest: "90s",  category: "balance", equipment: ["none"], notes: "Chest to wall, tight body" },
    { name: "Crow Pose",              sets: 3, reps: "3x15s", rest: "75s",  category: "balance", equipment: ["none"] },
    { name: "Headstand",              sets: 3, reps: "3x30s", rest: "60s",  category: "balance", equipment: ["none"], notes: "Tripod or straight-arm variation" },
    { name: "Handstand Kick-Ups",     sets: 5, reps: "3-5 attempts", rest: "60s", category: "balance", equipment: ["none"] },
    { name: "Tuck Handstand",         sets: 3, reps: "3x10s", rest: "90s",  category: "balance", equipment: ["none"] },
    { name: "Frog Stand",             sets: 3, reps: "3x20s", rest: "60s",  category: "balance", equipment: ["none"], notes: "Balance point between hands" },
    { name: "Parallette Frog Stand",  sets: 3, reps: "3x25s", rest: "60s",  category: "balance", equipment: ["parallettes"] },
    { name: "Wall Handstand",         sets: 3, reps: "3x30s", rest: "90s",  category: "balance", equipment: ["none"], notes: "Improve alignment and balance" },
    { name: "Tiger Bend Hold",        sets: 3, reps: "3x10s", rest: "90s",  category: "balance", equipment: ["none"], notes: "Forearm stand entry practice" },
  ],
  explosive: [
    { name: "Box Jumps",              sets: 4, reps: "5-8",   rest: "75s",  category: "explosive", equipment: ["none","gym"] },
    { name: "Clap Push-Ups",          sets: 4, reps: "5-8",   rest: "75s",  category: "explosive", equipment: ["none"] },
    { name: "Plyometric Push-Ups",    sets: 4, reps: "6-10",  rest: "75s",  category: "explosive", equipment: ["none"] },
    { name: "Broad Jump",             sets: 4, reps: "4-6",   rest: "90s",  category: "explosive", equipment: ["none"] },
    { name: "Tuck Jumps",             sets: 4, reps: "8-12",  rest: "60s",  category: "explosive", equipment: ["none"] },
    { name: "Explosive Pull-Ups",     sets: 4, reps: "3-6",   rest: "90s",  category: "explosive", equipment: ["pullup_bar","gym"], notes: "Pull as fast as possible" },
    { name: "Kip Swings",             sets: 4, reps: "8-12",  rest: "60s",  category: "explosive", equipment: ["pullup_bar","gym"], notes: "Build kipping mechanics" },
    { name: "Depth Jumps",            sets: 4, reps: "4-6",   rest: "90s",  category: "explosive", equipment: ["none","gym"] },
    { name: "Jumping Lunges",         sets: 4, reps: "8-12",  rest: "60s",  category: "explosive", equipment: ["none"] },
    { name: "Medicine Ball Slams",    sets: 4, reps: "8-12",  rest: "60s",  category: "explosive", equipment: ["gym"] },
    { name: "Burpees",                sets: 4, reps: "10-15", rest: "60s",  category: "explosive", equipment: ["none"] },
    { name: "Lateral Bounds",         sets: 4, reps: "8-12",  rest: "60s",  category: "explosive", equipment: ["none"] },
  ],
};

// ─── Goal → Category Mapping ─────────────────────────────────────────────────

const GOAL_CATEGORIES: Record<WorkoutGoal, { primary: WorkoutCategory[]; secondary: WorkoutCategory[] }> = {
  strength:      { primary: ["push","pull"],               secondary: ["core"] },
  muscle:        { primary: ["push","pull","legs"],         secondary: ["core"] },
  endurance:     { primary: ["push","pull","core","legs"],  secondary: [] },
  mobility:      { primary: ["mobility"],                   secondary: ["balance"] },
  balance:       { primary: ["balance"],                    secondary: ["core"] },
  explosiveness: { primary: ["explosive"],                  secondary: ["legs"] },
  athleticism:   { primary: ["push","pull","core","legs"],  secondary: ["explosive","balance"] },
  skill_unlock:  { primary: ["pull","core","balance"],      secondary: ["push"] },
};

// ─── Warmup / Cooldown Templates ─────────────────────────────────────────────

const WARMUP_EXERCISES: Exercise[] = [
  { name: "Arm Circles",      sets: 2, reps: "2x20s", rest: "10s", category: "mobility", equipment: ["none"] },
  { name: "Hip Circles",      sets: 2, reps: "2x20s", rest: "10s", category: "mobility", equipment: ["none"] },
  { name: "Jumping Jacks",    sets: 2, reps: "20-30", rest: "20s", category: "explosive", equipment: ["none"] },
  { name: "Inchworms",        sets: 2, reps: "6-8",   rest: "20s", category: "mobility", equipment: ["none"] },
  { name: "Leg Swings",       sets: 2, reps: "10 each", rest: "15s", category: "mobility", equipment: ["none"] },
  { name: "World's Greatest Stretch", sets: 2, reps: "5 each", rest: "20s", category: "mobility", equipment: ["none"] },
  { name: "Cat-Cow Warm-Up",  sets: 2, reps: "10",    rest: "15s", category: "mobility", equipment: ["none"] },
  { name: "Wrist Circles",    sets: 2, reps: "2x20s", rest: "10s", category: "mobility", equipment: ["none"] },
];

const COOLDOWN_EXERCISES: Exercise[] = [
  { name: "Child's Pose",     sets: 1, reps: "60s",   rest: "0s",  category: "mobility", equipment: ["none"] },
  { name: "Chest Stretch",    sets: 1, reps: "30s each", rest: "10s", category: "mobility", equipment: ["none"] },
  { name: "Lat Stretch",      sets: 1, reps: "30s each", rest: "10s", category: "mobility", equipment: ["none"] },
  { name: "Pigeon Pose",      sets: 1, reps: "60s each", rest: "10s", category: "mobility", equipment: ["none"] },
  { name: "Supine Twist",     sets: 1, reps: "45s each", rest: "10s", category: "mobility", equipment: ["none"] },
  { name: "Forward Fold",     sets: 1, reps: "60s",   rest: "10s",  category: "mobility", equipment: ["none"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function filterByEquipment(exercises: Exercise[], available: EquipmentType[]): Exercise[] {
  const has = new Set(available);
  return exercises.filter((ex) => ex.equipment.some((eq) => has.has(eq)));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scaleSetsReps(ex: Exercise, difficulty: WorkoutDifficulty): Exercise {
  const mults: Record<WorkoutDifficulty, number> = {
    beginner: 0.75, intermediate: 1.0, advanced: 1.25, elite: 1.5,
  };
  const mult = mults[difficulty];
  const sets = Math.max(2, Math.round(ex.sets * mult));
  return { ...ex, sets };
}

function pickExercises(
  categories: WorkoutCategory[],
  available: EquipmentType[],
  count: number,
  excludeNames: Set<string> = new Set(),
): Exercise[] {
  const pool: Exercise[] = [];
  for (const cat of categories) {
    const filtered = filterByEquipment(EXERCISE_LIBRARY[cat] ?? [], available);
    pool.push(...filtered.filter((e) => !excludeNames.has(e.name)));
  }
  return shuffle(pool).slice(0, count);
}

function workoutName(goal: WorkoutGoal, primary: WorkoutCategory[]): string {
  const names: Partial<Record<WorkoutGoal, string[]>> = {
    strength:      ["Iron Protocol", "Maximum Strength Session", "Power Foundation", "Force Multiplier"],
    muscle:        ["Hypertrophy Engine", "Volume Assault", "Mass Builder", "Muscle Protocol"],
    endurance:     ["Endurance Forge", "Stamina Engine", "Cardio Forge", "Resilience Builder"],
    mobility:      ["Mobility Flow", "Flexibility Unlock", "Range Protocol", "Joint Liberation"],
    balance:       ["Balance Quest", "Equilibrium Protocol", "Control Forge", "Stability Session"],
    explosiveness: ["Power Surge", "Explosive Protocol", "Plyometric Assault", "Fast-Twitch Forge"],
    athleticism:   ["Full Athlete Protocol", "Complete Training", "Athletic Forge", "All-Round Session"],
    skill_unlock:  ["Skill Acquisition Protocol", "Technique Lab", "Skill Forge", "Movement Mastery"],
  };
  const opts = names[goal] ?? ["Custom Workout"];
  return opts[Math.floor(Math.random() * opts.length)];
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export function generateWorkout(config: WorkoutBuilderConfig): GeneratedWorkout {
  const { goal, difficulty, equipment, durationMins, coachHints } = config;
  const { primary, secondary } = GOAL_CATEGORIES[goal];
  const diffMeta = DIFFICULTY_META[difficulty];

  // Adjust categories based on coach hints
  let adjustedPrimary = [...primary];
  if (coachHints) {
    if (coachHints.includes("pull") && !adjustedPrimary.includes("pull")) adjustedPrimary.unshift("pull");
    if (coachHints.includes("push") && !adjustedPrimary.includes("push")) adjustedPrimary.unshift("push");
    if (coachHints.includes("core") && !adjustedPrimary.includes("core")) adjustedPrimary.push("core");
  }

  const allEquipment: EquipmentType[] = equipment.length > 0 ? [...equipment] : ["none"];
  const usedNames = new Set<string>();

  // Determine block counts based on duration
  const warmupCount  = 3;
  const cooldownCount = 2;
  let mainCount      = durationMins <= 20 ? 3 : durationMins <= 30 ? 4 : durationMins <= 45 ? 5 : 6;
  let accessoryCount = durationMins >= 30 ? 2 : 1;
  let skillCount     = (goal === "skill_unlock" || goal === "balance") && durationMins >= 30 ? 2 : 0;
  let hasFinisher    = durationMins >= 45 && (goal === "endurance" || goal === "athleticism" || goal === "explosiveness");

  const blocks: WorkoutBlock[] = [];

  // ── Warmup ─────────────────────────────────────────────────────────────────
  const warmupExs = shuffle(WARMUP_EXERCISES).slice(0, warmupCount).map((e) => {
    usedNames.add(e.name);
    return e;
  });
  blocks.push({ type: "warmup", label: "Warm-Up", exercises: warmupExs, duration: 5 });

  // ── Main Block ─────────────────────────────────────────────────────────────
  const mainExs = pickExercises(adjustedPrimary, allEquipment, mainCount, usedNames)
    .map((e) => { usedNames.add(e.name); return scaleSetsReps(e, difficulty); });
  if (mainExs.length > 0) {
    blocks.push({ type: "main", label: "Main Work", exercises: mainExs, duration: Math.max(10, durationMins - 15) });
  }

  // ── Accessory Block ────────────────────────────────────────────────────────
  if (accessoryCount > 0) {
    const accessoryCats = secondary.length > 0 ? secondary : adjustedPrimary;
    const accExs = pickExercises(accessoryCats, allEquipment, accessoryCount, usedNames)
      .map((e) => { usedNames.add(e.name); return scaleSetsReps(e, difficulty); });
    if (accExs.length > 0) {
      blocks.push({ type: "accessory", label: "Accessory Work", exercises: accExs, duration: 8 });
    }
  }

  // ── Skill Block ────────────────────────────────────────────────────────────
  if (skillCount > 0) {
    const skillExs = pickExercises(["balance","core"], allEquipment, skillCount, usedNames)
      .map((e) => { usedNames.add(e.name); return scaleSetsReps(e, difficulty); });
    if (skillExs.length > 0) {
      blocks.push({ type: "skill", label: "Skill Practice", exercises: skillExs, duration: 8 });
    }
  }

  // ── Finisher ────────────────────────────────────────────────────────────────
  if (hasFinisher) {
    const finisherExs = pickExercises(["explosive","legs"], allEquipment, 1, usedNames);
    if (finisherExs.length > 0) {
      blocks.push({ type: "finisher", label: "Finisher", exercises: finisherExs, duration: 3 });
    }
  }

  // ── Cooldown ────────────────────────────────────────────────────────────────
  const cooldownExs = shuffle(COOLDOWN_EXERCISES).slice(0, cooldownCount);
  blocks.push({ type: "cooldown", label: "Cool-Down", exercises: cooldownExs, duration: 5 });

  const xpBase = 25 * diffMeta.xpMultiplier;
  const xpReward = Math.round(xpBase + durationMins * 0.5);
  const coinReward = Math.round(10 * diffMeta.xpMultiplier);

  const tags: string[] = [goal, difficulty, ...allEquipment.slice(0, 2)];

  return {
    id:              generateId(),
    name:            workoutName(goal, adjustedPrimary),
    goal,
    difficulty,
    equipment:       allEquipment,
    durationMins,
    blocks,
    xpReward,
    coinReward,
    tags,
    generatedAt:     Date.now(),
    isSaved:         false,
    isFavorite:      false,
    isArchived:      false,
    coachInfluenced: !!(coachHints && coachHints.length > 0),
  };
}

// ─── Recommended Workouts ─────────────────────────────────────────────────────

export function getRecommendedWorkouts(
  coachAnalysis: CoachAnalysis | null,
  _treeState: SkillTreeState,
  appState: AppState,
  count: number = 3,
): GeneratedWorkout[] {
  const workouts: GeneratedWorkout[] = [];
  const wc = appState.workouts.length;

  // Determine difficulty
  const difficulty: WorkoutDifficulty = wc < 10 ? "beginner" : wc < 30 ? "intermediate" : wc < 75 ? "advanced" : "elite";

  // Derive goal from coach analysis
  let primaryGoal: WorkoutGoal = "athleticism";
  let coachHints: string[] = [];

  if (coachAnalysis) {
    const { trainingBalance } = coachAnalysis;
    const { counts } = trainingBalance;
    if (counts.pull < counts.push) {
      primaryGoal = "strength";
      coachHints = ["pull"];
    } else if (counts.push < counts.pull) {
      coachHints = ["push"];
    }
    if (trainingBalance.total7 < 2) primaryGoal = "endurance";
  }

  const goals: WorkoutGoal[] = [primaryGoal, "strength", "mobility", "skill_unlock", "explosiveness", "balance"];
  const durations = [30, 45, 20];

  for (let i = 0; i < Math.min(count, goals.length); i++) {
    workouts.push(generateWorkout({
      goal:         goals[i] ?? "athleticism",
      difficulty,
      equipment:    ["none","pullup_bar"],
      durationMins: durations[i % durations.length] ?? 30,
      coachHints:   i === 0 ? coachHints : [],
    }));
  }

  return workouts;
}
