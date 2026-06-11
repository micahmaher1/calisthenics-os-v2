"use client";

import Link from "next/link";
import { CoachAnalysis } from "@/lib/coach-types";
import { CoachSettings, COACH_PERSONALITY_META } from "@/lib/coach-types";
import { PRIORITY_STYLES } from "./coach-utils";

interface Props {
  analysis: CoachAnalysis;
  settings: CoachSettings;
}

export default function CoachDashboardCard({ analysis, settings }: Props) {
  const { todayFocus, recommendations, milestoneForecasts, trainingBalance } = analysis;
  const personality = COACH_PERSONALITY_META[settings.personality];
  const topRecs  = recommendations.slice(0, 3);

  return (
    <section className="animate-slide-up stagger-3">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">AI Coach</span>
        <div className="flex-1 h-px bg-white/5" />
        <Link
          href="/coach"
          className="font-mono text-[9px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors"
        >
          Full Analysis →
        </Link>
      </div>

      <div className={`bg-surface-800 border ${personality.borderClass} rounded-2xl overflow-hidden`}>
        {/* Top accent bar */}
        <div className={`h-0.5 w-full bg-gradient-to-r from-transparent via-current to-transparent ${personality.accentColor}`} />

        {/* Coach header */}
        <div className={`flex items-center gap-3 px-5 pt-4 pb-3 border-b border-white/5 ${personality.bgClass}`}>
          <div className="text-3xl">{personality.icon}</div>
          <div className="flex-1 min-w-0">
            <p className={`font-display text-base tracking-wider ${personality.accentColor}`}>
              {personality.label}
            </p>
            <p className="font-mono text-[9px] text-white/40 leading-snug truncate">
              {personality.greeting}
            </p>
          </div>
          {todayFocus?.urgent && (
            <div className="flex-shrink-0 flex items-center gap-1 bg-red-500/15 border border-red-500/30 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="font-mono text-[9px] text-red-400 uppercase tracking-wider">Urgent</span>
            </div>
          )}
        </div>

        {/* Today's Focus */}
        {todayFocus ? (
          <div className="px-5 py-4 border-b border-white/5">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-2">Today's Focus</p>
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 mt-0.5">{todayFocus.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-display text-lg tracking-wider ${personality.accentColor} leading-tight`}>
                  {todayFocus.title}
                </p>
                <p className="font-body text-xs text-white/50 mt-1 leading-relaxed line-clamp-2">
                  {todayFocus.subtitle}
                </p>
                {todayFocus.xpReward && (
                  <span className="inline-block mt-1.5 font-mono text-[9px] text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2 py-0.5">
                    +{todayFocus.xpReward} XP Potential
                  </span>
                )}
              </div>
              {todayFocus.recommendation.actionHref && (
                <Link
                  href={todayFocus.recommendation.actionHref}
                  className={`flex-shrink-0 font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-xl border transition-all ${personality.bgClass} ${personality.borderClass} ${personality.accentColor} hover:opacity-80`}
                >
                  {todayFocus.recommendation.actionLabel ?? "Go"}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className={`font-display text-base tracking-wider ${personality.accentColor}`}>All Clear!</p>
                <p className="font-body text-xs text-white/40">No urgent recommendations. Keep up the great work!</p>
              </div>
            </div>
          </div>
        )}

        {/* Priority Recommendations (top 2) */}
        {topRecs.length > 1 && (
          <div className="px-5 py-3 border-b border-white/5 space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">Recommendations</p>
            {topRecs.slice(1, 3).map((rec) => {
              const style = PRIORITY_STYLES[rec.priority];
              return (
                <div
                  key={rec.id}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 ${style.bg} ${style.border} border`}
                >
                  <span className="text-base flex-shrink-0">{rec.icon}</span>
                  <p className={`font-body text-xs flex-1 leading-snug ${style.text}`}>{rec.title}</p>
                  {rec.actionHref && (
                    <Link href={rec.actionHref} className="font-mono text-[8px] text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
                      →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Milestone forecasts */}
        {milestoneForecasts.length > 0 && (
          <div className="px-5 py-3 border-b border-white/5">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 mb-2">Upcoming Milestones</p>
            <div className="flex flex-wrap gap-2">
              {milestoneForecasts.slice(0, 2).map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-1.5 bg-surface-700 border border-white/8 rounded-xl px-3 py-1.5"
                >
                  <span className="text-sm">{f.icon}</span>
                  <div>
                    <p className="font-mono text-[9px] text-white/60">{f.label}</p>
                    {f.estimatedDays !== null && (
                      <p className="font-mono text-[8px] text-white/30">
                        ~{f.estimatedDays}d away
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Training balance mini */}
        <div className="px-5 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">Training Balance (14d)</p>
            <Link href="/coach" className={`font-mono text-[8px] ${personality.accentColor} hover:opacity-70 transition-opacity`}>
              Full Analysis →
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {(["push","pull","core","legs"] as const).map((cat) => {
              const count = trainingBalance.counts[cat];
              const max   = Math.max(1, trainingBalance.total14 / 2);
              const pct   = Math.min(100, (count / max) * 100);
              const colors = { push: "bg-orange-400", pull: "bg-sky-400", core: "bg-red-400", legs: "bg-green-400" };
              return (
                <div key={cat} className="text-center">
                  <div className="h-10 bg-surface-700 rounded-lg overflow-hidden flex flex-col justify-end mb-1">
                    <div
                      className={`w-full ${colors[cat]} transition-all duration-700 rounded-b-lg`}
                      style={{ height: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                  <p className="font-mono text-[7px] text-white/30 uppercase">{cat}</p>
                  <p className="font-mono text-[9px] text-white/50">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
