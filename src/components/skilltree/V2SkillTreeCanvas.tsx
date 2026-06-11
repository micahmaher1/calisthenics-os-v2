"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  V2SkillNode,
  V2SkillTreeState,
  V2NodeStatus,
  CATEGORY_META,
} from "@/lib/v2-skilltree-types";
import {
  V2_SKILL_NODES,
  V2_NODE_MAP,
} from "@/lib/v2-skilltree-data";
import {
  v2GetNodeStatus,
  v2UnlockNode,
  v2CompleteNode,
  v2FindNextUnlock,
} from "@/lib/v2-skilltree-engine";

// ─── Constants ────────────────────────────────────────────────────────────────

const NODE_R = 36; // circle radius
const CANVAS_W = 2400;
const CANVAS_H = 1550;
const FOUNDATION_X = 1125;
const FOUNDATION_Y = 0;
const INIT_ZOOM = 0.55;

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  treeState: V2SkillTreeState;
  onStateChange: (state: V2SkillTreeState) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNodeColor(status: V2NodeStatus, category: string): string {
  const meta = CATEGORY_META[category as keyof typeof CATEGORY_META];
  const col = meta?.color ?? "#94a3b8";
  if (status === "locked") return "#1e293b";
  if (status === "available") return col + "66"; // 40% opacity hex
  return col;
}

function getNodeStroke(status: V2NodeStatus, category: string, selected: boolean): { stroke: string; width: number } {
  const meta = CATEGORY_META[category as keyof typeof CATEGORY_META];
  const col = meta?.color ?? "#94a3b8";
  if (selected) return { stroke: "#ffffff", width: 3 };
  if (status === "completed") return { stroke: "#ffffff", width: 3 };
  if (status === "unlocked") return { stroke: col, width: 2.5 };
  if (status === "available") return { stroke: col, width: 2 };
  return { stroke: "#334155", width: 1 };
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

const TIER_LABELS: Record<number, string> = {
  0: "FOUNDATION", 1: "BEGINNER", 2: "BEGINNER", 3: "INTERMEDIATE",
  4: "ADVANCED", 5: "HYBRID", 6: "ELITE", 7: "LEGENDARY",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function V2SkillTreeCanvas({ treeState, onStateChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(INIT_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [lastTap, setLastTap] = useState(0);
  const pinchDistRef = useRef<number | null>(null);

  // Center foundation on mount
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2 - FOUNDATION_X * INIT_ZOOM, y: 60 });
    }
  }, []);

  // ── Reset view ──────────────────────────────────────────────────────────────

  const resetView = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setZoom(INIT_ZOOM);
      setPan({ x: rect.width / 2 - FOUNDATION_X * INIT_ZOOM, y: 60 });
    }
  }, []);

  // ── Mouse events ────────────────────────────────────────────────────────────

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPanStart({ x: pan.x, y: pan.y });
  };

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: panStart.x + (e.clientX - dragStart.x),
      y: panStart.y + (e.clientY - dragStart.y),
    });
  }, [isDragging, dragStart, panStart]);

  const onMouseUp = () => setIsDragging(false);

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom((z) => {
      const nz = Math.min(2.0, Math.max(0.3, z + delta * z));
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const ratio = nz / z;
        setPan((p) => ({
          x: mx - ratio * (mx - p.x),
          y: my - ratio * (my - p.y),
        }));
      }
      return nz;
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  // ── Touch events ────────────────────────────────────────────────────────────

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      pinchDistRef.current = Math.hypot(dx, dy);
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTap < 300) {
        setZoom((z) => Math.min(2.0, z + 0.3));
      }
      setLastTap(now);
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setPanStart({ x: pan.x, y: pan.y });
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const dist = Math.hypot(dx, dy);
      if (pinchDistRef.current !== null) {
        const scale = dist / pinchDistRef.current;
        const mid = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const mx = mid.x - rect.left;
          const my = mid.y - rect.top;
          setZoom((z) => {
            const nz = Math.min(2.0, Math.max(0.3, z * scale));
            const ratio = nz / z;
            setPan((p) => ({
              x: mx - ratio * (mx - p.x),
              y: my - ratio * (my - p.y),
            }));
            return nz;
          });
        }
      }
      pinchDistRef.current = dist;
    } else if (e.touches.length === 1 && isDragging) {
      setPan({
        x: panStart.x + (e.touches[0].clientX - dragStart.x),
        y: panStart.y + (e.touches[0].clientY - dragStart.y),
      });
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    pinchDistRef.current = null;
  };

  // ── Node click (toggle select) ──────────────────────────────────────────────

  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNode((prev) => (prev === nodeId ? null : nodeId));
  };

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleUnlock = (nodeId: string) => {
    const newState = v2UnlockNode(treeState, nodeId);
    onStateChange(newState);
  };

  const handleComplete = (nodeId: string) => {
    const newState = v2CompleteNode(treeState, nodeId);
    onStateChange(newState);
  };

  // ── Computed ─────────────────────────────────────────────────────────────────

  const selectedNodeData = selectedNode ? V2_NODE_MAP[selectedNode] : null;
  const selectedStatus = selectedNode ? v2GetNodeStatus(selectedNode, treeState) : null;
  const nextUnlock = v2FindNextUnlock(treeState);

  // ── Render edges ─────────────────────────────────────────────────────────────

  const edges = V2_SKILL_NODES.flatMap((node) =>
    node.prerequisites.map((pid) => {
      const parent = V2_NODE_MAP[pid];
      if (!parent) return null;
      const pStatus = v2GetNodeStatus(pid, treeState);
      const cStatus = v2GetNodeStatus(node.id, treeState);
      const active = (pStatus === "unlocked" || pStatus === "completed") && cStatus !== "locked";
      const midY = (parent.y + node.y) / 2;
      const path = `M ${parent.x},${parent.y + NODE_R} C ${parent.x},${midY} ${node.x},${midY} ${node.x},${node.y - NODE_R}`;
      return (
        <g key={`edge-${pid}-${node.id}`}>
          {active && (
            <path d={path} fill="none" stroke="#4ade80" strokeWidth={4} opacity={0.12} />
          )}
          <path
            d={path} fill="none"
            stroke={active ? "#4ade80" : "#1e3a2e"}
            strokeWidth={active ? 2 : 1.5}
            opacity={active ? 0.6 : 0.2}
            strokeDasharray={cStatus === "locked" ? "5 4" : undefined}
          />
          {active && (
            <circle r={3} fill="#4ade80" opacity={0.9}>
              <animateMotion dur="3s" repeatCount="indefinite" path={path} />
            </circle>
          )}
        </g>
      );
    })
  );

  // ── Render nodes ─────────────────────────────────────────────────────────────

  const nodes = V2_SKILL_NODES.map((node) => {
    const status = v2GetNodeStatus(node.id, treeState);
    const fill = getNodeColor(status, node.category);
    const { stroke, width: sWidth } = getNodeStroke(status, node.category, selectedNode === node.id);
    const isSelected = selectedNode === node.id;
    const isLegendary = node.tier === 7;
    const isElite = node.tier === 6;
    const filterAttr = status === "completed" ? "url(#glow-filter)" : isLegendary ? "url(#legendary-filter)" : undefined;
    const tierLabel = TIER_LABELS[node.tier] ?? "";
    const catMeta = CATEGORY_META[node.category as keyof typeof CATEGORY_META];

    return (
      <g
        key={node.id}
        transform={`translate(${node.x},${node.y})`}
        onClick={(e) => handleNodeClick(e, node.id)}
        style={{ cursor: "pointer" }}
      >
        {/* Legendary animated ring */}
        {isLegendary && (
          <circle
            cx={0} cy={0} r={NODE_R + 8}
            fill="none"
            stroke={catMeta?.color ?? "#fbbf24"}
            strokeWidth={2}
            strokeDasharray="12 6"
            opacity={status === "locked" ? 0.2 : 0.7}
          >
            <animateTransform
              attributeName="transform" type="rotate"
              from="0 0 0" to="360 0 0"
              dur="8s" repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Elite dashed ring */}
        {isElite && !isLegendary && (
          <circle
            cx={0} cy={0} r={NODE_R + 6}
            fill="none"
            stroke={catMeta?.color ?? "#94a3b8"}
            strokeWidth={1.5}
            strokeDasharray="8 4"
            opacity={status === "locked" ? 0.15 : 0.5}
          >
            <animateTransform
              attributeName="transform" type="rotate"
              from="0 0 0" to="-360 0 0"
              dur="12s" repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Selected glow ring */}
        {isSelected && (
          <circle cx={0} cy={0} r={NODE_R + 4} fill="none" stroke="#ffffff" strokeWidth={2} opacity={0.4}>
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Main circle */}
        <circle
          cx={0} cy={0} r={NODE_R}
          fill={fill}
          stroke={stroke}
          strokeWidth={sWidth}
          filter={filterAttr}
          opacity={status === "locked" ? 0.5 : 1}
        />

        {/* Available pulse */}
        {status === "available" && (
          <circle cx={0} cy={0} r={NODE_R} fill="none" stroke={catMeta?.color ?? "#4ade80"} strokeWidth={2} opacity={0.4}>
            <animate attributeName="r" values={`${NODE_R};${NODE_R + 8};${NODE_R}`} dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Tier tiny label above */}
        <text
          x={0} y={-NODE_R - 8}
          textAnchor="middle"
          fontSize={7}
          fill={status === "locked" ? "#334155" : catMeta?.color ?? "#94a3b8"}
          fontFamily="'JetBrains Mono', monospace"
          letterSpacing="0.5"
          opacity={0.7}
        >
          {tierLabel}
        </text>

        {/* Icon */}
        <text
          x={0} y={-6}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={18}
          opacity={status === "locked" ? 0.3 : 1}
        >
          {node.icon}
        </text>

        {/* Name below */}
        <text
          x={0} y={NODE_R + 14}
          textAnchor="middle"
          fontSize={10}
          fontWeight="600"
          fontFamily="'DM Sans', sans-serif"
          fill={status === "locked" ? "#475569" : "#e2e8f0"}
          opacity={status === "locked" ? 0.5 : 1}
        >
          {truncate(node.name, 16)}
        </text>

        {/* Completed checkmark */}
        {status === "completed" && (
          <text x={NODE_R - 8} y={-NODE_R + 8} textAnchor="middle" fontSize={12}>✅</text>
        )}
        {status === "locked" && (
          <text x={0} y={10} textAnchor="middle" fontSize={11} opacity={0.4}>🔒</text>
        )}
      </g>
    );
  });

  // ── Selected node panel ───────────────────────────────────────────────────────

  const prereqStatuses = selectedNodeData?.prerequisites.map((pid) => ({
    id: pid,
    name: V2_NODE_MAP[pid]?.name ?? pid,
    done: treeState.unlockedNodes.includes(pid) || treeState.completedNodes.includes(pid),
  })) ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* SVG Canvas */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        style={{ touchAction: "none", cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => setSelectedNode(null)}
      >
        {/* Grid bg */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="legendary-filter" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
            {/* Edges first */}
            <g className="edges">{edges}</g>
            {/* Nodes on top */}
            <g className="nodes">{nodes}</g>
          </g>
        </svg>

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(2.0, z + 0.2)); }}
            className="w-9 h-9 bg-slate-800/90 border border-slate-600/50 rounded-lg text-slate-200 hover:bg-slate-700 transition-all text-lg font-bold leading-none flex items-center justify-center"
          >
            +
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(0.3, z - 0.2)); }}
            className="w-9 h-9 bg-slate-800/90 border border-slate-600/50 rounded-lg text-slate-200 hover:bg-slate-700 transition-all text-lg font-bold leading-none flex items-center justify-center"
          >
            −
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); resetView(); }}
            className="w-9 h-9 bg-slate-800/90 border border-slate-600/50 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all text-sm flex items-center justify-center"
            title="Reset view"
          >
            ⊙
          </button>
        </div>

        {/* Zoom level badge */}
        <div className="absolute top-3 left-3 bg-slate-900/80 border border-slate-700/50 rounded-lg px-2 py-1">
          <span className="font-mono text-[9px] text-slate-500">{Math.round(zoom * 100)}%</span>
        </div>

        {/* Next unlock hint */}
        {nextUnlock && !selectedNode && (
          <div
            className="absolute bottom-3 left-3 bg-slate-900/90 border border-green-500/30 rounded-xl px-3 py-2 max-w-[220px] cursor-pointer hover:border-green-400/50 transition-all"
            onClick={(e) => { e.stopPropagation(); setSelectedNode(nextUnlock.id); }}
          >
            <p className="font-mono text-[8px] uppercase tracking-widest text-green-400/70 mb-0.5">Next Available</p>
            <p className="text-sm text-white font-medium">
              {nextUnlock.icon} {nextUnlock.name}
            </p>
          </div>
        )}

        {/* Hint text */}
        <div className="absolute bottom-3 right-3 hidden sm:block">
          <p className="font-mono text-[8px] text-slate-600">Drag · Scroll to zoom · Tap node</p>
        </div>
      </div>

      {/* Selected node panel */}
      {selectedNodeData && selectedStatus && (
        <div
          className="bg-slate-900 border-t border-slate-700/50"
          onClick={(e) => e.stopPropagation()}
        >
          <NodeDetailPanel
            node={selectedNodeData}
            status={selectedStatus}
            prereqStatuses={prereqStatuses}
            onUnlock={() => handleUnlock(selectedNodeData.id)}
            onComplete={() => handleComplete(selectedNodeData.id)}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      )}
    </div>
  );
}

// ─── Node Detail Panel ────────────────────────────────────────────────────────

interface PanelProps {
  node:           V2SkillNode;
  status:         V2NodeStatus;
  prereqStatuses: { id: string; name: string; done: boolean }[];
  onUnlock:       () => void;
  onComplete:     () => void;
  onClose:        () => void;
}

function NodeDetailPanel({ node, status, prereqStatuses, onUnlock, onComplete, onClose }: PanelProps) {
  const catMeta = CATEGORY_META[node.category as keyof typeof CATEGORY_META];
  const tierLabel = TIER_LABELS[node.tier] ?? `Tier ${node.tier}`;

  const statusLabel =
    status === "completed" ? "✅ COMPLETED" :
    status === "unlocked"  ? "🔓 UNLOCKED" :
    status === "available" ? "🟢 AVAILABLE" :
    "🔒 LOCKED";

  const statusColor =
    status === "completed" ? "text-green-400" :
    status === "unlocked"  ? "text-sky-400" :
    status === "available" ? "text-emerald-400" :
    "text-slate-500";

  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
            style={{ backgroundColor: catMeta?.color + "22", border: `1px solid ${catMeta?.color}55` }}
          >
            {node.icon}
          </div>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span
                className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: catMeta?.color, backgroundColor: catMeta?.color + "22" }}
              >
                {catMeta?.label}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                {tierLabel}
              </span>
              <span className={`font-mono text-[8px] tracking-widest ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            <h3 className="font-semibold text-white text-base leading-tight truncate">{node.name}</h3>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-200 transition-colors text-xl leading-none flex-shrink-0 mt-1"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">{node.description}</p>

      {/* Footer: prereqs + actions */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        {/* Prerequisites */}
        {prereqStatuses.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {prereqStatuses.map((p) => (
              <span
                key={p.id}
                className={`font-mono text-[8px] px-1.5 py-0.5 rounded ${p.done ? "text-green-400 bg-green-500/10" : "text-slate-500 bg-slate-800"}`}
              >
                {p.done ? "✓" : "○"} {p.name}
              </span>
            ))}
          </div>
        )}

        {/* XP */}
        <span className="font-mono text-[9px] text-yellow-400 ml-auto">+{node.xpCost} XP</span>

        {/* Action buttons */}
        {status === "available" && (
          <button
            onClick={onUnlock}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-all"
          >
            UNLOCK
          </button>
        )}
        {status === "unlocked" && (
          <button
            onClick={onComplete}
            className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-lg transition-all"
          >
            COMPLETE
          </button>
        )}
      </div>
    </div>
  );
}
