"use client";

import Link from "next/link";

const ACTIONS = [
  { icon: "💪", label: "Log Workout", href: "/workouts", color: "border-green-500/30 hover:border-green-500/60 hover:bg-green-500/10 text-green-400" },
  { icon: "🌳", label: "Skill Tree",  href: "/tree",     color: "border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10 text-emerald-400" },
  { icon: "🧠", label: "Coach",       href: "/coach",    color: "border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 text-purple-400" },
  { icon: "🗺️", label: "Journey",     href: "/journeys", color: "border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-500/10 text-cyan-400" },
  { icon: "🏅", label: "Standards",   href: "/standards",color: "border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10 text-amber-400" },
  { icon: "📚", label: "Library",     href: "/library",  color: "border-sky-500/30 hover:border-sky-500/60 hover:bg-sky-500/10 text-sky-400" },
];

export default function QuickActionsBar() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {ACTIONS.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border bg-[#0d1117] transition-all ${a.color}`}
        >
          <span className="text-xl">{a.icon}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest whitespace-nowrap">{a.label}</span>
        </Link>
      ))}
    </div>
  );
}
