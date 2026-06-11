"use client";

import Link from "next/link";
import { LegendaryTarget } from "@/lib/training-hub-types";

export default function LegendaryTargetWidget({ target }: { target: LegendaryTarget }) {
  const { journeyDef, overallPct, stageName, stagesLeft, topRequirements } = target;
  return (
    <div className="bg-surface-800 border border-yellow-500/30 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{journeyDef.icon}</span>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-yellow-400">Goal Journey</div>
          <div className="text-sm font-medium text-white">{journeyDef.name}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="14" fill="none" stroke="rgb(234 179 8 / 0.7)"
              strokeWidth="3" strokeDasharray={`${(overallPct / 100) * 88} 88`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[9px] text-yellow-400 stat-number">{overallPct}%</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-white/60">Stage: <span className="text-white/80">{stageName}</span></div>
          <div className="font-mono text-[9px] text-white/30 stat-number">{stagesLeft} stages remaining</div>
        </div>
      </div>
      {topRequirements.length > 0 && (
        <div className="space-y-1 mb-3">
          {topRequirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-white/40">
              <span className="w-2 h-2 rounded-full bg-yellow-500/30 flex-shrink-0" />
              {req}
            </div>
          ))}
        </div>
      )}
      <Link href="/journeys" className="block font-mono text-[10px] text-yellow-400 hover:text-yellow-300 transition-colors">
        Continue Journey →
      </Link>
    </div>
  );
}
