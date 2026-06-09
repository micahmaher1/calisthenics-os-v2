"use client";

import { useState, useMemo } from "react";
import { Workout, SkillName } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface WorkoutHistoryProps {
  workouts: Workout[];
}

const SKILL_STYLES: Record<SkillName, { text: string; bg: string; border: string; bar: string; icon: string; label: string }> = {
  "push-ups": { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", bar: "bg-green-400", icon: "🤜", label: "Push-Ups" },
  "pull-ups": { text: "text-sky-400",   bg: "bg-sky-500/10",   border: "border-sky-500/20",   bar: "bg-sky-400",   icon: "🦅", label: "Pull-Ups" },
  dips:       { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", bar: "bg-amber-400", icon: "⚡", label: "Dips" },
};

const PAGE_SIZE = 7;

const FILTER_OPTIONS = [
  { value: "all",      label: "All",      icon: "📋" },
  { value: "push-ups", label: "Push-Ups", icon: "🤜" },
  { value: "pull-ups", label: "Pull-Ups", icon: "🦅" },
  { value: "dips",     label: "Dips",     icon: "⚡" },
  { value: "general",  label: "General",  icon: "💪" },
] as const;

type FilterValue = typeof FILTER_OPTIONS[number]["value"];

export default function WorkoutHistory({ workouts }: WorkoutHistoryProps) {
  const [page,   setPage]   = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    return workouts.filter((w) => {
      if (filter === "general"  && w.skillName !== null) return false;
      if (filter !== "all" && filter !== "general" && w.skillName !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          w.name.toLowerCase().includes(q) ||
          (w.notes && w.notes.toLowerCase().includes(q)) ||
          (w.skillName ?? "").includes(q)
        );
      }
      return true;
    });
  }, [workouts, filter, search]);

  const total   = filtered.length;
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < total;

  const totalXP = workouts.reduce((s, w) => s + w.xpEarned, 0);

  // Reset page when filters change
  const handleFilter = (v: FilterValue) => { setFilter(v); setPage(1); };
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  return (
    <section className="animate-slide-up stagger-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">History</span>
        <div className="flex-1 h-px bg-white/5" />
        {workouts.length > 0 && (
          <span className="font-mono text-[9px] text-white/20">
            {workouts.length} sessions · {totalXP.toLocaleString()} XP earned
          </span>
        )}
      </div>

      {workouts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search workouts…"
              className="w-full pl-9 pr-4 py-2.5 bg-surface-700 border border-white/5 rounded-xl text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-white/15 transition-colors font-body"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 text-sm"
              >×</button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex gap-1.5 flex-wrap">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleFilter(opt.value)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-mono text-[9px] uppercase tracking-widest transition-all ${
                  filter === opt.value
                    ? "bg-green-500/15 border-green-500/30 text-green-400"
                    : "bg-surface-700 border-white/5 text-white/30 hover:text-white/50 hover:border-white/10"
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Results info */}
          {(search || filter !== "all") && (
            <p className="font-mono text-[9px] text-white/20">
              {total} result{total !== 1 ? "s" : ""}
              {(search || filter !== "all") && (
                <button
                  onClick={() => { handleSearch(""); handleFilter("all"); }}
                  className="ml-2 text-white/30 hover:text-white/50"
                >
                  Clear filters ×
                </button>
              )}
            </p>
          )}

          {/* Workout list */}
          {total === 0 ? (
            <div className="py-8 text-center">
              <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">No results found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {visible.map((workout, i) => (
                <WorkoutCard key={workout.id} workout={workout} index={i} />
              ))}
              {hasMore && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="w-full py-3 rounded-xl border border-white/5 bg-surface-800 font-mono text-[10px] text-white/30 hover:text-white/50 hover:border-white/10 transition-all"
                >
                  Load {Math.min(PAGE_SIZE, total - visible.length)} more · {total - visible.length} remaining
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function WorkoutCard({ workout, index }: { workout: Workout; index: number }) {
  const skill  = workout.skillName ? SKILL_STYLES[workout.skillName] : null;
  const accentBar = skill?.bar ?? "bg-white/15";

  return (
    <div
      className="group relative overflow-hidden bg-surface-800 border border-white/5 rounded-xl hover:border-white/10 transition-all animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${accentBar} opacity-60 rounded-l-xl`} />

      <div className="flex items-center gap-3 px-4 py-3 pl-5">
        {/* Icon */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center text-base ${
          skill
            ? `${skill.bg} ${skill.border}`
            : "bg-white/5 border-white/5"
        }`}>
          {skill ? skill.icon : "💪"}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-body text-sm font-medium text-white truncate">{workout.name}</p>
            {skill && (
              <span className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${skill.text} ${skill.bg} ${skill.border}`}>
                {skill.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-[10px] text-white/30">{workout.reps} reps</span>
            {workout.notes && (
              <>
                <span className="text-white/15 text-[10px]">·</span>
                <span className="font-body text-[11px] text-white/20 truncate max-w-[160px] italic">
                  {workout.notes}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <span className="font-mono text-xs text-green-400">+{workout.xpEarned} XP</span>
          <div className="flex items-center gap-1">
            <span className="font-mono text-[8px] text-yellow-400/60">+{workout.coins ?? 10}🪙</span>
          </div>
          <span className="font-mono text-[9px] text-white/20">{formatDate(workout.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-800 border border-white/5 border-dashed rounded-2xl px-6 py-14 flex flex-col items-center text-center">
      <div className="text-5xl mb-4 opacity-20">📋</div>
      <p className="font-display text-xl tracking-wider text-white/20 mb-2">NO WORKOUTS YET</p>
      <p className="font-mono text-[10px] text-white/15 mb-4">Log your first workout above to start earning XP</p>
      <div className="flex flex-wrap justify-center gap-2">
        {["Push-ups", "Pull-ups", "Dips", "Squats"].map((ex) => (
          <span key={ex} className="font-mono text-[9px] text-white/20 border border-white/8 rounded-full px-2.5 py-1">
            {ex}
          </span>
        ))}
      </div>
    </div>
  );
}
