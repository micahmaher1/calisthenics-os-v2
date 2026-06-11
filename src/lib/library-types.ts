import { SkillTier, SkillDomain } from "./skill-requirements-types";

export type LibraryDifficulty = "beginner" | "intermediate" | "advanced" | "elite" | "legendary";

export interface LibrarySkill {
  id:               string;
  name:             string;
  icon:             string;
  tier:             SkillTier;
  domain:           SkillDomain;
  description:      string;
  purpose:          string;
  benefits:         string[];
  commonMistakes:   string[];
  prerequisites:    string[];
  progressions:     string[];
  regressions:      string[];
  relatedSkills:    string[];
  journeyId?:       string;
  masteryCategories: string[];
  coachingTips:     string[];
  isLegendary:      boolean;
  tags:             string[];
}

export interface ProgressionChain {
  id:          string;
  name:        string;
  icon:        string;
  skills:      string[];
  description: string;
}

export interface LibraryState {
  favoriteSkillIds:  string[];
  trackedSkillIds:   string[];
  completedSkillIds: string[];
  goalSkillId:       string | null;
  lastViewedSkillId: string | null;
}
