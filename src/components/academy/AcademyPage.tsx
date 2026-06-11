"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import AcademySkillCard from "./AcademySkillCard";
import { LIBRARY_SKILLS, SKILL_LIBRARY_MAP } from "@/lib/library-data";
import { filterLibrarySkills } from "@/lib/library-utils";
import { FEATURED_SKILL_IDS } from "@/lib/skill-academy-data";
import { SkillProgress } from "@/lib/skill-requirements-types";
import { buildSkillSnapshot, calcAllSkillProgress } from "@/lib/skill-progress-engine";
import { ALL_SKILLS } from "@/lib/skill-requirements-data";
import { loadState } from "@/lib/storage";
import { loadMasteryState } from "@/lib/mastery-storage";
import { loadJourneyState } from "@/lib/journey-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { loadStreakState } from "@/lib/streak-storage";
import { loadAchievementState } from "@/lib/achievement-storage";
import { loadTreeState } from "@/lib/skilltree-engine";

const DOMAIN_TABS = [
  { key: "all",       label: "All",      icon: "📚" },
  { key: "push",      label: "Push",     icon: "💪" },
  { key: "pull",      label: "Pull",     icon: "🔼" },
  { key: "core",      label: "Core",     icon: "📐" },
  { key: "balance",   label: "Balance",  icon: "⚖️" },
  { key: "legs",      label: "Legs",     icon: "🦵" },
  { key: "static",    label: "Static",   icon: "🧲" },
  { key: "mobility",  label: "Mobility", icon: "🔄" },
] as const;

const TIER_TABS = ["all", "beginner", "intermediate", "advanced", "elite", "legendary"] as const;

export default function AcademyPage() {
  const [progressMap, setProgressMap] = useState<Record<string, SkillProgress>>({});
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [domain,      setDomain]      = useState<string>("all");
  const [tier,        setTier]        = useState<string>("all");

  useEffect(() => {
    const appState     = loadState();
    const masteryState = loadMasteryState();
    const journeyState = loadJourneyState();
    const recState     = loadRecordsState();
    const streakState  = loadStreakState();
    const achState     = loadAchievementState();
    const treeState    = loadTreeState();
    const snap = buildSkillSnapshot({ appState, masteryState, journeyState, recState, streakState, achState, treeState });
    setProgressMap(calcAllSkillProgress(ALL_SKILLS, snap));
    setLoading(false);
  }, []);

  const featuredSkills = useMemo(
    () => FEATURED_SKILL_IDS.map((id) => SKILL_LIBRARY_MAP[id]).filter(Boolean),
    [],
  );

  const isFiltered = search.trim() || domain !== "all" || tier !== "all";
  const filteredSkills = useMemo(
    () => filterLibrarySkills(LIBRARY_SKILLS, search, domain, tier),
    [search, domain, tier],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🎓</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING ACADEMY</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: "linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full bg-indigo-500/[0.04] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <PageHeader
          icon="🎓"
          title="SKILL ACADEMY"
          subtitle="The Calisthenics Encyclopedia"
          backHref="/"
          backLabel="Dashboard"
          actions={
            <Link
              href="/library"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 font-mono text-[10px] hover:bg-sky-500/20 transition-all"
            >
              <span>📚</span><span className="hidden sm:inline">Library</span>
            </Link>
          }
        />

        {/* ── Search ─────────────────────────────────────────────────────── */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-base pointer-events-none">🔍</div>
          <input
            type="text"
            placeholder="Search skills — Front Lever, Planche, Handstand, Muscle-Up…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-800 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-surface-700 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Filters ────────────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
          {DOMAIN_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setDomain(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl border font-mono text-[9px] uppercase tracking-widest transition-all ${
                domain === tab.key
                  ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-400"
                  : "border-white/10 bg-white/3 text-white/35 hover:border-white/20 hover:text-white/60"
              }`}
            >
              <span>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {TIER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`flex-shrink-0 px-3 py-1 rounded-xl border font-mono text-[9px] uppercase tracking-widest transition-all ${
                tier === t
                  ? "border-purple-500/50 bg-purple-500/15 text-purple-400"
                  : "border-white/10 bg-white/3 text-white/30 hover:border-white/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Featured Skills (when no filter active) ────────────────────── */}
        {!isFiltered && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">⭐ Featured Skills</span>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {featuredSkills.map((skill) => (
                <AcademySkillCard
                  key={skill.id}
                  skill={skill}
                  progress={progressMap[skill.id] ?? null}
                  featured
                />
              ))}
            </div>
          </section>
        )}

        {/* ── All Skills / Search Results ─────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-white/[0.05]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
                {isFiltered ? `${filteredSkills.length} results` : "All Skills"}
              </span>
            </div>
            {isFiltered && (
              <button
                onClick={() => { setSearch(""); setDomain("all"); setTier("all"); }}
                className="font-mono text-[9px] text-white/30 hover:text-white/60 transition-colors border border-white/10 px-2.5 py-1 rounded-lg"
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredSkills.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-4xl block mb-4">🔍</span>
              <p className="font-display text-xl text-white/30 tracking-wide">No skills found</p>
              <p className="font-body text-sm text-white/20 mt-2">Try a different search term or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSkills.map((skill) => (
                <AcademySkillCard
                  key={skill.id}
                  skill={skill}
                  progress={progressMap[skill.id] ?? null}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
