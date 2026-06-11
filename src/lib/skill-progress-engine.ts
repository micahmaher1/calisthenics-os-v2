import {
  SkillDef,
  SkillRequirement,
  SkillSnapshot,
  SkillProgress,
  getReadinessFromPct,
} from "./skill-requirements-types";
import { ALL_SKILLS, SKILL_MAP, FEATURED_SKILLS } from "./skill-requirements-data";
import { AppState } from "./types";
import { MasteryState } from "./mastery-types";
import { JourneyState } from "./journey-types";
import { RecordsState } from "./records-types";
import { StreakState } from "./streak-types";
import { AchievementState } from "./achievement-types";
import { SkillTreeState } from "./skilltree-types";

// ─── Snapshot Builder ─────────────────────────────────────────────────────────

export function buildSkillSnapshot(params: {
  appState:     AppState;
  masteryState: MasteryState;
  journeyState: JourneyState;
  recState:     RecordsState;
  streakState:  StreakState;
  achState:     AchievementState;
  treeState:    SkillTreeState;
}): SkillSnapshot {
  const { appState, masteryState, journeyState, recState, streakState, achState, treeState } = params;

  // Mastery levels: category → level
  const masteryLevels: Record<string, number> = {};
  for (const [cat, cm] of Object.entries(masteryState.categories)) {
    masteryLevels[cat] = cm.level;
  }

  // Journey stages: journeyId → number of completed stages
  const journeyStages: Record<string, number> = {};
  for (const [id, prog] of Object.entries(journeyState.journeyProgress)) {
    journeyStages[id] = prog.completedStageIds.length;
  }

  // Records: exercise name (lowercase, underscored) → best value
  const records: Record<string, number> = {};
  for (const [key, trackedRec] of Object.entries(recState.records)) {
    if (trackedRec.current) {
      // Store under original key (normalised) and also a simplified variant
      const normalised = key.toLowerCase().replace(/[\s-]+/g, "_");
      records[normalised] = trackedRec.current.value;
      // Also store under the exercise name itself
      const byName = trackedRec.exerciseName.toLowerCase().replace(/[\s-]+/g, "_");
      if (!records[byName] || trackedRec.current.value > records[byName]) {
        records[byName] = trackedRec.current.value;
      }
    }
  }

  // Unlocked achievements
  const unlockedAchievementIds = Object.entries(achState.progress)
    .filter(([, p]) => p.unlocked)
    .map(([id]) => id);

  // Unlocked skill ids from tree (completed nodes)
  const unlockedSkillIds = Object.entries(treeState.progress)
    .filter(([, p]) => p.status === "completed")
    .map(([nodeId]) => nodeId);

  return {
    level:          appState.level,
    totalXP:        appState.totalXP,
    workoutCount:   appState.workouts.length,
    longestStreak:  streakState.daily.longest,
    masteryLevels,
    journeyStages,
    records,
    unlockedAchievementIds,
    unlockedSkillIds,
  };
}

// ─── Requirement Checker ──────────────────────────────────────────────────────

export function checkRequirement(
  req: SkillRequirement,
  snap: SkillSnapshot,
): { met: boolean; current: number; pct: number } {
  let current = 0;
  let met = false;

  switch (req.type) {
    case "mastery_level": {
      current = snap.masteryLevels[req.target] ?? 0;
      met = current >= req.value;
      break;
    }
    case "journey_stage": {
      current = snap.journeyStages[req.target] ?? 0;
      met = current >= req.value;
      break;
    }
    case "record_reps":
    case "record_seconds": {
      // Try exact match first, then partial match
      const targetKey = req.target.toLowerCase().replace(/[\s-]+/g, "_");
      current = snap.records[targetKey] ?? 0;
      if (current === 0) {
        // Try partial match
        for (const [k, v] of Object.entries(snap.records)) {
          if (k.includes(targetKey) || targetKey.includes(k)) {
            current = Math.max(current, v);
          }
        }
      }
      met = current >= req.value;
      break;
    }
    case "level": {
      current = snap.level;
      met = current >= req.value;
      break;
    }
    case "xp": {
      current = snap.totalXP;
      met = current >= req.value;
      break;
    }
    case "achievement": {
      current = snap.unlockedAchievementIds.includes(req.target) ? 1 : 0;
      met = current === 1;
      return { met, current, pct: met ? 100 : 0 };
    }
    case "workout_count": {
      current = snap.workoutCount;
      met = current >= req.value;
      break;
    }
    case "streak_days": {
      current = snap.longestStreak;
      met = current >= req.value;
      break;
    }
    case "skill_unlocked": {
      current = snap.unlockedSkillIds.includes(req.target) ? 1 : 0;
      met = current === 1;
      return { met, current, pct: met ? 100 : 0 };
    }
    default:
      return { met: false, current: 0, pct: 0 };
  }

  const pct = req.value > 0 ? Math.min(100, Math.round((current / req.value) * 100)) : (met ? 100 : 0);
  return { met, current, pct };
}

// ─── Skill Progress Calculator ────────────────────────────────────────────────

export function calcSkillProgress(skill: SkillDef, snap: SkillSnapshot): SkillProgress {
  if (skill.requirements.length === 0) {
    return {
      skillId:             skill.id,
      pct:                 100,
      readiness:           "ready",
      metRequirements:     [],
      unmetRequirements:   [],
      requirementProgress: [],
      nextSteps:           [],
    };
  }

  const requirementProgress = skill.requirements.map((req) => {
    const { met, current, pct } = checkRequirement(req, snap);
    return { req, met, current, pct };
  });

  const metRequirements   = requirementProgress.filter((r) => r.met).map((r) => r.req);
  const unmetRequirements = requirementProgress.filter((r) => !r.met).map((r) => r.req);

  // Overall pct = average of all requirement pcts
  const totalPct = requirementProgress.reduce((sum, r) => sum + r.pct, 0);
  const avgPct   = Math.round(totalPct / requirementProgress.length);
  // Cap at 99 if not all met
  const pct = metRequirements.length === skill.requirements.length ? 100 : Math.min(99, avgPct);

  const readiness = getReadinessFromPct(pct);

  // Next steps: top 3 unmet requirements sorted by pct descending (closest to met)
  const unmetSorted = requirementProgress
    .filter((r) => !r.met)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  const nextSteps = unmetSorted.map((r) => {
    const progress = r.pct > 0 ? ` (${r.pct}% there — ${r.current}/${r.req.value})` : ` (${r.current}/${r.req.value})`;
    return `${r.req.label}${progress}`;
  });

  return {
    skillId: skill.id,
    pct,
    readiness,
    metRequirements,
    unmetRequirements,
    requirementProgress,
    nextSteps,
  };
}

// ─── Bulk Calculator ──────────────────────────────────────────────────────────

export function calcAllSkillProgress(
  skills: SkillDef[],
  snap: SkillSnapshot,
): Record<string, SkillProgress> {
  const result: Record<string, SkillProgress> = {};
  for (const skill of skills) {
    result[skill.id] = calcSkillProgress(skill, snap);
  }
  return result;
}

// ─── Top Skills by Readiness ──────────────────────────────────────────────────

export function getTopSkillsByReadiness(
  progressMap: Record<string, SkillProgress>,
  count: number,
  filterFeatured?: boolean,
): Array<{ skill: SkillDef; progress: SkillProgress }> {
  let skills = filterFeatured ? FEATURED_SKILLS : ALL_SKILLS;

  return skills
    .map((skill) => ({ skill, progress: progressMap[skill.id] }))
    .filter((x) => x.progress !== undefined)
    .sort((a, b) => b.progress.pct - a.progress.pct)
    .slice(0, count);
}

// ─── Recommended Next Skill ───────────────────────────────────────────────────

export function getRecommendedNextSkill(
  progressMap: Record<string, SkillProgress>,
): { skill: SkillDef; progress: SkillProgress } | null {
  // Featured skills first, sorted by pct descending (closest to ready)
  const candidates = FEATURED_SKILLS
    .map((skill) => ({ skill, progress: progressMap[skill.id] }))
    .filter((x) => x.progress && x.progress.pct < 100)
    .sort((a, b) => b.progress.pct - a.progress.pct);

  if (candidates.length > 0) return candidates[0];

  // Fall back to all skills
  const allCandidates = ALL_SKILLS
    .map((skill) => ({ skill, progress: progressMap[skill.id] }))
    .filter((x) => x.progress && x.progress.pct < 100)
    .sort((a, b) => b.progress.pct - a.progress.pct);

  return allCandidates[0] ?? null;
}
