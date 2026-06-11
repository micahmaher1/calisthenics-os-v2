import { LibraryState } from "./library-types";

const STORAGE_KEY = "calisthenics-os:library:v1";

export function defaultLibraryState(): LibraryState {
  return {
    favoriteSkillIds:  [],
    trackedSkillIds:   [],
    completedSkillIds: [],
    goalSkillId:       null,
    lastViewedSkillId: null,
  };
}

export function loadLibraryState(): LibraryState {
  if (typeof window === "undefined") return defaultLibraryState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultLibraryState();
    return { ...defaultLibraryState(), ...JSON.parse(raw) } as LibraryState;
  } catch {
    return defaultLibraryState();
  }
}

export function saveLibraryState(s: LibraryState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export function toggleFavoriteSkill(id: string): void {
  const s = loadLibraryState();
  const idx = s.favoriteSkillIds.indexOf(id);
  if (idx === -1) {
    s.favoriteSkillIds = [...s.favoriteSkillIds, id];
  } else {
    s.favoriteSkillIds = s.favoriteSkillIds.filter((x) => x !== id);
  }
  saveLibraryState(s);
}

export function toggleTrackedSkill(id: string): void {
  const s = loadLibraryState();
  const idx = s.trackedSkillIds.indexOf(id);
  if (idx === -1) {
    s.trackedSkillIds = [...s.trackedSkillIds, id];
  } else {
    s.trackedSkillIds = s.trackedSkillIds.filter((x) => x !== id);
  }
  saveLibraryState(s);
}

export function markSkillComplete(id: string): void {
  const s = loadLibraryState();
  if (!s.completedSkillIds.includes(id)) {
    s.completedSkillIds = [...s.completedSkillIds, id];
  }
  saveLibraryState(s);
}

export function setGoalSkill(id: string | null): void {
  const s = loadLibraryState();
  s.goalSkillId = id;
  saveLibraryState(s);
}
