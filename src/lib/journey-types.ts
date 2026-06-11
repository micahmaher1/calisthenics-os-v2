export type JourneyDifficulty = "beginner" | "intermediate" | "advanced" | "elite" | "legendary";
export type JourneyCategory = "push" | "pull" | "balance" | "core" | "full_body";
export type JourneyRequirementType =
  | "record_reps"
  | "record_seconds"
  | "workout_count"
  | "level"
  | "xp"
  | "streak_days"
  | "skill_unlocked"
  | "journey_stage"
  | "manual";

export interface JourneyRequirement {
  type:        JourneyRequirementType;
  target:      string;
  value:       number;
  label:       string;
  description: string;
}

export interface JourneyReward {
  xp:          number;
  coins:       number;
  titleId?:    string;
  badgeId?:    string;
  description: string;
}

export interface JourneyStage {
  id:           string;
  stageNumber:  number;
  name:         string;
  description:  string;
  icon:         string;
  requirements: JourneyRequirement[];
  reward:       JourneyReward;
  isMilestone:  boolean;
  tips:         string[];
}

export interface JourneyDef {
  id:             string;
  name:           string;
  subtitle:       string;
  description:    string;
  icon:           string;
  category:       JourneyCategory;
  difficulty:     JourneyDifficulty;
  estimatedWeeks: number;
  stages:         JourneyStage[];
  completionReward: JourneyReward;
  tags:           string[];
  featured?:      boolean;
}

export interface JourneyProgress {
  journeyId:              string;
  startedAt:              number;
  completedAt?:           number;
  currentStageIndex:      number;
  completedStageIds:      string[];
  manualChecks:           Record<string, boolean>;
  claimedRewardStageIds:  string[];
  totalXPEarned:          number;
  totalCoinsEarned:       number;
}

export interface JourneyState {
  activeJourneyId:          string | null;
  journeyProgress:          Record<string, JourneyProgress>;
  completedJourneyIds:      string[];
  totalJourneysStarted:     number;
  totalJourneysCompleted:   number;
}
