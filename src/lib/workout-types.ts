export type WorkoutGoal = "strength" | "muscle" | "endurance" | "mobility" | "balance" | "explosiveness" | "athleticism" | "skill_unlock";
export type WorkoutDifficulty = "beginner" | "intermediate" | "advanced" | "elite";
export type EquipmentType = "none" | "pullup_bar" | "rings" | "parallettes" | "resistance_bands" | "dumbbells" | "gym";
export type WorkoutBlockType = "warmup" | "main" | "accessory" | "skill" | "finisher" | "cooldown";
export type WorkoutCategory = "push" | "pull" | "core" | "legs" | "mobility" | "balance" | "explosive";

export const WORKOUT_GOAL_META: Record<WorkoutGoal, { label: string; icon: string; color: string; description: string }> = {
  strength:      { label: "Strength",       icon: "💪", color: "text-orange-400", description: "Build raw power and maximum strength" },
  muscle:        { label: "Muscle",         icon: "🏋️",  color: "text-red-400",    description: "Hypertrophy and muscle development" },
  endurance:     { label: "Endurance",      icon: "⚡", color: "text-yellow-400", description: "Stamina and cardiovascular fitness" },
  mobility:      { label: "Mobility",       icon: "🧘", color: "text-green-400",  description: "Flexibility and range of motion" },
  balance:       { label: "Balance",        icon: "⚖️",  color: "text-sky-400",    description: "Body control and proprioception" },
  explosiveness: { label: "Explosiveness",  icon: "💥", color: "text-pink-400",   description: "Power and fast-twitch development" },
  athleticism:   { label: "Athleticism",    icon: "🏃", color: "text-purple-400", description: "All-round athletic performance" },
  skill_unlock:  { label: "Skill Unlock",   icon: "🎯", color: "text-cyan-400",   description: "Progress toward specific skill goals" },
};

export const DIFFICULTY_META: Record<WorkoutDifficulty, { label: string; color: string; xpMultiplier: number }> = {
  beginner:     { label: "Beginner",     color: "text-green-400",  xpMultiplier: 1.0 },
  intermediate: { label: "Intermediate", color: "text-yellow-400", xpMultiplier: 1.25 },
  advanced:     { label: "Advanced",     color: "text-orange-400", xpMultiplier: 1.5 },
  elite:        { label: "Elite",        color: "text-red-400",    xpMultiplier: 2.0 },
};

export const EQUIPMENT_META: Record<EquipmentType, { label: string; icon: string }> = {
  none:             { label: "No Equipment",      icon: "🤸" },
  pullup_bar:       { label: "Pull-Up Bar",        icon: "🏗️"  },
  rings:            { label: "Rings",              icon: "⭕" },
  parallettes:      { label: "Parallettes",        icon: "🏋️"  },
  resistance_bands: { label: "Resistance Bands",   icon: "🎗️"  },
  dumbbells:        { label: "Dumbbells",          icon: "🏋️"  },
  gym:              { label: "Gym Access",         icon: "🏟️"  },
};

export interface Exercise {
  name:        string;
  sets:        number;
  reps:        string;
  rest:        string;
  notes?:      string;
  category:    WorkoutCategory;
  equipment:   EquipmentType[];
}

export interface WorkoutBlock {
  type:      WorkoutBlockType;
  label:     string;
  exercises: Exercise[];
  duration:  number;
}

export interface GeneratedWorkout {
  id:            string;
  name:          string;
  goal:          WorkoutGoal;
  difficulty:    WorkoutDifficulty;
  equipment:     EquipmentType[];
  durationMins:  number;
  blocks:        WorkoutBlock[];
  xpReward:      number;
  coinReward:    number;
  tags:          string[];
  generatedAt:   number;
  completedAt?:  number;
  isSaved:       boolean;
  isFavorite:    boolean;
  isArchived:    boolean;
  coachInfluenced: boolean;
  programId?:    string;
  programDay?:   number;
}

export interface WorkoutBuilderState {
  savedWorkouts:    GeneratedWorkout[];
  recentWorkouts:   GeneratedWorkout[];
  completedIds:     string[];
  totalGenerated:   number;
  totalCompleted:   number;
  favoriteGoal:     WorkoutGoal | null;
}

export interface WorkoutBuilderConfig {
  goal:         WorkoutGoal;
  difficulty:   WorkoutDifficulty;
  equipment:    EquipmentType[];
  durationMins: number;
  coachHints?:  string[];
  focusSkill?:  string;
}
