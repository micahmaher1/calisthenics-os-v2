"use client";

import { useEffect, useState } from "react";
import { ActiveQuest, QUEST_RARITY_META, QUEST_CATEGORY_META } from "@/lib/quest-types";

export interface QuestNotification {
  quest:      ActiveQuest;
  bonusXP?:   number;
  bonusCoins?:number;
  isBonus:    boolean;
}

interface Props {
  notification: QuestNotification | null;
  onDismiss:    () => void;
}

export default function QuestToast({ notification, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!notification) { setVisible(false); return; }
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 350);
    }, notification.isBonus ? 4500 : 3500);
    return () => clearTimeout(t);
  }, [notification]);

  if (!notification) return null;

  if (notification.isBonus) {
    return (
      <div
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] transition-all duration-350 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        onClick={onDismiss}
      >
        <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-2xl px-6 py-4 shadow-2xl shadow-yellow-500/20 text-center min-w-[260px]">
          <div className="text-2xl mb-1">🎉</div>
          <p className="font-display text-lg text-yellow-300 tracking-wider">ALL QUESTS DONE!</p>
          <p className="font-mono text-[9px] text-yellow-400/70 mt-0.5">Bonus Reward Unlocked</p>
          <div className="flex items-center justify-center gap-3 mt-2">
            {notification.bonusXP && (
              <span className="font-mono text-xs text-green-400">⚡ +{notification.bonusXP} XP</span>
            )}
            {notification.bonusCoins && (
              <span className="font-mono text-xs text-yellow-400">🪙 +{notification.bonusCoins}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  const q   = notification.quest;
  const rm  = QUEST_RARITY_META[q.rarity];
  const cat = QUEST_CATEGORY_META[q.category];

  return (
    <div
      className={`fixed bottom-24 right-4 z-[70] transition-all duration-350 ${
        visible ? "opacity-100 translate-y-0 translate-x-0" : "opacity-0 translate-y-4 translate-x-4"
      }`}
      onClick={onDismiss}
    >
      <div className={`border ${rm.border} ${rm.bg} rounded-2xl px-4 py-3 shadow-xl min-w-[220px] max-w-[280px]`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl border ${rm.border} ${rm.bg} flex-shrink-0`}>
            {cat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[8px] uppercase tracking-widest text-white/40 mb-0.5">Quest Complete</p>
            <p className="font-body text-xs font-semibold text-white truncate">{q.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[9px] text-green-400">⚡ +{q.rewardXP}</span>
              <span className="font-mono text-[9px] text-yellow-400">🪙 +{q.rewardCoins}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
