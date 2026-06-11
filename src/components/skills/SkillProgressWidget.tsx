"use client";

import Link from "next/link";
import { SkillProgress, SkillSnapshot, SKILL_READINESS_META } from "@/lib/skill-requirements-types";
import { ALL_SKILLS } from "@/lib/skill-requirements-data";

interface SkillProgressWidgetProps {
  progressMap: Record<string, SkillProgress>;
  snap:        SkillSnapshot;
}

export default function SkillProgressWidget({ progressMap }: SkillProgressWidgetProps) {
  // Top 3 skills by progress (closest to ready but not yet ready)
  const topSkills = ALL_SKILLS
    .map((s) => ({ skill: s, progress: progressMap[s.id] }))
    .filter((x) => x.progress && x.progress.pct < 100)
    .sort((a, b) => b.progress.pct - a.progress.pct)
    .slice(0, 3);

  if (topSkills.length === 0) return null;

  return (
    <div className="bg-surface-800 border border-teal-500/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>🎯</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400">Skill Progress</span>
        </div>
        <Link href="/skills" className="font-mono text-[10px] text-teal-400 hover:text-teal-300 transition-colors">
          View All →
        </Link>
      </div>

      <div className="space-y-2.5">
        {topSkills.map(({ skill, progress }) => {
          const readinessMeta = SKILL_READINESS_META[progress.readiness];
          return (
            <div key={skill.id}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{skill.icon}</span>
                <span className="text-xs text-white/70 flex-1 truncate">{skill.name}</span>
                <span className={`font-mono text-[9px] ${readinessMeta.color}`}>
                  {progress.pct}%
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    progress.pct >= 76 ? "bg-orange-500/70"
                    : progress.pct >= 51 ? "bg-yellow-500/70"
                    : progress.pct >= 26 ? "bg-sky-500/70"
                    : "bg-slate-600/70"
                  }`}
                  style={{ width: `${progress.pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/skills"
        className="mt-3 flex items-center justify-center gap-1 text-teal-400 font-mono text-[10px] hover:text-teal-300 transition-colors border-t border-white/5 pt-3"
      >
        <span>VIEW ALL SKILLS</span>
        <span>→</span>
      </Link>
    </div>
  );
}
