// ─── Enums ────────────────────────────────────────────────────────────────────

export type TrainingExperience =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "elite";

export const EXPERIENCE_LABELS: Record<TrainingExperience, string> = {
  beginner:     "Beginner (< 1 year)",
  intermediate: "Intermediate (1–3 years)",
  advanced:     "Advanced (3–7 years)",
  elite:        "Elite (7+ years)",
};

export type HeightUnit  = "cm" | "ft";
export type WeightUnit  = "kg" | "lbs";
export type Visibility  = "private" | "public";

// ─── Goal ────────────────────────────────────────────────────────────────────

export type GoalType =
  | "skill"          // unlock a skill in the tree
  | "max_reps"       // hit N reps in a single session
  | "total_reps"     // accumulate N lifetime reps
  | "streak"         // maintain N day streak
  | "level"          // reach a certain level
  | "custom";        // user-defined checkbox

export interface UserGoal {
  id:           string;
  type:         GoalType;
  title:        string;
  description:  string;
  skillId?:     string;       // for GoalType "skill"
  skillName?:   "push-ups" | "pull-ups" | "dips";  // for rep goals
  target:       number;       // reps / level / streak days
  completed:    boolean;
  completedAt?: number;
  createdAt:    number;
  pinned:       boolean;
}

// ─── Preset Goals ─────────────────────────────────────────────────────────────

export interface GoalPreset {
  id:          string;
  title:       string;
  description: string;
  type:        GoalType;
  skillId?:    string;
  skillName?:  "push-ups" | "pull-ups" | "dips";
  target:      number;
  icon:        string;
  difficulty:  "beginner" | "intermediate" | "advanced" | "elite";
}

export const GOAL_PRESETS: GoalPreset[] = [
  // Rep milestones
  { id: "gp_pu_20",   title: "20 Push-Ups",          description: "Hit 20 push-up reps in a single session",    type: "max_reps",   skillName: "push-ups", target: 20,   icon: "💪", difficulty: "beginner"     },
  { id: "gp_pu_50",   title: "50 Push-Ups",           description: "Hit 50 push-up reps in a single session",    type: "max_reps",   skillName: "push-ups", target: 50,   icon: "💪", difficulty: "intermediate" },
  { id: "gp_pu_100",  title: "100 Push-Ups",          description: "Hit 100 push-up reps in a single session",   type: "max_reps",   skillName: "push-ups", target: 100,  icon: "🔥", difficulty: "advanced"     },
  { id: "gp_pl_10",   title: "10 Pull-Ups",           description: "Hit 10 pull-up reps in a single session",    type: "max_reps",   skillName: "pull-ups", target: 10,   icon: "🦅", difficulty: "beginner"     },
  { id: "gp_pl_20",   title: "20 Pull-Ups",           description: "Hit 20 pull-up reps in a single session",    type: "max_reps",   skillName: "pull-ups", target: 20,   icon: "🦅", difficulty: "intermediate" },
  { id: "gp_pl_30",   title: "30 Pull-Ups",           description: "Hit 30 pull-up reps in a single session",    type: "max_reps",   skillName: "pull-ups", target: 30,   icon: "👑", difficulty: "advanced"     },
  { id: "gp_dip_20",  title: "20 Dips",               description: "Hit 20 dip reps in a single session",        type: "max_reps",   skillName: "dips",     target: 20,   icon: "⚡", difficulty: "beginner"     },
  { id: "gp_dip_50",  title: "50 Dips",               description: "Hit 50 dip reps in a single session",        type: "max_reps",   skillName: "dips",     target: 50,   icon: "⚡", difficulty: "intermediate" },
  // Skill tree goals
  { id: "gp_skill_mu",    title: "Muscle-Up",         description: "Unlock the Muscle-Up in the Skill Tree",     type: "skill",      skillId: "muscle-up",       target: 1, icon: "🏆", difficulty: "elite"        },
  { id: "gp_skill_fl",    title: "Front Lever",       description: "Unlock the Front Lever in the Skill Tree",   type: "skill",      skillId: "front-lever",     target: 1, icon: "🎯", difficulty: "elite"        },
  { id: "gp_skill_hf",    title: "Human Flag",        description: "Unlock the Human Flag in the Skill Tree",    type: "skill",      skillId: "human-flag",      target: 1, icon: "🚩", difficulty: "elite"        },
  { id: "gp_skill_hs",    title: "Handstand",         description: "Unlock the Handstand in the Skill Tree",     type: "skill",      skillId: "handstand",       target: 1, icon: "🤸", difficulty: "advanced"     },
  { id: "gp_skill_plmu",  title: "Planche",           description: "Unlock the Planche in the Skill Tree",       type: "skill",      skillId: "planche",         target: 1, icon: "💎", difficulty: "elite"        },
  { id: "gp_skill_pispu", title: "Pistol Squat",      description: "Unlock the Pistol Squat in the Skill Tree",  type: "skill",      skillId: "pistol-squat",    target: 1, icon: "🦵", difficulty: "intermediate" },
  // Level goals
  { id: "gp_lvl_10",  title: "Reach Level 10",        description: "Grind your way to Level 10",                 type: "level",      target: 10,  icon: "⬆️", difficulty: "beginner"     },
  { id: "gp_lvl_25",  title: "Reach Level 25",        description: "Hit the 25-level milestone",                 type: "level",      target: 25,  icon: "⬆️", difficulty: "intermediate" },
  { id: "gp_lvl_50",  title: "Reach Level 50",        description: "Half way to the century",                    type: "level",      target: 50,  icon: "👑", difficulty: "advanced"     },
  { id: "gp_lvl_100", title: "Reach Level 100",       description: "Become a Legend",                            type: "level",      target: 100, icon: "🌟", difficulty: "elite"        },
  // Streak goals
  { id: "gp_str_7",   title: "7-Day Streak",          description: "Train for 7 consecutive days",               type: "streak",     target: 7,   icon: "🔥", difficulty: "beginner"     },
  { id: "gp_str_30",  title: "30-Day Streak",         description: "Train for 30 consecutive days",              type: "streak",     target: 30,  icon: "🔥", difficulty: "advanced"     },
];

// ─── User Profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  // Identity (future-proofed for social)
  profileId:    string;
  name:         string;
  displayName:  string;
  bio:          string;

  // Fitness info
  age:           number | null;
  heightCm:      number | null;
  weightKg:      number | null;
  heightUnit:    HeightUnit;
  weightUnit:    WeightUnit;
  experience:    TrainingExperience;
  primarySport:  string;
  favoriteSkill: string;

  // Customization
  title:                    string;
  showcaseAchievementId:    string | null;
  showcaseSkillId:          string | null;

  // Goals
  goals: UserGoal[];

  // Social (not yet functional — architecture placeholder)
  visibility:  Visibility;
  friendIds:   string[];

  // Meta
  createdAt:   number;
  updatedAt:   number;
}

// ─── Default ──────────────────────────────────────────────────────────────────

export function defaultProfile(): UserProfile {
  return {
    profileId:    crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    name:         "",
    displayName:  "Athlete",
    bio:          "",
    age:          null,
    heightCm:     null,
    weightKg:     null,
    heightUnit:   "cm",
    weightUnit:   "kg",
    experience:   "beginner",
    primarySport: "Calisthenics",
    favoriteSkill: "",
    title:        "",
    showcaseAchievementId: null,
    showcaseSkillId:       null,
    goals:        [],
    visibility:   "private",
    friendIds:    [],
    createdAt:    Date.now(),
    updatedAt:    Date.now(),
  };
}
