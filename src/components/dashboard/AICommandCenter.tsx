"use client";

import Link from "next/link";
import { CoachAnalysis, CoachSettings } from "@/lib/coach-types";

export default function AICommandCenter({ analysis, settings }: { analysis: CoachAnalysis; settings: CoachSettings }) {
  const recs  = analysis.recommendations.slice(0, 3);
  const focus = analysis.todayFocus;

  const priorityIcon = (priority: string) => {
    switch (priority) {
      case "critical": return "🔴";
      case "high":     return "🟠";
      case "medium":   return "🟡";
      default:         return "⚪";
    }
  };

  return (
    <div className="bg-surface-800 border border-purple-500/20 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-purple-400">AI Command Center</div>
            <div className="text-[10px] text-white/30 capitalize">{settings.personality} Coach</div>
          </div>
        </div>
        <Link href="/coach" className="font-mono text-[10px] text-purple-400 border border-purple-500/25 px-2.5 py-1 rounded-lg hover:bg-purple-500/15 transition-colors">
          Full Analysis →
        </Link>
      </div>

      {focus && (
        <div className="mb-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/15">
          <div className="flex items-center gap-2">
            <span>{focus.icon}</span>
            <div className="flex-1">
              <div className="text-xs font-medium text-white">{focus.title}</div>
              <div className="text-[10px] text-white/40">{focus.subtitle}</div>
            </div>
            {focus.xpReward && (
              <span className="font-mono text-[9px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded-full">
                +{focus.xpReward} XP
              </span>
            )}
          </div>
        </div>
      )}

      {recs.length > 0 ? (
        <div className="space-y-2">
          {recs.map((r) => (
            <div key={r.id} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/3 border border-white/5">
              <span className="text-sm flex-shrink-0">{priorityIcon(r.priority)}</span>
              <span className="text-base flex-shrink-0">{r.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white/70 font-medium">{r.title}</div>
                <div className="text-[10px] text-white/40 line-clamp-2">{r.message}</div>
              </div>
              {r.actionHref && (
                <Link href={r.actionHref} className="flex-shrink-0 font-mono text-[9px] text-purple-400 hover:text-purple-300 transition-colors">
                  →
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 border border-dashed border-white/8 rounded-xl">
          <p className="text-sm text-white/30">No recommendations right now</p>
          <p className="font-mono text-[9px] text-white/20 mt-1">Log workouts to unlock coach insights</p>
        </div>
      )}
    </div>
  );
}
