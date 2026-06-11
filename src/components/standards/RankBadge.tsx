"use client";

import { StandardRank, STANDARD_RANK_META } from "@/lib/movement-standards-types";

interface RankBadgeProps {
  rank: StandardRank;
  size?: "sm" | "md" | "lg";
}

export default function RankBadge({ rank, size = "md" }: RankBadgeProps) {
  const meta = STANDARD_RANK_META[rank];

  if (size === "sm") {
    return (
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-xs ${meta.bg} ${meta.border} ${meta.color}`}
        title={meta.label}
      >
        {meta.icon}
      </span>
    );
  }

  if (size === "lg") {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${meta.bg} ${meta.border} ${meta.glow ? `shadow-lg ${meta.glow}` : ""}`}>
        <span className="text-2xl">{meta.icon}</span>
        <span className={`font-display text-lg tracking-widest uppercase ${meta.color}`}>
          {meta.label}
        </span>
      </div>
    );
  }

  // md
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${meta.bg} ${meta.border}`}>
      <span className="text-sm">{meta.icon}</span>
      <span className={`font-mono text-[10px] uppercase tracking-widest ${meta.color}`}>
        {meta.label}
      </span>
    </div>
  );
}
