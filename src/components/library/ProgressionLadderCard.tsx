"use client";

/**
 * ProgressionLadderCard
 *
 * Renders a single progression chain as a vertical ladder with:
 * - Each step as a clickable row showing skill name, tier, readiness %
 * - Colour-coded by state: completed (green), current (yellow), locked (dim)
 * - Mini progress bar per step
 * - Connector line between steps
 * - Overall progress bar in the header
 */

import { ProgressionChain } from "@/lib/library-types";
import { SKILL_LIBRARY_MAP } from "@/lib/library-data";
import { SkillProgress, SKILL_TIER_META } from "@/lib/skill-requirements-types";

interface Props {
  chain:             ProgressionChain;
  progressMap:       Record<string, SkillProgress>;
  completedSkillIds: string[];
  goalSkillId?:      string | null;
  onSkillClick?:     (skillId: string) => void;
}

export default function ProgressionLadderCard({
  chain, progressMap, completedSkillIds, goalSkillId, onSkillClick,
}: Props) {
  // First step not yet completed = "current"
  const currentIdx = (() => {
    for (let i = 0; i < chain.skills.length; i++) {
      if (!completedSkillIds.includes(chain.skills[i])) return i;
    }
    return chain.skills.length; // all done
  })();

  const doneCount = chain.skills.filter((id) => completedSkillIds.includes(id)).length;
  const pctDone   = Math.round((doneCount / chain.skills.length) * 100);
  const allDone   = doneCount === chain.skills.length;

  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-2.5 bg-white/[0.015] border-b border-white/5">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-9 h-9 rounded-xl bg-surface-700 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
            {chain.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white leading-tight">{chain.name}</div>
            {chain.description && (
              <div className="font-mono text-[9px] text-white/30 mt-0.5 truncate">{chain.description}</div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`font-display text-lg leading-tight ${allDone ? "text-green-400" : "text-white"}`}>
              {pctDone}%
            </div>
            <div className="font-mono text-[8px] text-white/25">{doneCount}/{chain.skills.length}</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${allDone ? "bg-green-500/70" : "bg-teal-500/50"}`}
            style={{ width: `${pctDone}%` }}
          />
        </div>
      </div>

      {/* ── Steps ──────────────────────────────────────────────────── */}
      <div className="p-3 space-y-1">
        {chain.skills.map((skillId, idx) => {
          const lib        = SKILL_LIBRARY_MAP[skillId];
          const prog       = progressMap[skillId];
          const readiness  = prog?.pct ?? null;
          const completed  = completedSkillIds.includes(skillId);
          const isCurrent  = idx === currentIdx && !completed;
          const isGoal     = goalSkillId === skillId;
          const isLast     = idx === chain.skills.length - 1;
          const tierMeta   = lib?.tier ? SKILL_TIER_META[lib.tier] : null;
          const stepPct    = readiness ?? 0;

          // Visual state
          let cardBorder = "border-white/[0.06]";
          let cardBg     = "bg-transparent";
          let nameColor  = "text-white/30";

          if (completed) {
            cardBorder = "border-green-500/20";
            cardBg     = "bg-green-500/[0.04]";
            nameColor  = "text-green-400/70";
          } else if (isCurrent) {
            cardBorder = "border-yellow-500/30";
            cardBg     = "bg-yellow-500/[0.04]";
            nameColor  = "text-white";
          } else if (isGoal) {
            cardBorder = "border-sky-500/25";
            cardBg     = "bg-sky-500/[0.04]";
            nameColor  = "text-sky-300/80";
          } else if (stepPct > 10) {
            nameColor  = "text-white/50";
          }

          const barColor = completed  ? "#22c55e"
            : isCurrent              ? "#eab308"
            : stepPct >= 76          ? "#f97316"
            : stepPct >= 50          ? "#eab308"
            : stepPct >= 25          ? "#38bdf8"
            : "#1e293b";

          return (
            <div key={skillId}>
              <button
                onClick={() => onSkillClick?.(skillId)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl border transition-all hover:bg-white/[0.04] active:scale-[0.99] ${cardBorder} ${cardBg}`}
              >
                {/* Icon badge */}
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-all ${
                    completed
                      ? "bg-green-500/15 border-green-500/40 text-green-400"
                      : isCurrent
                      ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-400"
                      : "bg-white/[0.04] border-white/10 text-white/25"
                  }`}
                >
                  {completed ? "✓" : (lib?.icon ?? String(idx + 1))}
                </div>

                {/* Name + tier */}
                <div className="flex-1 min-w-0 text-left">
                  <div className={`text-[12px] font-medium leading-tight ${nameColor} truncate`}>
                    {lib?.name ?? skillId}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {tierMeta && (
                      <span className={`font-mono text-[8px] ${tierMeta.color} opacity-55`}>
                        {tierMeta.label}
                      </span>
                    )}
                    {isLast && (
                      <span className="font-mono text-[8px] text-yellow-400/50">👑 GOAL</span>
                    )}
                    {isCurrent && (
                      <span className="font-mono text-[7px] text-yellow-400 bg-yellow-500/15 border border-yellow-500/20 px-1.5 py-0.5 rounded-full">
                        NEXT
                      </span>
                    )}
                  </div>
                </div>

                {/* Readiness */}
                {completed ? (
                  <span className="flex-shrink-0 font-mono text-[8px] text-green-400 px-2 py-0.5 rounded-full border border-green-500/25 bg-green-500/8 whitespace-nowrap">
                    DONE
                  </span>
                ) : readiness !== null ? (
                  <div className="flex-shrink-0 flex items-center gap-1.5">
                    <div className="w-10 h-1 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${stepPct}%`, background: barColor }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-white/35 w-6 text-right leading-none">
                      {stepPct}%
                    </span>
                  </div>
                ) : null}
              </button>

              {/* Connector */}
              {idx < chain.skills.length - 1 && (
                <div className="flex justify-start pl-[21px] py-[1px]">
                  <div className={`w-px h-3 ${completed ? "bg-green-500/20" : "bg-white/[0.05]"}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
