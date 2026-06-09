"use client";

import Link from "next/link";
import { RecordsState } from "@/lib/records-types";
import { buildMilestoneGroups } from "@/lib/records-engine";

interface Props {
  recState: RecordsState;
}

const UNIT_LABEL: Record<string, string> = {
  reps: "reps", seconds: "sec", minutes: "min", count: "", custom: "",
};

export default function DashboardRecords({ recState }: Props) {
  const records     = Object.values(recState.records).filter((r) => r.current !== null);
  const milGroups   = buildMilestoneGroups(recState);
  const closestNext = milGroups
    .filter((g) => g.nextMilestone && g.currentValue > 0)
    .sort((a, b) => {
      const gapA = (a.nextMilestone?.value ?? Infinity) - a.currentValue;
      const gapB = (b.nextMilestone?.value ?? Infinity) - b.currentValue;
      return gapA - gapB;
    })[0] ?? null;

  // 3 most recent records (by dateAchieved)
  const recentRecords = records
    .filter((r) => r.current !== null)
    .sort((a, b) =>
      new Date(b.current!.dateAchieved).getTime() - new Date(a.current!.dateAchieved).getTime(),
    )
    .slice(0, 3);

  if (records.length === 0) return null;

  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">Personal Records</p>
          <p className="font-display text-lg text-white">{records.length} PRs Set</p>
        </div>
        <Link
          href="/records"
          className="font-mono text-[9px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Recent records */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {recentRecords.map((record) => {
          const unit = UNIT_LABEL[record.unit] ?? record.unit;
          return (
            <div key={record.exerciseName} className="bg-surface-700 rounded-xl px-3 py-2.5">
              <p className="font-mono text-[8px] text-white/30 uppercase tracking-widest truncate mb-1">
                {record.exerciseName}
              </p>
              <p className="font-display text-xl t-text">{record.current?.value}</p>
              <p className="font-mono text-[8px] text-white/25">{unit}</p>
            </div>
          );
        })}
      </div>

      {/* Closest milestone */}
      {closestNext && closestNext.nextMilestone && (
        <div className="border border-yellow-500/15 bg-yellow-500/5 rounded-xl px-3 py-2.5">
          <p className="font-mono text-[8px] uppercase tracking-widest text-yellow-400/60 mb-0.5">
            Next Milestone
          </p>
          <div className="flex items-center justify-between">
            <p className="font-body text-xs text-white">
              <span className="t-text">
                {closestNext.nextMilestone.value - closestNext.currentValue} {closestNext.unit}
              </span>{" "}
              to "{closestNext.nextMilestone.label}"
            </p>
            <p className="font-mono text-[8px] text-yellow-400/60">+{closestNext.nextMilestone.xpReward} XP</p>
          </div>
        </div>
      )}
    </div>
  );
}
