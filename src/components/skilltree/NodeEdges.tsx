"use client";

import { LayoutNode } from "@/lib/skilltree-layout";
import { ProgressMap, NodeStatus } from "@/lib/skilltree-types";
import { NODE_WIDTH, NODE_HEIGHT } from "@/lib/skilltree-layout";

interface NodeEdgesProps {
  nodes:    LayoutNode[];
  progress: ProgressMap;
}

function getEdgeColor(parentStatus: NodeStatus, childStatus: NodeStatus): string {
  if (parentStatus === "completed" && childStatus !== "locked") return "#22c55e";
  if (parentStatus === "completed") return "#1a3a1a";
  if (parentStatus === "in_progress") return "#3a3000";
  return "#1e1e1e";
}

function getEdgeOpacity(parentStatus: NodeStatus): number {
  if (parentStatus === "completed") return 0.7;
  if (parentStatus === "in_progress" || parentStatus === "available") return 0.4;
  return 0.15;
}

export default function NodeEdges({ nodes, progress }: NodeEdgesProps) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const edges: JSX.Element[] = [];

  nodes.forEach((child) => {
    child.parents.forEach((parentId) => {
      const parent = nodeMap[parentId];
      if (!parent) return;

      const parentStatus = progress[parentId]?.status ?? "locked";
      const childStatus  = progress[child.id]?.status  ?? "locked";
      const color        = getEdgeColor(parentStatus, childStatus);
      const opacity      = getEdgeOpacity(parentStatus);

      // Start from bottom-center of parent, end at top-center of child
      const x1 = parent.x;
      const y1 = parent.y + NODE_HEIGHT / 2;
      const x2 = child.x;
      const y2 = child.y - NODE_HEIGHT / 2;

      // Bezier control points
      const midY = (y1 + y2) / 2;
      const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

      const edgeId = `edge-${parentId}-${child.id}`;
      const isActive = parentStatus === "completed" && childStatus !== "locked";

      edges.push(
        <g key={edgeId}>
          {/* Shadow / glow for active edges */}
          {isActive && (
            <path
              d={path}
              fill="none"
              stroke="#22c55e"
              strokeWidth={4}
              opacity={0.15}
              strokeLinecap="round"
            />
          )}
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={isActive ? 2 : 1.5}
            opacity={opacity}
            strokeLinecap="round"
            strokeDasharray={childStatus === "locked" ? "4 4" : "none"}
          />
          {/* Animated flow dot on active connections */}
          {isActive && (
            <circle r={3} fill="#4ade80" opacity={0.8}>
              <animateMotion dur="2.5s" repeatCount="indefinite" path={path} />
            </circle>
          )}
        </g>
      );
    });
  });

  return <g className="edges">{edges}</g>;
}
