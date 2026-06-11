import {
  HubState, SmartPriority, TrainingScore, LegendaryTarget, RecentActivity,
} from "./training-hub-types";
import { ALL_JOURNEYS, JOURNEY_MAP } from "./journey-data";
import { calcGlobalMasteryScore } from "./mastery-types";
import { JourneyState } from "./journey-types";
import { AppState } from "./types";
import { AchievementState } from "./achievement-types";

type PartialHub = Omit<HubState, "trainingScore" | "smartPriority" | "legendaryTarget" | "recentActivity">;

export function calcTrainingScore(hubState: PartialHub): TrainingScore {
  const { appState, masteryState, streakState, questState, achState, journeyState } = hubState;

  const xpScore      = appState.level * 10;
  const masteryScore = calcGlobalMasteryScore(masteryState);
  const streakScore  = streakState.daily.current * 5;
  const questScore   = (questState.stats.totalCompleted ?? 0) * 2;
  const achieveScore = Object.values(achState.progress).filter((p) => p.unlocked).length * 3;

  let totalStages = 0;
  let completedStages = 0;
  for (const j of ALL_JOURNEYS) {
    totalStages += j.stages.length;
    const prog = journeyState.journeyProgress[j.id];
    if (prog) completedStages += prog.completedStageIds.length;
  }
  const journeyScore = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  const total = xpScore + masteryScore + streakScore + questScore + achieveScore + journeyScore;

  let rank      = "Novice Athlete";
  let rankColor = "text-slate-400";
  if (total >= 2000)      { rank = "Legendary Champion";    rankColor = "text-yellow-400"; }
  else if (total >= 1000) { rank = "Master Warrior";        rankColor = "text-purple-400"; }
  else if (total >= 500)  { rank = "Elite Athlete";         rankColor = "text-orange-400"; }
  else if (total >= 200)  { rank = "Skilled Practitioner";  rankColor = "text-sky-400";    }
  else if (total >= 75)   { rank = "Rising Warrior";        rankColor = "text-green-400";  }

  return {
    total,
    breakdown: { xpScore, masteryScore, streakScore, questScore, achieveScore, journeyScore },
    rank,
    rankColor,
  };
}

export function calcSmartPriority(hubState: PartialHub): SmartPriority {
  const { streakState, questState, coachAnalysis, journeyState, appState } = hubState;

  const todayStr = new Date().toDateString();
  const workedOutToday = appState.workouts.some(
    (w) => new Date(w.timestamp).toDateString() === todayStr,
  );

  if (!workedOutToday && streakState.daily.current > 0) {
    return {
      action:   "Log a Workout to Save Your Streak",
      reason:   `Your ${streakState.daily.current}-day streak is at risk!`,
      benefits: ["Protect streak", "+25 XP", "Daily quest progress"],
      xpValue:  25,
      urgency:  "critical",
      icon:     "🔥",
      href:     "/workouts",
    };
  }

  if (journeyState.activeJourneyId) {
    const def  = JOURNEY_MAP[journeyState.activeJourneyId];
    const prog = journeyState.journeyProgress[journeyState.activeJourneyId];
    if (def && prog) {
      const currentStage = def.stages[prog.currentStageIndex];
      if (currentStage) {
        return {
          action:   `Train for ${currentStage.name}`,
          reason:   `Advance your ${def.name}`,
          benefits: [`+${currentStage.reward.xp} XP on completion`, "Journey progress", "Mastery XP"],
          xpValue:  currentStage.reward.xp,
          urgency:  "high",
          icon:     def.icon,
          href:     "/journeys",
        };
      }
    }
  }

  const pendingQuests = (questState.daily?.quests ?? []).filter((q) => !q.completed);
  if (pendingQuests.length > 0) {
    const totalPendingXP = pendingQuests.reduce((s, q) => s + (q.rewardXP ?? 0), 0);
    return {
      action:   "Complete Daily Quests",
      reason:   `${pendingQuests.length} quest${pendingQuests.length > 1 ? "s" : ""} remaining today`,
      benefits: [`+${totalPendingXP} XP available`, "Coin rewards", "Achievement progress"],
      xpValue:  totalPendingXP,
      urgency:  "high",
      icon:     "⚔️",
      href:     "/quests",
    };
  }

  if (coachAnalysis?.recommendations?.[0]) {
    const rec = coachAnalysis.recommendations[0];
    return {
      action:   rec.title,
      reason:   rec.message,
      benefits: rec.xpReward ? [`+${rec.xpReward} XP`] : ["Progress boost"],
      xpValue:  rec.xpReward ?? 0,
      urgency:  rec.priority === "critical" ? "critical" : rec.priority === "high" ? "high" : "medium",
      icon:     rec.icon,
      href:     rec.actionHref ?? "/workouts",
    };
  }

  return {
    action:   "Log Today's Workout",
    reason:   "Consistent training is the key to mastery",
    benefits: ["+25 XP", "+10 Coins", "Mastery XP", "Streak progress"],
    xpValue:  25,
    urgency:  "medium",
    icon:     "🏋️",
    href:     "/workouts",
  };
}

export function findLegendaryTarget(journeyState: JourneyState): LegendaryTarget | null {
  const featuredJourneys = ALL_JOURNEYS.filter(
    (j) => j.featured || j.difficulty === "legendary" || j.difficulty === "elite",
  );

  let best: LegendaryTarget | null = null;
  let bestPct = -1;

  for (const def of featuredJourneys) {
    const prog = journeyState.journeyProgress[def.id];
    if (!prog) continue;
    const pct = (prog.completedStageIds.length / def.stages.length) * 100;
    if (pct > bestPct) {
      bestPct = pct;
      const currentStage = def.stages[prog.currentStageIndex] ?? def.stages[def.stages.length - 1];
      best = {
        journeyDef:      def,
        progress:        prog,
        overallPct:      Math.round(pct),
        stageName:       currentStage?.name ?? "Complete",
        stagesLeft:      def.stages.length - prog.completedStageIds.length,
        topRequirements: currentStage?.requirements.slice(0, 3).map((r) => r.label) ?? [],
      };
    }
  }

  if (!best && featuredJourneys.length > 0) {
    const def = featuredJourneys[0];
    best = {
      journeyDef:      def,
      progress:        null,
      overallPct:      0,
      stageName:       def.stages[0]?.name ?? "Begin",
      stagesLeft:      def.stages.length,
      topRequirements: def.stages[0]?.requirements.slice(0, 3).map((r) => r.label) ?? [],
    };
  }

  return best;
}

export function buildRecentActivity(
  appState: AppState,
  achState: AchievementState,
  journeyState: JourneyState,
): RecentActivity[] {
  const activities: RecentActivity[] = [];

  const recentWorkouts = [...appState.workouts]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  for (const w of recentWorkouts) {
    activities.push({
      type:      "workout",
      title:     w.name,
      subtitle:  `+${w.xpEarned} XP · +${w.coins} Coins`,
      icon:      "🏋️",
      timestamp: w.timestamp,
      xpGained:  w.xpEarned,
    });
  }

  const unlockedEntries = Object.entries(achState.progress)
    .filter(([, p]) => p.unlocked && p.unlockedAt)
    .map(([id, p]) => ({ id, ts: p.unlockedAt as number }))
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 3);

  for (const { id, ts } of unlockedEntries) {
    activities.push({
      type:      "achievement",
      title:     "Achievement Unlocked",
      subtitle:  id.replace(/_/g, " "),
      icon:      "🏆",
      timestamp: ts,
    });
  }

  return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
}
