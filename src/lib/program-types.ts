import { GeneratedWorkout, WorkoutDifficulty, EquipmentType } from "./workout-types";

export type ProgramDuration = 1 | 2 | 4 | 8 | 12;
export type ProgramTheme =
  | "strength" | "muscle" | "mobility" | "athleticism" | "skill_unlock"
  | "path_of_strength" | "path_of_power" | "path_of_balance"
  | "path_of_mobility" | "path_of_athlete"
  | "path_of_human_flag" | "path_of_front_lever" | "path_of_planche";

export const PROGRAM_THEME_META: Record<ProgramTheme, {
  label: string; icon: string; description: string; color: string; bgClass: string; borderClass: string;
  weeks: ProgramDuration[]; featured?: boolean;
}> = {
  strength:           { label: "Strength Program",        icon: "💪", description: "Build raw strength across all movement patterns.",     color: "text-orange-400", bgClass: "bg-orange-500/8",   borderClass: "border-orange-500/25", weeks: [4,8,12] },
  muscle:             { label: "Muscle Program",          icon: "🏋️",  description: "Hypertrophy-focused progressive overload.",            color: "text-red-400",    bgClass: "bg-red-500/8",      borderClass: "border-red-500/25",    weeks: [4,8,12] },
  mobility:           { label: "Mobility Program",        icon: "🧘", description: "Unlock full flexibility and range of motion.",         color: "text-green-400",  bgClass: "bg-green-500/8",    borderClass: "border-green-500/25",  weeks: [2,4,8]  },
  athleticism:        { label: "Athleticism Program",     icon: "🏃", description: "All-round athletic development.",                     color: "text-purple-400", bgClass: "bg-purple-500/8",   borderClass: "border-purple-500/25", weeks: [4,8,12] },
  skill_unlock:       { label: "Skill Unlock Program",    icon: "🎯", description: "Systematic skill acquisition and progression.",       color: "text-cyan-400",   bgClass: "bg-cyan-500/8",     borderClass: "border-cyan-500/25",   weeks: [4,8]    },
  path_of_strength:   { label: "Path of Strength",        icon: "⚔️",  description: "A warrior's journey to peak raw power.",              color: "text-amber-400",  bgClass: "bg-amber-500/8",    borderClass: "border-amber-500/30",  weeks: [8,12],  featured: true },
  path_of_power:      { label: "Path of Power",           icon: "⚡", description: "Explosive power and athletic dominance.",             color: "text-yellow-400", bgClass: "bg-yellow-500/8",   borderClass: "border-yellow-500/30", weeks: [8],     featured: true },
  path_of_balance:    { label: "Path of Balance",         icon: "⚖️",  description: "Master equilibrium and body control.",                color: "text-sky-400",    bgClass: "bg-sky-500/8",      borderClass: "border-sky-500/30",    weeks: [4,8],   featured: true },
  path_of_mobility:   { label: "Path of Mobility",        icon: "🌊", description: "Unlock the body's full movement potential.",          color: "text-teal-400",   bgClass: "bg-teal-500/8",     borderClass: "border-teal-500/30",   weeks: [4,8]    },
  path_of_athlete:    { label: "Path of the Athlete",     icon: "🏆", description: "Forge the complete calisthenics athlete.",            color: "text-purple-400", bgClass: "bg-purple-500/8",   borderClass: "border-purple-500/30", weeks: [12],    featured: true },
  path_of_human_flag: { label: "Path of the Human Flag",  icon: "🚩", description: "The brutal journey to the Human Flag.",               color: "text-red-400",    bgClass: "bg-red-500/8",      borderClass: "border-red-500/30",    weeks: [12],    featured: true },
  path_of_front_lever:{ label: "Path of the Front Lever", icon: "🎯", description: "Systematic front lever progression.",                 color: "text-orange-400", bgClass: "bg-orange-500/8",   borderClass: "border-orange-500/30", weeks: [8,12],  featured: true },
  path_of_planche:    { label: "Path of the Planche",     icon: "👐", description: "Planche mastery from zero to full.",                  color: "text-pink-400",   bgClass: "bg-pink-500/8",     borderClass: "border-pink-500/30",   weeks: [12],    featured: true },
};

export interface ProgramDay {
  dayNumber:    number;
  weekNumber:   number;
  label:        string;
  isRest:       boolean;
  workout?:     GeneratedWorkout;
  completedAt?: number;
}

export interface ActiveProgram {
  id:            string;
  theme:         ProgramTheme;
  durationWeeks: ProgramDuration;
  difficulty:    WorkoutDifficulty;
  equipment:     EquipmentType[];
  startedAt:     number;
  days:          ProgramDay[];
  completedAt?:  number;
  xpBonus:       number;
  coinBonus:     number;
}

export interface ProgramState {
  activeProgram:          ActiveProgram | null;
  completedPrograms:      ActiveProgram[];
  totalProgramsCompleted: number;
}
