"use client";

import { RecordInsight } from "@/lib/records-engine";

interface Props {
  insights: RecordInsight[];
}

const TYPE_COLOR: Record<string, string> = {
  milestone:   "border-yellow-500/20 bg-yellow-500/6",
  improvement: "border-green-500/20 bg-green-500/6",
  streak:      "border-orange-500/20 bg-orange-500/6",
  general:     "border-white/8 bg-surface-800",
};

export default function InsightsSection({ insights }: Props) {
  if (insights.length === 0) return null;

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 border rounded-xl px-4 py-3 ${TYPE_COLOR[insight.type] ?? TYPE_COLOR.general}`}
        >
          <span className="text-xl flex-shrink-0 mt-0.5">{insight.icon}</span>
          <div>
            <p className="font-body text-sm font-semibold text-white">{insight.title}</p>
            <p className="font-mono text-[9px] text-white/40 leading-relaxed mt-0.5">{insight.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
