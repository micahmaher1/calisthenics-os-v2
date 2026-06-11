"use client";

import Link from "next/link";
import { LibraryState } from "@/lib/library-types";
import { SkillProgress } from "@/lib/skill-requirements-types";
import { SKILL_LIBRARY_MAP } from "@/lib/library-data";
import { getLegendarySkillsByReadiness } from "@/lib/library-utils";

interface LegendaryTargetLibraryWidgetProps {
  libraryState: LibraryState;
  progressMap:  Record<string, SkillProgress>;
}

function ringColor(pct: number): string {
  if (pct >= 76) return "rgb(249 115 22 / 0.8)";
  if (pct >= 51) return "rgb(234 179 8 / 0.8)";
  if (pct >= 26) return "rgb(56 189 248 / 0.8)";
  return "rgb(71 85 105 / 0.6)";
}

export default function LegendaryTargetLibraryWidget({
  libraryState, progressMap,
}: LegendaryTargetLibraryWidgetProps) {
  const goalSkill     = libraryState.goalSkillId ? SKILL_LIBRARY_MAP[libraryState.goalSkillId] : null;
  const goalProgress  = goalSkill ? (progressMap[goalSkill.id] ?? null) : null;
  const topLegendary  = getLegendarySkillsByReadiness(progressMap).slice(0, 2);

  return (
    <div className="bg-surface-800 border border-yellow-500/25 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>🌟</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-yellow-400">Legendary Target</span>
        </div>
        <Link
          href="/legendary-skills"
          className="font-mono text-[9px] text-yellow-400 hover:text-yellow-300 border border-yellow-500/25 px-2 py-0.5 rounded-lg transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Goal skill */}
      {goalSkill && goalProgress && (
        <div className="mb-3 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <div className="font-mono text-[8px] text-yellow-400/60 uppercase mb-1">Your Goal</div>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke={ringColor(goalProgress.pct)}
                  strokeWidth="3"
                  strokeDasharray={`${(goalProgress.pct / 100) * 88} 88`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[8px] text-yellow-400">{goalProgress.pct}%</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white font-medium truncate">{goalSkill.name}</div>
              <div className="text-[10px] text-white/30">{goalSkill.icon} {goalSkill.tier}</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 2 legendary skills */}
      {topLegendary.map(({ skill, progress }) => {
        if (skill.id === libraryState.goalSkillId) return null;
        const pct = progress?.pct ?? 0;
        return (
          <div key={skill.id} className="flex items-center gap-3 mb-2">
            <span className="text-xl flex-shrink-0">{skill.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between font-mono text-[9px] text-white/50 mb-0.5">
                <span className="truncate">{skill.name}</span>
                <span className="flex-shrink-0 ml-1">{pct}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width:           `${pct}%`,
                    backgroundColor: ringColor(pct),
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {!goalSkill && (
        <Link
          href="/legendary-skills"
          className="flex items-center justify-center gap-1.5 mt-2 py-2 rounded-xl border border-yellow-500/25 text-yellow-400 font-mono text-[9px] uppercase tracking-widest hover:bg-yellow-500/10 transition-all"
        >
          <span>+</span><span>Set a Goal Skill</span>
        </Link>
      )}
    </div>
  );
}
