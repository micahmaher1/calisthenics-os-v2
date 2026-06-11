"use client";

import Link from "next/link";
import { LibrarySkill } from "@/lib/library-types";
import { SkillProgress, SKILL_TIER_META, SKILL_READINESS_META } from "@/lib/skill-requirements-types";
import { getAcademyEntry } from "@/lib/skill-academy-data";

interface Props {
  skill:      LibrarySkill;
  progress:   SkillProgress | null;
  featured?:  boolean;
}

export default function AcademySkillCard({ skill, progress, featured }: Props) {
  const tierMeta   = SKILL_TIER_META[skill.tier];
  const hasAcademy = !!getAcademyEntry(skill.id);
  const pct        = progress?.pct ?? 0;
  const readiness  = progress ? SKILL_READINESS_META[progress.readiness] : null;

  const barColor =
    pct >= 100 ? "#22c55e" :
    pct >= 76  ? "#f97316" :
    pct >= 51  ? "#eab308" :
    pct >= 26  ? "#38bdf8" :
    "#1e293b";

  return (
    <Link
      href={`/academy/${skill.id}`}
      className={`group block bg-surface-800 border rounded-2xl overflow-hidden transition-all hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] ${
        skill.isLegendary
          ? "border-yellow-500/25 hover:border-yellow-500/50 hover:shadow-yellow-500/10"
          : featured
          ? `${tierMeta.border} hover:border-white/20`
          : "border-white/8 hover:border-white/20"
      }`}
    >
      {/* Legendary shimmer top bar */}
      {skill.isLegendary && (
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${tierMeta.border} ${tierMeta.bg}`}>
            {skill.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-display text-[14px] font-semibold leading-tight ${skill.isLegendary ? "text-yellow-300" : "text-white"} group-hover:text-white transition-colors`}>
              {skill.name}
            </div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-full border ${tierMeta.border} ${tierMeta.bg} ${tierMeta.color}`}>
                {tierMeta.icon} {tierMeta.label}
              </span>
              <span className="font-mono text-[8px] text-white/25 uppercase">{skill.domain}</span>
              {skill.isLegendary && (
                <span className="font-mono text-[8px] text-yellow-400/70">👑 Legendary</span>
              )}
            </div>
          </div>
          {hasAcademy && (
            <div className="flex-shrink-0">
              <span className="font-mono text-[7px] text-green-400/60 border border-green-500/20 px-1.5 py-0.5 rounded-full">
                GUIDE
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="font-body text-[11px] text-white/40 leading-relaxed mb-3 line-clamp-2">
          {skill.description}
        </p>

        {/* Readiness */}
        {progress && (
          <div>
            <div className="flex items-center justify-between font-mono text-[8px] mb-1">
              <span className={readiness?.color ?? "text-white/30"}>
                {readiness?.icon} {readiness?.label}
              </span>
              <span className="text-white/35">{pct}% ready</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: barColor }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`px-4 py-2 border-t border-white/5 flex items-center justify-between ${
        skill.isLegendary ? "bg-yellow-500/[0.02]" : "bg-white/[0.01]"
      }`}>
        <span className="font-mono text-[8px] text-white/20">
          {skill.masteryCategories.slice(0, 2).join(" · ")}
        </span>
        <span className="font-mono text-[9px] text-white/30 group-hover:text-white/60 transition-colors">
          View Guide →
        </span>
      </div>
    </Link>
  );
}
