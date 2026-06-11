"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadQuestState } from "@/lib/quest-storage";
import { QuestState, ActiveQuest, QUEST_RARITY_META } from "@/lib/quest-types";

function getCountdown(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

export default function QuestsDashboardCard() {
  const [questState, setQuestState] = useState<QuestState | null>(null);
  const [countdown, setCountdown]   = useState<string>("");

  useEffect(() => {
    try {
      setQuestState(loadQuestState());
    } catch {
      // ignore
    }
    setCountdown(getCountdown());
    const interval = setInterval(() => setCountdown(getCountdown()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!questState) return null;

  const quests: ActiveQuest[] = questState.daily.quests.slice(0, 4);
  const completed = quests.filter((q) => q.completed).length;

  return (
    <div className="bg-surface-800 border border-orange-500/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>⚔️</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">Daily Quests</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-white/30 stat-number">{completed}/{quests.length}</span>
          <Link href="/quests" className="font-mono text-[9px] text-orange-400/60 hover:text-orange-400 transition-colors">
            All →
          </Link>
        </div>
      </div>

      {quests.length === 0 ? (
        <div className="text-center py-3 border border-dashed border-white/8 rounded-xl">
          <p className="text-xs text-white/30">No active quests</p>
        </div>
      ) : (
        <div className="space-y-2">
          {quests.map((q) => {
            const rarityMeta = QUEST_RARITY_META[q.rarity];
            const pct = q.target > 0 ? Math.min(100, Math.round((q.progress / q.target) * 100)) : 0;
            return (
              <div
                key={q.templateId}
                className={`p-2.5 rounded-xl border transition-all ${
                  q.completed
                    ? "border-green-500/20 bg-green-500/5 opacity-60"
                    : `${rarityMeta.border} ${rarityMeta.bg}`
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium ${q.completed ? "line-through text-white/30" : "text-white/80"}`}>
                    {q.title}
                  </span>
                  <span className="font-mono text-[9px] text-yellow-400 flex-shrink-0 ml-2">+{q.rewardXP}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${q.completed ? "bg-green-500/60" : "bg-orange-500/60"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-white/30 stat-number">{q.progress}/{q.target}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[9px] text-white/20">Refreshes in {countdown}</span>
        <Link href="/quests" className="font-mono text-[10px] text-orange-400 hover:text-orange-300 transition-colors">
          View All →
        </Link>
      </div>
    </div>
  );
}
