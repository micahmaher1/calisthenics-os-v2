import { CoachAnalysis, CoachSettings } from "./coach-types";
import { JourneyDef, JourneyProgress, JourneyState } from "./journey-types";
import { MasteryState } from "./mastery-types";
import { StreakState } from "./streak-types";
import { QuestState } from "./quest-types";
import { RecordsState } from "./records-types";
import { AppState } from "./types";
import { TitleState } from "./title-types";
import { AchievementState } from "./achievement-types";
import { SkillTreeState } from "./skilltree-types";

export interface SmartPriority {
  action:   string;
  reason:   string;
  benefits: string[];
  xpValue:  number;
  urgency:  "critical" | "high" | "medium" | "low";
  icon:     string;
  href?:    string;
}

export interface TrainingScore {
  total:     number;
  breakdown: {
    xpScore:      number;
    masteryScore: number;
    streakScore:  number;
    questScore:   number;
    achieveScore: number;
    journeyScore: number;
  };
  rank:      string;
  rankColor: string;
}

export interface LegendaryTarget {
  journeyDef:      JourneyDef;
  progress:        JourneyProgress | null;
  overallPct:      number;
  stageName:       string;
  stagesLeft:      number;
  topRequirements: string[];
}

export interface HubState {
  appState:      AppState;
  streakState:   StreakState;
  questState:    QuestState;
  recState:      RecordsState;
  masteryState:  MasteryState;
  journeyState:  JourneyState;
  coachAnalysis: CoachAnalysis | null;
  coachSettings: CoachSettings;
  titleState:    TitleState;
  achState:      AchievementState;
  treeState:     SkillTreeState;

  trainingScore:   TrainingScore;
  smartPriority:   SmartPriority;
  legendaryTarget: LegendaryTarget | null;
  recentActivity:  RecentActivity[];
}

export interface RecentActivity {
  type:       "workout" | "achievement" | "quest" | "journey" | "mastery" | "record" | "streak";
  title:      string;
  subtitle?:  string;
  icon:       string;
  timestamp:  number;
  xpGained?:  number;
}
