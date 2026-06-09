"use client";

import { useState } from "react";
import { SkillNode, ProgressMap, BRANCH_META } from "@/lib/skilltree-types";
import { getProgressPercent, getNodeProgress } from "@/lib/skilltree-engine";


interface SkillModalProps {
  node:     SkillNode;
  progress: ProgressMap;
  onClose:  () => void;
  onUpdate: (nodeId: string, reps: number) => void;
}

const LEVEL_LABELS = ["", "Beginner", "Easy", "Moderate", "Hard", "Elite"];

export default function SkillModal({ node, progress, onClose, onUpdate }: SkillModalProps) {
  const prog       = getNodeProgress(node.id, progress);
  const percent    = getProgressPercent(node.id, progress);
  const meta       = BRANCH_META[node.branch];
  const [reps, setReps] = useState(String(prog.currentReps));
  const [saving, setSaving] = useState(false);

  // Branch-specific colors
  const colorMap: Record<string, { text: string; border: string; bg: string; bar: string }> = {
    push:  { text: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10", bar: "bg-orange-400" },
    pull:  { text: "text-sky-400",    border: "border-sky-500/30",    bg: "bg-sky-500/10",    bar: "bg-sky-400"    },
    core:  { text: "text-red-400",    border: "border-red-500/30",    bg: "bg-red-500/10",    bar: "bg-red-400"    },
    skill: { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10", bar: "bg-purple-400" },
  };
  const col = colorMap[node.branch];

  const statusColor =
    prog.status === "completed"   ? "text-green-400" :
    prog.status === "in_progress" ? "text-yellow-400" :
    prog.status === "available"   ? "text-green-300" :
    "text-white/30";

  const statusLabel =
    prog.status === "completed"   ? "✓ COMPLETED" :
    prog.status === "in_progress" ? "⚡ IN PROGRESS" :
    prog.status === "available"   ? "🟢 AVAILABLE" :
    "🔒 LOCKED";

  const handleSave = () => {
    const n = parseInt(reps, 10);
    if (isNaN(n) || n < 0) return;
    setSaving(true);
    setTimeout(() => {
      onUpdate(node.id, n);
      setSaving(false);
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative z-10 w-full max-w-lg bg-[#111] border ${col.border} rounded-2xl overflow-hidden shadow-2xl`}>
        {/* Header */}
        <div className={`${col.bg} border-b ${col.border} px-5 py-4`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-mono text-[9px] uppercase tracking-widest ${col.text}`}>
                  {meta.icon} {meta.label} Tree
                </span>
                {node.isEndgame && (
                  <span className="font-mono text-[9px] uppercase tracking-widest text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                    👑 Endgame
                  </span>
                )}
              </div>
              <h2 className={`font-display text-2xl tracking-wider ${node.isEndgame ? "text-yellow-400" : "text-white"}`}>
                {node.name}
              </h2>
            </div>
            <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors text-xl leading-none mt-1">✕</button>
          </div>

          {/* Status + level */}
          <div className="flex items-center gap-3 mt-2">
            <span className={`font-mono text-[10px] tracking-widest ${statusColor}`}>{statusLabel}</span>
            <span className="text-white/20">·</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < node.skillLevel ? "bg-yellow-400" : "bg-white/10"}`} />
              ))}
            </div>
            <span className="font-mono text-[9px] text-white/30">{LEVEL_LABELS[node.skillLevel]}</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Description */}
          <p className="text-sm text-white/60 leading-relaxed">{node.description}</p>

          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Progress</span>
              <span className={`font-mono text-xs ${col.text}`}>
                {prog.currentReps} / {node.requiredReps} {node.unit}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full ${prog.status === "completed" ? "bg-green-400" : col.bar} rounded-full transition-all duration-700`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="text-right mt-1">
              <span className="font-mono text-[9px] text-white/20">{percent}% complete</span>
            </div>
          </div>

          {/* XP Reward */}
          <div className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl px-4 py-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">XP Reward</p>
              <p className="font-display text-xl text-green-400">+{node.xpReward} XP</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 text-right">Skill Level</p>
              <p className={`font-display text-xl text-right ${col.text}`}>{LEVEL_LABELS[node.skillLevel]}</p>
            </div>
          </div>

          {/* Requirements */}
          {node.unlockReqs && prog.status === "locked" && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-2">Unlock Requirements</p>
              <div className="space-y-1.5">
                {(node.unlockReqs.type === "nodes" || node.unlockReqs.type === "both") &&
                  node.unlockReqs.nodes.map((req) => {
                    const reqProg = progress[req.nodeId];
                    const done    = reqProg?.status === "completed";
                    return (
                      <div key={req.nodeId} className="flex items-center gap-2">
                        <span className={`text-xs ${done ? "text-green-400" : "text-white/30"}`}>
                          {done ? "✓" : "○"}
                        </span>
                        <span className={`font-mono text-[10px] ${done ? "text-green-400" : "text-white/40"}`}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })
                }
                {(node.unlockReqs.type === "branches" || node.unlockReqs.type === "both") &&
                  node.unlockReqs.branches.map((req) => (
                    <div key={req.branch} className="flex items-center gap-2">
                      <span className="text-xs text-yellow-400">👑</span>
                      <span className="font-mono text-[10px] text-yellow-400">{req.label}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Update progress (available/in_progress nodes) */}
          {(prog.status === "available" || prog.status === "in_progress") && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-2">
                Update Your Best
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  min={0}
                  max={9999}
                  placeholder="0"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono text-sm text-center focus:outline-none focus:border-green-500/50 focus:bg-white/8 transition-all"
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-5 py-2.5 rounded-xl font-display text-base tracking-widest transition-all ${
                    saving
                      ? "bg-green-500/20 text-green-400/50"
                      : "bg-green-500 hover:bg-green-400 text-black"
                  }`}
                >
                  {saving ? "..." : "SAVE"}
                </button>
              </div>
              <p className="font-mono text-[9px] text-white/20 mt-1.5 text-center">
                Reach {node.requiredReps} {node.unit} to complete
              </p>
            </div>
          )}

          {/* Completed state */}
          {prog.status === "completed" && (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-display text-base text-green-400 tracking-wider">SKILL MASTERED</p>
                <p className="font-mono text-[9px] text-white/30">
                  {prog.completedAt
                    ? new Date(prog.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "Completed"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
