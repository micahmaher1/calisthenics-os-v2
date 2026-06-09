"use client";

import { useEffect, useState } from "react";

interface XPToastProps {
  xp: number;
}

export default function XPToast({ xp }: XPToastProps) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    if (xp <= 0) return;

    setPhase("enter");
    setVisible(true);

    const holdTimer = setTimeout(() => setPhase("hold"), 300);
    const exitTimer = setTimeout(() => setPhase("exit"), 2200);
    const hideTimer = setTimeout(() => setVisible(false), 2600);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [xp]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{
        transform: `translateX(-50%) translateY(${
          phase === "enter" ? "20px" : phase === "exit" ? "-10px" : "0px"
        })`,
        opacity: phase === "enter" ? 0 : phase === "exit" ? 0 : 1,
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div className="flex items-center gap-3 bg-surface-700 border border-green-500/30 rounded-2xl px-5 py-3 glow-green-strong shadow-2xl">
        <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-sm">
          ⚡
        </div>
        <div>
          <p className="font-display text-xl tracking-wider text-green-400">
            +{xp} XP
          </p>
          <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
            Workout logged!
          </p>
        </div>
      </div>
    </div>
  );
}
