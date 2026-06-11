"use client";

import Link from "next/link";
import { QuestState } from "@/lib/quest-types";

export default function MissionBoard({ questState }: { questState: QuestState }) {
  const quests    = questState.daily.quests;
  const completed = quests.filter((q) => q.completed).length;

  const sorted = [...quests].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>⚔️</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">Today&apos;s Missions</span>
        </div>
        <span className="font-mono text-[10px] text-white/40">{completed}/{quests.length}</span>
      </div>
      <div className="space-y-2">
        {sorted.map((q) => (
          <div key={q.templateId} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${q.completed ? "border-green-500/20 bg-green-500/5 opacity-60" : "border-white/8 bg-white/3"}`}>
            <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${q.completed ? "bg-green-500 border-green-500 text-white" : "border-white/20"}`}>
              {q.completed && <span className="text-[10px]">✓</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-medium ${q.completed ? "line-through text-white/30" : "text-white/80"}`}>
                {q.title}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500/60 rounded-full"
                    style={{ width: `${Math.min(100, q.target > 0 ? (q.progress / q.target) * 100 : 0)}%` }}
                  />
                </div>
                <span className="font-mono text-[9px] text-white/30 stat-number">{q.progress}/{q.target}</span>
              </div>
            </div>
            <span className="font-mono text-[9px] text-yellow-400 flex-shrink-0">+{q.rewardXP}</span>
          </div>
        ))}
      </div>
      <Link href="/quests" className="mt-3 flex items-center justify-center gap-1 text-orange-400 font-mono text-[10px] hover:text-orange-300 transition-colors">
        <span>View All Missions</span><span>→</span>
      </Link>
    </div>
  );
}
