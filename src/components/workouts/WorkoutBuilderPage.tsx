"use client";

import { useState, useEffect, useCallback } from "react";
import {
  WorkoutGoal, WorkoutDifficulty, EquipmentType,
  GeneratedWorkout, WorkoutBuilderConfig,
  WORKOUT_GOAL_META, DIFFICULTY_META, EQUIPMENT_META,
} from "@/lib/workout-types";
import {
  ProgramTheme, ActiveProgram,
  PROGRAM_THEME_META, ProgramDuration,
} from "@/lib/program-types";
import { generateWorkout, getRecommendedWorkouts } from "@/lib/workout-generator";
import { generateProgram } from "@/lib/program-generator";
import {
  loadWorkoutBuilderState,
  saveWorkout,
  deleteWorkout,
  toggleFavoriteWorkout,
  markWorkoutCompleted,
  addToRecent,
} from "@/lib/workout-storage";
import {
  loadProgramState,
  startProgram,
  abandonProgram,
  completeProgram,
} from "@/lib/program-storage";
import WorkoutCard from "./WorkoutCard";
import ProgramCard from "./ProgramCard";
import WorkoutCompletionModal from "./WorkoutCompletionModal";
import PageHeader from "@/components/ui/PageHeader";

type Tab = "quick" | "programs" | "saved" | "recommended";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "quick",       label: "Quick Build",   icon: "⚡" },
  { id: "programs",    label: "Programs",      icon: "📋" },
  { id: "saved",       label: "Saved",         icon: "💾" },
  { id: "recommended", label: "Recommended",   icon: "🎯" },
];

const GOALS = Object.keys(WORKOUT_GOAL_META) as WorkoutGoal[];
const DIFFICULTIES = Object.keys(DIFFICULTY_META) as WorkoutDifficulty[];
const EQUIPMENT_LIST = Object.keys(EQUIPMENT_META) as EquipmentType[];
const DURATIONS = [20, 30, 45, 60, 90];

export default function WorkoutBuilderPage() {
  const [tab, setTab] = useState<Tab>("quick");

  // Quick build state
  const [goal, setGoal] = useState<WorkoutGoal>("strength");
  const [difficulty, setDifficulty] = useState<WorkoutDifficulty>("intermediate");
  const [equipment, setEquipment] = useState<EquipmentType[]>(["none", "pullup_bar"]);
  const [duration, setDuration] = useState<number>(30);
  const [generated, setGenerated] = useState<GeneratedWorkout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Storage state
  const [savedWorkouts, setSavedWorkouts] = useState<GeneratedWorkout[]>([]);
  const [recommended, setRecommended] = useState<GeneratedWorkout[]>([]);
  const [programState, setProgramState] = useState(loadProgramState());

  // Programs UI
  const [selectedTheme, setSelectedTheme] = useState<ProgramTheme>("path_of_strength");
  const [programDuration, setProgramDuration] = useState<ProgramDuration>(8);
  const [programDifficulty, setProgramDifficulty] = useState<WorkoutDifficulty>("intermediate");

  // Completion modal
  const [completingWorkout, setCompletingWorkout] = useState<GeneratedWorkout | null>(null);

  const refresh = useCallback(() => {
    const s = loadWorkoutBuilderState();
    setSavedWorkouts(s.savedWorkouts);
    setProgramState(loadProgramState());
  }, []);

  useEffect(() => {
    refresh();
    setRecommended(getRecommendedWorkouts(null, {} as never, { workouts: [] as never[] } as never, 3));
  }, [refresh]);

  function toggleEquipment(eq: EquipmentType) {
    setEquipment((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );
  }

  function handleGenerate() {
    setIsGenerating(true);
    const config: WorkoutBuilderConfig = {
      goal, difficulty, equipment: equipment.length > 0 ? equipment : ["none"], durationMins: duration,
    };
    setTimeout(() => {
      const w = generateWorkout(config);
      setGenerated(w);
      addToRecent(w);
      refresh();
      setIsGenerating(false);
    }, 400);
  }

  function handleSave(workout: GeneratedWorkout) {
    saveWorkout(workout);
    if (generated?.id === workout.id) setGenerated({ ...workout, isSaved: true });
    refresh();
  }

  function handleDeleteSaved(id: string) {
    deleteWorkout(id);
    refresh();
  }

  function handleFavorite(id: string) {
    toggleFavoriteWorkout(id);
    refresh();
  }

  function handleComplete(workout: GeneratedWorkout) {
    setCompletingWorkout(workout);
  }

  function handleStartProgram() {
    const prog = generateProgram(selectedTheme, programDuration, programDifficulty, ["none", "pullup_bar"]);
    startProgram(prog);
    refresh();
  }

  function handleAbandonProgram() {
    abandonProgram();
    refresh();
  }

  function handleCompleteProgram(prog: ActiveProgram) {
    completeProgram();
    refresh();
  }

  function handleModalClose() {
    if (completingWorkout) {
      markWorkoutCompleted(completingWorkout.id);
      if (generated?.id === completingWorkout.id) setGenerated({ ...completingWorkout, completedAt: Date.now() });
      refresh();
    }
    setCompletingWorkout(null);
  }

  const themeMeta = PROGRAM_THEME_META[selectedTheme];
  const availableWeeks = themeMeta.weeks;

  return (
    <div className="min-h-screen bg-surface-900 text-white">
      <div className="max-w-4xl mx-auto px-4 pb-24 lg:pb-8">
        <PageHeader icon="🏋️" title="WORKOUT BUILDER" subtitle="Generate Your Training" />

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-surface-800 rounded-2xl p-1.5 border border-white/8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-mono text-[10px] uppercase tracking-wider transition-all ${
                tab === t.id
                  ? "bg-green-500/15 text-green-400 border border-green-500/25"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Quick Build Tab */}
        {tab === "quick" && (
          <div className="space-y-6">
            {/* Goal selector */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">Training Goal</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GOALS.map((g) => {
                  const m = WORKOUT_GOAL_META[g];
                  return (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`p-3 rounded-xl border transition-all text-left ${
                        goal === g
                          ? `bg-green-500/12 border-green-500/30`
                          : "bg-surface-800 border-white/8 hover:border-white/20"
                      }`}
                    >
                      <div className="text-xl mb-1">{m.icon}</div>
                      <div className={`font-mono text-[10px] uppercase tracking-wider ${goal === g ? m.color : "text-white/50"}`}>
                        {m.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">Difficulty</p>
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTIES.map((d) => {
                  const m = DIFFICULTY_META[d];
                  return (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-4 py-2 rounded-xl border font-mono text-[10px] uppercase tracking-wider transition-all ${
                        difficulty === d
                          ? `${m.color} bg-white/8 border-white/20`
                          : "text-white/30 bg-surface-800 border-white/8 hover:border-white/20"
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">Duration</p>
              <div className="flex gap-2 flex-wrap">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-4 py-2 rounded-xl border font-mono text-[10px] uppercase tracking-wider transition-all ${
                      duration === d
                        ? "text-sky-400 bg-sky-500/10 border-sky-500/25"
                        : "text-white/30 bg-surface-800 border-white/8 hover:border-white/20"
                    }`}
                  >
                    {d}min
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">Equipment Available</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EQUIPMENT_LIST.map((eq) => {
                  const m = EQUIPMENT_META[eq];
                  return (
                    <button
                      key={eq}
                      onClick={() => toggleEquipment(eq)}
                      className={`p-2.5 rounded-xl border transition-all text-left flex items-center gap-2 ${
                        equipment.includes(eq)
                          ? "bg-purple-500/12 border-purple-500/30"
                          : "bg-surface-800 border-white/8 hover:border-white/20"
                      }`}
                    >
                      <span className="text-base">{m.icon}</span>
                      <span className={`font-mono text-[9px] uppercase tracking-wider ${equipment.includes(eq) ? "text-purple-300" : "text-white/40"}`}>
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 rounded-2xl font-mono text-sm uppercase tracking-widest text-green-400 bg-green-500/12 border border-green-500/25 hover:bg-green-500/20 transition-all disabled:opacity-50"
            >
              {isGenerating ? "⚡ Generating..." : "⚡ Generate Workout"}
            </button>

            {/* Result */}
            {generated && (
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">Generated Workout</p>
                <WorkoutCard
                  workout={generated}
                  onComplete={handleComplete}
                  onSave={!generated.isSaved ? handleSave : undefined}
                  showActions
                />
              </div>
            )}
          </div>
        )}

        {/* Programs Tab */}
        {tab === "programs" && (
          <div className="space-y-6">
            {/* Active program */}
            {programState.activeProgram && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">Active Program</p>
                <ProgramCard
                  program={programState.activeProgram}
                  isActive
                  onAbandon={handleAbandonProgram}
                  onComplete={handleCompleteProgram}
                />
              </div>
            )}

            {!programState.activeProgram && (
              <>
                {/* Theme selector */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">Choose a Program</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.keys(PROGRAM_THEME_META) as ProgramTheme[]).map((theme) => {
                      const m = PROGRAM_THEME_META[theme];
                      return (
                        <button
                          key={theme}
                          onClick={() => {
                            setSelectedTheme(theme);
                            if (!m.weeks.includes(programDuration as ProgramDuration)) {
                              setProgramDuration(m.weeks[0]);
                            }
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            selectedTheme === theme
                              ? `${m.bgClass} ${m.borderClass}`
                              : "bg-surface-800 border-white/8 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">{m.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`font-display text-sm tracking-wider ${selectedTheme === theme ? m.color : "text-white/70"}`}>
                                  {m.label}
                                </span>
                                {m.featured && (
                                  <span className="font-mono text-[7px] uppercase tracking-wider text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-1.5 py-0.5">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="font-body text-[11px] text-white/35 mt-0.5 line-clamp-2">{m.description}</p>
                              <div className="flex gap-1 mt-1.5">
                                {m.weeks.map((w) => (
                                  <span key={w} className="font-mono text-[8px] text-white/30 bg-white/5 rounded px-1.5 py-0.5">{w}w</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Program config */}
                <div className="p-4 bg-surface-800 border border-white/8 rounded-2xl space-y-4">
                  <p className={`font-display text-base tracking-wider ${themeMeta.color}`}>
                    {themeMeta.icon} {themeMeta.label}
                  </p>

                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-white/30 mb-2">Duration</p>
                    <div className="flex gap-2 flex-wrap">
                      {availableWeeks.map((w) => (
                        <button
                          key={w}
                          onClick={() => setProgramDuration(w)}
                          className={`px-3 py-1.5 rounded-xl border font-mono text-[9px] uppercase tracking-wider transition-all ${
                            programDuration === w
                              ? `${themeMeta.color} bg-white/8 border-white/20`
                              : "text-white/30 bg-white/3 border-white/8 hover:border-white/20"
                          }`}
                        >
                          {w} weeks
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-white/30 mb-2">Difficulty</p>
                    <div className="flex gap-2 flex-wrap">
                      {DIFFICULTIES.map((d) => {
                        const m = DIFFICULTY_META[d];
                        return (
                          <button
                            key={d}
                            onClick={() => setProgramDifficulty(d)}
                            className={`px-3 py-1.5 rounded-xl border font-mono text-[9px] uppercase tracking-wider transition-all ${
                              programDifficulty === d
                                ? `${m.color} bg-white/8 border-white/20`
                                : "text-white/30 bg-white/3 border-white/8 hover:border-white/20"
                            }`}
                          >
                            {m.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleStartProgram}
                    className={`w-full py-3 rounded-xl font-mono text-[10px] uppercase tracking-widest ${themeMeta.color} ${themeMeta.bgClass} border ${themeMeta.borderClass} hover:opacity-80 transition-all`}
                  >
                    Start Program →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Saved Tab */}
        {tab === "saved" && (
          <div>
            {savedWorkouts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">💾</div>
                <p className="font-display text-lg text-white/30">No saved workouts yet</p>
                <p className="font-body text-sm text-white/20 mt-2">Generate and save workouts from Quick Build</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">{savedWorkouts.length} saved workout{savedWorkouts.length !== 1 ? "s" : ""}</p>
                {savedWorkouts.map((w) => (
                  <WorkoutCard
                    key={w.id}
                    workout={w}
                    onComplete={handleComplete}
                    onFavorite={handleFavorite}
                    onDelete={handleDeleteSaved}
                    showActions
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recommended Tab */}
        {tab === "recommended" && (
          <div className="space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Recommended for You</p>
            {recommended.map((w) => (
              <WorkoutCard
                key={w.id}
                workout={w}
                onComplete={handleComplete}
                onSave={handleSave}
                showActions
              />
            ))}
          </div>
        )}
      </div>

      <WorkoutCompletionModal
        workout={completingWorkout}
        onClose={handleModalClose}
      />
    </div>
  );
}
