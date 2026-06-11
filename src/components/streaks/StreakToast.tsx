"use client";

import { useEffect, useRef } from "react";
import { StreakNotification } from "@/lib/streak-types";

interface Props {
  notification: StreakNotification | null;
  onDismiss:    () => void;
}

const TYPE_STYLES: Record<string, { bg: string; border: string; titleColor: string }> = {
  streak_started:           { bg: "bg-green-500/10",  border: "border-green-500/30",  titleColor: "text-green-400"  },
  streak_increased:         { bg: "bg-orange-500/10", border: "border-orange-500/30", titleColor: "text-orange-400" },
  weekly_increased:         { bg: "bg-sky-500/10",    border: "border-sky-500/30",    titleColor: "text-sky-400"    },
  milestone_reached:        { bg: "bg-yellow-500/10", border: "border-yellow-500/30", titleColor: "text-yellow-300" },
  weekly_milestone_reached: { bg: "bg-purple-500/10", border: "border-purple-500/30", titleColor: "text-purple-400" },
  freeze_used:              { bg: "bg-sky-500/10",    border: "border-sky-500/30",    titleColor: "text-sky-400"    },
  streak_broken:            { bg: "bg-red-500/10",    border: "border-red-500/30",    titleColor: "text-red-400"    },
};

const AUTO_DISMISS_MS = 4000;

export default function StreakToast({ notification, onDismiss }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!notification) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [notification, onDismiss]);

  if (!notification) return null;

  const style = TYPE_STYLES[notification.type] ?? TYPE_STYLES.streak_increased;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-xs w-full animate-fade-up
        ${style.bg} ${style.border} border rounded-2xl shadow-2xl backdrop-blur-sm
        cursor-pointer select-none`}
      onClick={onDismiss}
    >
      <div className="flex items-start gap-3 p-4">
        <span className="text-3xl leading-none mt-0.5">{notification.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`font-display text-base tracking-wider ${style.titleColor}`}>
            {notification.title}
          </p>
          <p className="font-body text-xs text-white/60 mt-0.5 leading-snug">
            {notification.message}
          </p>
          {(notification.xpReward || notification.coinReward) ? (
            <div className="flex items-center gap-2 mt-1.5">
              {notification.xpReward ? (
                <span className="font-mono text-[9px] text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-2 py-0.5">
                  +{notification.xpReward} XP
                </span>
              ) : null}
              {notification.coinReward ? (
                <span className="font-mono text-[9px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                  +{notification.coinReward} 🪙
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          className="text-white/20 hover:text-white/50 transition-colors text-xs mt-0.5"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div className="mx-4 mb-3 h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${style.border.replace("border-", "bg-").replace("/30", "/60")} animate-shrink`}
          style={{ animationDuration: `${AUTO_DISMISS_MS}ms` }}
        />
      </div>
    </div>
  );
}
