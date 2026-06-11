"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadStandardsState } from "@/lib/movement-standards-storage";
import { loadRecordsState } from "@/lib/records-storage";
import { calcAllStandardsProgress } from "@/lib/movement-standards-engine";
import { MOVEMENT_STANDARDS } from "@/lib/movement-standards-data";
import { StandardProgress, STANDARD_RANK_META } from "@/lib/movement-standards-types";

interface StdEntry {
  id:     string;
  name:   string;
  icon:   string;
  prog:   StandardProgress;
}

function rankColor(rank: string): string {
  switch (rank) {
    case "bronze":    return "text-amber-600 bg-amber-900/40 border-amber-700/50";
    case "silver":    return "text-slate-300 bg-slate-700/40 border-slate-500/40";
    case "gold":      return "text-yellow-400 bg-yellow-900/30 border-yellow-600/40";
    case "elite":     return "text-sky-400 bg-sky-900/30 border-sky-500/40";
    case "legendary": return "text-purple-400 bg-purple-900/30 border-purple-500/40";
    default:          return "text-slate-500 bg-slate-800/40 border-slate-700/40";
  }
}

function barColor(rank: string): string {
  switch (rank) {
    case "bronze":    return "from-amber-600 to-amber-500";
    case "silver":    return "from-slate-400 to-slate-300";
    case "gold":      return "from-yellow-500 to-yellow-400";
    case "elite":     return "from-sky-500 to-sky-400";
    case "legendary": return "from-purple-500 to-purple-400";
    default:          return "from-slate-600 to-slate-500";
  }
}

export default function MovementStandardsWidget() {
  const [entries, setEntries] = useState<StdEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const sState = loadStandardsState();
      const rState = loadRecordsState();
      const pm = calcAllStandardsProgress(rState, sState);
      const list: StdEntry[] = MOVEMENT_STANDARDS.slice(0, 6).map((std) => ({
        id:   std.id,
        name: std.name,
        icon: std.icon,
        prog: pm[std.id] ?? { currentRank: "unranked", nextRank: "bronze", pct: 0, currentValue: 0, nextThreshold: null, pointsEarned: 0 },
      }));
      setEntries(list);
    } catch {
      // ignore
    }
    setTimeout(() => setMounted(true), 100);
  }, []);

  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d1117] overflow-hidden">
      <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #f59e0b, transparent)" }} />
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="text-base">🏅</span>
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-white/50">Movement Standards</span>
        </div>
        <Link href="/standards" className="font-mono text-[9px] tracking-widest uppercase text-white/20 hover:text-white/50 transition-colors">
          VIEW ALL →
        </Link>
      </div>
      <div className="px-4 py-3 space-y-2.5">
        {entries.map((e) => {
          const currentMeta = STANDARD_RANK_META[e.prog.currentRank];
          const rankCls     = rankColor(e.prog.currentRank);
          const barCls      = barColor(e.prog.nextRank ?? e.prog.currentRank);
          return (
            <div key={e.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{e.icon}</span>
                  <span className="text-xs text-white/70">{e.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-full border ${rankCls}`}>
                    {currentMeta.icon} {currentMeta.label}
                  </span>
                  {e.prog.nextRank && (
                    <span className="font-mono text-[8px] text-white/20">→ {STANDARD_RANK_META[e.prog.nextRank].label}</span>
                  )}
                </div>
              </div>
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${barCls}`}
                  style={{ width: mounted ? `${e.prog.pct}%` : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
