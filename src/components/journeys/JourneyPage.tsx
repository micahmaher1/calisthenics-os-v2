"use client";

import { useEffect, useState } from "react";
import { JourneyDef, JourneyState, JourneyProgress } from "@/lib/journey-types";
import { JourneyDifficulty } from "@/lib/journey-types";
import {
  loadJourneyState, saveJourneyState, startJourney,
  markManualRequirement, claimStageReward, completeJourney,
} from "@/lib/journey-storage";
import { ALL_JOURNEYS, FEATURED_JOURNEYS, JOURNEY_DIFFICULTY_META } from "@/lib/journey-data";
import {
  buildJourneySnapshot, evaluateJourneyProgress, JourneySnapshot,
} from "@/lib/journey-utils";
import { loadState, saveState } from "@/lib/storage";
import { loadStreakState } from "@/lib/streak-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { loadTreeState } from "@/lib/skilltree-engine";
import { calcLevel } from "@/lib/xp";
import JourneyCard from "./JourneyCard";
import JourneyMap from "./JourneyMap";
import PageHeader from "@/components/ui/PageHeader";

type Tab = "all" | "active" | "completed";

export default function JourneyPage() {
  const [journeyState, setJourneyState] = useState<JourneyState | null>(null);
  const [snap,         setSnap]         = useState<JourneySnapshot | null>(null);
  const [activeTab,    setActiveTab]    = useState<Tab>("all");
  const [diffFilter,   setDiffFilter]   = useState<JourneyDifficulty | "all">("all");
  const [catFilter,    setCatFilter]    = useState<string>("all");

  function loadAll(js?: JourneyState) {
    const appState    = loadState();
    const streakState = loadStreakState();
    const recState    = loadRecordsState();
    const treeState   = loadTreeState();
    const jState      = js ?? loadJourneyState();

    const activeId  = jState.activeJourneyId;
    const manualChecks = activeId ? (jState.journeyProgress[activeId]?.manualChecks ?? {}) : {};
    const snapshot  = buildJourneySnapshot(appState, streakState, recState, treeState, manualChecks);

    // Evaluate active journey progress
    if (activeId) {
      const def = ALL_JOURNEYS.find((j) => j.id === activeId);
      const prog = jState.journeyProgress[activeId];
      if (def && prog) {
        const { newProgress, newlyCompletedStages } = evaluateJourneyProgress(def, prog, snapshot);
        if (newlyCompletedStages.length > 0 || newProgress.currentStageIndex !== prog.currentStageIndex) {
          jState.journeyProgress[activeId] = newProgress;
          // Check if all stages complete
          if (newProgress.completedStageIds.length === def.stages.length && !newProgress.completedAt) {
            const updated = completeJourney(activeId);
            setJourneyState(updated);
            setSnap(snapshot);
            return;
          }
          saveJourneyState(jState);
        }
      }
    }

    setJourneyState(jState);
    setSnap(snapshot);
  }

  useEffect(() => { loadAll(); }, []);

  function handleStart(journeyId: string) {
    const newState = startJourney(journeyId);
    setActiveTab("active");
    loadAll(newState);
  }

  function handleMarkManual(key: string) {
    if (!journeyState?.activeJourneyId) return;
    const newState = markManualRequirement(journeyState.activeJourneyId, key);
    loadAll(newState);
  }

  function handleClaimReward(stageId: string) {
    if (!journeyState?.activeJourneyId) return;
    const activeId = journeyState.activeJourneyId;
    const def = ALL_JOURNEYS.find((j) => j.id === activeId);
    if (!def) return;
    const stage = def.stages.find((s) => s.id === stageId);
    if (!stage) return;

    // Grant XP and coins
    const appState = loadState();
    const newXP = appState.totalXP + stage.reward.xp;
    const newCoins = appState.coins + stage.reward.coins;
    saveState({
      ...appState,
      totalXP: newXP,
      coins:   newCoins,
      level:   calcLevel(newXP),
    });

    // Update journey progress totals
    const jState = loadJourneyState();
    if (jState.journeyProgress[activeId]) {
      jState.journeyProgress[activeId].totalXPEarned    += stage.reward.xp;
      jState.journeyProgress[activeId].totalCoinsEarned += stage.reward.coins;
      saveJourneyState(jState);
    }

    const newState = claimStageReward(activeId, stageId);
    loadAll(newState);
  }

  if (!journeyState || !snap) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🗺️</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING JOURNEYS</span>
        </div>
      </div>
    );
  }

  const activeJourneyDef = journeyState.activeJourneyId
    ? ALL_JOURNEYS.find((j) => j.id === journeyState.activeJourneyId)
    : null;
  const activeProgress = journeyState.activeJourneyId
    ? journeyState.journeyProgress[journeyState.activeJourneyId] ?? null
    : null;

  const completedJourneys = ALL_JOURNEYS.filter((j) => journeyState.completedJourneyIds.includes(j.id));

  const filteredJourneys = ALL_JOURNEYS.filter((j) => {
    if (diffFilter !== "all" && j.difficulty !== diffFilter) return false;
    if (catFilter !== "all" && j.category !== catFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(ALL_JOURNEYS.map((j) => j.category)));

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "all",       label: "All Journeys",  icon: "🗺️" },
    { id: "active",    label: "Active Journey", icon: "🎯" },
    { id: "completed", label: "Completed",      icon: "✅" },
  ];

  return (
    <div className="min-h-screen bg-surface-900 overflow-x-hidden">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8 pt-0">
      <PageHeader icon="🗺️" title="SKILL JOURNEYS" subtitle="Epic Progression Campaigns" />
      {/* Stats bar */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <StatChip icon="🚀" label="Started"   value={journeyState.totalJourneysStarted.toString()} />
        <StatChip icon="🏆" label="Completed" value={journeyState.totalJourneysCompleted.toString()} />
        {activeJourneyDef && (
          <StatChip icon="🎯" label="Active" value={activeJourneyDef.name} />
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-mono text-[9px] uppercase tracking-widest transition-all flex-shrink-0 ${
              activeTab === tab.id
                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                : "bg-white/3 border-white/10 text-white/40 hover:bg-white/5"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* All Journeys Tab */}
      {activeTab === "all" && (
        <>
          {/* Featured */}
          {FEATURED_JOURNEYS.length > 0 && diffFilter === "all" && catFilter === "all" && (
            <div className="mb-8">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-3">⭐ Featured Journeys</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FEATURED_JOURNEYS.map((j) => (
                  <JourneyCard
                    key={j.id}
                    def={j}
                    progress={journeyState.journeyProgress[j.id] ?? null}
                    snap={snap}
                    onStart={() => handleStart(j.id)}
                    onContinue={() => setActiveTab("active")}
                    isActive={journeyState.activeJourneyId === j.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2 flex-wrap mb-4">
            {(["all", "beginner", "intermediate", "advanced", "elite", "legendary"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDiffFilter(d)}
                className={`px-2.5 py-1 rounded-lg border font-mono text-[9px] uppercase tracking-widest transition-all ${
                  diffFilter === d
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/3 border-white/8 text-white/35 hover:bg-white/5"
                }`}
              >
                {d === "all" ? "All" : (JOURNEY_DIFFICULTY_META[d as JourneyDifficulty].icon + " " + JOURNEY_DIFFICULTY_META[d as JourneyDifficulty].label)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap mb-6">
            <button
              onClick={() => setCatFilter("all")}
              className={`px-2.5 py-1 rounded-lg border font-mono text-[9px] uppercase tracking-widest transition-all ${
                catFilter === "all" ? "bg-white/10 border-white/20 text-white" : "bg-white/3 border-white/8 text-white/35 hover:bg-white/5"
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`px-2.5 py-1 rounded-lg border font-mono text-[9px] uppercase tracking-widest transition-all ${
                  catFilter === c ? "bg-white/10 border-white/20 text-white" : "bg-white/3 border-white/8 text-white/35 hover:bg-white/5"
                }`}
              >
                {c.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJourneys.map((j) => (
              <JourneyCard
                key={j.id}
                def={j}
                progress={journeyState.journeyProgress[j.id] ?? null}
                snap={snap}
                onStart={() => handleStart(j.id)}
                onContinue={() => setActiveTab("active")}
                isActive={journeyState.activeJourneyId === j.id}
              />
            ))}
          </div>
        </>
      )}

      {/* Active Journey Tab */}
      {activeTab === "active" && (
        <>
          {!activeJourneyDef || !activeProgress ? (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">🗺️</span>
              <p className="font-display text-xl tracking-wide text-white/60 mb-2">No Active Journey</p>
              <p className="font-body text-sm text-white/35 mb-6">Select a journey from the All Journeys tab to start your quest.</p>
              <button
                onClick={() => setActiveTab("all")}
                className="px-6 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
              >
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">Browse Journeys →</span>
              </button>
            </div>
          ) : (
            <div>
              {/* Journey header */}
              <div className="mb-6 p-4 rounded-2xl bg-surface-800 border border-white/8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{activeJourneyDef.icon}</span>
                  <div>
                    <h2 className="font-display text-xl tracking-wide text-white">{activeJourneyDef.name}</h2>
                    <p className="font-mono text-[9px] text-white/30">{activeJourneyDef.subtitle}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-white/35">
                  <span className="font-mono text-[9px]">
                    📍 {activeProgress.completedStageIds.length}/{activeJourneyDef.stages.length} stages
                  </span>
                  <span className="font-mono text-[9px]">
                    ⚡ {activeProgress.totalXPEarned} XP earned
                  </span>
                  <span className="font-mono text-[9px]">
                    ⏱️ Started {new Date(activeProgress.startedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <JourneyMap
                def={activeJourneyDef}
                progress={activeProgress}
                snap={snap}
                onMarkManual={handleMarkManual}
                onClaimReward={handleClaimReward}
              />

              {/* Switch journey button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setActiveTab("all")}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/3 hover:bg-white/5 transition-all"
                >
                  <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Switch Journey →</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Completed Tab */}
      {activeTab === "completed" && (
        <>
          {completedJourneys.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">🏆</span>
              <p className="font-display text-xl tracking-wide text-white/60 mb-2">No Completed Journeys</p>
              <p className="font-body text-sm text-white/35">Complete your first journey to see it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedJourneys.map((j) => (
                <JourneyCard
                  key={j.id}
                  def={j}
                  progress={journeyState.journeyProgress[j.id] ?? null}
                  snap={snap}
                  onStart={() => {}}
                  onContinue={() => {}}
                  isActive={false}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
    </div>
  );
}

function StatChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800 border border-white/8">
      <span className="text-sm">{icon}</span>
      <div>
        <p className="font-mono text-[8px] uppercase tracking-widest text-white/30">{label}</p>
        <p className="font-mono text-xs text-white">{value}</p>
      </div>
    </div>
  );
}
