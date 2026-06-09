import { QuestState } from "./quest-types";
import { buildDefaultQuestState } from "./quest-engine";

const QUEST_KEY = "calisthenics-os:quests:v1";

export function loadQuestState(): QuestState {
  if (typeof window === "undefined") return buildDefaultQuestState();
  try {
    const raw = localStorage.getItem(QUEST_KEY);
    if (!raw) return buildDefaultQuestState();
    const parsed = JSON.parse(raw) as QuestState;
    // Back-fill missing fields
    if (!parsed.stats.perfectDays)  parsed.stats.perfectDays  = 0;
    if (!parsed.stats.perfectWeeks) parsed.stats.perfectWeeks = 0;
    return parsed;
  } catch {
    return buildDefaultQuestState();
  }
}

export function saveQuestState(state: QuestState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUEST_KEY, JSON.stringify(state));
  } catch {}
}

// Stores the skill count and level at week start so we can measure weekly delta
const WEEK_BASELINE_KEY = "calisthenics-os:quests:week-baseline";

export interface WeekBaseline {
  weekKey:      string;
  skillsUnlocked: number;
  level:          number;
}

export function loadWeekBaseline(currentWeekKey: string, skillCount: number, level: number): WeekBaseline {
  if (typeof window === "undefined") return { weekKey: currentWeekKey, skillsUnlocked: skillCount, level };
  try {
    const raw = localStorage.getItem(WEEK_BASELINE_KEY);
    if (raw) {
      const b = JSON.parse(raw) as WeekBaseline;
      if (b.weekKey === currentWeekKey) return b;
    }
  } catch {}
  // New week — save fresh baseline
  const baseline: WeekBaseline = { weekKey: currentWeekKey, skillsUnlocked: skillCount, level };
  try { localStorage.setItem(WEEK_BASELINE_KEY, JSON.stringify(baseline)); } catch {}
  return baseline;
}
