"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { SkillNode, ProgressMap, Branch, BranchStats, BRANCH_META } from "@/lib/skilltree-types";
import { layoutNodes, CANVAS_WIDTH, CANVAS_HEIGHT, NODE_WIDTH, NODE_HEIGHT } from "@/lib/skilltree-layout";
import SkillNodeCard from "./SkillNodeCard";
import NodeEdges     from "./NodeEdges";
import BranchLabels  from "./BranchLabels";

interface SkillTreeCanvasProps {
  progress:    ProgressMap;
  branchStats: Record<Branch, BranchStats>;
  onNodeClick: (node: SkillNode) => void;
}

interface Transform { x: number; y: number; scale: number }

const MIN_SCALE = 0.25;
const MAX_SCALE = 1.6;
const INIT_SCALE = 0.55;

export default function SkillTreeCanvas({ progress, branchStats, onNodeClick }: SkillTreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 40, y: 20, scale: INIT_SCALE });
  const [dragging, setDragging]   = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, tx: 0, ty: 0 });
  const [selected,  setSelected]  = useState<string | null>(null);
  const [filter,    setFilter]    = useState<"all" | "available" | "completed">("all");

  const layouted = layoutNodes();

  // ── Zoom ──────────────────────────────────────────────────────────────────

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setTransform((t) => {
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale + delta * t.scale));
      const rect     = containerRef.current?.getBoundingClientRect();
      if (!rect) return t;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      // Scale around mouse position
      const scaleRatio = newScale / t.scale;
      return {
        scale: newScale,
        x: mouseX - scaleRatio * (mouseX - t.x),
        y: mouseY - scaleRatio * (mouseY - t.y),
      };
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // ── Pan ───────────────────────────────────────────────────────────────────

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y });
  };

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setTransform((t) => ({
      ...t,
      x: dragStart.tx + (e.clientX - dragStart.x),
      y: dragStart.ty + (e.clientY - dragStart.y),
    }));
  }, [dragging, dragStart]);

  const onMouseUp = () => setDragging(false);

  // ── Touch Pan/Zoom ────────────────────────────────────────────────────────

  const lastTouchDist = useRef<number | null>(null);
  const lastTouchMid  = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      lastTouchDist.current = Math.hypot(dx, dy);
      lastTouchMid.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    } else if (e.touches.length === 1) {
      setDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY, tx: transform.x, ty: transform.y });
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx   = e.touches[1].clientX - e.touches[0].clientX;
      const dy   = e.touches[1].clientY - e.touches[0].clientY;
      const dist = Math.hypot(dx, dy);
      if (lastTouchDist.current !== null) {
        const scaleDelta = dist / lastTouchDist.current;
        const mid = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const mx = mid.x - rect.left;
          const my = mid.y - rect.top;
          setTransform((t) => {
            const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale * scaleDelta));
            const sr = newScale / t.scale;
            return { scale: newScale, x: mx - sr * (mx - t.x), y: my - sr * (my - t.y) };
          });
        }
      }
      lastTouchDist.current = dist;
    } else if (e.touches.length === 1 && dragging) {
      setTransform((t) => ({
        ...t,
        x: dragStart.tx + (e.touches[0].clientX - dragStart.x),
        y: dragStart.ty + (e.touches[0].clientY - dragStart.y),
      }));
    }
  };

  const onTouchEnd = () => {
    setDragging(false);
    lastTouchDist.current = null;
  };

  // ── Zoom controls ─────────────────────────────────────────────────────────

  const zoom = (dir: 1 | -1) => {
    setTransform((t) => ({
      ...t,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale + dir * 0.15)),
    }));
  };

  const resetView = () => setTransform({ x: 40, y: 20, scale: INIT_SCALE });

  // ── Node click ────────────────────────────────────────────────────────────

  const handleNodeClick = (node: SkillNode) => {
    setSelected(node.id);
    onNodeClick(node);
  };

  // ── Filter ────────────────────────────────────────────────────────────────

  const visible = layouted.filter((n) => {
    if (filter === "available")  return ["available", "in_progress"].includes(progress[n.id]?.status ?? "");
    if (filter === "completed")  return progress[n.id]?.status === "completed";
    return true;
  });

  return (
    <div className="relative w-full flex flex-col gap-3">
      {/* Controls bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <button onClick={() => zoom(1)}  className="w-8 h-8 bg-surface-700 border border-white/5 rounded-lg text-white/60 hover:text-white hover:bg-surface-600 transition-all text-lg leading-none">+</button>
          <button onClick={() => zoom(-1)} className="w-8 h-8 bg-surface-700 border border-white/5 rounded-lg text-white/60 hover:text-white hover:bg-surface-600 transition-all text-lg leading-none">−</button>
          <button onClick={resetView}      className="px-3 h-8 bg-surface-700 border border-white/5 rounded-lg font-mono text-[9px] text-white/40 hover:text-white/70 hover:bg-surface-600 transition-all uppercase tracking-widest">Reset</button>
          <span className="font-mono text-[9px] text-white/20 ml-2">{Math.round(transform.scale * 100)}%</span>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-surface-800 border border-white/5 rounded-xl p-1">
          {(["all", "available", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-widest transition-all ${
                filter === f
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <p className="font-mono text-[9px] text-white/20 hidden sm:block">Drag to pan · Scroll to zoom · Pinch on mobile</p>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden bg-surface-900 border border-white/5 rounded-2xl"
        style={{ height: "560px", cursor: dragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Grid bg */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <svg
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            transition: dragging ? "none" : "transform 0.05s ease",
            overflow: "visible",
          }}
        >
          <defs>
            {/* Branch separator lines */}
            <line id="sep" x1="0" y1="0" x2="0" y2={CANVAS_HEIGHT} stroke="#1a1a1a" strokeWidth="1" />
          </defs>

          {/* Branch separators */}
          {[960, 1920, 2880].map((x) => (
            <line key={x} x1={x} y1={0} x2={x} y2={CANVAS_HEIGHT} stroke="#1a1a1a" strokeWidth={1} strokeDasharray="6 6" />
          ))}

          {/* Edges (below nodes) */}
          <NodeEdges nodes={filter === "all" ? layouted : visible} progress={progress} />

          {/* Branch labels */}
          <BranchLabels branchStats={branchStats} />

          {/* Nodes */}
          {visible.map((node) => (
            <SkillNodeCard
              key={node.id}
              node={node}
              x={node.x}
              y={node.y}
              progress={progress}
              selected={selected === node.id}
              onClick={handleNodeClick}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
