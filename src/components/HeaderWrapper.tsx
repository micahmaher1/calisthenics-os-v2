"use client";

/**
 * HeaderWrapper — self-contained client component that lives in layout.tsx.
 * Loads XP/rank from localStorage so the Header always renders with live data
 * regardless of which page is active. Placing this in layout.tsx means NO
 * future dashboard rewrite can accidentally remove the navigation.
 */

import { useEffect, useState } from "react";
import { loadState } from "@/lib/storage";
import { getRankLabel } from "@/lib/xp";
import Header from "@/components/Header";

export default function HeaderWrapper() {
  const [rank,  setRank]  = useState("Beginner");
  const [level, setLevel] = useState(1);

  useEffect(() => {
    try {
      const s = loadState();
      const totalXP = s?.totalXP ?? 0;
      const lvl = Math.floor(totalXP / 100) + 1;
      setLevel(lvl);
      setRank(getRankLabel(lvl));
    } catch {
      // keep defaults
    }

    // Refresh whenever a workout is logged
    const handler = () => {
      try {
        const s = loadState();
        const totalXP = s?.totalXP ?? 0;
        const lvl2 = Math.floor(totalXP / 100) + 1;
        setLevel(lvl2);
        setRank(getRankLabel(lvl2));
      } catch { /* ignore */ }
    };
    window.addEventListener("workout-logged", handler);
    return () => window.removeEventListener("workout-logged", handler);
  }, []);

  return <Header rank={rank} level={level} />;
}
