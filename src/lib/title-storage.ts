import { TitleState } from "./title-types";

const TITLE_KEY = "calisthenics-os:titles:v1";

export function defaultTitleState(): TitleState {
  return {
    unlockedTitleIds: [],
    equippedTitleId:  null,
    unlockedBadgeIds: [],
    favoriteBadgeIds: [],
    seenUnlockIds:    [],
    lastEvaluatedAt:  0,
  };
}

export function loadTitleState(): TitleState {
  if (typeof window === "undefined") return defaultTitleState();
  try {
    const raw = localStorage.getItem(TITLE_KEY);
    if (!raw) return defaultTitleState();
    return JSON.parse(raw) as TitleState;
  } catch {
    return defaultTitleState();
  }
}

export function saveTitleState(state: TitleState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TITLE_KEY, JSON.stringify(state));
  } catch {}
}

export function equipTitle(id: string | null): void {
  const state = loadTitleState();
  state.equippedTitleId = id;
  saveTitleState(state);
}

export function toggleFavoriteBadge(id: string): void {
  const state = loadTitleState();
  const idx = state.favoriteBadgeIds.indexOf(id);
  if (idx >= 0) {
    state.favoriteBadgeIds = state.favoriteBadgeIds.filter((x) => x !== id);
  } else if (state.favoriteBadgeIds.length < 4) {
    state.favoriteBadgeIds = [...state.favoriteBadgeIds, id];
  }
  saveTitleState(state);
}
