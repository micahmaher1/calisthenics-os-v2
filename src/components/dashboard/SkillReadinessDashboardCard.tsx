"use client";

/**
 * SkillReadinessDashboardCard
 *
 * Dashboard widget showing:
 * - The #1 closest skill to unlock (Closest Unlock)
 * - 2 more approaching skills
 * - Weakest area for the top skill
 *
 * Placed in the right sidebar of ZONE 6: SYSTEMS.
 */

import Link from "next/link";
import { SkillProgress, SKILL_READINESS_META } from "@/lib/skill-requirements-types";
import { ALL_SKILLS } from "@/lib/skill-requirements-data";
import { calcReadinessBreakdown, getWeakestCategory } from "@/lib/skill-readiness-breakdown";

interface Props {
  progressMap: Record<string, SkillProgress>;
}

// ─── SVG readiness ring ───────────────────────────────────────────────────────

function ReadinessRing({
  pct, size = 44, icon = "", showIcon = true,
}: {
  pct: number; size?: number; icon?: string; showIcon?: boolean;
}) {
  const pad   = 3.5;
  const r     = size / 2 - pad;
  const cx    = size / 2;
  const cy    = size / 2;
  const circ  = 2 * Math.PI * r;
  const off   = circ - (Math.min(pct, 100) / 100) * circ;
  const color =
    pct >= 76 ? "#f97316" :
    pct >= 51 ? "#eab308" :
    pct >= 26 ? "#38bdf8" :
    "#1e293b";

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke={color} strokeWidth="2.5"
          strokeDasharray={circ} strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.7s ease" }}
        />
      </svg>
      {showIcon && (
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <span style={{ fontSize: size * 0.3 }}>{icon}</span>
        </div>
      )}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SkillReadinessDashboardCard({ progressMap }: Props) {
  const sorted = ALL_SKILLS
    .map((s) => ({ skill: s, progress: progressMap[s.id] }))
    .filter((x) => x.progress && x.progress.pct > 0 && x.progress.pct < 100)
    .sort((a, b) => b.progress.pct - a.progress.pct);

  if (sorted.length === 0) return null;

  const [top, ...rest] = sorted;
  const nextTwo        = rest.slice(0, 2);

  const topBreakdown = calcReadinessBreakdown(top.skill.id, top.progress);
  const weakest      = getWeakestCategory(topBreakdown);
  const topMeta      = SKILL_READINESS_META[top.progress.readiness];

  return (
    <div className="bg-surface-800 border border-teal-500/20 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🎯</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400">Closest Unlock</span>
        </div>
        <Link href="/library" className="font-mono text-[9px] text-white/30 hover:text-teal-400 transition-colors">
          All Skills →
        </Link>
      </div>

      {/* Top skill */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-1">
          <ReadinessRing pct={top.progress.pct} size={52} icon={top.skill.icon} showIcon />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white truncate leading-snug">
              {top.skill.name}
            </div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-full border ${topMeta.border} ${topMeta.bg} ${topMeta.color}`}>
                {topMeta.icon} {topMeta.label}
              </span>
              <span className="font-mono text-[8px] text-white/30">
                {top.progress.pct}% ready
              </span>
            </div>
          </div>
        </div>

        {/* Weakest area */}
        {weakest && (
          <div className="mt-2.5 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-red-500/15 bg-red-500/[0.04]">
            <span className="text-[11px]">{weakest.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[8px] text-white/40 flex justify-between">
                <span className="text-red-400/70">Weak: {weakest.label}</span>
                <span>{weakest.pct}%</span>
              </div>
              <div className="mt-0.5 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500/50 rounded-full"
                  style={{ width: `${weakest.pct}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Breakdown bars (top categories) */}
        {topBreakdown.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {topBreakdown.slice(0, 3).map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center justify-between font-mono text-[8px] text-white/30 mb-0.5">
                  <span className="flex items-center gap-1">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                  <span className={cat.pct >= 100 ? "text-green-400" : ""}>{cat.pct}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${cat.pct}%`,
                      background:
                        cat.pct >= 100 ? "#22c55e" :
                        cat.pct >= 76  ? "#f97316" :
                        cat.pct >= 51  ? "#eab308" :
                        cat.pct >= 26  ? "#38bdf8" :
                        "#334155",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Next 2 approaching skills */}
        {nextTwo.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-white/5 space-y-2">
            <div className="font-mono text-[8px] uppercase text-white/20 tracking-widest mb-1.5">Also approaching</div>
            {nextTwo.map(({ skill, progress }) => {
              const meta = SKILL_READINESS_META[progress.readiness];
              return (
                <div key={skill.id} className="flex items-center gap-2.5">
                  <ReadinessRing pct={progress.pct} size={30} icon={skill.icon} showIcon />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-white/55 truncate leading-tight">{skill.name}</div>
                    <span className={`font-mono text-[8px] ${meta.color}`}>{progress.pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
