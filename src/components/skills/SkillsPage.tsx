"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { loadState } from "@/lib/storage";
import { loadMasteryState } from "@/lib/mastery-storage";
import { loadJourneyState } from "@/lib/journey-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { loadStreakState } from "@/lib/streak-storage";
import { loadAchievementState } from "@/lib/achievement-storage";
import { loadTreeState } from "@/lib/skilltree-engine";
import { buildSkillSnapshot, calcAllSkillProgress } from "@/lib/skill-progress-engine";
import { ALL_SKILLS } from "@/lib/skill-requirements-data";
import {
  SkillDef, SkillProgress, SkillSnapshot, SkillTier, SkillDomain,
  SKILL_READINESS_META, SKILL_TIER_META,
} from "@/lib/skill-requirements-types";
import PageHeader from "@/components/ui/PageHeader";
import SkillProgressCard from "./SkillProgressCard";

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function SkillDetailPanel({
  skill,
  progress,
}: {
  skill: SkillDef;
  progress: SkillProgress;
}) {
  const readinessMeta = SKILL_READINESS_META[progress.readiness];
  const tierMeta      = SKILL_TIER_META[skill.tier];

  return (
    <div className={`bg-surface-800 border ${readinessMeta.border} rounded-2xl p-5 h-full`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="text-4xl flex-shrink-0">{skill.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="font-display text-xl tracking-wide text-white">{skill.name}</h2>
            {skill.featured && (
              <span className="font-mono text-[9px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/25 px-1.5 py-0.5 rounded-full">
                ★ FEATURED
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${tierMeta.color} ${tierMeta.border} ${tierMeta.bg}`}>
              {tierMeta.icon} {tierMeta.label}
            </span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/50 uppercase">
              {skill.domain}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-white/60 mb-5">{skill.description}</p>

      {/* Readiness + Progress Ring */}
      <div className="flex items-center gap-5 mb-5 p-4 rounded-xl bg-white/3 border border-white/8">
        {/* Progress ring (CSS-based) */}
        <div className="relative flex-shrink-0 w-16 h-16">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(
                var(--ring-color, #22c55e) ${progress.pct * 3.6}deg,
                rgba(255,255,255,0.08) ${progress.pct * 3.6}deg
              )`,
              ["--ring-color" as string]:
                progress.pct >= 100 ? "#22c55e"
                : progress.pct >= 76 ? "#f97316"
                : progress.pct >= 51 ? "#eab308"
                : progress.pct >= 26 ? "#38bdf8"
                : "#475569",
            }}
          />
          <div className="absolute inset-[4px] bg-surface-800 rounded-full flex items-center justify-center">
            <span className={`font-mono text-xs font-bold ${readinessMeta.color}`}>
              {progress.pct}%
            </span>
          </div>
        </div>

        <div>
          <div className={`font-display text-lg ${readinessMeta.color}`}>
            {readinessMeta.icon} {readinessMeta.label}
          </div>
          <div className="font-mono text-[10px] text-white/30 mt-0.5">
            {progress.metRequirements.length}/{progress.metRequirements.length + progress.unmetRequirements.length} requirements met
          </div>
        </div>
      </div>

      {/* Requirements */}
      {skill.requirements.length > 0 && (
        <div className="mb-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
            Requirements
          </div>
          <div className="space-y-2">
            {progress.requirementProgress.map((rp, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${
                  rp.met
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-white/8 bg-white/3"
                }`}
              >
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="text-sm flex-shrink-0">{rp.met ? "✅" : "❌"}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium ${rp.met ? "text-green-400 line-through" : "text-white/70"}`}>
                      {rp.req.label}
                    </div>
                    <div className="text-[10px] text-white/30">{rp.req.description}</div>
                  </div>
                  <span className={`font-mono text-[10px] flex-shrink-0 ${rp.met ? "text-green-400" : "text-white/30"}`}>
                    {rp.current}/{rp.req.value}
                  </span>
                </div>
                {!rp.met && rp.req.value > 0 && (
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden ml-6">
                    <div
                      className={`h-full rounded-full transition-all ${
                        rp.pct >= 75 ? "req-met" : rp.pct >= 50 ? "req-close" : "req-far"
                      }`}
                      style={{ width: `${rp.pct}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {progress.nextSteps.length > 0 && (
        <div className="mb-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
            Next Steps
          </div>
          <div className="space-y-1.5">
            {progress.nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                <span className="font-mono text-teal-400 font-bold flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prerequisites */}
      {skill.prerequisites.length > 0 && (
        <div className="mb-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
            Prerequisites
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skill.prerequisites.map((id) => (
              <span key={id} className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-white/15 bg-white/5 text-white/50">
                {id.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Unlocks */}
      {skill.unlocks.length > 0 && (
        <div className="mb-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
            Unlocks
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skill.unlocks.map((id) => (
              <span key={id} className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-teal-500/25 bg-teal-500/8 text-teal-400">
                → {id.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Journey link */}
      {skill.journeyId && (
        <div className="mb-4">
          <Link
            href="/journeys"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 border border-cyan-500/25 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors"
          >
            <span>🗺️</span>
            <span>Start {skill.name} Journey</span>
            <span>→</span>
          </Link>
        </div>
      )}

      {/* Tips */}
      {skill.tips.length > 0 && (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">
            Coaching Tips
          </div>
          <ul className="space-y-1">
            {skill.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-white/40">
                <span className="text-teal-400 flex-shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TIERS: Array<SkillTier | "all"> = ["all", "beginner", "intermediate", "advanced", "elite", "legendary"];
const DOMAINS: Array<SkillDomain | "all"> = ["all", "push", "pull", "core", "legs", "balance", "mobility", "static"];

export default function SkillsPage() {
  const [progressMap, setProgressMap] = useState<Record<string, SkillProgress> | null>(null);
  const [snap,        setSnap]        = useState<SkillSnapshot | null>(null);
  const [selected,    setSelected]    = useState<SkillDef | null>(null);
  const [search,      setSearch]      = useState("");
  const [tierFilter,  setTierFilter]  = useState<SkillTier | "all">("all");
  const [domainFilter,setDomainFilter]= useState<SkillDomain | "all">("all");

  useEffect(() => {
    const appState    = loadState();
    const masteryState = loadMasteryState();
    const journeyState = loadJourneyState();
    const recState    = loadRecordsState();
    const streakState = loadStreakState();
    const achState    = loadAchievementState();
    const treeState   = loadTreeState();

    const snapshot = buildSkillSnapshot({ appState, masteryState, journeyState, recState, streakState, achState, treeState });
    const map      = calcAllSkillProgress(ALL_SKILLS, snapshot);
    setSnap(snapshot);
    setProgressMap(map);

    // Default: select the featured skill with highest progress
    const featured = ALL_SKILLS
      .filter((s) => s.featured)
      .map((s) => ({ skill: s, pct: map[s.id]?.pct ?? 0 }))
      .sort((a, b) => b.pct - a.pct);
    if (featured.length > 0) setSelected(featured[0].skill);
  }, []);

  const filteredSkills = useMemo(() => {
    if (!progressMap) return [];
    return ALL_SKILLS
      .filter((s) => {
        if (tierFilter   !== "all" && s.tier   !== tierFilter)   return false;
        if (domainFilter !== "all" && s.domain !== domainFilter) return false;
        if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => (progressMap[b.id]?.pct ?? 0) - (progressMap[a.id]?.pct ?? 0));
  }, [progressMap, tierFilter, domainFilter, search]);

  // Stats
  const stats = useMemo(() => {
    if (!progressMap) return { ready: 0, almostReady: 0, total: ALL_SKILLS.length, topPct: 0 };
    const ready       = ALL_SKILLS.filter((s) => progressMap[s.id]?.readiness === "ready").length;
    const almostReady = ALL_SKILLS.filter((s) => progressMap[s.id]?.readiness === "almost_ready").length;
    const topPct      = Math.max(...ALL_SKILLS.map((s) => progressMap[s.id]?.pct ?? 0));
    return { ready, almostReady, total: ALL_SKILLS.length, topPct };
  }, [progressMap]);

  const selectedProgress = selected && progressMap ? progressMap[selected.id] : null;

  return (
    <div className="min-h-screen bg-surface-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <PageHeader
          icon="🎯"
          title="SKILLS"
          subtitle="Progression Requirements Engine"
        />

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-surface-800 border border-green-500/20 rounded-xl p-3 text-center">
            <div className="font-display text-2xl text-green-400">{stats.ready}</div>
            <div className="font-mono text-[9px] text-white/30 uppercase mt-1">Skills Ready</div>
          </div>
          <div className="bg-surface-800 border border-orange-500/20 rounded-xl p-3 text-center">
            <div className="font-display text-2xl text-orange-400">{stats.almostReady}</div>
            <div className="font-mono text-[9px] text-white/30 uppercase mt-1">Almost Ready</div>
          </div>
          <div className="bg-surface-800 border border-white/8 rounded-xl p-3 text-center">
            <div className="font-display text-2xl text-white">{stats.total}</div>
            <div className="font-mono text-[9px] text-white/30 uppercase mt-1">Total Skills</div>
          </div>
          <div className="bg-surface-800 border border-teal-500/20 rounded-xl p-3 text-center">
            <div className="font-display text-2xl text-teal-400">{stats.topPct}%</div>
            <div className="font-mono text-[9px] text-white/30 uppercase mt-1">Top Progress</div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-5 space-y-3">
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-teal-500/40"
          />
          {/* Tier filter */}
          <div className="flex flex-wrap gap-1.5">
            {TIERS.map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border transition-all ${
                  tierFilter === t
                    ? "border-teal-500/40 bg-teal-500/15 text-teal-400"
                    : "border-white/10 bg-white/5 text-white/40 hover:border-white/20"
                }`}
              >
                {t === "all" ? "All Tiers" : t}
              </button>
            ))}
          </div>
          {/* Domain filter */}
          <div className="flex flex-wrap gap-1.5">
            {DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setDomainFilter(d)}
                className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border transition-all ${
                  domainFilter === d
                    ? "border-teal-500/40 bg-teal-500/15 text-teal-400"
                    : "border-white/10 bg-white/5 text-white/40 hover:border-white/20"
                }`}
              >
                {d === "all" ? "All Domains" : d}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Skill list */}
          <div className="lg:col-span-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">
              {filteredSkills.length} skills
            </div>
            {!progressMap ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-16 bg-surface-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto scrollbar-hide pr-1">
                {filteredSkills.map((skill) => (
                  <SkillProgressCard
                    key={skill.id}
                    skill={skill}
                    progress={progressMap[skill.id]}
                    selected={selected?.id === skill.id}
                    onClick={() => setSelected(skill)}
                  />
                ))}
                {filteredSkills.length === 0 && (
                  <div className="text-center py-8 text-white/30 text-sm">
                    No skills match your filters
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            {selected && selectedProgress ? (
              <SkillDetailPanel skill={selected} progress={selectedProgress} />
            ) : (
              <div className="bg-surface-800 border border-white/8 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="text-4xl mb-3">🎯</div>
                <div className="font-display text-lg text-white/40 tracking-wide mb-2">Select a Skill</div>
                <p className="text-sm text-white/20 mb-6">
                  Choose a skill from the list to view its requirements and track your progress.
                </p>
                {progressMap && (
                  <div className="w-full">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/25 mb-3">Featured Skills</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {ALL_SKILLS.filter((s) => s.featured).slice(0, 5).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelected(s)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-teal-500/30 hover:bg-teal-500/8 transition-all"
                        >
                          <span>{s.icon}</span>
                          <span className="font-mono text-[9px] text-white/50">{s.name}</span>
                          <span className="font-mono text-[8px] text-teal-400">{progressMap[s.id]?.pct ?? 0}%</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
