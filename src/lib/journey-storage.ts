import { JourneyState, JourneyProgress } from "./journey-types";

const JOURNEY_KEY = "calisthenics-os:journeys:v1";

export function defaultJourneyState(): JourneyState {
  return {
    activeJourneyId:        null,
    journeyProgress:        {},
    completedJourneyIds:    [],
    totalJourneysStarted:   0,
    totalJourneysCompleted: 0,
  };
}

export function loadJourneyState(): JourneyState {
  if (typeof window === "undefined") return defaultJourneyState();
  try {
    const raw = localStorage.getItem(JOURNEY_KEY);
    if (!raw) return defaultJourneyState();
    const parsed = JSON.parse(raw) as JourneyState;
    if (!parsed.journeyProgress)     parsed.journeyProgress     = {};
    if (!parsed.completedJourneyIds) parsed.completedJourneyIds = [];
    if (parsed.totalJourneysStarted   === undefined) parsed.totalJourneysStarted   = 0;
    if (parsed.totalJourneysCompleted === undefined) parsed.totalJourneysCompleted = 0;
    return parsed;
  } catch {
    return defaultJourneyState();
  }
}

export function saveJourneyState(s: JourneyState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(s));
  } catch {}
}

export function startJourney(journeyId: string): JourneyState {
  const s = loadJourneyState();
  const isNew = !s.journeyProgress[journeyId];
  if (isNew) {
    const progress: JourneyProgress = {
      journeyId,
      startedAt:             Date.now(),
      currentStageIndex:     0,
      completedStageIds:     [],
      manualChecks:          {},
      claimedRewardStageIds: [],
      totalXPEarned:         0,
      totalCoinsEarned:      0,
    };
    s.journeyProgress[journeyId] = progress;
    s.totalJourneysStarted += 1;
  }
  s.activeJourneyId = journeyId;
  saveJourneyState(s);
  return s;
}

export function markManualRequirement(journeyId: string, key: string): JourneyState {
  const s = loadJourneyState();
  if (s.journeyProgress[journeyId]) {
    s.journeyProgress[journeyId].manualChecks[key] = true;
  }
  saveJourneyState(s);
  return s;
}

export function claimStageReward(journeyId: string, stageId: string): JourneyState {
  const s = loadJourneyState();
  if (s.journeyProgress[journeyId]) {
    const claimed = s.journeyProgress[journeyId].claimedRewardStageIds;
    if (!claimed.includes(stageId)) {
      s.journeyProgress[journeyId].claimedRewardStageIds = [...claimed, stageId];
    }
  }
  saveJourneyState(s);
  return s;
}

export function completeJourney(journeyId: string): JourneyState {
  const s = loadJourneyState();
  if (s.journeyProgress[journeyId]) {
    s.journeyProgress[journeyId].completedAt = Date.now();
  }
  if (!s.completedJourneyIds.includes(journeyId)) {
    s.completedJourneyIds = [...s.completedJourneyIds, journeyId];
    s.totalJourneysCompleted += 1;
  }
  saveJourneyState(s);
  return s;
}
