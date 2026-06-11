import { ActiveProgram, ProgramState } from "@/lib/program-types";

const KEY = "calisthenics-os:programs:v1";

export function defaultProgramState(): ProgramState {
  return {
    activeProgram:          null,
    completedPrograms:      [],
    totalProgramsCompleted: 0,
  };
}

export function loadProgramState(): ProgramState {
  if (typeof window === "undefined") return defaultProgramState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgramState();
    return { ...defaultProgramState(), ...(JSON.parse(raw) as ProgramState) };
  } catch {
    return defaultProgramState();
  }
}

export function saveProgramState(state: ProgramState): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function startProgram(program: ActiveProgram): void {
  const state = loadProgramState();
  state.activeProgram = program;
  saveProgramState(state);
}

export function completeProgramDay(programId: string, dayNumber: number): void {
  const state = loadProgramState();
  if (!state.activeProgram || state.activeProgram.id !== programId) return;
  state.activeProgram.days = state.activeProgram.days.map((d) =>
    d.dayNumber === dayNumber ? { ...d, completedAt: Date.now() } : d
  );
  saveProgramState(state);
}

export function abandonProgram(): void {
  const state = loadProgramState();
  state.activeProgram = null;
  saveProgramState(state);
}

export function completeProgram(): void {
  const state = loadProgramState();
  if (!state.activeProgram) return;
  const completed = { ...state.activeProgram, completedAt: Date.now() };
  state.completedPrograms = [completed, ...state.completedPrograms];
  state.totalProgramsCompleted++;
  state.activeProgram = null;
  saveProgramState(state);
}
