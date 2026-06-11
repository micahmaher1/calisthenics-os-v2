"use client";

import { CategoryStrength } from "@/lib/records-types";

interface Props {
  strengths: CategoryStrength[];
}

export default function CategoryStrengthsCard({ strengths }: Props) {
  const strongest  = strengths.reduce((a, b) => (a.score >= b.score ? a : b), strengths[0]);
  const weakest    = strengths.reduce((a, b) => (a.score <= b.score ? a : b), strengths[0]);

  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">📊</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Category Strengths</span>
      </div>

      <div className="space-y-4">
        {strengths.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{cat.icon}</span>
                <span className={`font-mono text-[9px] uppercase tracking-widest ${cat.color}`}>
                  {cat.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {cat.topRecord && (
                  <span className="font-mono text-[8px] text-white/30">
                    {cat.topRecord.exerciseName}: {cat.topRecord.value} {cat.topRecord.unit}
                  </span>
                )}
                <span className={`font-display text-lg ${cat.color}`}>{cat.score}</span>
              </div>
            </div>
            <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${cat.color.replace("text-", "bg-").replace("/400", "/60")}`}
                style={{ width: `${cat.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {strengths.length > 0 && strongest && weakest && strongest.id !== weakest.id && (
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <p className="font-mono text-[9px] text-white/30">
            💪 Strongest: <span className={strongest.color}>{strongest.label} ({strongest.score})</span>
          </p>
          <p className="font-mono text-[9px] text-white/30">
            📈 Needs work: <span className={weakest.color}>{weakest.label} ({weakest.score})</span>
          </p>
        </div>
      )}
    </div>
  );
}
