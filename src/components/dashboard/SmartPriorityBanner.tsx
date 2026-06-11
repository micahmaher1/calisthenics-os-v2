"use client";

import Link from "next/link";
import { SmartPriority } from "@/lib/training-hub-types";

function urgencyStyles(urgency: string) {
  switch (urgency) {
    case "critical": return { border: "border-red-500/60",    bg: "bg-red-500/10",    text: "text-red-400",    pulse: true  };
    case "high":     return { border: "border-orange-500/50", bg: "bg-orange-500/8",  text: "text-orange-400", pulse: false };
    case "medium":   return { border: "border-sky-500/40",    bg: "bg-sky-500/8",     text: "text-sky-400",    pulse: false };
    default:         return { border: "border-white/15",      bg: "bg-white/5",       text: "text-white/50",   pulse: false };
  }
}

export default function SmartPriorityBanner({ priority }: { priority: SmartPriority }) {
  const s = urgencyStyles(priority.urgency);
  return (
    <div className={`border rounded-2xl p-5 shadow-lg ${s.border} ${s.bg} ${s.pulse ? "animate-pulse-slow" : ""}`}>
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0">{priority.icon}</div>
        <div className="flex-1 min-w-0">
          <div className={`font-mono text-[10px] uppercase tracking-widest mb-1 ${s.text}`}>
            ⚡ Priority Action
          </div>
          <h2 className="font-display text-lg tracking-wide text-white leading-tight mb-1">
            {priority.action}
          </h2>
          <p className="text-sm text-white/50 mb-3">{priority.reason}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {priority.benefits.map((b, i) => (
              <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/60">
                {b}
              </span>
            ))}
          </div>
          {priority.href && (
            <Link
              href={priority.href}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-[11px] uppercase tracking-widest transition-all ${s.border} ${s.text} hover:bg-white/10`}
            >
              <span>Start Now</span><span>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
