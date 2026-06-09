"use client";

import { useEffect, useState, useCallback } from "react";
import { SkillNode, Branch, BranchStats, BRANCH_META } from "@/lib/skilltree-types";
import { SkillTreeState } from "@/lib/skilltree-types";
import { loadTreeState, updateNodeProgress, getAllBranchStats, getTotalNodes, getTotalCompleted } from "@/lib/skilltree-engine";
import { ALL_NODES } from "@/lib/skilltree-data";
import { formatXP } from "@/lib/utils";
import { useAchievements } from "@/hooks/useAchievements";

import SkillTreeCanvas from "./SkillTreeCanvas";
import SkillModal      from "./SkillModal";
import BranchStatsBar  from "./BranchStatsBar";
import XPReward        from "./XPReward";
import AchievementToast from "@/components/achievements/AchievementToast";

export default function SkillTreeView() {
  const [treeState,   setTreeState]   = useState<SkillTreeState | null>(null);
  const [modalNode,   setModalNode]   = useState<SkillNode | null>(null);
  const [rewardKey,   setRewardKey]   = useState(0);
  const [rewardXP,    setRewardXP]    = useState(0);
  const [rewardName,  setRewardName]  = useState("");
  const { notifQueue, checkAndUpdate, dismissNotification } = useAchievements();

  useEffect(() => {
    setTreeState(loadTreeState());
  }, []);

  const branchStats: Record<Branch, BranchStats> | null = treeState
    ? getAllBranchStats(treeState.progress) as Record<Branch, BranchStats>
    : null;

  const handleNodeClick = useCallback((node: SkillNode) => {
    setModalNode(node);
  }, []);

  const handleUpdate = useCallback((nodeId: string, reps: number) => {
    setTreeState((prev) => {
      if (!prev) return prev;
      const result = updateNodeProgress(prev, nodeId, reps);
      if (result.justCompleted) {
        setRewardXP(result.xpGained);
        setRewardName(result.node.name);
        setRewardKey((k) => k + 1);
        setModalNode(null);
        setTimeout(() => setRewardXP(0), 3000);
        // Check achievements after skill completion
        setTimeout(checkAndUpdate, 150);
      }
      return result.state;
    });
  }, [checkAndUpdate]);

  if (!treeState || !branchStats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <span className="text-4xl">🌳</span>
          <span className="font-display text-xl tracking-widest text-white/30">LOADING SKILL TREE</span>
        </div>
      </div>
    );
  }

  const totalNodes     = getTotalNodes();
  const totalCompleted = getTotalCompleted(treeState.progress);
  const overallPct     = Math.round((totalCompleted / totalNodes) * 100);

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Tree XP"         value={formatXP(treeState.totalTreeXP)} accent="text-green-400"  icon="⚡" />
        <StatCard label="Tree Level"      value={String(treeState.treeLevel)}     accent="text-yellow-400" icon="🏆" />
        <StatCard label="Skills Mastered" value={`${totalCompleted} / ${totalNodes}`} accent="text-white"  icon="✦" />
        <StatCard label="Overall"         value={`${overallPct}%`}                accent="text-green-400"  icon="📈" />
      </div>

      <BranchStatsBar stats={branchStats} />

      <section>
        <SectionLabel>Skill Tree</SectionLabel>
        <SkillTreeCanvas
          progress={treeState.progress}
          branchStats={branchStats}
          onNodeClick={handleNodeClick}
        />
      </section>

      <AvailableSkillsList
        treeState={treeState}
        onSelect={setModalNode}
      />

      {modalNode && (
        <SkillModal
          node={modalNode}
          progress={treeState.progress}
          onClose={() => setModalNode(null)}
          onUpdate={handleUpdate}
        />
      )}

      {rewardXP > 0 && (
        <XPReward key={rewardKey} xp={rewardXP} skillName={rewardName} />
      )}

      <AchievementToast
        notification={notifQueue[0] ?? null}
        onDismiss={dismissNotification}
      />
    </div>
  );
}

// ─── Available Skills Panel ───────────────────────────────────────────────────

function AvailableSkillsList({
  treeState,
  onSelect,
}: {
  treeState: SkillTreeState;
  onSelect: (node: SkillNode) => void;
}) {
  const available = ALL_NODES.filter(
    (n) =>
      treeState.progress[n.id]?.status === "available" ||
      treeState.progress[n.id]?.status === "in_progress"
  );

  if (available.length === 0) return null;

  const barMap: Record<string, string> = {
    push: "bg-orange-400", pull: "bg-sky-400", core: "bg-red-400", skill: "bg-purple-400",
  };

  return (
    <section>
      <SectionLabel>Active Skills ({available.length}/3)</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {available.map((node) => {
          const prog = treeState.progress[node.id];
          const pct  = Math.min(100, Math.round((prog.currentReps / node.requiredReps) * 100));
          const meta = BRANCH_META[node.branch];

          return (
            <button
              key={node.id}
              onClick={() => onSelect(node)}
              className={`text-left bg-surface-800 border ${meta.border} rounded-xl p-4 hover:bg-surface-700 transition-all group noise`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono text-[9px] uppercase tracking-widest ${meta.color}`}>
                  {meta.icon} {meta.label}
                </span>
                <span className={`font-mono text-[9px] ${prog.status === "in_progress" ? "text-yellow-400" : "text-green-400"}`}>
                  {prog.status === "in_progress" ? "⚡ In Progress" : "🟢 Available"}
                </span>
              </div>
              <p className="font-body text-sm font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                {node.name}
              </p>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9px] text-white/30">
                  {prog.currentReps} / {node.requiredReps} {node.unit}
                </span>
                <span className={`font-mono text-[9px] ${meta.color}`}>+{node.xpReward} XP</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barMap[node.branch]} rounded-full transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, accent, icon }: { label: string; value: string; accent: string; icon: string }) {
  return (
    <div className="relative overflow-hidden bg-surface-800 border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3 noise">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">{label}</p>
        <p className={`font-display text-xl tracking-wide ${accent}`}>{value}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">{children}</span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}
