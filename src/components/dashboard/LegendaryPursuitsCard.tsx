"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { v2LoadTreeState, v2GetNodeStatus } from "@/lib/v2-skilltree-engine";
import { V2_NODE_MAP } from "@/lib/v2-skilltree-data";
import { V2NodeStatus } from "@/lib/v2-skilltree-types";

interface PursuitEntry {
  id:     string;
  name:   string;
  icon:   string;
  status: V2NodeStatus;
}

const LEGENDARY_SKILL_IDS = [
  "human_flag",
  "front_lever",
  "full_planche",
  "muscle_up",
  "one_arm_pull_up",
  "handstand_pushup",
];

function statusColor(status: V2NodeStatus): string {
  switch (status) {
    case "completed": return "text-purple-400 bg-purple-500/10 border-purple-500/30";
    case "unlocked":  return "text-green-400 bg-green-500/10 border-green-500/30";
    case "available": return "text-amber-400 bg-amber-500/10 border-amber-500/30 animate-pulse";
    default:          return "text-white/30 bg-white/5 border-white/10";
  }
}

function statusLabel(status: V2NodeStatus): string {
  switch (status) {
    case "completed": return "Completed";
    case "unlocked":  return "Unlocked";
    case "available": return "Available";
    default:          return "Locked";
  }
}

export default function LegendaryPursuitsCard() {
  const [pursuits, setPursuits] = useState<PursuitEntry[]>([]);

  useEffect(() => {
    try {
      const state = v2LoadTreeState();
      const list: PursuitEntry[] = LEGENDARY_SKILL_IDS.map((id) => {
        const node   = V2_NODE_MAP[id];
        const status = v2GetNodeStatus(id, state);
        return {
          id,
          name:   node?.name   ?? id,
          icon:   node?.icon   ?? "⭐",
          status,
        };
      });
      setPursuits(list);
    } catch {
      // ignore
    }
  }, []);

  if (pursuits.length === 0) return null;

  return (
    <div className="bg-surface-800 border border-purple-500/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>👑</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-purple-400">Legendary Pursuits</span>
        </div>
        <Link href="/tree" className="font-mono text-[9px] text-purple-400/60 hover:text-purple-400 transition-colors">
          Tree →
        </Link>
      </div>

      <div className="space-y-2">
        {pursuits.map((p) => (
          <Link key={p.id} href="/tree" className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all group">
            <span className="text-base flex-shrink-0">{p.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/70 group-hover:text-white/90 transition-colors">{p.name}</div>
            </div>
            <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${statusColor(p.status)}`}>
              {statusLabel(p.status)}
            </span>
          </Link>
        ))}
      </div>

      <Link href="/tree" className="mt-3 flex items-center justify-center gap-1 text-purple-400 font-mono text-[10px] hover:text-purple-300 transition-colors">
        <span>View Skill Tree</span><span>→</span>
      </Link>
    </div>
  );
}
