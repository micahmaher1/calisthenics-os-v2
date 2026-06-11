"use client";

import { LibrarySkill } from "@/lib/library-types";
import { SkillProgress } from "@/lib/skill-requirements-types";
import { SKILL_TIER_META } from "@/lib/skill-requirements-types";

interface SkillLibraryCardProps {
  skill:    LibrarySkill;
  progress: SkillProgress | null;
  selected: boolean;
  completed: boolean;
  tracked:  boolean;
  onClick:  () => void;
}

export default function SkillLibraryCard({
  skill, progress, selected, completed, tracked, onClick,
}: SkillLibraryCardProps) {
  const tierMeta = SKILL_TIER_META[skill.tier];
  const pct      = progress?.pct ?? 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-3 transition-all hover:border-white/20 ${
        selected
          ? "border-yellow-500/50 bg-yellow-500/8 shadow-md shadow-yellow-500/10"
          : skill.isLegendary
          ? "border-yellow-500/20 bg-yellow-500/3 hover:bg-yellow-500/6"
          : "border-white/8 bg-white/3 hover:bg-white/5"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{skill.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 mb-1">
            <span className="text-sm font-medium text-white truncate">{skill.name}</span>
            {completed && (
              <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 flex-shrink-0">
                DONE
              </span>
            )}
            {tracked && !completed && (
              <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex-shrink-0">
                TRACKING
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-mono text-[8px] ${tierMeta.color}`}>
              {tierMeta.icon} {tierMeta.label}
            </span>
            <span className="font-mono text-[8px] text-white/25 uppercase">{skill.domain}</span>
          </div>
          {progress !== null && (
            <div>
              <div className="flex justify-between font-mono text-[8px] text-white/30 mb-1">
                <span>Readiness</span>
                <span>{pct}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width:           `${pct}%`,
                    backgroundColor: pct >= 76 ? "#f97316" : pct >= 51 ? "#eab308" : "#38bdf8",
                    opacity:         0.7,
                  }}
                />
              </div>
            </div>
          )}
          {progress === null && (
            <span className="font-mono text-[8px] text-slate-500">🔒 Requirements TBD</span>
          )}
        </div>
      </div>
    </button>
  );
}
