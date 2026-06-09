"use client";

import { useEffect, useState } from "react";

interface XPRewardProps {
  xp:        number;
  skillName: string;
  key:       number; // force re-mount to re-trigger
}

export default function XPReward({ xp, skillName }: XPRewardProps) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    if (!xp) return;
    setPhase("enter");
    const t1 = setTimeout(() => setPhase("hold"), 100);
    const t2 = setTimeout(() => setPhase("exit"),  2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [xp]);

  if (!xp) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      style={{ opacity: phase === "hold" ? 1 : 0, transition: "opacity 0.4s ease" }}
    >
      <div
        style={{
          transform: phase === "enter" ? "scale(0.7)" : phase === "exit" ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        className="text-center"
      >
        <div className="font-display text-7xl text-green-400 drop-shadow-[0_0_40px_rgba(74,222,128,0.8)]">
          +{xp} XP
        </div>
        <div className="font-mono text-sm text-white/60 mt-2 uppercase tracking-widest">
          {skillName} Mastered!
        </div>
        <div className="text-4xl mt-3">🏆</div>
      </div>
    </div>
  );
}
