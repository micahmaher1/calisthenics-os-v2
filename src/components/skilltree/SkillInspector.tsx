"use client";

/**
 * SkillInspector — RPG-style skill requirements panel.
 * Desktop: fixed side panel (tree stays visible).
 * Mobile: rendered in a full-screen overlay by the parent.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { SkillNode, ProgressMap, BRANCH_META, NodeStatus } from "@/lib/skilltree-types";
import { getProgressPercent, getNodeProgress } from "@/lib/skilltree-engine";
import { ALL_NODES } from "@/lib/skilltree-data";
import type { SkillProgress } from "@/lib/skill-requirements-types";
import { calcReadinessBreakdown } from "@/lib/skill-readiness-breakdown";
import { SKILL_LIBRARY_MAP } from "@/lib/library-data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillInspectorProps {
  node:             SkillNode;
  progress:         ProgressMap;
  onClose:          () => void;
  onUpdate:         (nodeId: string, reps: number) => void;
  skillProgressMap?: Record<string, SkillProgress>;  // optional — enables readiness breakdown
}

// ─── Style Maps ──────────────────────────────────────────────────────────────

const BRANCH_STYLE: Record<string, {
  hex: string; text: string; border: string; bg: string; glow: string;
}> = {
  push:  { hex: "#f97316", text: "text-orange-400",  border: "border-orange-500/25",  bg: "bg-orange-500/10",  glow: "rgba(249,115,22,0.20)"  },
  pull:  { hex: "#38bdf8", text: "text-sky-400",     border: "border-sky-500/25",     bg: "bg-sky-500/10",     glow: "rgba(56,189,248,0.20)"  },
  core:  { hex: "#f87171", text: "text-red-400",     border: "border-red-500/25",     bg: "bg-red-500/10",     glow: "rgba(248,113,113,0.20)" },
  skill: { hex: "#c084fc", text: "text-purple-400",  border: "border-purple-500/25",  bg: "bg-purple-500/10",  glow: "rgba(192,132,252,0.20)" },
};

const DIFF_LABELS = ["", "Starter", "Beginner", "Intermediate", "Advanced", "Elite"];

const STATUS_META: Record<NodeStatus, { label: string; color: string; bg: string; border: string }> = {
  locked:      { label: "🔒 LOCKED",      color: "text-white/30",   bg: "bg-white/5",         border: "border-white/8"          },
  available:   { label: "🟢 AVAILABLE",   color: "text-green-300",  bg: "bg-green-500/8",     border: "border-green-500/20"     },
  in_progress: { label: "⚡ IN PROGRESS", color: "text-yellow-300", bg: "bg-yellow-500/8",    border: "border-yellow-500/20"    },
  completed:   { label: "✓ COMPLETED",    color: "text-green-400",  bg: "bg-green-500/10",    border: "border-green-500/25"     },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcReadiness(node: SkillNode, progress: ProgressMap): number {
  const prog   = progress[node.id];
  const status = prog?.status ?? "locked";
  if (status === "completed")   return 100;
  if (status === "in_progress") return Math.max(5, getProgressPercent(node.id, progress));
  if (status === "available")   return Math.max(5, getProgressPercent(node.id, progress));

  // Locked — count completed prerequisites
  if (!node.unlockReqs) return 0;
  const reqNodes = node.unlockReqs.type !== "branches" ? node.unlockReqs.nodes : [];
  if (reqNodes.length === 0) return 0;
  const done = reqNodes.filter(r => progress[r.nodeId]?.status === "completed").length;
  return Math.round((done / reqNodes.length) * 100);
}

function readinessLabel(r: number, s: NodeStatus) {
  if (s === "completed")   return "Skill Mastered";
  if (s === "available")   return "Ready to Train";
  if (s === "in_progress") return "Training Active";
  if (r >= 100) return "Prerequisites Met";
  if (r >= 75)  return "Almost Ready";
  if (r >= 50)  return "Halfway There";
  if (r >= 25)  return "Building Towards";
  return "Just Starting";
}

function readinessColor(r: number, s: NodeStatus): string {
  if (s === "completed")   return "#22c55e";
  if (s === "available")   return "#4ade80";
  if (s === "in_progress") return "#fbbf24";
  if (r >= 75) return "#4ade80";
  if (r >= 50) return "#fbbf24";
  return "#f87171";
}

// ─── Section Header Helper ───────────────────────────────────────────────────

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/22 whitespace-nowrap">{title}</span>
        <div className="flex-1 h-px bg-white/[0.05]" />
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SkillInspector({ node, progress, onClose, onUpdate, skillProgressMap }: SkillInspectorProps) {
  const [repsInput, setRepsInput] = useState("0");
  const [saving,    setSaving]    = useState(false);
  const [mounted,   setMounted]   = useState(false);

  // Animate bars on mount + node change
  useEffect(() => {
    setMounted(false);
    setRepsInput(String(getNodeProgress(node.id, progress).currentReps));
    const id = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.id]);

  const prog     = getNodeProgress(node.id, progress);
  const status   = prog.status;
  const percent  = getProgressPercent(node.id, progress);
  const meta     = BRANCH_META[node.branch];
  const bStyle   = BRANCH_STYLE[node.branch] ?? BRANCH_STYLE.push;
  const sMeta    = STATUS_META[status];
  const ready    = calcReadiness(node, progress);
  const rColor   = readinessColor(ready, status);
  const rLabel   = readinessLabel(ready, status);
  const circ     = 2 * Math.PI * 30; // r=30

  // Derived data ─────────────────────────────────────────────────────────────

  // Child nodes (skills this unlocks)
  const childNodes = ALL_NODES.filter(n => n.parents.includes(node.id));

  // Related: same-branch siblings within ±1 tier
  const relatedNodes = ALL_NODES.filter(n =>
    n.id !== node.id &&
    n.branch === node.branch &&
    Math.abs(n.tier - node.tier) <= 1
  ).slice(0, 5);

  // Prerequisite nodes
  const reqNodeList = !node.unlockReqs ? []
    : node.unlockReqs.type !== "branches" ? node.unlockReqs.nodes : [];
  const reqBranchList = !node.unlockReqs ? []
    : node.unlockReqs.type !== "nodes" ? node.unlockReqs.branches : [];

  // Closest incomplete prerequisite (has most progress, not yet completed)
  const closestReq = reqNodeList
    .filter(r => progress[r.nodeId]?.status !== "completed")
    .map(r => {
      const rn = ALL_NODES.find(n => n.id === r.nodeId);
      const rp = progress[r.nodeId];
      const pct = rn ? Math.min(100, Math.round(((rp?.currentReps ?? 0) / rn.requiredReps) * 100)) : 0;
      return { ...r, pct, node: rn, prog: rp };
    })
    .sort((a, b) => b.pct - a.pct)[0];

  const remaining = node.requiredReps - (prog.currentReps ?? 0);

  // Handlers ─────────────────────────────────────────────────────────────────

  const handleSave = () => {
    const n = parseInt(repsInput, 10);
    if (isNaN(n) || n < 0) return;
    setSaving(true);
    setTimeout(() => { onUpdate(node.id, n); setSaving(false); }, 300);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border ${bStyle.border} overflow-hidden`}
      style={{ background: "#090b0f", boxShadow: `0 0 48px ${bStyle.glow}, inset 0 1px 0 rgba(255,255,255,0.03)` }}
    >
      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <div className={`flex-shrink-0 ${bStyle.bg} border-b ${bStyle.border} px-4 py-3`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-1.5 mb-1">
              <span className={`font-mono text-[8.5px] uppercase tracking-widest ${bStyle.text}`}>
                {meta.icon} {meta.label}
              </span>
              <span className="text-white/15">·</span>
              <span className={`font-mono text-[8.5px] uppercase tracking-widest ${sMeta.color} px-1.5 py-0.5 rounded-full border ${sMeta.border} ${sMeta.bg}`}>
                {sMeta.label}
              </span>
              {node.isEndgame && (
                <span className="font-mono text-[8px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/25 px-1.5 py-0.5 rounded-full">
                  👑 ENDGAME
                </span>
              )}
            </div>
            <h2 className={`font-display text-[1.15rem] leading-tight tracking-wide truncate ${node.isEndgame ? "text-yellow-400" : "text-white"}`}>
              {node.name}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex gap-[3px]">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-[7px] h-[7px] rounded-full ${i < node.skillLevel ? "bg-yellow-400" : "bg-white/10"}`} />
                ))}
              </div>
              <span className="font-mono text-[8.5px] text-white/35">{DIFF_LABELS[node.skillLevel]}</span>
              <span className="text-white/15">·</span>
              <span className="font-mono text-[8.5px] text-green-400">+{node.xpReward} XP</span>
              <span className="text-white/15">·</span>
              <span className="font-mono text-[8.5px] text-white/25">Tier {node.tier}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 mt-0.5 flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-5">

        {/* Description */}
        <p className="text-[11.5px] text-white/45 leading-relaxed">{node.description}</p>

        {/* Academy Guide link — shown when library skill exists */}
        {SKILL_LIBRARY_MAP[node.id] && (
          <Link
            href={`/academy/${node.id}`}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all hover:opacity-90 ${bStyle.border} ${bStyle.bg}`}
          >
            <span className="text-sm">🎓</span>
            <div className="flex-1 min-w-0">
              <p className={`font-mono text-[9px] uppercase tracking-widest ${bStyle.text}`}>View Academy Guide</p>
              <p className="font-mono text-[8px] text-white/25 mt-0.5">Technique · Muscles · Progressions · Training</p>
            </div>
            <span className="text-white/25 text-xs">→</span>
          </Link>
        )}

        {/* ── Readiness + Quick Stats Row ─────────────────────────────────── */}
        <div className="flex items-center gap-3 bg-white/[0.025] border border-white/[0.06] rounded-2xl p-3">
          {/* SVG Ring */}
          <div className="relative flex-shrink-0 w-[68px] h-[68px]">
            <svg viewBox="0 0 68 68" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="34" cy="34" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
              <circle
                cx="34" cy="34" r="30"
                fill="none"
                stroke={rColor}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - (mounted ? ready : 0) / 100)}
                style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 4px ${rColor})` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-[1.05rem] leading-none" style={{ color: rColor }}>{ready}%</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-mono text-[8.5px] uppercase tracking-widest text-white/22 mb-0.5">Readiness</p>
            <p className="font-display text-sm text-white leading-tight">{rLabel}</p>
            <p className="font-mono text-[9px] text-white/30 mt-1 leading-snug">
              {status === "completed"   && "All requirements met."}
              {status === "available"   && (remaining > 0 ? `${remaining} ${node.unit} to complete` : "Ready to complete")}
              {status === "in_progress" && (remaining > 0 ? `${remaining} ${node.unit} remaining` : "Almost done!")}
              {status === "locked"      && reqNodeList.length > 0
                ? `${reqNodeList.filter(r => progress[r.nodeId]?.status !== "completed").length} of ${reqNodeList.length} prereqs incomplete`
                : status === "locked" ? "Complete prerequisites to unlock" : ""}
            </p>
          </div>
        </div>

        {/* ── Readiness Breakdown (if skill progress data available) ─────── */}
        {(() => {
          if (!skillProgressMap) return null;
          const sp = skillProgressMap[node.id];
          if (!sp || !sp.requirementProgress.length) return null;
          const breakdown = calcReadinessBreakdown(node.id, sp);
          if (breakdown.length === 0) return null;
          return (
            <Sec title="Readiness Breakdown">
              <div className="space-y-2">
                {breakdown.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between font-mono text-[8.5px] mb-0.5">
                      <span className="text-white/35 flex items-center gap-1">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                      <span className={cat.pct >= 100 ? "text-green-400" : cat.pct >= 76 ? "text-orange-400" : cat.pct >= 51 ? "text-yellow-400" : "text-white/30"}>
                        {cat.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: mounted ? `${cat.pct}%` : "0%",
                          background:
                            cat.pct >= 100 ? "#22c55e" :
                            cat.pct >= 76  ? "#f97316" :
                            cat.pct >= 51  ? "#eab308" :
                            cat.pct >= 26  ? "#38bdf8" :
                            "#1e293b",
                          transition: "width 0.7s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Sec>
          );
        })()}

        {/* ── Own Progress Bar (if unlocked) ──────────────────────────────── */}
        {(status === "available" || status === "in_progress" || status === "completed") && (
          <Sec title="Your Progress">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-white/30">{prog.currentReps} / {node.requiredReps} {node.unit}</span>
                <span className={`font-mono text-[9px] ${bStyle.text}`}>{percent}%</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: mounted ? `${percent}%` : "0%",
                    background: status === "completed"
                      ? "linear-gradient(90deg, #16a34a, #4ade80)"
                      : `linear-gradient(90deg, ${bStyle.hex}cc, ${bStyle.hex})`,
                    transition: "width 0.75s ease",
                    boxShadow: `0 0 8px ${bStyle.glow}`,
                  }}
                />
              </div>
            </div>
          </Sec>
        )}

        {/* ── Update Progress ─────────────────────────────────────────────── */}
        {(status === "available" || status === "in_progress") && (
          <Sec title="Log Progress">
            <div className="flex gap-2">
              <input
                type="number"
                value={repsInput}
                onChange={e => setRepsInput(e.target.value)}
                min={0} max={9999}
                placeholder="0"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono text-sm text-center focus:outline-none focus:border-green-500/40 focus:bg-white/[0.07] transition-all"
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-5 py-2.5 rounded-xl font-display text-sm tracking-widest transition-all ${
                  saving ? "bg-green-500/20 text-green-400/40" : "bg-green-500 hover:bg-green-400 text-black font-bold"
                }`}
              >
                {saving ? "…" : "SAVE"}
              </button>
            </div>
            <p className="font-mono text-[8.5px] text-white/20 mt-1.5 text-center">
              Reach {node.requiredReps} {node.unit} to complete · +{node.xpReward} XP
            </p>
          </Sec>
        )}

        {/* Completed badge */}
        {status === "completed" && (
          <div className="flex items-center gap-3 bg-green-500/8 border border-green-500/20 rounded-xl px-4 py-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-display text-sm text-green-400 tracking-wider">SKILL MASTERED</p>
              {prog.completedAt && (
                <p className="font-mono text-[8.5px] text-white/30 mt-0.5">
                  {new Date(prog.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Prerequisites ────────────────────────────────────────────────── */}
        <Sec title={reqNodeList.length + reqBranchList.length > 0
          ? `Prerequisites (${reqNodeList.length + reqBranchList.length})`
          : "Prerequisites"
        }>
          {reqNodeList.length === 0 && reqBranchList.length === 0 ? (
            <div className="flex items-center gap-2 bg-green-500/6 border border-green-500/15 rounded-xl px-3 py-2.5">
              <span className="text-green-400 text-sm">▶</span>
              <span className="font-mono text-[10px] text-green-400/80">Available from start — no prerequisites</span>
            </div>
          ) : (
            <div className="space-y-2">
              {reqNodeList.map(req => {
                const rn   = ALL_NODES.find(n => n.id === req.nodeId);
                const rp   = progress[req.nodeId];
                const done = rp?.status === "completed";
                const pct  = rn ? Math.min(100, Math.round(((rp?.currentReps ?? 0) / rn.requiredReps) * 100)) : 0;
                const rb   = BRANCH_STYLE[rn?.branch ?? "push"];

                return (
                  <div key={req.nodeId}
                    className={`rounded-xl p-3 border transition-colors ${done
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-white/[0.06] bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          done ? "bg-green-500/20 border-green-500/50" : "bg-white/5 border-white/15"
                        }`}>
                          {done
                            ? <span className="text-green-400 text-[9px] leading-none">✓</span>
                            : <span className="text-white/25 text-[9px] leading-none">○</span>
                          }
                        </div>
                        <span className={`font-mono text-[10px] ${done ? "text-green-400" : "text-white/60"}`}>{req.label}</span>
                      </div>
                      {rn && (
                        <span className={`font-mono text-[9px] ${done ? "text-green-400" : "text-white/30"}`}>
                          {rp?.currentReps ?? 0}/{rn.requiredReps} {rn.unit}
                        </span>
                      )}
                    </div>
                    {rn && (
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: mounted ? `${pct}%` : "0%",
                            background: done ? "#22c55e" : rb?.hex ?? "#4ade80",
                            transition: "width 0.7s ease",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              {reqBranchList.map(req => (
                <div key={req.branch}
                  className="flex items-center gap-2 bg-yellow-500/6 border border-yellow-500/20 rounded-xl px-3 py-2.5"
                >
                  <span className="text-yellow-400 text-sm">👑</span>
                  <span className="font-mono text-[10px] text-yellow-400">{req.label}</span>
                </div>
              ))}
            </div>
          )}
        </Sec>

        {/* ── Training Recommendation ─────────────────────────────────────── */}
        <Sec title="Recommendation">
          <div className={`rounded-xl p-3 border ${bStyle.border} ${bStyle.bg}`}>
            {status === "completed" ? (
              childNodes.length > 0 ? (
                <>
                  <p className="font-mono text-[9px] text-white/40 mb-1">Master next</p>
                  <p className="font-display text-sm text-white">{childNodes[0].name}</p>
                  <p className="font-mono text-[9px] text-white/35 mt-1">Unlocked by completing this skill.</p>
                </>
              ) : (
                <>
                  <p className="font-mono text-[9px] text-white/40 mb-1">Branch complete</p>
                  <p className="font-display text-sm text-white">You&apos;ve mastered this skill</p>
                  <p className="font-mono text-[9px] text-white/35 mt-1">Explore other branches for more challenges.</p>
                </>
              )
            ) : status === "available" || status === "in_progress" ? (
              <>
                <p className="font-mono text-[9px] text-white/40 mb-1">Focus</p>
                <p className="font-display text-sm text-white">{node.name}</p>
                <p className="font-mono text-[9px] text-white/35 mt-1">
                  {remaining > 0
                    ? `Train to reach ${node.requiredReps} ${node.unit}. ${remaining} ${node.unit} to go.`
                    : "You've hit the target! Log it to complete."
                  }
                </p>
              </>
            ) : closestReq ? (
              <>
                <p className="font-mono text-[9px] text-white/40 mb-1">Closest prerequisite</p>
                <p className="font-display text-sm text-white">{closestReq.label}</p>
                <p className="font-mono text-[9px] text-white/35 mt-1">
                  {closestReq.pct}% complete.
                  {closestReq.node ? ` Target: ${closestReq.node.requiredReps} ${closestReq.node.unit}.` : ""}
                  {" "}Complete this to progress toward {node.name}.
                </p>
              </>
            ) : (
              <>
                <p className="font-mono text-[9px] text-white/40 mb-1">Complete prerequisites</p>
                <p className="font-mono text-[9px] text-white/35">Finish all required skills above to unlock this.</p>
              </>
            )}
          </div>
        </Sec>

        {/* ── What This Unlocks ───────────────────────────────────────────── */}
        {childNodes.length > 0 && (
          <Sec title={`Unlocks (${childNodes.length})`}>
            <div className="space-y-1.5">
              {childNodes.map(child => {
                const cp    = progress[child.id];
                const cs    = cp?.status ?? "locked";
                const cb    = BRANCH_STYLE[child.branch] ?? bStyle;
                const cMeta = BRANCH_META[child.branch];
                const csm   = STATUS_META[cs];

                return (
                  <div key={child.id}
                    className="flex items-center gap-2.5 bg-white/[0.025] border border-white/[0.06] rounded-xl px-3 py-2.5 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className={`text-base flex-shrink-0`}>{child.isEndgame ? "👑" : "→"}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-mono text-[10px] font-semibold truncate ${child.isEndgame ? "text-yellow-400" : "text-white/80"}`}>
                        {child.name}
                      </p>
                      <p className={`font-mono text-[8.5px] ${cb.text} mt-0.5`}>{cMeta.icon} {cMeta.label}</p>
                    </div>
                    <span className={`font-mono text-[8px] ${csm.color} px-1.5 py-0.5 rounded-full border ${csm.border} ${csm.bg} whitespace-nowrap flex-shrink-0`}>
                      {cs === "completed" ? "✓" : cs === "in_progress" ? "⚡" : cs === "available" ? "🟢" : "🔒"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Sec>
        )}

        {/* ── Related Skills ──────────────────────────────────────────────── */}
        {relatedNodes.length > 0 && (
          <Sec title="Related Skills">
            <div className="flex flex-wrap gap-1.5">
              {relatedNodes.map(rel => {
                const rs  = progress[rel.id]?.status ?? "locked";
                const rsm = STATUS_META[rs];
                return (
                  <div key={rel.id}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 border text-[9px] font-mono transition-colors ${
                      rs === "completed"
                        ? "bg-green-500/8 border-green-500/20 text-green-400"
                        : rs === "available" || rs === "in_progress"
                        ? `${bStyle.bg} ${bStyle.border} ${bStyle.text}`
                        : "bg-white/[0.03] border-white/[0.06] text-white/35"
                    }`}
                  >
                    <span className="text-[8px]">
                      {rs === "completed" ? "✓" : rs === "available" ? "●" : rs === "in_progress" ? "⚡" : "○"}
                    </span>
                    {rel.name}
                  </div>
                );
              })}
            </div>
          </Sec>
        )}

        {/* Bottom spacer */}
        <div className="h-2" />
      </div>
    </div>
  );
}
