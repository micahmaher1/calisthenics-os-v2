"use client";

import { useState } from "react";
import { SkillName } from "@/lib/types";
import { XP_PER_WORKOUT } from "@/lib/xp";

interface WorkoutLoggerProps {
  onAdd: (data: {
    name: string;
    skillName: SkillName | null;
    reps: number;
    notes: string;
  }) => void;
}

const SKILL_OPTIONS: { value: SkillName | ""; label: string; icon: string }[] = [
  { value: "", label: "General", icon: "💪" },
  { value: "push-ups", label: "Push-Ups", icon: "🤜" },
  { value: "pull-ups", label: "Pull-Ups", icon: "🦅" },
  { value: "dips", label: "Dips", icon: "⚡" },
];

export default function WorkoutLogger({ onAdd }: WorkoutLoggerProps) {
  const [name, setName] = useState("");
  const [skillName, setSkillName] = useState<SkillName | "">("");
  const [reps, setReps] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Workout name is required.");
      return;
    }
    const parsedReps = parseInt(reps, 10);
    if (!reps || isNaN(parsedReps) || parsedReps <= 0) {
      setError("Enter a valid rep count.");
      return;
    }

    setError("");
    setSubmitting(true);

    onAdd({
      name: name.trim(),
      skillName: skillName || null,
      reps: parsedReps,
      notes: notes.trim(),
    });

    // Brief animation delay then reset
    setTimeout(() => {
      setName("");
      setSkillName("");
      setReps("");
      setNotes("");
      setSubmitting(false);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  return (
    <section className="animate-slide-up stagger-1">
      <SectionLabel>Log Workout</SectionLabel>

      <div className="relative overflow-hidden bg-surface-800 border border-white/5 rounded-2xl p-5 noise">
        {/* XP badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-[10px] text-green-400">
            +{XP_PER_WORKOUT} XP
          </span>
        </div>

        <div className="space-y-4" onKeyDown={handleKeyDown}>
          {/* Workout name */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
              Workout Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
              placeholder="e.g. Push-ups, Pull-ups, Dips..."
              className="w-full bg-surface-700 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-500/40 focus:bg-surface-600 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Skill selector */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
                Skill
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {SKILL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSkillName(opt.value as SkillName | "")}
                    className={`px-2 py-2 rounded-lg text-xs font-body transition-all border ${
                      skillName === opt.value
                        ? "bg-green-500/15 border-green-500/40 text-green-400"
                        : "bg-surface-700 border-white/5 text-white/40 hover:border-white/10 hover:text-white/60"
                    }`}
                  >
                    <span className="mr-1">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reps */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
                Reps *
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => { setReps(e.target.value); if (error) setError(""); }}
                placeholder="0"
                min="1"
                max="9999"
                className="w-full bg-surface-700 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-500/40 focus:bg-surface-600 transition-all font-mono text-center text-lg"
              />
              <p className="font-mono text-[9px] text-white/20 text-center mt-1">
                repetitions
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1.5">
              Notes{" "}
              <span className="normal-case text-white/15">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel? Any PRs?"
              rows={2}
              className="w-full bg-surface-700 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-500/40 focus:bg-surface-600 transition-all resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="font-mono text-xs text-red-400 flex items-center gap-1.5">
              <span>⚠</span> {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full py-3.5 rounded-xl font-display text-lg tracking-widest transition-all duration-200 ${
              submitting
                ? "bg-green-500/20 text-green-400/50 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400 text-black glow-green hover:glow-green-strong active:scale-[0.98]"
            }`}
          >
            {submitting ? "LOGGING..." : "LOG WORKOUT"}
          </button>

          <p className="text-center font-mono text-[9px] text-white/15 hidden sm:block">
            Ctrl/⌘ + Enter to submit
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
        {children}
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}
