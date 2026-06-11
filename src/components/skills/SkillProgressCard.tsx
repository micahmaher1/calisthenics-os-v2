"use client";

import { SkillDef, SkillProgress, SKILL_READINESS_META, SKILL_TIER_META } from "@/lib/skill-requirements-types";

interface SkillProgressCardProps {
  skill:    SkillDef;
  progress: SkillProgress;
  selected: boolean;
  onClick:  () => void;
}

export default function SkillProgressCard({ skill, progress, selected, onClick }: SkillProgressCardProps) {
  const readinessMeta = SKILL_READINESS_META[progress.readiness];
  const tierMeta      = SKILL_TIER_META[skill.tier];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all ${
        selected
          ? `${readinessMeta.border} ${readinessMeta.bg} ring-1 ring-inset ${readinessMeta.border}`
          : "border-white/8 bg-surface-800/50 hover:bg-white/5 hover:border-white/15"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="text-xl flex-shrink-0 w-8 text-center">{skill.icon}</div>

        {/* Name + tier */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-medium text-white truncate">{skill.name}</span>
            {skill.featured && (
              <span className="text-[8px] text-yellow-400 flex-shrink-0">★</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`font-mono text-[8px] uppercase tracking-widest ${tierMeta.color}`}>
              {tierMeta.icon} {tierMeta.label}
            </span>
          </div>
        </div>

        {/* Readiness + pct */}
        <div className="flex-shrink-0 text-right">
          <div className={`font-mono text-xs font-bold ${readinessMeta.color}`}>
            {progress.pct}%
          </div>
          <div className={`font-mono text-[8px] ${readinessMeta.color}`}>
            {readinessMeta.icon}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            progress.pct >= 100
              ? "bg-green-500/70"
              : progress.pct >= 76
              ? "bg-orange-500/70"
              : progress.pct >= 51
              ? "bg-yellow-500/70"
              : progress.pct >= 26
              ? "bg-sky-500/70"
              : "bg-slate-600/70"
          }`}
          style={{ width: `${progress.pct}%` }}
        />
      </div>
    </button>
  );
}
