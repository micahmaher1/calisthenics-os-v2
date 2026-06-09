"use client";

import { MilestoneGroup } from "@/lib/records-types";

interface Props {
  groups: MilestoneGroup[];
}

export default function MilestoneTracker({ groups }: Props) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <MilestoneGroupRow key={group.exerciseName} group={group} />
      ))}
    </div>
  );
}

function MilestoneGroupRow({ group }: { group: MilestoneGroup }) {
  const achieved = group.milestones.filter((m) => m.achieved).length;
  const total    = group.milestones.length;
  const pct      = total > 0 ? (achieved / total) * 100 : 0;

  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{group.icon}</span>
          <div>
            <p className="font-body text-sm font-semibold text-white">{group.exerciseName}</p>
            <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
              {achieved}/{total} milestones · Current: {group.currentValue} {group.unit}
            </p>
          </div>
        </div>
        <div className="font-display text-2xl t-text">{Math.round(pct)}%</div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden mb-4">
        <div
          className="h-full t-bar rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Milestones row */}
      <div className="flex flex-wrap gap-2">
        {group.milestones.map((m) => (
          <MilestoneChip key={m.value} milestone={m} currentValue={group.currentValue} />
        ))}
      </div>

      {/* Next insight */}
      {group.nextMilestone && group.currentValue > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="font-mono text-[9px] text-white/35">
            🎯 {group.nextMilestone.value - group.currentValue} {group.unit} to "{group.nextMilestone.label}" · +{group.nextMilestone.xpReward} XP
          </p>
        </div>
      )}
    </div>
  );
}

function MilestoneChip({
  milestone,
  currentValue,
}: {
  milestone: MilestoneGroup["milestones"][number];
  currentValue: number;
}) {
  const isNext = !milestone.achieved && (
    milestone.value <= (currentValue + 20) || milestone.value === Math.min(
      ...[milestone.value]
    )
  );

  const date = milestone.dateAchieved
    ? new Date(milestone.dateAchieved).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : null;

  return (
    <div
      title={milestone.dateAchieved ? `Achieved ${date}` : `+${milestone.xpReward} XP when reached`}
      className={`px-2.5 py-1 rounded-xl border font-mono text-[8px] uppercase tracking-widest transition-all ${
        milestone.achieved
          ? "border-green-500/30 bg-green-500/10 text-green-400"
          : isNext
          ? "border-white/15 bg-white/5 text-white/50"
          : "border-white/6 bg-transparent text-white/20"
      }`}
    >
      {milestone.achieved ? "✓ " : ""}{milestone.label}
    </div>
  );
}
