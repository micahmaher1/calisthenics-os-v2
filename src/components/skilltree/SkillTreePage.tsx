"use client";

import Link from "next/link";
import SkillTreeView from "./SkillTreeView";

export default function SkillTreePage() {
  return (
    <div className="min-h-screen bg-surface-900 relative overflow-x-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#c084fc 1px, transparent 1px), linear-gradient(90deg, #c084fc 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Ambient glow - purple for skill tree */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-purple-500/4 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <header className="flex items-center justify-between py-6 border-b border-white/5 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg">
              🌳
            </div>
            <div>
              <div className="font-display text-xl tracking-widest text-white leading-none">
                SKILL TREE
              </div>
              <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase mt-0.5">
                Calisthenics OS · RPG Progression
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 bg-surface-700 border border-white/5 rounded-xl font-mono text-[10px] text-white/40 hover:text-white/70 hover:border-white/10 transition-all uppercase tracking-widest"
            >
              ← Dashboard
            </Link>
          </div>
        </header>

        <div className="mt-8 animate-slide-up">
          <SkillTreeView />
        </div>
      </div>
    </div>
  );
}
