"use client";

import { JourneyDef, JourneyProgress } from "@/lib/journey-types";
import { JourneySnapshot, getStageCompletion } from "@/lib/journey-utils";

interface JourneyMapProps {
  def:            JourneyDef;
  progress:       JourneyProgress;
  snap:           JourneySnapshot;
  onMarkManual:   (key: string) => void;
  onClaimReward:  (stageId: string) => void;
}

export default function JourneyMap({
  def, progress, snap, onMarkManual, onClaimReward,
}: JourneyMapProps) {
  const completedSet = new Set(progress.completedStageIds);
  const claimedSet   = new Set(progress.claimedRewardStageIds);
  const currentIdx   = progress.currentStageIndex;

  return (
    <div className="relative">
      {def.stages.map((stage, idx) => {
        const isCompleted = completedSet.has(stage.id);
        const isCurrent   = idx === currentIdx && !isCompleted;
        const isLocked    = !isCompleted && !isCurrent;
        const canClaim    = isCompleted && !claimedSet.has(stage.id);
        const { completed: stageComplete, requirements: reqDetails } = getStageCompletion(stage, snap);
        const manualReqs = reqDetails.filter((r) => r.req.type === "manual" && !r.met);

        // Node color/style
        let nodeClasses = "";
        let lineBg      = "bg-white/10";
        if (isCompleted) {
          nodeClasses = "bg-green-500/20 border-green-400/60 shadow-green-500/20 shadow-lg";
          lineBg      = "bg-green-500/40";
        } else if (isCurrent) {
          nodeClasses = "bg-cyan-500/20 border-cyan-400/80 shadow-cyan-500/30 shadow-lg ring-2 ring-cyan-400/40 animate-pulse";
        } else {
          nodeClasses = "bg-white/3 border-white/15 opacity-50";
        }

        return (
          <div key={stage.id} className="flex gap-4">
            {/* Timeline column */}
            <div className="flex flex-col items-center w-14 flex-shrink-0">
              {/* Node circle */}
              <div
                className={`
                  w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl
                  flex-shrink-0 transition-all duration-300
                  ${nodeClasses}
                  ${stage.isMilestone ? "w-16 h-16 text-3xl" : ""}
                `}
              >
                {isCompleted ? "✅" : stage.icon}
              </div>
              {/* Connecting line */}
              {idx < def.stages.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-6 mt-1 mb-1 ${lineBg} transition-colors duration-300`} />
              )}
            </div>

            {/* Content column */}
            <div className={`flex-1 pb-6 ${idx < def.stages.length - 1 ? "mb-0" : ""}`}>
              {/* Stage header */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
                  Stage {stage.stageNumber}
                </span>
                {stage.isMilestone && (
                  <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 uppercase tracking-widest">
                    Milestone
                  </span>
                )}
                {isCompleted && (
                  <span className="font-mono text-[8px] text-green-400 uppercase tracking-widest">Complete</span>
                )}
                {isCurrent && (
                  <span className="font-mono text-[8px] text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded-full">
                    ● CURRENT STAGE
                  </span>
                )}
              </div>

              <h3 className={`font-display text-base tracking-wide mb-1 ${
                isCompleted ? "text-green-300" : isCurrent ? "text-white" : "text-white/40"
              }`}>
                {stage.name}
              </h3>
              <p className={`font-body text-xs leading-relaxed mb-2 ${
                isCompleted || isCurrent ? "text-white/50" : "text-white/25"
              }`}>
                {stage.description}
              </p>

              {/* Requirements (show for current and completed) */}
              {(isCurrent || isCompleted) && (
                <div className="space-y-1.5 mb-3">
                  {reqDetails.map((r, ri) => (
                    <div key={ri} className="flex items-center gap-2">
                      <span className={`text-sm ${r.met ? "text-green-400" : "text-white/30"}`}>
                        {r.met ? "✓" : "○"}
                      </span>
                      <span className={`font-mono text-[9px] ${r.met ? "text-white/60" : "text-white/35"}`}>
                        {r.req.label}
                      </span>
                      {!r.met && r.req.type !== "manual" && (
                        <span className="font-mono text-[9px] text-white/25 ml-auto">
                          {r.current}/{r.req.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Reward preview */}
              <div className="flex items-center gap-3 mb-3 text-white/30">
                <span className="font-mono text-[9px]">⚡ {stage.reward.xp} XP</span>
                <span className="font-mono text-[9px]">🪙 {stage.reward.coins}</span>
                {stage.reward.titleId && (
                  <span className="font-mono text-[9px] text-yellow-400/60">🏷️ Title</span>
                )}
              </div>

              {/* Tips (current stage) */}
              {isCurrent && stage.tips.length > 0 && (
                <div className="mb-3 p-3 rounded-xl bg-surface-700 border border-white/5">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-white/30 mb-1.5">Coach Tips</p>
                  <ul className="space-y-1">
                    {stage.tips.map((tip, ti) => (
                      <li key={ti} className="flex items-start gap-1.5">
                        <span className="text-[9px] text-cyan-400 mt-0.5">›</span>
                        <span className="font-body text-[11px] text-white/50">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Manual check buttons */}
              {isCurrent && manualReqs.length > 0 && stageComplete === false && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {manualReqs.map((r, ri) => (
                    <button
                      key={ri}
                      onClick={() => onMarkManual(r.req.target)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/40 hover:bg-purple-500/25 transition-all shadow-md shadow-purple-500/10"
                    >
                      <span className="text-purple-400">✓</span>
                      <span className="font-mono text-[9px] text-purple-400 uppercase tracking-widest font-semibold">
                        MARK COMPLETE: {r.req.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Claim reward button */}
              {canClaim && (
                <button
                  onClick={() => onClaimReward(stage.id)}
                  className="px-4 py-2 rounded-xl bg-green-500/15 border border-green-500/30 hover:bg-green-500/25 transition-all"
                >
                  <span className="font-mono text-[9px] text-green-400 uppercase tracking-widest">
                    🎁 Claim Reward — {stage.reward.xp} XP + {stage.reward.coins} Coins
                  </span>
                </button>
              )}
              {isCompleted && claimedSet.has(stage.id) && (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] text-green-500/50 uppercase tracking-widest">
                    Reward claimed ✓
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Completion reward */}
      {progress.completedStageIds.length === def.stages.length && (
        <div className="mt-2 p-4 rounded-2xl bg-yellow-500/8 border border-yellow-500/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-display text-base tracking-wide text-yellow-300">Journey Complete!</p>
              <p className="font-mono text-[9px] text-white/40">{def.completionReward.description}</p>
            </div>
          </div>
          <div className="flex gap-3 text-white/50">
            <span className="font-mono text-[9px]">⚡ +{def.completionReward.xp.toLocaleString()} XP</span>
            <span className="font-mono text-[9px]">🪙 +{def.completionReward.coins.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
