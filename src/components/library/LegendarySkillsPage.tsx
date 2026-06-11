"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import LegendarySkillCard from "./LegendarySkillCard";
import { LibraryState } from "@/lib/library-types";
import { loadLibraryState, saveLibraryState, toggleFavoriteSkill, setGoalSkill } from "@/lib/library-storage";
import { LIBRARY_SKILLS, SKILL_LIBRARY_MAP } from "@/lib/library-data";
import { getLegendarySkillsByReadiness } from "@/lib/library-utils";
import { SkillProgress } from "@/lib/skill-requirements-types";
import { loadState } from "@/lib/storage";
import { loadMasteryState } from "@/lib/mastery-storage";
import { loadJourneyState } from "@/lib/journey-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { loadStreakState } from "@/lib/streak-storage";
import { loadAchievementState } from "@/lib/achievement-storage";
import { loadTreeState } from "@/lib/skilltree-engine";
import { buildSkillSnapshot, calcAllSkillProgress } from "@/lib/skill-progress-engine";
import { ALL_SKILLS } from "@/lib/skill-requirements-data";

type DomainFilter = "all" | "push" | "pull" | "static" | "balance" | "core";

export default function LegendarySkillsPage() {
  const [libraryState,    setLibraryState]    = useState<LibraryState | null>(null);
  const [progressMap,     setProgressMap]     = useState<Record<string, SkillProgress>>({});
  const [domainFilter,    setDomainFilter]    = useState<DomainFilter>("all");
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    const appState     = loadState();
    const masteryState = loadMasteryState();
    const journeyState = loadJourneyState();
    const recState     = loadRecordsState();
    const streakState  = loadStreakState();
    const achState     = loadAchievementState();
    const treeState    = loadTreeState();

    const snap = buildSkillSnapshot({
      appState, masteryState, journeyState,
      recState, streakState, achState, treeState,
    });
    const pm = calcAllSkillProgress(ALL_SKILLS, snap);
    setProgressMap(pm);
    setLibraryState(loadLibraryState());
    setLoading(false);
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    toggleFavoriteSkill(id);
    setLibraryState(loadLibraryState());
  }, []);

  const handleSetGoal = useCallback((id: string) => {
    const s = loadLibraryState();
    setGoalSkill(s.goalSkillId === id ? null : id);
    setLibraryState(loadLibraryState());
  }, []);

  if (loading || !libraryState) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🌟</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING LEGENDS</span>
        </div>
      </div>
    );
  }

  const legendarySkills = getLegendarySkillsByReadiness(progressMap);
  const filtered = domainFilter === "all"
    ? legendarySkills
    : legendarySkills.filter((x) => x.skill.domain === domainFilter || x.skill.tags.includes(domainFilter));

  const goalSkill   = libraryState.goalSkillId ? SKILL_LIBRARY_MAP[libraryState.goalSkillId] : null;
  const goalProgress = goalSkill ? (progressMap[goalSkill.id] ?? null) : null;

  const almostReady  = legendarySkills.filter((x) => (x.progress?.pct ?? 0) >= 76).length;
  const completed    = libraryState.completedSkillIds.length;
  const tracked      = libraryState.trackedSkillIds.length;

  const domainTabs: Array<{ key: DomainFilter; label: string; icon: string }> = [
    { key: "all",     label: "All",     icon: "🌟" },
    { key: "pull",    label: "Pull",    icon: "🔼" },
    { key: "push",    label: "Push",    icon: "💪" },
    { key: "static",  label: "Static",  icon: "🏛️" },
    { key: "balance", label: "Balance", icon: "⚖️" },
    { key: "core",    label: "Core",    icon: "📐" },
  ];

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#eab308 1px,transparent 1px),linear-gradient(90deg,#eab308 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-yellow-500/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <PageHeader
          icon="🌟"
          title="LEGENDARY SKILLS"
          subtitle="The Pinnacle of Calisthenics"
          backHref="/"
          backLabel="Dashboard"
        />

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-surface-800 border border-white/8 rounded-xl p-3 text-center">
            <div className="font-display text-2xl text-yellow-400">{legendarySkills.length}</div>
            <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">Total Legendary</div>
          </div>
          <div className="bg-surface-800 border border-white/8 rounded-xl p-3 text-center">
            <div className="font-display text-2xl text-cyan-400">{tracked}</div>
            <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">Skills Tracked</div>
          </div>
          <div className="bg-surface-800 border border-white/8 rounded-xl p-3 text-center">
            <div className="font-display text-2xl text-orange-400">{almostReady}</div>
            <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">Almost Ready</div>
          </div>
          <div className="bg-surface-800 border border-white/8 rounded-xl p-3 text-center">
            <div className="font-display text-2xl text-green-400">{completed}</div>
            <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mt-1">Completed</div>
          </div>
        </div>

        {/* Goal skill hero */}
        {goalSkill && (
          <div className="mb-6 bg-surface-800 border border-yellow-500/30 rounded-2xl p-5 shadow-lg shadow-yellow-500/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🎯</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-yellow-400">Your Goal</span>
              <button
                onClick={() => {
                  setGoalSkill(null);
                  setLibraryState(loadLibraryState());
                }}
                className="ml-auto font-mono text-[9px] text-white/30 hover:text-white/60 border border-white/10 px-2 py-0.5 rounded-lg transition-colors"
              >
                Change Goal
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{goalSkill.icon}</span>
              <div className="flex-1">
                <h2 className="font-display text-xl tracking-wide text-white mb-1">{goalSkill.name}</h2>
                <p className="text-sm text-white/50 mb-3">{goalSkill.description}</p>
                {goalProgress && goalProgress.nextSteps.length > 0 && (
                  <div className="space-y-1">
                    <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1.5">Next Steps</div>
                    {goalProgress.nextSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                        <span className="text-yellow-400 flex-shrink-0 mt-0.5">→</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 text-center">
                <div className="font-display text-3xl text-yellow-400">{goalProgress?.pct ?? 0}%</div>
                <div className="font-mono text-[9px] text-white/30 uppercase">Readiness</div>
              </div>
            </div>
          </div>
        )}

        {/* Domain filter tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {domainTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setDomainFilter(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-[10px] uppercase tracking-widest transition-all ${
                domainFilter === tab.key
                  ? "border-yellow-500/50 bg-yellow-500/15 text-yellow-400"
                  : "border-white/10 bg-white/3 text-white/40 hover:border-white/20 hover:text-white/70"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Skills grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl mb-3 block">🔒</span>
            <p className="font-display text-xl text-white/30 tracking-wide">No skills in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(({ skill, progress }) => (
              <LegendarySkillCard
                key={skill.id}
                skill={skill}
                progress={progress}
                libraryState={libraryState}
                onToggleFavorite={() => handleToggleFavorite(skill.id)}
                onSetGoal={() => handleSetGoal(skill.id)}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/30 mb-3">Explore all progressions and skill details</p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 font-mono text-[11px] uppercase tracking-widest hover:bg-yellow-500/20 transition-all"
          >
            <span>📚</span>
            <span>Open Progression Library</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
