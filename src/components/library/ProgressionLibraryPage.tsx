"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import LegendarySkillCard from "./LegendarySkillCard";
import SkillLibraryCard from "./SkillLibraryCard";
import ProgressionChainView from "./ProgressionChainView";
import { LibraryState } from "@/lib/library-types";
import {
  loadLibraryState, saveLibraryState, toggleFavoriteSkill, toggleTrackedSkill, setGoalSkill,
} from "@/lib/library-storage";
import { LIBRARY_SKILLS, SKILL_LIBRARY_MAP, PROGRESSION_CHAINS } from "@/lib/library-data";
import {
  filterLibrarySkills, getLegendarySkillsByReadiness, getSkillChain, getNextProgression, getPreviousProgression,
} from "@/lib/library-utils";
import { SkillProgress, SKILL_TIER_META } from "@/lib/skill-requirements-types";
import { loadState } from "@/lib/storage";
import { loadMasteryState } from "@/lib/mastery-storage";
import { loadJourneyState } from "@/lib/journey-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { loadStreakState } from "@/lib/streak-storage";
import { loadAchievementState } from "@/lib/achievement-storage";
import { loadTreeState } from "@/lib/skilltree-engine";
import { buildSkillSnapshot, calcAllSkillProgress } from "@/lib/skill-progress-engine";
import { ALL_SKILLS } from "@/lib/skill-requirements-data";

type Tab = "legendary" | "all" | "progressions" | "journey";

export default function ProgressionLibraryPage() {
  const [activeTab,     setActiveTab]     = useState<Tab>("legendary");
  const [libraryState,  setLibraryState]  = useState<LibraryState | null>(null);
  const [progressMap,   setProgressMap]   = useState<Record<string, SkillProgress>>({});
  const [loading,       setLoading]       = useState(true);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [domainFilter,  setDomainFilter]  = useState("all");
  const [tierFilter,    setTierFilter]    = useState("all");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  useEffect(() => {
    const appState     = loadState();
    const masteryState = loadMasteryState();
    const journeyState = loadJourneyState();
    const recState     = loadRecordsState();
    const streakState  = loadStreakState();
    const achState     = loadAchievementState();
    const treeState    = loadTreeState();

    const snap = buildSkillSnapshot({
      appState, masteryState, journeyState, recState, streakState, achState, treeState,
    });
    const pm = calcAllSkillProgress(ALL_SKILLS, snap);
    setProgressMap(pm);
    setLibraryState(loadLibraryState());
    setLoading(false);
  }, []);

  const refreshLibraryState = useCallback(() => {
    setLibraryState(loadLibraryState());
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    toggleFavoriteSkill(id);
    refreshLibraryState();
  }, [refreshLibraryState]);

  const handleToggleTracked = useCallback((id: string) => {
    toggleTrackedSkill(id);
    refreshLibraryState();
  }, [refreshLibraryState]);

  const handleSetGoal = useCallback((id: string) => {
    const s = loadLibraryState();
    setGoalSkill(s.goalSkillId === id ? null : id);
    refreshLibraryState();
  }, [refreshLibraryState]);

  if (loading || !libraryState) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">📚</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING LIBRARY</span>
        </div>
      </div>
    );
  }

  const legendarySkills   = getLegendarySkillsByReadiness(progressMap);
  const filteredSkills     = filterLibrarySkills(LIBRARY_SKILLS, searchQuery, domainFilter, tierFilter);
  const selectedSkillDef   = selectedSkill ? SKILL_LIBRARY_MAP[selectedSkill] : null;
  const selectedProgress   = selectedSkill ? (progressMap[selectedSkill] ?? null) : null;
  const goalSkill          = libraryState.goalSkillId ? SKILL_LIBRARY_MAP[libraryState.goalSkillId] : null;
  const goalProgress       = goalSkill ? (progressMap[goalSkill.id] ?? null) : null;

  const TABS: Array<{ key: Tab; icon: string; label: string }> = [
    { key: "legendary",   icon: "🌟", label: "Legendary"   },
    { key: "all",         icon: "📋", label: "All Skills"  },
    { key: "progressions", icon: "🔗", label: "Progressions" },
    { key: "journey",     icon: "🎯", label: "My Journey"  },
  ];

  const domains = ["all", "push", "pull", "core", "legs", "balance", "mobility", "explosive", "static"];
  const tiers   = ["all", "beginner", "intermediate", "advanced", "elite", "legendary"];

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#94a3b8 1px,transparent 1px),linear-gradient(90deg,#94a3b8 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <PageHeader
          icon="📚"
          title="PROGRESSION LIBRARY"
          subtitle="The Calisthenics Encyclopedia"
          backHref="/"
          backLabel="Dashboard"
          actions={
            <Link
              href="/legendary-skills"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 font-mono text-[10px] hover:bg-yellow-500/20 transition-all"
            >
              <span>🌟</span><span className="hidden sm:inline">Legendary Skills</span>
            </Link>
          }
        />

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl border font-mono text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab.key
                  ? "border-sky-500/50 bg-sky-500/15 text-sky-400"
                  : "border-white/10 bg-white/3 text-white/40 hover:border-white/20 hover:text-white/70"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB: LEGENDARY */}
        {activeTab === "legendary" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {legendarySkills.map(({ skill, progress }) => (
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

        {/* TAB: ALL SKILLS */}
        {activeTab === "all" && (
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Left: search + grid */}
            <div className="flex-1 min-w-0">
              {/* Search + filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Search skills…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50"
                />
              </div>
              {/* Domain filter pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {domains.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDomainFilter(d)}
                    className={`px-3 py-1 rounded-full border font-mono text-[9px] uppercase tracking-widest transition-all ${
                      domainFilter === d
                        ? "border-sky-500/50 bg-sky-500/15 text-sky-400"
                        : "border-white/10 bg-white/3 text-white/30 hover:border-white/20"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {/* Tier filter pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {tiers.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTierFilter(t)}
                    className={`px-3 py-1 rounded-full border font-mono text-[9px] uppercase tracking-widest transition-all ${
                      tierFilter === t
                        ? "border-purple-500/50 bg-purple-500/15 text-purple-400"
                        : "border-white/10 bg-white/3 text-white/30 hover:border-white/20"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="font-mono text-[10px] text-white/30 mb-3">{filteredSkills.length} skills</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredSkills.map((skill) => (
                  <SkillLibraryCard
                    key={skill.id}
                    skill={skill}
                    progress={progressMap[skill.id] ?? null}
                    selected={selectedSkill === skill.id}
                    completed={libraryState.completedSkillIds.includes(skill.id)}
                    tracked={libraryState.trackedSkillIds.includes(skill.id)}
                    onClick={() => setSelectedSkill(selectedSkill === skill.id ? null : skill.id)}
                  />
                ))}
              </div>
            </div>

            {/* Right: detail panel */}
            {selectedSkillDef && (
              <div className="lg:w-80 xl:w-96 flex-shrink-0">
                <div className="sticky top-4 bg-surface-800 border border-white/10 rounded-2xl p-5 overflow-y-auto max-h-[calc(100vh-120px)]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{selectedSkillDef.icon}</span>
                    <div>
                      <h3 className="font-display text-lg tracking-wide text-white">{selectedSkillDef.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`font-mono text-[9px] ${SKILL_TIER_META[selectedSkillDef.tier].color}`}>
                          {SKILL_TIER_META[selectedSkillDef.tier].icon} {SKILL_TIER_META[selectedSkillDef.tier].label}
                        </span>
                        <span className="font-mono text-[9px] text-white/30 uppercase">{selectedSkillDef.domain}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-white/70 mb-1">{selectedSkillDef.description}</p>
                  <p className="text-xs text-white/40 mb-4 italic">{selectedSkillDef.purpose}</p>

                  {/* Benefits */}
                  <div className="mb-4">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-2">Benefits</div>
                    <ul className="space-y-1">
                      {selectedSkillDef.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                          <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Common Mistakes */}
                  <div className="mb-4">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-2">Common Mistakes</div>
                    <ul className="space-y-1">
                      {selectedSkillDef.commonMistakes.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                          <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>{m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Progression chain position */}
                  {(() => {
                    const chain = getSkillChain(selectedSkillDef.id);
                    if (!chain) return null;
                    const pos = chain.skills.indexOf(selectedSkillDef.id);
                    return (
                      <div className="mb-4 p-3 rounded-xl bg-sky-500/5 border border-sky-500/20">
                        <div className="font-mono text-[9px] uppercase tracking-widest text-sky-400 mb-1">
                          {chain.icon} {chain.name}
                        </div>
                        <div className="text-xs text-white/50">
                          Step {pos + 1} of {chain.skills.length}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Next / Prev progression */}
                  <div className="flex gap-2 mb-4">
                    {(() => {
                      const prev = getPreviousProgression(selectedSkillDef.id);
                      return prev ? (
                        <button
                          onClick={() => setSelectedSkill(prev.id)}
                          className="flex-1 text-center text-xs border border-white/10 rounded-xl py-2 px-3 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                        >
                          ← {prev.name}
                        </button>
                      ) : null;
                    })()}
                    {(() => {
                      const next = getNextProgression(selectedSkillDef.id);
                      return next ? (
                        <button
                          onClick={() => setSelectedSkill(next.id)}
                          className="flex-1 text-center text-xs border border-sky-500/30 bg-sky-500/5 rounded-xl py-2 px-3 text-sky-400 hover:bg-sky-500/10 transition-all"
                        >
                          {next.name} →
                        </button>
                      ) : null;
                    })()}
                  </div>

                  {/* Readiness */}
                  {selectedProgress && (
                    <div className="mb-4">
                      <div className="flex justify-between font-mono text-[9px] text-white/30 mb-1">
                        <span>READINESS</span>
                        <span>{selectedProgress.pct}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${selectedProgress.pct}%`,
                            backgroundColor: selectedProgress.pct >= 76 ? "#f97316" : "#38bdf8",
                          }}
                        />
                      </div>
                      {selectedProgress.nextSteps.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {selectedProgress.nextSteps.slice(0, 2).map((step, i) => (
                            <div key={i} className="text-[10px] text-white/40 flex items-start gap-1">
                              <span className="text-yellow-400 flex-shrink-0">→</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mastery categories */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {selectedSkillDef.masteryCategories.map((cat) => (
                      <span key={cat} className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                        {cat.replace("_", " ")}
                      </span>
                    ))}
                  </div>

                  {/* Coaching tips */}
                  <div className="mb-4">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-2">Tips</div>
                    <ul className="space-y-1">
                      {selectedSkillDef.coachingTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                          <span className="text-yellow-400 flex-shrink-0 mt-0.5">💡</span>{tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Journey link */}
                  {selectedSkillDef.journeyId && (
                    <Link href="/journeys" className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 mb-4 transition-colors">
                      <span>🗺️</span><span>View Journey →</span>
                    </Link>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleToggleTracked(selectedSkillDef.id)}
                      className={`flex-1 py-2 rounded-xl border font-mono text-[9px] uppercase tracking-widest transition-all ${
                        libraryState.trackedSkillIds.includes(selectedSkillDef.id)
                          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                          : "border-white/10 bg-white/3 text-white/40 hover:border-cyan-500/30"
                      }`}
                    >
                      {libraryState.trackedSkillIds.includes(selectedSkillDef.id) ? "Tracking" : "Track"}
                    </button>
                    <button
                      onClick={() => handleSetGoal(selectedSkillDef.id)}
                      className={`flex-1 py-2 rounded-xl border font-mono text-[9px] uppercase tracking-widest transition-all ${
                        libraryState.goalSkillId === selectedSkillDef.id
                          ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                          : "border-white/10 bg-white/3 text-white/40 hover:border-yellow-500/30"
                      }`}
                    >
                      {libraryState.goalSkillId === selectedSkillDef.id ? "Goal ✓" : "Set Goal"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: PROGRESSIONS */}
        {activeTab === "progressions" && (
          <div>
            <p className="text-sm text-white/40 mb-5">Click any skill node to view details.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {PROGRESSION_CHAINS.map((chain) => (
                <ProgressionChainView
                  key={chain.id}
                  chain={chain}
                  libraryState={libraryState}
                  completedIds={libraryState.completedSkillIds}
                  onSkillSelect={(id) => {
                    setSelectedSkill(id);
                    setActiveTab("all");
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB: MY JOURNEY */}
        {activeTab === "journey" && (
          <div className="space-y-6">
            {/* Goal skill */}
            {goalSkill ? (
              <div className="bg-surface-800 border border-yellow-500/30 rounded-2xl p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-yellow-400 mb-3">🎯 Goal Skill</div>
                <LegendarySkillCard
                  skill={goalSkill}
                  progress={goalProgress}
                  libraryState={libraryState}
                  onToggleFavorite={() => handleToggleFavorite(goalSkill.id)}
                  onSetGoal={() => handleSetGoal(goalSkill.id)}
                />
              </div>
            ) : (
              <div className="bg-surface-800 border border-white/8 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <div className="font-display text-lg text-white/40 mb-2">No Goal Set</div>
                <p className="text-sm text-white/30 mb-4">Set a goal from the Legendary tab to track your journey here.</p>
                <button
                  onClick={() => setActiveTab("legendary")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 font-mono text-[10px] uppercase tracking-widest hover:bg-yellow-500/20 transition-all"
                >
                  🌟 Browse Legendary Skills
                </button>
              </div>
            )}

            {/* Tracked skills */}
            {libraryState.trackedSkillIds.length > 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-3">
                  📡 Tracked Skills ({libraryState.trackedSkillIds.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {libraryState.trackedSkillIds.map((id) => {
                    const skill = SKILL_LIBRARY_MAP[id];
                    if (!skill) return null;
                    return (
                      <SkillLibraryCard
                        key={id}
                        skill={skill}
                        progress={progressMap[id] ?? null}
                        selected={false}
                        completed={libraryState.completedSkillIds.includes(id)}
                        tracked={true}
                        onClick={() => {
                          setSelectedSkill(id);
                          setActiveTab("all");
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed skills */}
            {libraryState.completedSkillIds.length > 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-green-400 mb-3">
                  ✅ Completed Skills ({libraryState.completedSkillIds.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {libraryState.completedSkillIds.map((id) => {
                    const skill = SKILL_LIBRARY_MAP[id];
                    if (!skill) return null;
                    return (
                      <SkillLibraryCard
                        key={id}
                        skill={skill}
                        progress={progressMap[id] ?? null}
                        selected={false}
                        completed={true}
                        tracked={false}
                        onClick={() => {
                          setSelectedSkill(id);
                          setActiveTab("all");
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {libraryState.trackedSkillIds.length === 0 && libraryState.completedSkillIds.length === 0 && !goalSkill && (
              <div className="text-center py-8">
                <p className="text-sm text-white/30">
                  Start tracking skills from the All Skills tab to build your journey.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
