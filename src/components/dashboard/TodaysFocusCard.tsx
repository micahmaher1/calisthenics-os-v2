"use client";

/**
 * TodaysFocusCard — replaces the duplicate quick-navigation row.
 * Surfaces the most immediately actionable progression information:
 * what to train, what's closest to unlocking, and today's coaching insight.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadMasteryState } from "@/lib/mastery-storage";
import { MasteryState, MasteryCategory, MASTERY_CATEGORY_META } from "@/lib/mastery-types";
import { loadJourneyState } from "@/lib/journey-storage";
import { JourneyState } from "@/lib/journey-types";
import { JOURNEY_MAP } from "@/lib/journey-data";
import { loadStandardsState } from "@/lib/movement-standards-storage";
import { calcAllStandardsProgress } from "@/lib/movement-standards-engine";
import { loadRecordsState } from "@/lib/records-storage";
import { STANDARDS_MAP } from "@/lib/movement-standards-data";
import { STANDARD_RANK_META } from "@/lib/movement-standards-types";
import { v2LoadTreeState, v2FindNextUnlock } from "@/lib/v2-skilltree-engine";

interface FocusItem {
  icon:     string;
  label:    string;   // e.g. "NEXT SKILL"
  title:    string;   // e.g. "Tuck Front Lever"
  detail:   string;   // e.g. "2 prereqs met"
  pct:      number;   // 0–100
  barColor: string;   // CSS color
  href:     string;
}

export default function TodaysFocusCard() {
  const [items, setItems] = useState<FocusItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const collected: FocusItem[] = [];

    // ── 1. Next skill unlock ─────────────────────────────────────────
    try {
      const treeState = v2LoadTreeState();
      const skill = v2FindNextUnlock(treeState);
      if (skill) {
        const total = skill.prerequisites.length;
        const met   = skill.prerequisites.filter(
          p => treeState.unlockedNodes.includes(p) || treeState.completedNodes.includes(p)
        ).length;
        const pct = total > 0 ? Math.round((met / total) * 100) : 50;
        collected.push({
          icon: skill.icon ?? "🌳",
          label: "NEXT SKILL UNLOCK",
          title: skill.name,
          detail: total > 0 ? `${met}/${total} prerequisites met` : "Available to unlock now",
          pct,
          barColor: "#2dd4bf",
          href: "/tree",
        });
      }
    } catch { /* ignore */ }

    // ── 2. Active journey ───────────────────────────────────────────
    try {
      const jState: JourneyState = loadJourneyState();
      const activeId = jState.activeJourneyId;
      if (activeId) {
        const progress = jState.journeyProgress?.[activeId];
        const def      = JOURNEY_MAP[activeId];
        if (def && progress) {
          const stage    = progress.currentStageIndex ?? 0;
          const total    = def.stages.length;
          const pct      = Math.round((stage / total) * 100);
          const stageDef = def.stages[stage];
          collected.push({
            icon: "🗺️",
            label: "ACTIVE JOURNEY",
            title: def.name,
            detail: stageDef ? `Stage ${stage + 1}/${total}: ${stageDef.name}` : `${stage}/${total} stages`,
            pct,
            barColor: "#22d3ee",
            href: "/journeys",
          });
        }
      }
    } catch { /* ignore */ }

    // ── 3. Closest standard upgrade ─────────────────────────────────
    try {
      const stdState  = loadStandardsState();
      const recState  = loadRecordsState();
      const progressMap = calcAllStandardsProgress(recState, stdState);

      let bestPct = -1;
      let bestId  = "";
      for (const [id, prog] of Object.entries(progressMap)) {
        if (prog.nextRank && prog.pct > bestPct && prog.pct < 100) {
          bestPct = prog.pct;
          bestId  = id;
        }
      }

      if (bestId) {
        const std  = STANDARDS_MAP[bestId];
        const prog = progressMap[bestId];
        if (std && prog) {
          const nextMeta = prog.nextRank ? STANDARD_RANK_META[prog.nextRank] : null;
          const currMeta = STANDARD_RANK_META[prog.currentRank];
          collected.push({
            icon: std.icon,
            label: "STANDARDS PROGRESS",
            title: std.name,
            detail: `${currMeta.label} → ${nextMeta?.label ?? "Legendary"}`,
            pct: prog.pct,
            barColor: "#fbbf24",
            href: "/standards",
          });
        }
      }
    } catch { /* ignore */ }

    // ── 4. Weakest mastery category ──────────────────────────────────
    try {
      const mState: MasteryState = loadMasteryState();
      const cats = Object.entries(mState.categories) as [MasteryCategory, { totalXP: number; level: number }][];
      if (cats.length > 0) {
        const sorted = [...cats].sort((a, b) => a[1].level - b[1].level);
        const [weakestId, weakestCat] = sorted[0];
        const meta = MASTERY_CATEGORY_META[weakestId];
        if (meta) {
          const lvl         = weakestCat.level;
          const xpIntoLevel = weakestCat.totalXP % 100;
          const pct         = Math.min(99, xpIntoLevel);
          collected.push({
            icon: meta.icon,
            label: "WEAKEST ATTRIBUTE",
            title: `${meta.label} — Lv.${lvl}`,
            detail: "Focus here to balance your build",
            pct,
            barColor: "#f87171",
            href: "/mastery",
          });
        }
      }
    } catch { /* ignore */ }

    setItems(collected);
    setTimeout(() => setMounted(true), 80);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d1117] overflow-hidden">
      {/* Accent line */}
      <div className="h-[2px]" style={{ background: "linear-gradient(90deg,#4ade80,#22d3ee,#a855f7,transparent)" }} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="text-sm">🎯</span>
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-white/50">Today&apos;s Focus</span>
        </div>
        <span className="font-mono text-[8.5px] tracking-widest uppercase text-white/20">
          Personalized objectives
        </span>
      </div>

      {/* Grid of focus items */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.03]">
        {items.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group flex flex-col gap-2 px-4 py-3 bg-[#0d1117] hover:bg-white/[0.025] transition-colors"
          >
            {/* Label */}
            <span className="font-mono text-[8.5px] font-bold tracking-widest uppercase text-white/25 group-hover:text-white/40 transition-colors">
              {item.label}
            </span>

            {/* Icon + Title */}
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">{item.icon}</span>
              <span className="font-mono text-[11px] font-semibold text-white/75 group-hover:text-white/90 transition-colors leading-tight">
                {item.title}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width:      mounted ? `${item.pct}%` : "0%",
                  background: item.barColor,
                  boxShadow:  `0 0 6px ${item.barColor}60`,
                }}
              />
            </div>

            {/* Detail + pct */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8.5px] text-white/30 leading-tight">{item.detail}</span>
              <span className="font-mono text-[9px] font-bold" style={{ color: item.barColor }}>{item.pct}%</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
