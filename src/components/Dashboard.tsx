"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { AppState, SkillName, Workout } from "@/lib/types";
import { loadState, saveState, addWorkoutToState } from "@/lib/storage";
import {
  calcLevelProgress, calcXPToNextLevel, getRankLabel,
  XP_PER_WORKOUT, COINS_PER_WORKOUT,
} from "@/lib/xp";
import { generateId } from "@/lib/utils";
import {
  calcCurrentStreak, calcTodayStats, calcPersonalRecords,
} from "@/lib/stats";
import { loadTreeState, getTotalCompleted, getTotalNodes } from "@/lib/skilltree-engine";
import { loadAchievementState, saveAchievementState } from "@/lib/achievement-storage";
import { buildSnapshot, checkAchievements, computeStats } from "@/lib/achievement-utils";
import { ACHIEVEMENT_MAP } from "@/lib/achievement-data";
import { AchievementDef } from "@/lib/achievement-types";
import { loadQuestState, saveQuestState, loadWeekBaseline } from "@/lib/quest-storage";
import { evaluateQuests, thisWeekKey } from "@/lib/quest-engine";
import { QuestState, ActiveQuest } from "@/lib/quest-types";
import { loadRecordsState, saveRecordsState } from "@/lib/records-storage";
import { evaluateRecords } from "@/lib/records-engine";
import { RecordsState, NewRecordResult } from "@/lib/records-types";

import Header       from "./Header";
import HeroStats    from "./HeroStats";
import SkillsGrid   from "./SkillsGrid";
import WorkoutLogger from "./WorkoutLogger";
import WorkoutHistory from "./WorkoutHistory";
import WorkoutCompleteModal, { WorkoutResult } from "./WorkoutCompleteModal";
import RankProgressCard from "./RankProgressCard";
import ProgressInsights from "./ProgressInsights";
import DashboardQuests from "./quests/DashboardQuests";
import QuestToast, { QuestNotification } from "./quests/QuestToast";
import DashboardRecords from "./records/DashboardRecords";

export default function Dashboard() {
  const [state,           setState]          = useState<AppState | null>(null);
  const [treePercent,     setTreePercent]    = useState(0);
  const [achPercent,      setAchPercent]     = useState(0);
  const [workoutResult,   setWorkoutResult]  = useState<WorkoutResult | null>(null);
  const [questState,      setQuestState]     = useState<QuestState | null>(null);
  const [questNotif,      setQuestNotif]     = useState<QuestNotification | null>(null);
  const [questQueue,      setQuestQueue]     = useState<QuestNotification[]>([]);
  const [recState,        setRecState]       = useState<RecordsState | null>(null);
  const stateRef = useRef<AppState | null>(null);

  // Keep ref in sync for synchronous access in callbacks
  useEffect(() => { stateRef.current = state; }, [state]);

  // Drain quest notification queue
  useEffect(() => {
    if (!questNotif && questQueue.length > 0) {
      setQuestNotif(questQueue[0]);
      setQuestQueue((q) => q.slice(1));
    }
  }, [questNotif, questQueue]);

  // Hydrate
  useEffect(() => {
    const appState  = loadState();
    setState(appState);

    const treeState = loadTreeState();
    const total     = getTotalNodes();
    const done      = getTotalCompleted(treeState.progress);
    setTreePercent(total > 0 ? Math.round((done / total) * 100) : 0);

    const achState = loadAchievementState();
    const achStats = computeStats(achState);
    setAchPercent(achStats.completionPct);

    // Evaluate quests on load
    const wk         = thisWeekKey();
    const skillCount = getTotalCompleted(treeState.progress);
    const baseline   = loadWeekBaseline(wk, skillCount, appState.level);
    const rawQuests  = loadQuestState();
    const { newState: newQuestState, newlyCompleted, bonusXP, bonusCoins } =
      evaluateQuests(rawQuests, appState, treeState, appState.level, baseline.skillsUnlocked, baseline.level);

    // Grant quest rewards
    let finalState = appState;
    const totalQuestXP    = newlyCompleted.reduce((s, q) => s + q.rewardXP, 0) + bonusXP;
    const totalQuestCoins = newlyCompleted.reduce((s, q) => s + q.rewardCoins, 0) + bonusCoins;
    if (totalQuestXP > 0 || totalQuestCoins > 0) {
      finalState = {
        ...appState,
        totalXP: appState.totalXP + totalQuestXP,
        coins:   appState.coins   + totalQuestCoins,
        level:   Math.floor((appState.totalXP + totalQuestXP) / 100) + 1,
      };
      saveState(finalState);
      setState(finalState);
    }
    saveQuestState(newQuestState);
    setQuestState(newQuestState);

    // Evaluate records on load
    const rawRec = loadRecordsState();
    const { newState: newRecState } = evaluateRecords(rawRec, appState.workouts);
    saveRecordsState(newRecState);
    setRecState(newRecState);

    // Queue notifications
    const notifs: QuestNotification[] = newlyCompleted.map((q) => ({ quest: q, isBonus: false }));
    if (bonusXP > 0) notifs.push({ quest: newlyCompleted[0] ?? rawQuests.daily.quests[0], bonusXP, bonusCoins, isBonus: true });
    if (notifs.length > 0) setQuestQueue(notifs);
  }, []);

  const handleAddWorkout = useCallback(
    (data: { name: string; skillName: SkillName | null; reps: number; notes: string }) => {
      const prev = stateRef.current;
      if (!prev) return;

      const workout: Workout = {
        id:        generateId(),
        name:      data.name,
        skillName: data.skillName,
        reps:      data.reps,
        notes:     data.notes,
        xpEarned:  XP_PER_WORKOUT,
        coins:     COINS_PER_WORKOUT,
        timestamp: Date.now(),
      };

      const next = addWorkoutToState(prev, workout);
      saveState(next);
      setState(next);

      // Synchronous achievement check
      const treeState    = loadTreeState();
      const snapshot     = buildSnapshot(next, treeState);
      const prevAchState = loadAchievementState();
      const { newState: newAchState, newlyUnlocked } = checkAchievements(prevAchState, snapshot);
      if (newlyUnlocked.length > 0) {
        saveAchievementState(newAchState);
        setAchPercent(computeStats(newAchState).completionPct);
      }

      // Synchronous quest check
      const wk         = thisWeekKey();
      const skillCount = getTotalCompleted(treeState.progress);
      const baseline   = loadWeekBaseline(wk, skillCount, prev.level);
      const rawQuests  = loadQuestState();
      const { newState: newQuestState, newlyCompleted: newQuests, bonusXP, bonusCoins } =
        evaluateQuests(rawQuests, next, treeState, prev.level, baseline.skillsUnlocked, baseline.level);

      // Apply quest rewards on top of next state
      let finalNext = next;
      const questXP    = newQuests.reduce((s, q) => s + q.rewardXP, 0) + bonusXP;
      const questCoins = newQuests.reduce((s, q) => s + q.rewardCoins, 0) + bonusCoins;
      if (questXP > 0 || questCoins > 0) {
        finalNext = {
          ...next,
          totalXP: next.totalXP + questXP,
          coins:   next.coins   + questCoins,
          level:   Math.floor((next.totalXP + questXP) / 100) + 1,
        };
        saveState(finalNext);
        setState(finalNext);
      }
      saveQuestState(newQuestState);
      setQuestState(newQuestState);

      // Queue quest notifications
      const questNotifs: QuestNotification[] = newQuests.map((q) => ({ quest: q, isBonus: false }));
      if (bonusXP > 0) {
        questNotifs.push({ quest: newQuests[0] ?? rawQuests.daily.quests[0], bonusXP, bonusCoins, isBonus: true });
      }
      if (questNotifs.length > 0) {
        setQuestQueue((prev) => [...prev, ...questNotifs]);
      }

      const newAchievements: AchievementDef[] = newlyUnlocked
        .map((id) => ACHIEVEMENT_MAP[id])
        .filter(Boolean);

      // Re-evaluate records after workout
      const rawRec2    = loadRecordsState();
      const { newState: newRecState2, newRecords } = evaluateRecords(rawRec2, finalNext.workouts);
      saveRecordsState(newRecState2);
      setRecState(newRecState2);

      setWorkoutResult({
        workout,
        prevLevel:       prev.level,
        newLevel:        finalNext.level,
        prevRank:        getRankLabel(prev.level),
        newRank:         getRankLabel(finalNext.level),
        streak:          calcCurrentStreak(finalNext.workouts),
        coinsEarned:     COINS_PER_WORKOUT,
        newAchievements,
        totalXP:         finalNext.totalXP,
        newRecords:      newRecords.filter((r) => r.oldValue !== null && r.improvement !== null && r.improvement > 0),
      });
    },
    []
  );

  if (!state) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">⚡</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING OS</span>
        </div>
      </div>
    );
  }

  const levelProgress  = calcLevelProgress(state.totalXP);
  const xpToNext       = calcXPToNextLevel(state.totalXP);
  const rank           = getRankLabel(state.level);
  const streak         = calcCurrentStreak(state.workouts);
  const { xp: todayXP, count: todayWorkouts } = calcTodayStats(state.workouts);
  const records        = calcPersonalRecords(state.workouts);

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#4ade80 1px,transparent 1px),linear-gradient(90deg,#4ade80 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-green-500/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Header rank={rank} level={state.level} />

        <HeroStats
          totalXP={state.totalXP}
          level={state.level}
          rank={rank}
          levelProgress={levelProgress}
          xpToNext={xpToNext}
          workoutCount={state.workouts.length}
          coins={state.coins}
          streak={streak}
          todayXP={todayXP}
          todayWorkouts={todayWorkouts}
          treePercent={treePercent}
          achPercent={achPercent}
          workouts={state.workouts}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <WorkoutLogger onAdd={handleAddWorkout} />
            {questState && <DashboardQuests questState={questState} />}
            <WorkoutHistory workouts={state.workouts} />
          </div>
          <div className="flex flex-col gap-5">
            <RankProgressCard level={state.level} />
            <ProgressInsights workouts={state.workouts} level={state.level} totalXP={state.totalXP} />
            {recState && <DashboardRecords recState={recState} />}
            <SkillsGrid skills={state.skills} records={records} />
          </div>
        </div>
      </div>

      <WorkoutCompleteModal
        result={workoutResult}
        onClose={() => setWorkoutResult(null)}
      />

      <QuestToast
        notification={questNotif}
        onDismiss={() => setQuestNotif(null)}
      />
    </div>
  );
}
