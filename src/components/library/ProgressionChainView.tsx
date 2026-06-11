"use client";

import { ProgressionChain } from "@/lib/library-types";
import { LibraryState } from "@/lib/library-types";
import { SKILL_LIBRARY_MAP } from "@/lib/library-data";

interface ProgressionChainViewProps {
  chain:        ProgressionChain;
  libraryState: LibraryState;
  completedIds: string[];
  onSkillSelect: (skillId: string) => void;
}

export default function ProgressionChainView({
  chain, libraryState, completedIds, onSkillSelect,
}: ProgressionChainViewProps) {
  return (
    <div className="bg-surface-800 border border-white/8 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{chain.icon}</span>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">{chain.name}</div>
          <div className="text-[10px] text-white/25">{chain.description}</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-0">
        {chain.skills.map((skillId, index) => {
          const skill      = SKILL_LIBRARY_MAP[skillId];
          const completed  = completedIds.includes(skillId);
          const isGoal     = libraryState.goalSkillId === skillId;
          const isTracked  = libraryState.trackedSkillIds.includes(skillId);
          const isFav      = libraryState.favoriteSkillIds.includes(skillId);
          const isLast     = index === chain.skills.length - 1;

          if (!skill) {
            return (
              <div key={skillId} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                  <span className="text-sm text-white/20">?</span>
                </div>
                {!isLast && (
                  <div className="w-0.5 h-5 bg-white/10 my-0.5" />
                )}
              </div>
            );
          }

          let circleClass = "border-white/15 bg-surface-700 text-white/50";
          if (completed) {
            circleClass = "border-green-500/60 bg-green-500/15 text-white shadow-sm shadow-green-500/20";
          } else if (isGoal) {
            circleClass = "border-yellow-500/60 bg-yellow-500/15 text-white shadow-sm shadow-yellow-500/30 animate-pulse";
          } else if (isTracked) {
            circleClass = "border-cyan-500/50 bg-cyan-500/10 text-white";
          } else if (skill.isLegendary) {
            circleClass = "border-purple-500/40 bg-purple-500/8 text-white";
          }

          return (
            <div key={skillId} className="flex flex-col items-center">
              <div className="relative group">
                <button
                  onClick={() => onSkillSelect(skillId)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${circleClass}`}
                  title={skill.name}
                >
                  <span className="text-lg">{skill.icon}</span>
                </button>
                {/* Tooltip */}
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  <div className="bg-surface-700 border border-white/15 rounded-lg px-2.5 py-1.5 whitespace-nowrap">
                    <div className="text-xs text-white font-medium">{skill.name}</div>
                    <div className="font-mono text-[9px] text-white/40 capitalize">{skill.tier}</div>
                  </div>
                </div>
                {completed && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-surface-800 flex items-center justify-center">
                    <span className="text-[8px] text-white">✓</span>
                  </div>
                )}
                {isFav && !completed && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500/80 rounded-full border border-surface-800 flex items-center justify-center">
                    <span className="text-[8px]">❤</span>
                  </div>
                )}
              </div>
              {!isLast && (
                <div className={`w-0.5 h-5 my-0.5 ${completed ? "bg-green-500/40" : "bg-white/10"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
