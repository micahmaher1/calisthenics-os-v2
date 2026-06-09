"use client";

import { ActiveQuest, QUEST_RARITY_META, QUEST_CATEGORY_META } from "@/lib/quest-types";

interface Props {
  quest:    ActiveQuest;
  timeLeft: string;
}

export default function QuestCard({ quest, timeLeft }: Props) {
  const rm  = QUEST_RARITY_META[quest.rarity];
  const cat = QUEST_CATEGORY_META[quest.category];
  const pct = quest.target > 0 ? Math.min(100, Math.round((quest.progress / quest.target) * 100)) : 0;

  return (
    <div
      className={`relative overflow-hidden border rounded-2xl transition-all duration-300 ${
        quest.completed
          ? "border-green-500/30 bg-green-500/5"
          : `${rm.border} ${rm.bg}`
      } ${quest.completed ? "" : rm.glow ? `shadow-lg ${rm.glow}` : ""}`}
    >
      {/* Shimmer for legendary */}
      {quest.rarity === "legendary" && !quest.completed && (
        <div className="absolute inset-0 animate-shimmer-fast pointer-events-none" />
      )}

      {/* Completion glow overlay */}
      {quest.completed && (
        <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
      )}

      <div className="relative p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">{cat.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`font-body text-sm font-semibold leading-tight ${quest.completed ? "text-white/60 line-through" : "text-white"}`}>
                  {quest.title}
                </p>
                {quest.completed && <span className="text-green-400 text-sm">✓</span>}
              </div>
              <p className="font-mono text-[8px] text-white/30 mt-0.5">{quest.description}</p>
            </div>
          </div>

          {/* Rarity badge */}
          <span className={`flex-shrink-0 font-mono text-[7px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${rm.bg} ${rm.border} ${rm.color}`}>
            {rm.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">
              {quest.completed ? "Complete" : `${quest.progress.toLocaleString()} / ${quest.target.toLocaleString()}`}
            </span>
            <span className={`font-mono text-[8px] ${quest.completed ? "text-green-400" : "text-white/30"}`}>
              {pct}%
            </span>
          </div>
          <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                quest.completed
                  ? "bg-green-400"
                  : quest.rarity === "legendary"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-300"
                  : quest.rarity === "epic"
                  ? "bg-gradient-to-r from-purple-500 to-purple-300"
                  : quest.rarity === "rare"
                  ? "bg-gradient-to-r from-sky-500 to-sky-300"
                  : quest.rarity === "uncommon"
                  ? "bg-gradient-to-r from-green-500 to-green-300"
                  : "bg-white/30"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Footer row: rewards + time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-[9px] ${quest.completed ? "text-white/30" : "text-green-400"}`}>
              ⚡ +{quest.rewardXP}
            </span>
            <span className={`font-mono text-[9px] ${quest.completed ? "text-white/30" : "text-yellow-400"}`}>
              🪙 +{quest.rewardCoins}
            </span>
          </div>
          {!quest.completed && (
            <span className="font-mono text-[8px] text-white/20">{timeLeft}</span>
          )}
        </div>
      </div>
    </div>
  );
}
