import { StandardsState } from "./movement-standards-types";

const KEY = "calisthenics-os:standards:v1";

export function defaultStandardsState(): StandardsState {
  return { manualValues: {}, trackedIds: [], lastUpdatedAt: 0 };
}

export function loadStandardsState(): StandardsState {
  if (typeof window === "undefined") return defaultStandardsState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultStandardsState();
    const parsed = JSON.parse(raw) as Partial<StandardsState>;
    return {
      manualValues:  parsed.manualValues  ?? {},
      trackedIds:    parsed.trackedIds    ?? [],
      lastUpdatedAt: parsed.lastUpdatedAt ?? 0,
    };
  } catch {
    return defaultStandardsState();
  }
}

export function saveStandardsState(s: StandardsState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // storage unavailable
  }
}

export function setManualValue(standardId: string, value: number): void {
  const state = loadStandardsState();
  state.manualValues[standardId] = value;
  state.lastUpdatedAt = Date.now();
  saveStandardsState(state);
}

export function toggleTracked(standardId: string): void {
  const state = loadStandardsState();
  const idx = state.trackedIds.indexOf(standardId);
  if (idx >= 0) {
    state.trackedIds.splice(idx, 1);
  } else {
    state.trackedIds.push(standardId);
  }
  saveStandardsState(state);
}
