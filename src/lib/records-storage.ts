import {
  RecordsState, TrackedRecord, Milestone, SkillMilestone, CustomRecord,
} from "./records-types";
import { SKILL_MILESTONES_DEF } from "./records-engine";

const KEY = "calisthenics-os:records:v1";

export function defaultRecordsState(): RecordsState {
  const skillMilestones: Record<string, SkillMilestone> = {};
  SKILL_MILESTONES_DEF.forEach((sm) => {
    skillMilestones[sm.id] = { ...sm, achieved: false, dateAchieved: null };
  });

  return {
    records:         {},
    milestones:      {},
    milestoneDates:  {},
    skillMilestones,
    customRecords:   [],
    lastEvaluated:   null,
  };
}

export function loadRecordsState(): RecordsState {
  if (typeof window === "undefined") return defaultRecordsState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultRecordsState();
    const parsed = JSON.parse(raw) as RecordsState;
    // Back-fill skill milestones if new ones were added
    SKILL_MILESTONES_DEF.forEach((sm) => {
      if (!parsed.skillMilestones[sm.id]) {
        parsed.skillMilestones[sm.id] = { ...sm, achieved: false, dateAchieved: null };
      }
    });
    if (!parsed.customRecords) parsed.customRecords = [];
    if (!parsed.milestoneDates) parsed.milestoneDates = {};
    return parsed;
  } catch {
    return defaultRecordsState();
  }
}

export function saveRecordsState(state: RecordsState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function addCustomRecord(state: RecordsState, name: string, unit: string): RecordsState {
  const newRecord: CustomRecord = {
    id: `cr_${Date.now()}`,
    name,
    unit,
    currentValue: null,
    history: [],
    createdAt: new Date().toISOString(),
  };
  return { ...state, customRecords: [...state.customRecords, newRecord] };
}

export function updateCustomRecord(
  state: RecordsState,
  id: string,
  value: number,
): RecordsState {
  const updated = state.customRecords.map((cr) => {
    if (cr.id !== id) return cr;
    const entry = { value, dateAchieved: new Date().toISOString() };
    return {
      ...cr,
      currentValue: value,
      history: [...cr.history, entry],
    };
  });
  return { ...state, customRecords: updated };
}

export function deleteCustomRecord(state: RecordsState, id: string): RecordsState {
  return { ...state, customRecords: state.customRecords.filter((cr) => cr.id !== id) };
}
