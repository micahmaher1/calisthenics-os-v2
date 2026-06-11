"use client";

import { buildRecentActivity } from "@/lib/training-hub-utils";

export default function RecentProgressTimeline({ recentActivity }: { recentActivity: ReturnType<typeof buildRecentActivity> }) {
  if (recentActivity.length === 0) return null;
  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span>📜</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Recent Activity</span>
      </div>
      <div className="space-y-2">
        {recentActivity.slice(0, 6).map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-base flex-shrink-0">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/70 truncate">{a.title}</div>
              {a.subtitle && <div className="text-[10px] text-white/30 truncate">{a.subtitle}</div>}
            </div>
            <span className="font-mono text-[9px] text-white/20 flex-shrink-0">
              {new Date(a.timestamp).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
