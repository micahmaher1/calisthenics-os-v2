"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SKILL_LIBRARY_MAP, PROGRESSION_CHAINS } from "@/lib/library-data";
import { getAcademyEntry } from "@/lib/skill-academy-data";
import { ALL_SKILLS } from "@/lib/skill-requirements-data";
import { buildSkillSnapshot, calcAllSkillProgress } from "@/lib/skill-progress-engine";
import { SkillProgress, SKILL_TIER_META, SKILL_READINESS_META, getReadinessFromPct } from "@/lib/skill-requirements-types";
import { calcReadinessBreakdown } from "@/lib/skill-readiness-breakdown";
import { getSkillChain } from "@/lib/library-utils";
import { loadState } from "@/lib/storage";
import { loadMasteryState } from "@/lib/mastery-storage";
import { loadJourneyState } from "@/lib/journey-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { loadStreakState } from "@/lib/streak-storage";
import { loadAchievementState } from "@/lib/achievement-storage";
import { loadTreeState } from "@/lib/skilltree-engine";

// ─── Section Header ───────────────────────────────────────────────────────────

function Sec({
  id, icon, title, children,
}: {
  id?: string; icon: string; title: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">{icon}</span>
        <h2 className="font-display text-lg tracking-wide text-white">{title}</h2>
        <div className="flex-1 h-px bg-white/[0.05]" />
      </div>
      {children}
    </section>
  );
}

// ─── Readiness Ring ───────────────────────────────────────────────────────────

function ReadinessRing({ pct }: { pct: number }) {
  const r     = 38;
  const circ  = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const color  = pct >= 76 ? "#f97316" : pct >= 51 ? "#eab308" : pct >= 26 ? "#38bdf8" : "#334155";
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div className="relative w-20 h-20">
      <svg viewBox="0 0 88 88" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="44" cy="44" r={r}
          fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={mounted ? offset : circ}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl leading-none" style={{ color }}>{pct}%</span>
        <span className="font-mono text-[8px] text-white/30 mt-0.5">ready</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  skillId: string;
}

export default function SkillAcademyGuide({ skillId }: Props) {
  const [progressMap, setProgressMap] = useState<Record<string, SkillProgress>>({});
  const [loading,     setLoading]     = useState(true);

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
  }, [skillId]);

  const skill   = SKILL_LIBRARY_MAP[skillId];
  const academy = getAcademyEntry(skillId);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🎓</span>
          <span className="font-display text-xl tracking-widest text-white/40">LOADING GUIDE</span>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl block mb-4">🔍</span>
          <p className="font-display text-xl text-white/40 tracking-wide">Skill not found</p>
          <Link href="/academy" className="mt-6 inline-block font-mono text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors">
            ← Back to Academy
          </Link>
        </div>
      </div>
    );
  }

  const progress    = progressMap[skillId] ?? null;
  const pct         = progress?.pct ?? 0;
  const readiness   = progress ? SKILL_READINESS_META[progress.readiness] : null;
  const tierMeta    = SKILL_TIER_META[skill.tier];
  const chain       = getSkillChain(skillId);
  const breakdown   = progress ? calcReadinessBreakdown(skillId, progress) : [];

  // Prerequisite skills from library data
  const prereqSkills  = skill.prerequisites.map((id) => SKILL_LIBRARY_MAP[id]).filter(Boolean);
  const progressionSkills = skill.progressions.map((id) => SKILL_LIBRARY_MAP[id]).filter(Boolean);
  const regressionSkills  = skill.regressions.map((id) => SKILL_LIBRARY_MAP[id]).filter(Boolean);
  const relatedSkillDefs  = skill.relatedSkills.map((id) => SKILL_LIBRARY_MAP[id]).filter(Boolean);

  // Requirement system
  const skillDef = ALL_SKILLS.find((s) => s.id === skillId);
  const requirements = skillDef?.requirements ?? [];

  // Chain position
  const chainPos   = chain ? chain.skills.indexOf(skillId) : -1;
  const chainPrev  = chain && chainPos > 0 ? SKILL_LIBRARY_MAP[chain.skills[chainPos - 1]] : null;
  const chainNext  = chain && chainPos < (chain.skills.length - 1) ? SKILL_LIBRARY_MAP[chain.skills[chainPos + 1]] : null;

  const barColor =
    pct >= 100 ? "#22c55e" :
    pct >= 76  ? "#f97316" :
    pct >= 51  ? "#eab308" :
    pct >= 26  ? "#38bdf8" :
    "#1e293b";

  // ── Nav sections for TOC ──────────────────────────────────────────────
  const sections = [
    { id: "overview",    label: "Overview"     },
    { id: "technique",   label: "Technique",   skip: !academy },
    { id: "muscles",     label: "Muscles",     skip: !academy },
    { id: "progressions", label: "Progression" },
    { id: "training",    label: "Training",    skip: !academy },
    { id: "mistakes",    label: "Mistakes"     },
    { id: "requirements", label: "Requirements", skip: requirements.length === 0 },
    { id: "related",     label: "Related"      },
  ].filter((s) => !s.skip);

  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full bg-indigo-500/[0.035] blur-3xl pointer-events-none" />
      {skill.isLegendary && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] rounded-full bg-yellow-500/[0.03] blur-3xl pointer-events-none" />
      )}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: "linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-12">

        {/* ── Back nav ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pt-6 mb-5">
          <Link href="/academy" className="flex items-center gap-1.5 font-mono text-[10px] text-white/35 hover:text-white/60 transition-colors">
            ← Academy
          </Link>
          <span className="text-white/15">·</span>
          <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">{skill.domain}</span>
          <span className="text-white/15">·</span>
          <span className={`font-mono text-[9px] ${tierMeta.color}`}>{tierMeta.label}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT: Sticky TOC ──────────────────────────────────────── */}
          <aside className="hidden lg:block w-48 flex-shrink-0">
            <div className="sticky top-6 space-y-1">
              <p className="font-mono text-[8px] uppercase tracking-widest text-white/20 mb-3 px-3">Sections</p>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block px-3 py-1.5 font-mono text-[10px] text-white/35 hover:text-white/70 hover:bg-white/4 rounded-lg transition-all"
                >
                  {s.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/5">
                <Link
                  href="/library"
                  className="block px-3 py-1.5 font-mono text-[10px] text-indigo-400/60 hover:text-indigo-400 transition-colors"
                >
                  📚 Library
                </Link>
                <Link
                  href="/legendary-skills"
                  className="block px-3 py-1.5 font-mono text-[10px] text-yellow-400/50 hover:text-yellow-400 transition-colors"
                >
                  🌟 Legendary
                </Link>
              </div>
            </div>
          </aside>

          {/* ── RIGHT: Content ────────────────────────────────────────── */}
          <main className="flex-1 min-w-0 space-y-10">

            {/* ── HERO ──────────────────────────────────────────────── */}
            <div id="overview">
              {skill.isLegendary && (
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent mb-5" />
              )}
              <div className={`bg-surface-800 border rounded-2xl p-6 ${skill.isLegendary ? "border-yellow-500/30" : tierMeta.border}`}>
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  {/* Icon + tier */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border ${tierMeta.border} ${tierMeta.bg}`}>
                      {skill.icon}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${tierMeta.border} ${tierMeta.bg} ${tierMeta.color}`}>
                        {tierMeta.icon} {tierMeta.label}
                      </span>
                      <span className="font-mono text-[9px] text-white/30 uppercase border border-white/10 px-2 py-0.5 rounded-full">
                        {skill.domain}
                      </span>
                      {skill.isLegendary && (
                        <span className="font-mono text-[9px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/25 px-2 py-0.5 rounded-full">
                          👑 LEGENDARY
                        </span>
                      )}
                    </div>
                    <h1 className={`font-display text-3xl sm:text-4xl tracking-wide mb-2 ${skill.isLegendary ? "text-yellow-300" : "text-white"}`}>
                      {skill.name}
                    </h1>
                    <p className="text-sm text-white/60 leading-relaxed mb-2">{skill.description}</p>
                    <p className="text-xs text-white/35 italic leading-relaxed">{skill.purpose}</p>
                  </div>

                  {/* Readiness ring */}
                  {progress && (
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <ReadinessRing pct={pct} />
                      {readiness && (
                        <span className={`font-mono text-[8px] ${readiness.color}`}>
                          {readiness.icon} {readiness.label}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Difficulty note */}
                {academy?.difficultyNote && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-white/40 italic leading-relaxed">
                      💡 {academy.difficultyNote}
                    </p>
                  </div>
                )}

                {/* Benefits */}
                {skill.benefits.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="font-mono text-[8px] uppercase tracking-widest text-white/25 mb-2">Why Train This</p>
                    <div className="flex flex-wrap gap-2">
                      {skill.benefits.map((b, i) => (
                        <span key={i} className="font-mono text-[9px] text-green-400/70 bg-green-500/5 border border-green-500/15 px-2 py-0.5 rounded-full">
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Readiness breakdown */}
                {breakdown.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="font-mono text-[8px] uppercase tracking-widest text-white/25 mb-3">Readiness Breakdown</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {breakdown.map((cat) => (
                        <div key={cat.id}>
                          <div className="flex items-center justify-between font-mono text-[8px] mb-1">
                            <span className="text-white/40 flex items-center gap-1"><span>{cat.icon}</span><span>{cat.label}</span></span>
                            <span className={cat.pct >= 100 ? "text-green-400" : cat.pct >= 76 ? "text-orange-400" : "text-white/35"}>
                              {cat.pct}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${cat.pct}%`,
                                background: cat.pct >= 100 ? "#22c55e" : cat.pct >= 76 ? "#f97316" : cat.pct >= 51 ? "#eab308" : cat.pct >= 26 ? "#38bdf8" : "#1e293b",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next steps */}
                {progress && progress.nextSteps.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="font-mono text-[8px] uppercase tracking-widest text-white/25 mb-2">Your Next Steps</p>
                    <div className="space-y-1">
                      {progress.nextSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-white/50">
                          <span className="text-yellow-400 flex-shrink-0 mt-0.5">→</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── TECHNIQUE ─────────────────────────────────────────── */}
            {academy && (
              <Sec id="technique" icon="📋" title="How to Perform">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <TechCard icon="⚙️" title="Setup">
                    {academy.technique.setup.map((s, i) => (
                      <ListItem key={i} color="text-sky-400">{s}</ListItem>
                    ))}
                  </TechCard>

                  <TechCard icon="▶️" title="Execution">
                    {academy.technique.execution.map((s, i) => (
                      <ListItem key={i} color="text-green-400" marker={String(i + 1)}>{s}</ListItem>
                    ))}
                  </TechCard>

                  <TechCard icon="🏛️" title="Body Position">
                    {academy.technique.bodyPosition.map((s, i) => (
                      <ListItem key={i} color="text-purple-400">{ s}</ListItem>
                    ))}
                  </TechCard>

                  <TechCard icon="💨" title="Breathing">
                    {academy.technique.breathing.map((s, i) => (
                      <ListItem key={i} color="text-cyan-400">{s}</ListItem>
                    ))}
                  </TechCard>

                  <div className="sm:col-span-2">
                    <TechCard icon="🎯" title="Key Coaching Cues" highlight>
                      <div className="flex flex-wrap gap-2">
                        {academy.technique.keyCues.map((cue, i) => (
                          <span key={i} className="font-mono text-[9px] text-yellow-400 bg-yellow-500/8 border border-yellow-500/20 px-3 py-1.5 rounded-xl">
                            {cue}
                          </span>
                        ))}
                      </div>
                    </TechCard>
                  </div>

                </div>
              </Sec>
            )}

            {/* ── MUSCLES ───────────────────────────────────────────── */}
            {academy && (
              <Sec id="muscles" icon="💪" title="Muscles Worked">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface-800 border border-red-500/20 rounded-2xl p-4">
                    <p className="font-mono text-[8px] uppercase tracking-widest text-red-400/70 mb-3">Primary Muscles</p>
                    <div className="space-y-1.5">
                      {academy.muscles.primary.map((m, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500/70 flex-shrink-0" />
                          <span className="text-sm text-white/70">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
                    <p className="font-mono text-[8px] uppercase tracking-widest text-white/25 mb-3">Secondary Muscles</p>
                    <div className="space-y-1.5">
                      {academy.muscles.secondary.map((m, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                          <span className="text-sm text-white/45">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Sec>
            )}

            {/* ── PROGRESSIONS ──────────────────────────────────────── */}
            <Sec id="progressions" icon="🔗" title="Progression Path">
              {/* Chain view */}
              {chain ? (
                <div className="space-y-4">
                  <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{chain.icon}</span>
                      <span className="font-display text-sm text-white">{chain.name}</span>
                      <span className="font-mono text-[9px] text-white/30 ml-auto">
                        Step {chainPos + 1} of {chain.skills.length}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {chain.skills.map((id, idx) => {
                        const s    = SKILL_LIBRARY_MAP[id];
                        const p    = progressMap[id];
                        const done = p?.pct === 100;
                        const curr = id === skillId;
                        if (!s) return null;
                        return (
                          <div key={id}>
                            <Link
                              href={`/academy/${id}`}
                              className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all hover:bg-white/4 ${
                                curr   ? "border-yellow-500/35 bg-yellow-500/5"
                                : done ? "border-green-500/20 bg-green-500/4"
                                :        "border-white/6"
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] border flex-shrink-0 ${
                                done ? "bg-green-500/15 border-green-500/40 text-green-400"
                                : curr ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-400"
                                : "bg-white/4 border-white/10 text-white/20"
                              }`}>
                                {done ? "✓" : s.icon}
                              </div>
                              <span className={`flex-1 text-[12px] font-medium ${curr ? "text-white" : done ? "text-green-400/70" : "text-white/45"}`}>
                                {s.name}
                              </span>
                              {curr && <span className="font-mono text-[7px] text-yellow-400 bg-yellow-500/15 border border-yellow-500/20 px-1.5 py-0.5 rounded-full">YOU ARE HERE</span>}
                              {p && !done && <span className="font-mono text-[9px] text-white/30">{p.pct}%</span>}
                            </Link>
                            {idx < chain.skills.length - 1 && (
                              <div className="flex justify-start pl-[18px] py-[2px]">
                                <div className={`w-px h-3 ${done ? "bg-green-500/20" : "bg-white/5"}`} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Prev / Next navigation */}
                  <div className="flex gap-3">
                    {chainPrev && (
                      <Link
                        href={`/academy/${chainPrev.id}`}
                        className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/4 transition-all"
                      >
                        <span className="text-sm">{chainPrev.icon}</span>
                        <div className="min-w-0">
                          <div className="font-mono text-[8px] text-white/25 mb-0.5">← Regression</div>
                          <div className="text-xs text-white/55 truncate">{chainPrev.name}</div>
                        </div>
                      </Link>
                    )}
                    {chainNext && (
                      <Link
                        href={`/academy/${chainNext.id}`}
                        className="flex-1 flex items-center justify-end gap-2 px-4 py-3 rounded-xl border border-sky-500/25 bg-sky-500/5 hover:bg-sky-500/10 transition-all"
                      >
                        <div className="min-w-0 text-right">
                          <div className="font-mono text-[8px] text-sky-400/60 mb-0.5">Progression →</div>
                          <div className="text-xs text-sky-400/80 truncate">{chainNext.name}</div>
                        </div>
                        <span className="text-sm">{chainNext.icon}</span>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {progressionSkills.length > 0 && (
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-widest text-green-400/60 mb-2">Progress To</p>
                        {progressionSkills.map((s) => (
                          <SkillChip key={s.id} skill={s} progress={progressMap[s.id] ?? null} />
                        ))}
                      </div>
                    )}
                    {regressionSkills.length > 0 && (
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-widest text-white/25 mb-2">Easier Version</p>
                        {regressionSkills.map((s) => (
                          <SkillChip key={s.id} skill={s} progress={progressMap[s.id] ?? null} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Sec>

            {/* ── TRAINING EXERCISES ────────────────────────────────── */}
            {academy && academy.training.length > 0 && (
              <Sec id="training" icon="🏋️" title="Training Exercises">
                <p className="text-xs text-white/35 mb-4">Exercises that directly build the strength and skills needed for {skill.name}.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {academy.training.map((ex, i) => (
                    <div key={i} className="bg-surface-800 border border-white/8 rounded-xl p-3.5 hover:border-white/15 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0 text-[11px] text-indigo-400 font-mono">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white leading-tight">{ex.name}</p>
                          <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{ex.purpose}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coaching tips */}
                {skill.coachingTips.length > 0 && (
                  <div className="mt-4 bg-surface-800 border border-yellow-500/15 rounded-2xl p-4">
                    <p className="font-mono text-[8px] uppercase tracking-widest text-yellow-400/60 mb-3">💡 Coaching Tips</p>
                    <div className="space-y-1.5">
                      {skill.coachingTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-yellow-400/70 flex-shrink-0 mt-0.5 text-xs">→</span>
                          <span className="text-xs text-white/55 leading-relaxed">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Sec>
            )}

            {/* ── COMMON MISTAKES ───────────────────────────────────── */}
            {skill.commonMistakes.length > 0 && (
              <Sec id="mistakes" icon="⚠️" title="Common Mistakes">
                <div className="space-y-2">
                  {skill.commonMistakes.map((m, i) => (
                    <div key={i} className="flex items-start gap-3 bg-surface-800 border border-red-500/15 rounded-xl px-4 py-3">
                      <span className="text-red-400 flex-shrink-0 mt-0.5 font-mono text-sm">✗</span>
                      <span className="text-sm text-white/60 leading-relaxed">{m}</span>
                    </div>
                  ))}
                </div>
              </Sec>
            )}

            {/* ── REQUIREMENTS ──────────────────────────────────────── */}
            {requirements.length > 0 && (
              <Sec id="requirements" icon="🔓" title="Unlock Requirements">
                <p className="text-xs text-white/35 mb-4">What you need to achieve before unlocking {skill.name} in your progression system.</p>
                <div className="space-y-2">
                  {requirements.map((req, i) => {
                    const rp = progress?.requirementProgress.find((r) => r.req.label === req.label);
                    const met = rp?.met ?? false;
                    const rpct = rp?.pct ?? 0;
                    return (
                      <div key={i} className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors ${
                        met ? "border-green-500/20 bg-green-500/4" : "border-white/8 bg-surface-800"
                      }`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border text-[10px] ${
                          met ? "bg-green-500/20 border-green-500/50 text-green-400" : "bg-white/4 border-white/15 text-white/25"
                        }`}>
                          {met ? "✓" : "○"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[12px] font-medium ${met ? "text-green-400/80" : "text-white/60"}`}>{req.label}</p>
                          <p className="font-mono text-[9px] text-white/25">{req.description}</p>
                          {!met && rpct > 0 && (
                            <div className="mt-1 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-sky-500/50 rounded-full" style={{ width: `${rpct}%` }} />
                            </div>
                          )}
                        </div>
                        <span className={`font-mono text-[9px] flex-shrink-0 ${met ? "text-green-400" : "text-white/25"}`}>
                          {met ? "✓ Met" : `${rpct}%`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Prerequisites */}
                {prereqSkills.length > 0 && (
                  <div className="mt-4">
                    <p className="font-mono text-[8px] uppercase tracking-widest text-white/25 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {prereqSkills.map((s) => (
                        <Link
                          key={s.id}
                          href={`/academy/${s.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/3 hover:bg-white/6 transition-all"
                        >
                          <span>{s.icon}</span>
                          <span className="font-mono text-[9px] text-white/55">{s.name}</span>
                          {progressMap[s.id]?.pct === 100 && (
                            <span className="text-green-400 text-[9px]">✓</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </Sec>
            )}

            {/* ── RELATED SKILLS ────────────────────────────────────── */}
            {relatedSkillDefs.length > 0 && (
              <Sec id="related" icon="🔗" title="Related Skills">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedSkillDefs.map((s) => {
                    const rp  = progressMap[s.id];
                    const rtm = SKILL_TIER_META[s.tier];
                    return (
                      <Link
                        key={s.id}
                        href={`/academy/${s.id}`}
                        className="flex items-center gap-3 p-3 bg-surface-800 border border-white/8 rounded-xl hover:border-white/20 hover:bg-white/4 transition-all group"
                      >
                        <span className="text-xl flex-shrink-0">{s.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors truncate">{s.name}</p>
                          <p className={`font-mono text-[8px] ${rtm.color}`}>{rtm.label} · {s.domain}</p>
                        </div>
                        {rp && (
                          <span className="font-mono text-[9px] text-white/30 flex-shrink-0">{rp.pct}%</span>
                        )}
                        <span className="text-white/20 group-hover:text-white/50 text-xs transition-colors">→</span>
                      </Link>
                    );
                  })}
                </div>
              </Sec>
            )}

            {/* ── Footer CTA ────────────────────────────────────────── */}
            <div className="flex gap-3 flex-wrap pt-2">
              <Link
                href="/library"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 font-mono text-[10px] uppercase tracking-widest hover:bg-sky-500/20 transition-all"
              >
                <span>📚</span> Progression Library
              </Link>
              <Link
                href="/tree"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/4 text-white/50 font-mono text-[10px] uppercase tracking-widest hover:bg-white/8 transition-all"
              >
                <span>🌳</span> Skill Tree
              </Link>
              <Link
                href="/academy"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-500/25 bg-indigo-500/8 text-indigo-400/70 font-mono text-[10px] uppercase tracking-widest hover:bg-indigo-500/15 transition-all"
              >
                <span>🎓</span> All Skills
              </Link>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TechCard({
  icon, title, children, highlight,
}: {
  icon: string; title: string; children: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className={`bg-surface-800 border rounded-2xl p-4 ${highlight ? "border-yellow-500/20" : "border-white/8"}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">{icon}</span>
        <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">{title}</p>
      </div>
      {children}
    </div>
  );
}

function ListItem({
  children, color, marker = "•",
}: {
  children: React.ReactNode; color: string; marker?: string;
}) {
  return (
    <div className="flex items-start gap-2 mb-1.5 last:mb-0">
      <span className={`${color} flex-shrink-0 mt-0.5 text-xs font-mono`}>{marker}</span>
      <span className="text-xs text-white/55 leading-relaxed">{children}</span>
    </div>
  );
}

function SkillChip({
  skill, progress,
}: {
  skill: { id: string; name: string; icon: string; tier: string };
  progress: SkillProgress | null;
}) {
  const tierMeta = SKILL_TIER_META[skill.tier as keyof typeof SKILL_TIER_META];
  return (
    <Link
      href={`/academy/${skill.id}`}
      className="flex items-center gap-2 px-3 py-2 mb-2 bg-surface-800 border border-white/8 rounded-xl hover:border-white/20 hover:bg-white/4 transition-all"
    >
      <span className="text-sm">{skill.icon}</span>
      <span className="text-xs text-white/60 flex-1">{skill.name}</span>
      {tierMeta && <span className={`font-mono text-[8px] ${tierMeta.color}`}>{tierMeta.label}</span>}
      {progress && <span className="font-mono text-[8px] text-white/25">{progress.pct}%</span>}
    </Link>
  );
}
