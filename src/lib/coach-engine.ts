import { Workout } from "@/lib/types";
import { AppState } from "@/lib/types";
import { SkillTreeState } from "@/lib/skilltree-types";
import { AchievementState } from "@/lib/achievement-types";
import { QuestState } from "@/lib/quest-types";
import { RecordsState } from "@/lib/records-types";
import { StreakState } from "@/lib/streak-types";
import { UserProfile } from "@/lib/profile-types";
import { DAILY_MILESTONES } from "@/lib/streak-engine";
import { getAllBranchStats } from "@/lib/skilltree-engine";
import { ACHIEVEMENTS } from "@/lib/achievement-data";
import { buildSnapshot, evaluateAchievement } from "@/lib/achievement-utils";
import { loadTreeState } from "@/lib/skilltree-engine";
import {
  CoachSettings, CoachAnalysis, CoachRecommendation, CoachFocus,
  CoachInsight, MilestoneForecast, TrainingBalance, TrainingCategory,
  RecommendationType, RecommendationPriority, CoachPersonality,
} from "@/lib/coach-types";
import { MasteryState, MASTERY_CATEGORY_META } from "@/lib/mastery-types";

// ─── Date utils ───────────────────────────────────────────────────────────────

function todayMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function daysAgo(n: number): number {
  return todayMs() - n * 86_400_000;
}

function daysBetween(a: number, b: number): number {
  return Math.round(Math.abs(b - a) / 86_400_000);
}

function workoutsInWindow(workouts: Workout[], from: number): Workout[] {
  return workouts.filter((w) => w.timestamp >= from);
}

// ─── Workout Categoriser ──────────────────────────────────────────────────────

export function categorizeWorkout(w: Workout): TrainingCategory {
  const n = w.name.toLowerCase();
  const s = w.skillName ?? "";
  if (s === "push-ups" || /push.?up|chest|dip|press|incline|decline/i.test(n)) return "push";
  if (s === "pull-ups" || /pull.?up|chin.?up|row|muscle.?up|lat/i.test(n))     return "pull";
  if (s === "dips"     || /\bdip\b/i.test(n))                                   return "push";
  if (/plank|hollow|l.?sit|ab |core|crunch|tuck|pike|v.?up|dragon/i.test(n))   return "core";
  if (/squat|lunge|pistol|leg|glute|hip|hamstring|calf/i.test(n))               return "legs";
  if (/stretch|mobil|flex|yoga|split|joint|hip.?open/i.test(n))                 return "mobility";
  if (/handstand|balance|flag|frog|crow|planche/i.test(n))                      return "balance";
  if (/clap|explosive|plyom|jump|sprint|bound|burst/i.test(n))                  return "explosive";
  return "general";
}

// ─── Training Balance ─────────────────────────────────────────────────────────

const ALL_CATS: TrainingCategory[] = ["push","pull","core","legs","mobility","balance","explosive","general"];

function emptyCountMap(): Record<TrainingCategory, number> {
  return Object.fromEntries(ALL_CATS.map((c) => [c, 0])) as Record<TrainingCategory, number>;
}

export function buildTrainingBalance(workouts: Workout[]): TrainingBalance {
  const from14 = daysAgo(14);
  const from7  = daysAgo(7);
  const recent14 = workoutsInWindow(workouts, from14);
  const recent7  = workoutsInWindow(workouts, from7);

  const counts  = emptyCountMap();
  const counts7 = emptyCountMap();
  for (const w of recent14) counts[categorizeWorkout(w)]++;
  for (const w of recent7)  counts7[categorizeWorkout(w)]++;

  // Days since last workout of each category
  const daysSince: Record<TrainingCategory, number | null> = Object.fromEntries(
    ALL_CATS.map((cat) => {
      const last = workouts.filter((w) => categorizeWorkout(w) === cat).sort((a, b) => b.timestamp - a.timestamp)[0];
      return [cat, last ? daysBetween(last.timestamp, Date.now()) : null];
    })
  ) as Record<TrainingCategory, number | null>;

  return {
    counts,
    counts7,
    daysSince,
    total14: recent14.length,
    total7:  recent7.length,
  };
}

// ─── Personality voice ────────────────────────────────────────────────────────

export function personalityVoice(personality: CoachPersonality, type: RecommendationType, message: string): string {
  switch (personality) {
    case "drill_sergeant":
      return `LISTEN UP — ${message}`;
    case "wise_master":
      return message; // wise masters let facts speak
    case "elite_athlete":
      return `Data indicates: ${message}`;
    case "calm_coach":
      return message; // calm coaches use the message as-is with gentler titles
    default: // rpg_mentor
      return message;
  }
}

// ─── XP / Level helpers ───────────────────────────────────────────────────────

const XP_PER_LEVEL = 100;

function xpToNextLevel(totalXP: number): number {
  const currentLevelXP = totalXP % XP_PER_LEVEL;
  return XP_PER_LEVEL - currentLevelXP;
}

function avgXPPerDay(workouts: Workout[], days = 7): number {
  const from = daysAgo(days);
  const recent = workoutsInWindow(workouts, from);
  const totalXP = recent.reduce((s, w) => s + (w.xpEarned ?? 25), 0);
  return totalXP / days;
}

// ─── Recommendation builder ───────────────────────────────────────────────────

let _seq = 0;
function makeRec(
  type: RecommendationType,
  priority: RecommendationPriority,
  icon: string,
  title: string,
  message: string,
  opts: Partial<Pick<CoachRecommendation, "detail" | "actionLabel" | "actionHref" | "xpReward">> = {},
): CoachRecommendation {
  return {
    id:          `${type}-${++_seq}-${Date.now()}`,
    type,
    priority,
    icon,
    title,
    message,
    detail:       opts.detail,
    actionLabel:  opts.actionLabel,
    actionHref:   opts.actionHref,
    xpReward:     opts.xpReward,
    dismissed:    false,
    generatedAt:  Date.now(),
  };
}

function makeInsight(
  id: string,
  type: CoachInsight["type"],
  icon: string,
  message: string,
  metric?: string,
): CoachInsight {
  return { id, type, icon, message, metric };
}

// ─── Main Analysis Engine ─────────────────────────────────────────────────────

export function runCoachAnalysis(
  appState:     AppState,
  streakState:  StreakState,
  achState:     AchievementState,
  questState:   QuestState,
  recState:     RecordsState,
  profile:      UserProfile,
  settings:     CoachSettings,
  masteryState?: MasteryState,
  skillProgressMap?: Record<string, import("./skill-requirements-types").SkillProgress>,
  standardsProgressMap?: Record<string, import("./movement-standards-types").StandardProgress>,
): CoachAnalysis {
  const personality = settings.personality;
  const goal        = settings.selectedGoal;
  const workouts    = appState.workouts;
  const balance     = buildTrainingBalance(workouts);
  const recs: CoachRecommendation[] = [];
  const insights: CoachInsight[]    = [];
  const forecasts: MilestoneForecast[] = [];

  // ── 1. Streak coaching ─────────────────────────────────────────────────────
  const { daily, weekly } = streakState;
  const todayKey = new Date().toISOString().slice(0, 10);
  const workedOutToday = workouts.some((w) => {
    const d = new Date(w.timestamp);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}` === todayKey;
  });

  if (daily.current > 0 && !workedOutToday) {
    recs.push(makeRec(
      "streak_warning", "critical", "🔥",
      personality === "drill_sergeant" ? "PROTECT YOUR STREAK" : personality === "rpg_mentor" ? "Streak at Risk!" : "Don't Break Your Streak",
      `You have a ${daily.current}-day streak. Log a workout today to keep it alive!`,
      { actionLabel: "Log Workout", actionHref: "/", xpReward: 10 },
    ));
  }

  // Approaching streak milestone
  const nextMs = DAILY_MILESTONES.find((m) => m.days > daily.current && m.days <= daily.current + 5);
  if (nextMs && workedOutToday) {
    recs.push(makeRec(
      "streak_milestone", "high", nextMs.icon,
      `${nextMs.days - daily.current} Days from ${nextMs.label}!`,
      `Keep training daily — you're ${nextMs.days - daily.current} day${nextMs.days - daily.current > 1 ? "s" : ""} away from +${nextMs.xpReward} XP!`,
      { xpReward: nextMs.xpReward },
    ));
  }

  // Weekly streak warning
  const weeklyNeed = Math.max(0, 3 - weekly.currentWeekWorkouts);
  if (weeklyNeed > 0 && weeklyNeed <= 2) {
    recs.push(makeRec(
      "weekly_streak_warning", "medium", "⚔️",
      "Weekly Streak at Risk",
      `${weeklyNeed} more workout${weeklyNeed > 1 ? "s" : ""} needed this week to maintain your ${weekly.current}-week streak.`,
      { actionLabel: "Log Workout", actionHref: "/" },
    ));
  }

  // ── 2. Training balance ────────────────────────────────────────────────────
  const { counts, daysSince } = balance;

  // Push/pull imbalance
  const pushCount = counts.push;
  const pullCount = counts.pull;
  if (pushCount + pullCount >= 3) {
    const ratio = pullCount === 0 ? 999 : pushCount / pullCount;
    if (ratio >= 2.5) {
      recs.push(makeRec(
        "training_balance", "high", "🧲",
        "Push/Pull Imbalance Detected",
        `You've done ${pushCount} push workouts vs only ${pullCount} pull workouts in the last 2 weeks. Pull training is critical for posture and injury prevention.`,
        { actionLabel: "Log Pull Workout", actionHref: "/", xpReward: 25 },
      ));
    } else if (ratio <= 0.4) {
      recs.push(makeRec(
        "training_balance", "high", "💪",
        "Push Training Lagging",
        `${pullCount} pull vs ${pushCount} push workouts in 14 days. Balance your training with more push work.`,
        { actionLabel: "Log Push Workout", actionHref: "/" },
      ));
    }
  }

  // Neglected categories (no training in 14+ days, but user has worked out)
  if (workouts.length >= 5) {
    const neglectThreshold = 14;
    for (const cat of ["pull", "core", "legs"] as TrainingCategory[]) {
      const days = daysSince[cat];
      if (days !== null && days >= neglectThreshold) {
        recs.push(makeRec(
          "category_neglect", "medium", "⚠️",
          `${cat.charAt(0).toUpperCase() + cat.slice(1)} Training Neglected`,
          `You haven't done ${cat} training in ${days} days. Consistent ${cat} work prevents imbalances and improves overall performance.`,
          { actionLabel: "Log Workout", actionHref: "/" },
        ));
      } else if (days === null && counts.push + counts.pull + counts.core + counts.legs >= 3) {
        // Never done this category
        recs.push(makeRec(
          "category_neglect", "low", "🆕",
          `Try ${cat.charAt(0).toUpperCase() + cat.slice(1)} Training`,
          `You haven't logged any ${cat} workouts yet. Adding ${cat} training will accelerate your overall progress.`,
          { actionLabel: "Log Workout", actionHref: "/" },
        ));
      }
    }
  }

  // ── 3. XP / Level coaching ────────────────────────────────────────────────
  const xpNeeded  = xpToNextLevel(appState.totalXP);
  const xpPerDay  = avgXPPerDay(workouts, 7);
  const daysToLevel = xpPerDay > 0 ? Math.ceil(xpNeeded / xpPerDay) : null;

  if (xpNeeded <= 50) {
    recs.push(makeRec(
      "xp_level_up", "high", "⬆️",
      `Level ${appState.level + 1} is Close!`,
      `Only ${xpNeeded} XP to reach Level ${appState.level + 1}. One workout gets you there!`,
      { actionLabel: "Log Workout", actionHref: "/", xpReward: xpNeeded },
    ));
  } else if (xpNeeded <= 100 && questState) {
    const dailyDone   = questState.daily.quests.filter((q) => q.completed).length;
    const dailyTotal  = questState.daily.quests.length;
    const pendingXP   = questState.daily.quests.filter((q) => !q.completed).reduce((s, q) => s + q.rewardXP, 0);
    if (pendingXP >= xpNeeded) {
      recs.push(makeRec(
        "xp_level_up", "high", "⬆️",
        "Complete Quests to Level Up",
        `You need ${xpNeeded} XP to level up. Today's ${dailyTotal - dailyDone} remaining quests offer ${pendingXP} XP — enough to get you there.`,
        { actionLabel: "View Quests", actionHref: "/quests", xpReward: pendingXP },
      ));
    }
  }

  // ── 4. Quest coaching ─────────────────────────────────────────────────────
  if (questState) {
    const dailyPending = questState.daily.quests.filter((q) => !q.completed);
    const weeklyPending = questState.weekly.quests.filter((q) => !q.completed);

    if (dailyPending.length > 0) {
      const totalXP = dailyPending.reduce((s, q) => s + q.rewardXP, 0);
      recs.push(makeRec(
        "quest_reminder", "medium", "⚔️",
        `${dailyPending.length} Daily Quest${dailyPending.length > 1 ? "s" : ""} Remaining`,
        `Complete your remaining daily quests for +${totalXP} XP. Resets at midnight.`,
        { actionLabel: "View Quests", actionHref: "/quests", xpReward: totalXP },
      ));
    }

    if (weeklyPending.length > 0 && dailyPending.length === 0) {
      const totalXP = weeklyPending.reduce((s, q) => s + q.rewardXP, 0);
      recs.push(makeRec(
        "quest_reminder", "low", "📅",
        `${weeklyPending.length} Weekly Quest${weeklyPending.length > 1 ? "s" : ""} Open`,
        `Your weekly quests are still available. Complete them for +${totalXP} XP before the week resets.`,
        { actionLabel: "View Quests", actionHref: "/quests", xpReward: totalXP },
      ));
    }
  }

  // ── 5. Record coaching ────────────────────────────────────────────────────
  if (recState) {
    const allRecords = Object.values(recState.records ?? {});
    for (const rec of allRecords) {
      if (!rec.current) continue;
      const daysSinceRec = daysBetween(new Date(rec.current.dateAchieved).getTime(), Date.now());
      if (daysSinceRec >= 21) {
        recs.push(makeRec(
          "record_plateau", "low", "📊",
          `${rec.exerciseName} Record Plateau`,
          `Your ${rec.exerciseName} PR (${rec.current.value} ${rec.current.unit}) hasn't improved in ${daysSinceRec} days. Focus here to break through.`,
          { actionLabel: "View Records", actionHref: "/records" },
        ));
        break; // only show one plateau warning to avoid noise
      }
    }

    // Recent improvement (last 7 days)
    for (const rec of allRecords) {
      if (!rec.current) continue;
      const daysSinceRec = daysBetween(new Date(rec.current.dateAchieved).getTime(), Date.now());
      if (daysSinceRec <= 3 && rec.current.improvement && rec.current.improvement > 0) {
        const pct = rec.current.previousValue
          ? Math.round((rec.current.improvement / rec.current.previousValue) * 100)
          : 0;
        insights.push(makeInsight(
          `rec-improve-${rec.exerciseName}`,
          "improvement",
          "📈",
          `${rec.exerciseName} PR improved by ${pct > 0 ? pct + "%" : rec.current.improvement + " " + rec.current.unit}`,
          `${rec.current.previousValue} → ${rec.current.value} ${rec.current.unit}`,
        ));
        break;
      }
    }
  }

  // ── 6. Skill tree coaching ────────────────────────────────────────────────
  const treeState = loadTreeState();
  const branchStats = getAllBranchStats(treeState.progress);

  // Find the branch closest to completing current tier
  let bestBranch: string | null = null;
  let bestPercent = 0;
  for (const [branch, stats] of Object.entries(branchStats)) {
    if (stats.percent > bestPercent && stats.percent < 100) {
      bestPercent = stats.percent;
      bestBranch = branch;
    }
  }

  if (bestBranch && bestPercent >= 50) {
    const branchMeta: Record<string, string> = { push: "Push 💪", pull: "Pull 🧲", core: "Core 🔥", skill: "Skill 🤸" };
    recs.push(makeRec(
      "skill_opportunity", "medium", "🌳",
      `${branchMeta[bestBranch] ?? bestBranch} Branch at ${bestPercent}%`,
      `You're making strong progress in the ${bestBranch} branch. Complete the remaining nodes to unlock advanced skills.`,
      { actionLabel: "View Skill Tree", actionHref: "/tree" },
    ));
  }

  // Available nodes (nodes you can work on right now)
  const availableNodes = Object.entries(treeState.progress)
    .filter(([, p]) => p.status === "available" || p.status === "in_progress")
    .length;
  if (availableNodes > 0) {
    insights.push(makeInsight(
      "skill-available",
      "tip",
      "🌳",
      `${availableNodes} skill${availableNodes > 1 ? "s" : ""} available to work on in the skill tree`,
      `${availableNodes} available`,
    ));
  }

  // ── 7. Achievement coaching ───────────────────────────────────────────────
  const snapshot = buildSnapshot(appState, treeState);
  const closeAchievements: { name: string; pct: number }[] = [];

  for (const ach of ACHIEVEMENTS) {
    if (achState.progress[ach.id]?.unlocked || ach.secret) continue;
    const { current, target } = evaluateAchievement(ach.id, snapshot, achState);
    if (target > 0 && current > 0) {
      const pct = Math.round((current / target) * 100);
      if (pct >= 75 && pct < 100) {
        closeAchievements.push({ name: ach.name, pct });
      }
    }
  }

  if (closeAchievements.length > 0) {
    closeAchievements.sort((a, b) => b.pct - a.pct);
    const top = closeAchievements[0];
    recs.push(makeRec(
      "achievement_close", "medium", "🏆",
      `${top.pct}% of "${top.name}"`,
      `You're ${100 - top.pct}% away from unlocking "${top.name}". Keep pushing — you're close!`,
      { actionLabel: "View Achievements", actionHref: "/achievements" },
    ));
  }

  // ── 8. Goal alignment ─────────────────────────────────────────────────────
  if (goal === "skills" && bestPercent < 25 && workouts.length >= 3) {
    recs.push(makeRec(
      "goal_alignment", "low", "🌳",
      "Skill Tree Goal Unlocked",
      "Your goal is unlocking skills. The fastest path is working on available skill tree nodes.`,",
      { actionLabel: "View Skill Tree", actionHref: "/tree" },
    ));
  } else if (goal === "endurance" && counts.core < 2 && balance.total14 >= 3) {
    recs.push(makeRec(
      "goal_alignment", "low", "⏱️",
      "Add Core Work for Endurance",
      "For endurance goals, core training is essential. Try planks, hollow body holds, or L-sits.",
      { actionLabel: "Log Workout", actionHref: "/" },
    ));
  }

  // ── 9. Consistency insight ────────────────────────────────────────────────
  if (balance.total7 === 0 && workouts.length > 0) {
    recs.push(makeRec(
      "consistency_warning", "high", "📅",
      "No Workouts This Week",
      "You haven't logged any workouts this week. Getting back on track is easier than you think — even a short session counts!",
      { actionLabel: "Log Workout", actionHref: "/", xpReward: 25 },
    ));
  } else if (balance.total7 >= 5) {
    insights.push(makeInsight("high-volume", "strength", "⚡", `${balance.total7} workouts logged this week — exceptional consistency!`, `${balance.total7} this week`));
  }

  // ── 10. Strength/weakness insights ────────────────────────────────────────
  const { push, pull } = balance.counts;

  // Strengths
  if (push >= 4) insights.push(makeInsight("push-strong",  "strength", "💪", `Strong push training — ${push} push workouts in 14 days`, `${push} sessions`));
  if (pull >= 4) insights.push(makeInsight("pull-strong",  "strength", "🧲", `Consistent pull training — ${pull} pull workouts in 14 days`, `${pull} sessions`));
  if (daily.current >= 7)  insights.push(makeInsight("streak-strong", "strength", "🔥", `${daily.current}-day daily streak shows real commitment`, `${daily.current} days`));
  if (weekly.current >= 2) insights.push(makeInsight("wkly-strong",   "strength", "⚔️", `${weekly.current} consecutive weeks of 3+ workouts`, `${weekly.current} weeks`));

  // Weaknesses
  if (pull < 1 && push >= 3) insights.push(makeInsight("pull-weak", "weakness", "⚠️", "Pull training is missing — critical for upper body balance", "0 pull sessions"));
  if (balance.counts.core < 1 && balance.total14 >= 4)
    insights.push(makeInsight("core-weak", "weakness", "⚠️", "No core work in 14 days — core strength underlies all calisthenics", "0 core sessions"));
  if (balance.total14 < 3 && workouts.length >= 5)
    insights.push(makeInsight("low-vol", "weakness", "📉", "Training frequency is low — aim for 3+ sessions per week for best results", `${balance.total14} in 14d`));

  // ── 11. Milestone forecasts ────────────────────────────────────────────────

  // Level up forecast
  const xpLeft = xpToNextLevel(appState.totalXP);
  if (xpPerDay > 0) {
    forecasts.push({
      id:            "level-up",
      label:         `Level ${appState.level + 1}`,
      icon:          "⬆️",
      estimatedDays: Math.ceil(xpLeft / xpPerDay),
      current:       appState.totalXP % XP_PER_LEVEL,
      target:        XP_PER_LEVEL,
      description:   `${xpLeft} XP remaining at ~${Math.round(xpPerDay)} XP/day`,
      type:          "level",
      confidence:    xpPerDay >= 20 ? "high" : "medium",
    });
  }

  // Streak milestone forecast
  const nextStreakMs = DAILY_MILESTONES.find((m) => m.days > daily.current);
  if (nextStreakMs) {
    const daysNeeded = nextStreakMs.days - daily.current;
    forecasts.push({
      id:            "streak-milestone",
      label:         nextStreakMs.label,
      icon:          nextStreakMs.icon,
      estimatedDays: daily.current > 0 ? daysNeeded : null,
      current:       daily.current,
      target:        nextStreakMs.days,
      description:   daily.current > 0
        ? `${daysNeeded} consecutive days required (+${nextStreakMs.xpReward} XP)`
        : "Start a daily streak to unlock milestone rewards",
      type:          "streak",
      confidence:    "high",
    });
  }

  // Skill branch forecast
  for (const [branch, stats] of Object.entries(branchStats)) {
    if (stats.percent < 100 && stats.percent > 0) {
      const remaining = stats.total - stats.completed;
      const completedLast14 = balance.total14 > 0 ? Math.max(1, Math.floor(stats.completed / Math.max(1, workouts.length / 14))) : null;
      const branchIcons: Record<string, string> = { push: "💪", pull: "🧲", core: "🔥", skill: "🤸" };
      forecasts.push({
        id:            `branch-${branch}`,
        label:         `${branch.charAt(0).toUpperCase() + branch.slice(1)} Branch Complete`,
        icon:          branchIcons[branch] ?? "🌳",
        estimatedDays: null,
        current:       stats.completed,
        target:        stats.total,
        description:   `${remaining} node${remaining > 1 ? "s" : ""} remaining (${stats.percent}% complete)`,
        type:          "skill_branch",
        confidence:    "low",
      });
      break; // just the most progressed one
    }
  }

  // ── 12. Mastery analysis ──────────────────────────────────────────────────
  if (masteryState) {
    const cats = Object.keys(masteryState.categories) as Array<keyof typeof masteryState.categories>;
    const sorted = [...cats].sort(
      (a, b) => masteryState.categories[a].level - masteryState.categories[b].level
    );
    const lowest  = sorted[0];
    const highest = sorted[sorted.length - 1];
    const lowestLevel  = masteryState.categories[lowest].level;
    const highestLevel = masteryState.categories[highest].level;

    if (highestLevel - lowestLevel > 10 && highestLevel > 1) {
      const lowestMeta  = MASTERY_CATEGORY_META[lowest];
      const highestMeta = MASTERY_CATEGORY_META[highest];
      recs.push(makeRec(
        "mastery_imbalance", "medium", "⭐",
        `${lowestMeta.label} Mastery Falling Behind`,
        `Your ${lowestMeta.label} mastery (Lv. ${lowestLevel}) is significantly behind ${highestMeta.label} (Lv. ${highestLevel}). Try: ${lowestMeta.keywords.slice(0, 3).join(", ")}.`,
        { actionLabel: "View Mastery", actionHref: "/mastery" },
      ));
    }

    if (highestLevel >= 5) {
      insights.push(makeInsight(
        "mastery-top",
        "strength",
        MASTERY_CATEGORY_META[highest].icon,
        `${MASTERY_CATEGORY_META[highest].label} mastery is your strongest at Level ${highestLevel}`,
        `Lv. ${highestLevel}`,
      ));
    }
  }

  // ── 13. Skill readiness coaching ──────────────────────────────────────────
  if (skillProgressMap) {
    const { SKILL_MAP } = require("./skill-requirements-data");
    const candidates = Object.entries(skillProgressMap)
      .filter(([, p]) => (p as import("./skill-requirements-types").SkillProgress).pct < 100)
      .sort((a, b) => (b[1] as import("./skill-requirements-types").SkillProgress).pct - (a[1] as import("./skill-requirements-types").SkillProgress).pct);
    if (candidates.length > 0) {
      const [topId, topProg] = candidates[0] as [string, import("./skill-requirements-types").SkillProgress];
      if (topProg.pct >= 70) {
        const skillDef = SKILL_MAP[topId];
        const topUnmet = topProg.unmetRequirements[0];
        const detail   = topUnmet ? `Focus on: ${topUnmet.label}` : undefined;
        recs.push(makeRec(
          "skill_readiness", "medium", "🎯",
          `${topProg.pct}% Ready: ${skillDef?.name ?? topId}`,
          `You are ${topProg.pct}% ready to unlock ${skillDef?.name ?? topId}. Keep training to meet the remaining requirements.`,
          { detail, actionLabel: "View Skills", actionHref: "/skills" },
        ));
      }
    }
  }

  // ── 14. Standards upgrade coaching ───────────────────────────────────────
  if (standardsProgressMap) {
    const { calcStandardsAnalytics } = require("./movement-standards-engine");
    const { MOVEMENT_STANDARDS } = require("./movement-standards-data");
    const { STANDARD_RANK_META } = require("./movement-standards-types");
    try {
      const stdAnalytics = calcStandardsAnalytics(standardsProgressMap);
      if (stdAnalytics.closestUpgrade) {
        const { standard, progress } = stdAnalytics.closestUpgrade;
        if (progress.pct >= 60 && progress.nextRank) {
          const nextLabel = STANDARD_RANK_META[progress.nextRank]?.label ?? progress.nextRank;
          const remainStr = progress.remaining !== null && standard.measureType !== "qualitative"
            ? `You are ${progress.remaining} ${standard.unit} away from `
            : `You are close to `;
          recs.push(makeRec(
            "standards_upgrade", "medium", "🏅",
            `Close to ${nextLabel} ${standard.name}`,
            `${remainStr}${nextLabel} ${standard.name}. Focus on ${standard.name} to hit your next rank.`,
            { actionLabel: "View Standards", actionHref: "/standards" },
          ));
        }
      }
    } catch {
      // ignore errors from dynamic require
    }
  }

  // ── Sort recommendations by priority ─────────────────────────────────────
  const priorityOrder: Record<RecommendationPriority, number> = {
    critical: 0, high: 1, medium: 2, low: 3,
  };
  recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // ── 13. Today's Focus ─────────────────────────────────────────────────────
  let todayFocus: CoachFocus | null = null;
  const topRec = recs[0];
  if (topRec) {
    const focusTitles: Partial<Record<RecommendationType, string>> = {
      streak_warning:        "Protect Your Streak",
      training_balance:      "Balance Your Training",
      xp_level_up:           "Level Up Today",
      quest_reminder:        "Complete Quests",
      category_neglect:      "Add Missing Training",
      skill_opportunity:     "Advance Skill Tree",
      consistency_warning:   "Get Back on Track",
      achievement_close:     "Unlock Achievement",
    };

    todayFocus = {
      title:          focusTitles[topRec.type] ?? topRec.title,
      subtitle:       topRec.message,
      icon:           topRec.icon,
      xpReward:       topRec.xpReward,
      recommendation: topRec,
      urgent:         topRec.priority === "critical",
    };
  }

  // ── 14. Separate insights by type ─────────────────────────────────────────
  const strengths          = insights.filter((i) => i.type === "strength");
  const weaknesses         = insights.filter((i) => i.type === "weakness");
  const recentImprovements = insights.filter((i) => i.type === "improvement");

  return {
    todayFocus,
    recommendations:    recs,
    trainingBalance:    balance,
    insights,
    milestoneForecasts: forecasts,
    strengths,
    weaknesses,
    recentImprovements,
    generatedAt:        Date.now(),
  };
}
