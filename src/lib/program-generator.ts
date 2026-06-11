import { generateId } from "@/lib/utils";
import { generateWorkout } from "@/lib/workout-generator";
import { WorkoutDifficulty, EquipmentType, WorkoutGoal, WorkoutBuilderConfig } from "@/lib/workout-types";
import { DIFFICULTY_META } from "@/lib/workout-types";
import { ActiveProgram, ProgramDay, ProgramDuration, ProgramTheme } from "@/lib/program-types";

// ─── Theme → Day pattern ──────────────────────────────────────────────────────

type DayPattern = { label: string; isRest: boolean; goal?: WorkoutGoal };

function getWeeklyPattern(theme: ProgramTheme): DayPattern[] {
  // 7 entries, Mon–Sun
  const rest: DayPattern = { label: "Rest", isRest: true };

  switch (theme) {
    case "strength":
    case "path_of_strength":
      return [
        { label: "Push Day",       isRest: false, goal: "strength" },
        rest,
        { label: "Pull Day",       isRest: false, goal: "strength" },
        rest,
        { label: "Legs & Core",    isRest: false, goal: "strength" },
        rest,
        rest,
      ];
    case "muscle":
      return [
        { label: "Push Day",       isRest: false, goal: "muscle" },
        { label: "Pull Day",       isRest: false, goal: "muscle" },
        rest,
        { label: "Legs Day",       isRest: false, goal: "muscle" },
        rest,
        { label: "Full Body",      isRest: false, goal: "muscle" },
        rest,
      ];
    case "mobility":
    case "path_of_mobility":
      return [
        { label: "Mobility Flow",  isRest: false, goal: "mobility" },
        rest,
        { label: "Mobility Flow",  isRest: false, goal: "mobility" },
        rest,
        { label: "Mobility Flow",  isRest: false, goal: "mobility" },
        rest,
        rest,
      ];
    case "athleticism":
    case "path_of_athlete":
      return [
        { label: "Push Day",       isRest: false, goal: "athleticism" },
        { label: "Pull Day",       isRest: false, goal: "athleticism" },
        { label: "Core & Balance", isRest: false, goal: "balance" },
        rest,
        { label: "Legs Day",       isRest: false, goal: "athleticism" },
        { label: "Skill Day",      isRest: false, goal: "skill_unlock" },
        rest,
      ];
    case "skill_unlock":
      return [
        { label: "Skill Practice", isRest: false, goal: "skill_unlock" },
        rest,
        { label: "Skill Practice", isRest: false, goal: "skill_unlock" },
        rest,
        { label: "Skill Practice", isRest: false, goal: "skill_unlock" },
        rest,
        rest,
      ];
    case "path_of_power":
      return [
        { label: "Power Push",     isRest: false, goal: "explosiveness" },
        rest,
        { label: "Power Pull",     isRest: false, goal: "explosiveness" },
        rest,
        { label: "Power Legs",     isRest: false, goal: "explosiveness" },
        rest,
        rest,
      ];
    case "path_of_balance":
      return [
        { label: "Balance Session",isRest: false, goal: "balance" },
        { label: "Core Work",      isRest: false, goal: "skill_unlock" },
        rest,
        { label: "Balance Session",isRest: false, goal: "balance" },
        rest,
        { label: "Core Work",      isRest: false, goal: "skill_unlock" },
        rest,
      ];
    case "path_of_front_lever":
      return [
        { label: "Pull + Core",    isRest: false, goal: "skill_unlock" },
        rest,
        { label: "Pull Skills",    isRest: false, goal: "skill_unlock" },
        rest,
        { label: "Pull + Core",    isRest: false, goal: "skill_unlock" },
        rest,
        rest,
      ];
    case "path_of_planche":
      return [
        { label: "Push + Core",    isRest: false, goal: "skill_unlock" },
        rest,
        { label: "Push Skills",    isRest: false, goal: "skill_unlock" },
        rest,
        { label: "Push + Core",    isRest: false, goal: "skill_unlock" },
        rest,
        rest,
      ];
    case "path_of_human_flag":
      return [
        { label: "Flag Prep",      isRest: false, goal: "strength" },
        { label: "Core Strength",  isRest: false, goal: "skill_unlock" },
        rest,
        { label: "Flag Attempt",   isRest: false, goal: "balance" },
        { label: "Pull Strength",  isRest: false, goal: "strength" },
        rest,
        rest,
      ];
    default:
      return [
        { label: "Workout",        isRest: false, goal: "athleticism" },
        rest,
        { label: "Workout",        isRest: false, goal: "athleticism" },
        rest,
        { label: "Workout",        isRest: false, goal: "athleticism" },
        rest,
        rest,
      ];
  }
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export function generateProgram(
  theme: ProgramTheme,
  durationWeeks: ProgramDuration,
  difficulty: WorkoutDifficulty,
  equipment: EquipmentType[],
): ActiveProgram {
  const weekPattern = getWeeklyPattern(theme);
  const diffMeta    = DIFFICULTY_META[difficulty];
  const allEquipment: EquipmentType[] = equipment.length > 0 ? equipment : ["none"];

  const days: ProgramDay[] = [];
  let dayNumber = 1;

  for (let week = 1; week <= durationWeeks; week++) {
    for (let dow = 0; dow < 7; dow++) {
      const pattern = weekPattern[dow % weekPattern.length];

      let workout = undefined;
      if (!pattern.isRest) {
        const config: WorkoutBuilderConfig = {
          goal:         pattern.goal ?? "athleticism",
          difficulty,
          equipment:    allEquipment,
          durationMins: durationWeeks >= 8 ? 45 : 30,
        };
        workout = generateWorkout(config);
        workout = { ...workout, programId: "pending", programDay: dayNumber };
      }

      days.push({
        dayNumber,
        weekNumber: week,
        label:      pattern.label,
        isRest:     pattern.isRest,
        workout,
      });
      dayNumber++;
    }
  }

  const xpBonus   = durationWeeks * 100 * diffMeta.xpMultiplier;
  const coinBonus = durationWeeks * 50;

  const programId = generateId();
  // Back-fill programId
  days.forEach((d) => {
    if (d.workout) d.workout = { ...d.workout, programId };
  });

  return {
    id:            programId,
    theme,
    durationWeeks,
    difficulty,
    equipment:     allEquipment,
    startedAt:     Date.now(),
    days,
    xpBonus:       Math.round(xpBonus),
    coinBonus:     Math.round(coinBonus),
  };
}
