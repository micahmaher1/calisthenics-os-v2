"use client";

import { useState } from "react";
import { UserGoal, UserProfile, GOAL_PRESETS, GoalPreset } from "@/lib/profile-types";
import { PersonalRecords } from "@/lib/stats";
import { getGoalProgress } from "@/lib/profile-utils";

interface Props {
  profile:           UserProfile;
  records:           PersonalRecords;
  level:             number;
  streak:            number;
  completedSkillIds: Set<string>;
  onUpdate:          (goals: UserGoal[]) => void;
}

const DIFFICULTY_META = {
  beginner:     { color: "text-green-400",  border: "border-green-500/25",  bg: "bg-green-500/8"  },
  intermediate: { color: "text-sky-400",    border: "border-sky-500/25",    bg: "bg-sky-500/8"    },
  advanced:     { color: "text-purple-400", border: "border-purple-500/25", bg: "bg-purple-500/8" },
  elite:        { color: "text-yellow-400", border: "border-yellow-500/25", bg: "bg-yellow-500/8" },
};

export default function GoalsSection({ profile, records, level, streak, completedSkillIds, onUpdate }: Props) {
  const [showPresets, setShowPresets] = useState(false);
  const [showCustom,  setShowCustom]  = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const goals = profile.goals;

  const addPreset = (preset: GoalPreset) => {
    if (goals.find((g) => g.id === preset.id)) return;
    const goal: UserGoal = {
      id:          preset.id,
      type:        preset.type,
      title:       preset.title,
      description: preset.description,
      skillId:     preset.skillId,
      skillName:   preset.skillName,
      target:      preset.target,
      completed:   false,
      createdAt:   Date.now(),
      pinned:      false,
    };
    onUpdate([...goals, goal]);
  };

  const addCustom = () => {
    if (!customTitle.trim()) return;
    const goal: UserGoal = {
      id:          `custom_${Date.now()}`,
      type:        "custom",
      title:       customTitle.trim(),
      description: "",
      target:      1,
      completed:   false,
      createdAt:   Date.now(),
      pinned:      false,
    };
    onUpdate([...goals, goal]);
    setCustomTitle("");
    setShowCustom(false);
  };

  const toggleCustom = (id: string) => {
    onUpdate(goals.map((g) => g.id === id ? { ...g, completed: !g.completed, completedAt: !g.completed ? Date.now() : undefined } : g));
  };

  const removeGoal = (id: string) => onUpdate(goals.filter((g) => g.id !== id));

  const activeGoals    = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => {
    const p = getGoalProgress(g, records, level, streak, completedSkillIds);
    return p.completed;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">Goals</p>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowCustom(!showCustom); setShowPresets(false); }}
            className="font-mono text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
          >
            + Custom
          </button>
          <button
            onClick={() => { setShowPresets(!showPresets); setShowCustom(false); }}
            className="font-mono text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all"
          >
            + Preset
          </button>
        </div>
      </div>

      {/* Custom goal input */}
      {showCustom && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            placeholder="e.g. Complete 30 consecutive push-ups"
            maxLength={80}
            className="flex-1 bg-surface-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-green-500/50 font-body"
          />
          <button
            onClick={addCustom}
            className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded-xl font-display text-sm text-black transition-all"
          >
            ADD
          </button>
        </div>
      )}

      {/* Preset picker */}
      {showPresets && (
        <div className="mb-4 bg-surface-700 border border-white/8 rounded-2xl p-4">
          <p className="font-mono text-[8px] text-white/30 uppercase tracking-widest mb-3">Choose a preset goal</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {GOAL_PRESETS.map((preset) => {
              const already = goals.some((g) => g.id === preset.id);
              const dm = DIFFICULTY_META[preset.difficulty];
              return (
                <button
                  key={preset.id}
                  onClick={() => { addPreset(preset); setShowPresets(false); }}
                  disabled={already}
                  className={`flex items-center gap-2.5 text-left border rounded-xl px-3 py-2.5 transition-all ${
                    already
                      ? "border-white/5 opacity-30 cursor-not-allowed"
                      : `${dm.border} ${dm.bg} hover:opacity-80`
                  }`}
                >
                  <span className="text-xl">{preset.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs font-semibold text-white truncate">{preset.title}</p>
                    <p className={`font-mono text-[8px] ${dm.color}`}>{preset.difficulty}</p>
                  </div>
                  {already && <span className="font-mono text-[8px] text-white/30">Added</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active goals */}
      {goals.length === 0 && (
        <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl">
          <p className="text-3xl mb-2">🎯</p>
          <p className="font-body text-sm text-white/30">No goals yet.</p>
          <p className="font-mono text-[9px] text-white/20 mt-1">Add a preset or create your own</p>
        </div>
      )}

      <div className="space-y-2.5">
        {activeGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            records={records}
            level={level}
            streak={streak}
            completedSkillIds={completedSkillIds}
            onToggle={toggleCustom}
            onRemove={removeGoal}
          />
        ))}
      </div>

      {/* Completed goals */}
      {completedGoals.length > 0 && (
        <div className="mt-4">
          <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest mb-2">Completed ({completedGoals.length})</p>
          <div className="space-y-2 opacity-60">
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                records={records}
                level={level}
                streak={streak}
                completedSkillIds={completedSkillIds}
                onToggle={toggleCustom}
                onRemove={removeGoal}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, records, level, streak, completedSkillIds, onToggle, onRemove }: {
  goal: UserGoal;
  records: PersonalRecords;
  level: number;
  streak: number;
  completedSkillIds: Set<string>;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const { progress, target, pct, completed } = getGoalProgress(goal, records, level, streak, completedSkillIds);

  return (
    <div className={`group relative border rounded-2xl px-4 py-3 transition-all ${
      completed
        ? "border-green-500/25 bg-green-500/5"
        : "border-white/8 bg-surface-800"
    }`}>
      <div className="flex items-start gap-3">
        {/* Checkbox for custom goals */}
        {goal.type === "custom" ? (
          <button
            onClick={() => onToggle(goal.id)}
            className={`mt-0.5 w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all ${
              completed
                ? "bg-green-500 border-green-500 text-black"
                : "border-white/20 hover:border-green-500/50"
            }`}
          >
            {completed && <span className="text-[10px]">✓</span>}
          </button>
        ) : (
          <div className={`mt-0.5 w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center ${
            completed ? "bg-green-500 border-green-500 text-black" : "border-white/10"
          }`}>
            {completed && <span className="text-[10px]">✓</span>}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`font-body text-sm font-semibold ${completed ? "text-white/50 line-through" : "text-white"}`}>
              {goal.title}
            </p>
            <button
              onClick={() => onRemove(goal.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400 font-mono text-xs"
            >
              ✕
            </button>
          </div>

          {goal.type !== "custom" && (
            <>
              <div className="flex items-center justify-between mt-1.5 mb-1">
                <span className="font-mono text-[8px] text-white/30">
                  {progress.toLocaleString()} / {target.toLocaleString()}
                </span>
                <span className={`font-mono text-[8px] ${completed ? "text-green-400" : "text-white/30"}`}>{pct}%</span>
              </div>
              <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${completed ? "bg-green-400" : "bg-white/20"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
