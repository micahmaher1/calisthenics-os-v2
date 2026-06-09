"use client";

import { SkillMap, Skill } from "@/lib/types";
import {
  calcLevelProgress,
  calcXPToNextLevel,
  getSkillAccentClass,
  getSkillBarClass,
  getSkillGlowClass,
} from "@/lib/xp";
import { formatXP } from "@/lib/utils";

interface SkillsGridProps {
  skills: SkillMap;
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  return (
    <section className="animate-slide-up stagger-3">
      <SectionLabel>Skills</SectionLabel>
      <div className="flex flex-col gap-3">
        {Object.values(skills).map((skill, i) => (
          <SkillCard key={skill.name} skill={skill} delay={i} />
        ))}
      </div>
    </section>
  );
}

function SkillCard({ skill, delay }: { skill: Skill; delay: number }) {
  const progress = calcLevelProgress(skill.xp);
  const xpToNext = calcXPToNextLevel(skill.xp);
  const accentText = getSkillAccentClass(skill.color);
  const barBg = getSkillBarClass(skill.color);
  const glowShadow = getSkillGlowClass(skill.color);

  return (
    <div
      className={`relative overflow-hidden bg-surface-800 border border-white/5 rounded-xl p-4 noise shimmer stagger-${delay + 1}`}
      style={{ animationDelay: `${delay * 60}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{skill.icon}</span>
          <div>
            <p className="font-body text-sm font-medium text-white">
              {skill.label}
            </p>
            <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
              {formatXP(skill.xp)} XP
            </p>
          </div>
        </div>
        <div
          className={`font-display text-2xl ${accentText}`}
        >
          Lv.{skill.level}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
          <div
            className={`h-full ${barBg} rounded-full progress-bar shadow-sm ${glowShadow}`}
            style={{ "--bar-width": `${progress}%` } as React.CSSProperties}
          />
        </div>
        <div className="flex justify-between">
          <span className="font-mono text-[9px] text-white/20">
            {Math.round(progress)}%
          </span>
          <span className={`font-mono text-[9px] ${accentText} opacity-70`}>
            {xpToNext} XP to next
          </span>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
        {children}
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}
