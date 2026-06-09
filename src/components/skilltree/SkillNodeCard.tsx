"use client";

import { SkillNode, NodeStatus, ProgressMap } from "@/lib/skilltree-types";
import { BRANCH_META } from "@/lib/skilltree-types";
import { getProgressPercent } from "@/lib/skilltree-engine";
import { NODE_WIDTH, NODE_HEIGHT } from "@/lib/skilltree-layout";

interface SkillNodeCardProps {
  node:     SkillNode;
  x:        number;
  y:        number;
  progress: ProgressMap;
  selected: boolean;
  onClick:  (node: SkillNode) => void;
}

const STATUS_STYLES: Record<NodeStatus, { border: string; bg: string; text: string; glow: string }> = {
  locked:      { border: "#2a2a2a", bg: "#111111", text: "#444",    glow: "none" },
  available:   { border: "#4ade80", bg: "#0f1f13", text: "#ffffff", glow: "0 0 20px rgba(74,222,128,0.35)" },
  in_progress: { border: "#fbbf24", bg: "#1a1500", text: "#ffffff", glow: "0 0 20px rgba(251,191,36,0.3)" },
  completed:   { border: "#22c55e", bg: "#0a1a0f", text: "#4ade80", glow: "0 0 24px rgba(34,197,94,0.4)" },
};

export default function SkillNodeCard({ node, x, y, progress, selected, onClick }: SkillNodeCardProps) {
  const prog    = progress[node.id];
  const status  = prog?.status ?? "locked";
  const percent = getProgressPercent(node.id, progress);
  const style   = STATUS_STYLES[status];
  const branch  = BRANCH_META[node.branch];
  const isEnd   = node.isEndgame;

  const w = isEnd ? NODE_WIDTH + 20 : NODE_WIDTH;
  const h = isEnd ? NODE_HEIGHT + 14 : NODE_HEIGHT;
  const rx = 10;

  // Selected ring
  const selectedGlow = selected
    ? `0 0 0 2px #fff, 0 0 30px rgba(255,255,255,0.3), ${style.glow}`
    : style.glow;

  return (
    <g
      transform={`translate(${x - w / 2}, ${y - h / 2})`}
      onClick={() => status !== "locked" && onClick(node)}
      style={{ cursor: status === "locked" ? "not-allowed" : "pointer" }}
    >
      {/* Endgame boss glow ring */}
      {isEnd && (
        <rect
          x={-4} y={-4} width={w + 8} height={h + 8}
          rx={rx + 4} ry={rx + 4}
          fill="none"
          stroke={branch.color.replace("text-", "")}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          opacity={status === "locked" ? 0.2 : 0.7}
        >
          <animateTransform
            attributeName="transform" type="rotate"
            from={`0 ${(w + 8) / 2} ${(h + 8) / 2}`}
            to={`360 ${(w + 8) / 2} ${(h + 8) / 2}`}
            dur="12s" repeatCount="indefinite"
          />
        </rect>
      )}

      {/* Card background */}
      <rect
        x={0} y={0} width={w} height={h} rx={rx} ry={rx}
        fill={style.bg}
        stroke={selected ? "#ffffff" : style.border}
        strokeWidth={selected ? 2 : isEnd ? 1.5 : 1}
        style={{ filter: selectedGlow !== "none" ? `drop-shadow(0 0 8px ${style.border})` : undefined }}
      />

      {/* Progress bar bg */}
      <rect x={10} y={h - 14} width={w - 20} height={5} rx={2.5} fill="#1a1a1a" />

      {/* Progress bar fill */}
      {percent > 0 && (
        <rect
          x={10} y={h - 14}
          width={Math.max(0, (w - 20) * percent / 100)}
          height={5} rx={2.5}
          fill={status === "completed" ? "#22c55e" : status === "in_progress" ? "#fbbf24" : "#4ade80"}
          opacity={status === "locked" ? 0.3 : 1}
        />
      )}

      {/* Status dot */}
      <circle
        cx={w - 14} cy={14}
        r={5}
        fill={
          status === "completed"   ? "#22c55e" :
          status === "in_progress" ? "#fbbf24" :
          status === "available"   ? "#4ade80" :
          "#2a2a2a"
        }
      >
        {status === "available" && (
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        )}
      </circle>

      {/* Lock icon for locked nodes */}
      {status === "locked" && (
        <text x={w - 14} y={18} textAnchor="middle" fontSize={9} fill="#333">🔒</text>
      )}

      {/* Endgame crown */}
      {isEnd && status !== "locked" && (
        <text x={14} y={17} fontSize={10} fill="#fbbf24">👑</text>
      )}

      {/* Skill level dots */}
      {[...Array(node.skillLevel)].map((_, i) => (
        <circle
          key={i}
          cx={14 + i * 10} cy={h - 22}
          r={3}
          fill={status === "locked" ? "#2a2a2a" : "#fbbf24"}
          opacity={status === "locked" ? 0.4 : 0.9}
        />
      ))}

      {/* Node name */}
      <text
        x={w / 2} y={status === "completed" ? h / 2 - 6 : h / 2 - 4}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={isEnd ? 11 : 10.5}
        fontWeight="700"
        fontFamily="'DM Sans', sans-serif"
        fill={status === "locked" ? "#444" : isEnd ? "#fbbf24" : style.text}
        letterSpacing="0.3"
      >
        {node.name}
      </text>

      {/* Progress label */}
      <text
        x={w / 2} y={h / 2 + 10}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={8.5}
        fontFamily="'JetBrains Mono', monospace"
        fill={status === "locked" ? "#333" : status === "completed" ? "#22c55e" : "#888"}
      >
        {status === "completed"
          ? "✓ COMPLETE"
          : `${prog?.currentReps ?? 0} / ${node.requiredReps} ${node.unit}`}
      </text>

      {/* XP badge */}
      <text
        x={10} y={17}
        fontSize={8}
        fontFamily="'JetBrains Mono', monospace"
        fill={status === "locked" ? "#333" : "#4ade80"}
        opacity={status === "locked" ? 0.5 : 1}
      >
        {isEnd ? "" : `+${node.xpReward}`}
      </text>

      {isEnd && (
        <text x={26} y={17} fontSize={8} fontFamily="'JetBrains Mono', monospace" fill="#fbbf24">
          +{node.xpReward}
        </text>
      )}
    </g>
  );
}
