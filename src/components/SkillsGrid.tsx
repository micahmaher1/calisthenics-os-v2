"use client";

import { SkillMap, Skill } from "@/lib/types";
import {
  calcLevelProgress, calcXPToNextLevel,
  getSkillAccentClass, getSkillBarClass,
} from "@/lib/xp";
import { formatXP } from "@/lib/utils";
import { PersonalRecords } from "@/lib/stats";

interface SkillsGridProps {
  skills:  SkillMap;
  records?: PersonalRecords;
}

const PR_LABELS: Record<string, keyof PersonalRecords> = {
  "push-ups": "maxPushUpReps",
  "pull-ups": "maxPullUpReps",
  dips:       "maxDipReps",
};

export default function SkillsGrid({ skills, records }: SkillsGridProps) {
  return (
    <section className="animate-slide-up stagger-3 space-y-3">
      <SectionLabel icon="⚡">Skills</SectionLabel>
      <div className="flex flex-col gap-2.5">
        {Object.values(skills).map((skill, i) => (
          <SkillCard
            key={skill.name}
            skill={skill}
            delay={i}
            pr={records ? (records[PR_LABELS[skill.name]] as number) : undefined}
          />
        ))}
      </div>

      {/* Personal Records Panel */}
      {records && (records.longestStreak > 0 || records.maxPushUpReps > 0 || records.maxPullUpReps > 0) && (
        <div>
          <SectionLabel icon="🏅">Personal Records</SectionLabel>
          <div className="bg-surface-800 border border-white/5 rounded-xl divide-y divide-white/5">
            {records.longestStreak > 0 && (
              <PRRow icon="🔥" label="Longest Streak" value={`${records.longestStreak} days`} color="text-orange-400" />
            )}
            {records.maxPushUpReps > 0 && (
              <PRRow icon="🤜" label="Max Push-Ups"  value={`${records.maxPushUpReps} reps`} color="text-green-400" />
            )}
            {records.maxPullUpReps > 0 && (
              <PRRow icon="🦅" label="Max Pull-Ups"  value={`${records.maxPullUpReps} reps`} color="text-sky-400" />
            )}
            {records.maxDipReps > 0 && (
              <PRRow icon="⚡" label="Max Dips"       value={`${records.maxDipReps} reps`}    color="text-amber-400" />
            )}
            {records.highestDayXP > 0 && (
              <PRRow icon="⚡" label="Best Day XP"    value={`${records.highestDayXP} XP`}    color="text-yellow-400" />
            )}
            {records.highestWeekXP > 0 && (
              <PRRow icon="📅" label="Best Week XP"   value={`${records.highestWeekXP} XP`}   color="text-yellow-400" />
            )}
          </div>
        </div>
      )}

      {/* Totals */}
      {records && (records.totalPushUps + records.totalPullUps + records.totalDips) > 0 && (
        <div>
          <SectionLabel icon="📊">Lifetime Reps</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {records.totalPushUps > 0 && (
              <TotalChip icon="🤜" label="Push-Ups" value={records.totalPushUps} color="text-green-400" bg="bg-green-500/8" border="border-green-500/15" />
            )}
            {records.totalPullUps > 0 && (
              <TotalChip icon="🦅" label="Pull-Ups" value={records.totalPullUps} color="text-sky-400"   bg="bg-sky-500/8"   border="border-sky-500/15" />
            )}
            {records.totalDips > 0 && (
              <TotalChip icon="⚡" label="Dips"     value={records.totalDips}    color="text-amber-400" bg="bg-amber-500/8"  border="border-amber-500/15" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function SkillCard({ skill, delay, pr }: { skill: Skill; delay: number; pr?: number }) {
  const progress  = calcLevelProgress(skill.xp);
  const xpToNext  = calcXPToNextLevel(skill.xp);
  const accentText = getSkillAccentClass(skill.color);
  const barBg     = getSkillBarClass(skill.color);

  const bgMap: Record<string, string>     = { brand: "bg-green-500/8",  sky: "bg-sky-500/8",  amber: "bg-amber-500/8" };
  const borderMap: Record<string, string> = { brand: "border-green-500/15", sky: "border-sky-500/15", amber: "border-amber-500/15" };

  return (
    <div
      className={`relative overflow-hidden ${bgMap[skill.color] ?? "bg-white/5"} border ${borderMap[skill.color] ?? "border-white/5"} rounded-xl p-4`}
      style={{ animationDelay: `${delay * 60}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{skill.icon}</span>
          <div>
            <p className="font-body text-sm font-semibold text-white leading-tight">{skill.label}</p>
            <p className={`font-mono text-[9px] ${accentText} opacity-70`}>{formatXP(skill.xp)} XP</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-display text-2xl ${accentText}`}>Lv.{skill.level}</div>
          {pr !== undefined && pr > 0 && (
            <p className="font-mono text-[8px] text-white/25">PR: {pr} reps</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
          <div
            className={`h-full ${barBg} rounded-full progress-bar`}
            style={{ "--bar-width": `${progress}%` } as React.CSSProperties}
          />
        </div>
        <div className="flex justify-between">
          <span className="font-mono text-[8px] text-white/20">{Math.round(progress)}%</span>
          <span className={`font-mono text-[8px] ${accentText} opacity-60`}>{xpToNext} XP to next</span>
        </div>
      </div>
    </div>
  );
}

function PRRow({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">{label}</span>
      </div>
      <span className={`font-display text-base ${color}`}>{value}</span>
    </div>
  );
}

function TotalChip({ icon, label, value, color, bg, border }: {
  icon: string; label: string; value: number; color: string; bg: string; border: string;
}) {
  return (
    <div className={`${bg} border ${border} rounded-xl px-2 py-2.5 text-center`}>
      <div className="text-base mb-1">{icon}</div>
      <div className={`font-display text-lg ${color}`}>
        {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
      </div>
      <div className="font-mono text-[7px] text-white/25 uppercase tracking-widest">{label}</div>
    </div>
  );
}

function SectionLabel({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {icon && <span className="text-xs opacity-40">{icon}</span>}
      <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">{children}</span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}
