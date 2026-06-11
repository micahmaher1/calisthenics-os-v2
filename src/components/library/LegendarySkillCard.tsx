"use client";

import Link from "next/link";
import { LibrarySkill } from "@/lib/library-types";
import { LibraryState } from "@/lib/library-types";
import { SkillProgress } from "@/lib/skill-requirements-types";
import { SKILL_TIER_META, getReadinessFromPct } from "@/lib/skill-requirements-types";

interface LegendarySkillCardProps {
  skill:           LibrarySkill;
  progress:        SkillProgress | null;
  libraryState:    LibraryState;
  onToggleFavorite: () => void;
  onSetGoal:       () => void;
}

function readinessRingColor(pct: number): string {
  if (pct >= 100) return "#22c55e";
  if (pct >= 76)  return "#f97316";
  if (pct >= 51)  return "#eab308";
  if (pct >= 26)  return "#38bdf8";
  return "#475569";
}

function readinessBadge(pct: number): { label: string; classes: string } {
  if (pct >= 100) return { label: "READY",        classes: "text-green-400  bg-green-500/10  border-green-500/30"  };
  if (pct >= 76)  return { label: "ALMOST READY", classes: "text-orange-400 bg-orange-500/10 border-orange-500/30" };
  if (pct >= 51)  return { label: "APPROACHING",  classes: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" };
  if (pct >= 26)  return { label: "DEVELOPING",   classes: "text-sky-400    bg-sky-500/10    border-sky-500/30"    };
  return { label: "LOCKED", classes: "text-slate-400 bg-slate-800/50 border-slate-700" };
}

export default function LegendarySkillCard({
  skill, progress, libraryState, onToggleFavorite, onSetGoal,
}: LegendarySkillCardProps) {
  const pct      = progress?.pct ?? 0;
  const tierMeta = SKILL_TIER_META[skill.tier];
  const isFav    = libraryState.favoriteSkillIds.includes(skill.id);
  const isGoal   = libraryState.goalSkillId === skill.id;
  const ringColor = readinessRingColor(pct);
  const badge     = readinessBadge(pct);
  const isEliteLegendary = skill.tier === "legendary";

  // CSS ring: circumference = 2π × r (r=20, so C≈125.7)
  const circumference = 125.7;
  const dasharray     = `${(pct / 100) * circumference} ${circumference}`;

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all ${
        isEliteLegendary
          ? "border-yellow-500/40 bg-yellow-500/3 shadow-lg shadow-yellow-500/10"
          : "border-purple-500/30 bg-purple-500/3 shadow-lg shadow-purple-500/10"
      } ${isGoal ? "ring-2 ring-yellow-500/50" : ""}`}
    >
      {/* Shimmer border for legendary */}
      {isEliteLegendary && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`text-4xl flex-shrink-0 p-2 rounded-xl border ${tierMeta.border} ${tierMeta.bg}`}>
          {skill.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-display text-lg tracking-wide text-white">{skill.name}</h3>
            {isGoal && (
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400">
                🎯 GOAL
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${tierMeta.color} ${tierMeta.border} ${tierMeta.bg}`}>
              {tierMeta.icon} {tierMeta.label}
            </span>
            <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">{skill.domain}</span>
          </div>
          <p className="text-xs text-white/50 line-clamp-2">{skill.description}</p>
        </div>

        {/* Readiness Ring */}
        <div className="flex-shrink-0 relative w-16 h-16">
          <svg viewBox="0 0 50 50" className="w-full h-full -rotate-90">
            <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
            <circle
              cx="25" cy="25" r="20"
              fill="none"
              stroke={ringColor}
              strokeWidth="4"
              strokeDasharray={dasharray}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-[11px] text-white font-bold">{pct}%</span>
          </div>
        </div>
      </div>

      {/* Readiness badge */}
      <div className="mb-3">
        <span className={`inline-block font-mono text-[9px] px-2.5 py-1 rounded-full border ${badge.classes}`}>
          {badge.label}
        </span>
      </div>

      {/* Unmet requirements */}
      {progress && progress.unmetRequirements.length > 0 && (
        <div className="mb-3 space-y-1">
          <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1">Requirements</div>
          {progress.unmetRequirements.slice(0, 2).map((req, i) => {
            const rp = progress.requirementProgress.find((r) => r.req === req);
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between font-mono text-[9px] text-white/40 mb-0.5">
                    <span className="truncate">{req.label}</span>
                    <span className="flex-shrink-0 ml-1">{rp?.pct ?? 0}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width:            `${rp?.pct ?? 0}%`,
                        backgroundColor:  ringColor,
                        opacity:          0.7,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mastery categories */}
      {skill.masteryCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skill.masteryCategories.map((cat) => (
            <span
              key={cat}
              className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50"
            >
              {cat.replace("_", " ")}
            </span>
          ))}
        </div>
      )}

      {/* Journey link */}
      {skill.journeyId && (
        <div className="mb-3">
          <Link
            href="/journeys"
            className="flex items-center gap-1 font-mono text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>🗺️</span>
            <span>View Journey →</span>
          </Link>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        <button
          onClick={onToggleFavorite}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-[9px] transition-all ${
            isFav
              ? "border-red-500/40 bg-red-500/10 text-red-400"
              : "border-white/10 bg-white/3 text-white/40 hover:border-red-500/30 hover:text-red-400"
          }`}
        >
          <span>{isFav ? "❤️" : "🤍"}</span>
          <span>{isFav ? "Saved" : "Save"}</span>
        </button>
        <button
          onClick={onSetGoal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-[9px] transition-all ${
            isGoal
              ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
              : "border-white/10 bg-white/3 text-white/40 hover:border-yellow-500/30 hover:text-yellow-400"
          }`}
        >
          <span>🎯</span>
          <span>{isGoal ? "Current Goal" : "Set as Goal"}</span>
        </button>
      </div>
    </div>
  );
}
