// Personal Records & Progress Tracking types

export type RecordCategory =
  | "strength"
  | "core"
  | "hanging"
  | "skills"
  | "consistency"
  | "xp"
  | "workouts"
  | "custom";

export interface RecordEntry {
  id:           string;
  category:     RecordCategory;
  exerciseName: string;   // e.g. "Push-ups", "Plank", "Dead Hang"
  unit:         "reps" | "seconds" | "minutes" | "count" | "custom";
  value:        number;
  previousValue: number | null;
  improvement:  number | null;   // value - previousValue
  dateAchieved: string;          // ISO date
  workoutId?:   string;
  notes?:       string;
}

export interface RecordHistoryEntry {
  value:        number;
  dateAchieved: string;
}

export interface TrackedRecord {
  exerciseName:   string;
  category:       RecordCategory;
  unit:           "reps" | "seconds" | "minutes" | "count" | "custom";
  current:        RecordEntry | null;
  history:        RecordHistoryEntry[];  // oldest first
}

export interface Milestone {
  exerciseName: string;
  value:        number;
  label:        string;     // e.g. "50 Push-ups"
  achieved:     boolean;
  dateAchieved: string | null;
  xpReward:     number;
  coinReward:   number;
}

export interface MilestoneGroup {
  exerciseName: string;
  icon:         string;
  unit:         "reps" | "seconds" | "minutes";
  milestones:   Milestone[];
  currentValue: number;
  nextMilestone: Milestone | null;
}

export interface SkillMilestone {
  id:           string;
  name:         string;     // "First Pull-up"
  description:  string;
  icon:         string;
  achieved:     boolean;
  dateAchieved: string | null;
  xpReward:     number;
}

export interface CustomRecord {
  id:           string;
  name:         string;
  unit:         string;
  currentValue: number | null;
  history:      RecordHistoryEntry[];
  createdAt:    string;
}

export interface RecordsState {
  records:        Record<string, TrackedRecord>;  // keyed by exerciseName (normalized)
  milestones:     Record<string, boolean>;        // milestoneId -> achieved
  milestoneDates: Record<string, string>;         // milestoneId -> ISO date
  skillMilestones: Record<string, SkillMilestone>;
  customRecords:  CustomRecord[];
  lastEvaluated:  string | null;
}

export interface NewRecordResult {
  exerciseName: string;
  newValue:     number;
  oldValue:     number | null;
  improvement:  number | null;
  xpReward:     number;
  coinReward:   number;
  milestonesUnlocked: Milestone[];
  skillMilestonesUnlocked: SkillMilestone[];
}
