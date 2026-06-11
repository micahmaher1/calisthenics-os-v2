/**
 * skill-readiness-breakdown.ts
 *
 * Groups a skill's requirementProgress into human-readable categories
 * (Pull Strength, Core Strength, Scapular Strength, etc.) so the UI can
 * display a per-area breakdown rather than a flat list of requirements.
 */

import type { SkillRequirement, SkillProgress } from "./skill-requirements-types";

// ─── Output Type ─────────────────────────────────────────────────────────────

export interface ReadinessBreakdownCategory {
  id:         string;
  label:      string;
  icon:       string;
  pct:        number;  // 0-100, average across all reqs in this group
  metCount:   number;
  totalCount: number;
}

// ─── Generic Categorisation ───────────────────────────────────────────────────

function categoriseReq(req: SkillRequirement): { id: string; label: string; icon: string } {
  switch (req.type) {
    case "record_reps": {
      const t = req.target.toLowerCase();
      if (t.includes("pull") || t.includes("chin")) return { id: "pull_strength", label: "Pull Strength",  icon: "💪" };
      if (t.includes("push") || t.includes("dip") || t.includes("press")) return { id: "push_strength", label: "Push Strength", icon: "🏋️" };
      return { id: "performance", label: "Performance", icon: "📊" };
    }
    case "record_seconds": {
      const t = req.target.toLowerCase();
      if (t.includes("hang")) return { id: "grip_endurance", label: "Grip Endurance",  icon: "✊" };
      if (
        t.includes("plank") || t.includes("flag") || t.includes("lever") ||
        t.includes("planche") || t.includes("l_sit") || t.includes("handstand") ||
        t.includes("hold") || t.includes("support")
      ) return { id: "static_hold", label: "Static Hold Strength", icon: "🧲" };
      return { id: "endurance", label: "Endurance", icon: "⏱️" };
    }
    case "mastery_level": {
      switch (req.target) {
        case "strength":       return { id: "strength_mastery",     label: "Strength Mastery",     icon: "💪" };
        case "static_strength":return { id: "static_mastery",       label: "Static Strength",       icon: "🧲" };
        case "balance":        return { id: "balance_mastery",      label: "Balance",               icon: "⚖️" };
        case "mobility":       return { id: "mobility_mastery",     label: "Mobility",              icon: "🔄" };
        case "explosive":      return { id: "power_mastery",        label: "Power",                 icon: "⚡" };
        case "endurance":      return { id: "endurance_mastery",    label: "Endurance",             icon: "🏃" };
        case "grip":           return { id: "grip_mastery",         label: "Grip",                  icon: "✊" };
        case "coordination":   return { id: "coordination_mastery", label: "Coordination",          icon: "🎯" };
        default:               return { id: "mastery",              label: "Mastery",               icon: "⭐" };
      }
    }
    case "journey_stage":  return { id: "journey",       label: "Skill Journey",  icon: "🗺️" };
    case "level":          return { id: "level",         label: "Player Level",   icon: "🏅" };
    case "xp":             return { id: "xp",            label: "Total XP",       icon: "✨" };
    case "achievement":    return { id: "achievements",  label: "Achievements",   icon: "🏆" };
    case "workout_count":  return { id: "workouts",      label: "Workout Volume", icon: "📅" };
    case "streak_days":    return { id: "streak",        label: "Streak",         icon: "🔥" };
    case "skill_unlocked": return { id: "prerequisites", label: "Prerequisites",  icon: "🔓" };
    default:               return { id: "other",         label: "Other",          icon: "📋" };
  }
}

// ─── Per-skill label overrides ────────────────────────────────────────────────
// Lets us say "Scapular Strength" instead of "Static Strength" for front lever, etc.

const SKILL_LABEL_OVERRIDES: Record<string, Record<string, string>> = {
  front_lever:       { strength_mastery: "Back Strength",       static_mastery: "Scapular Strength",    journey: "Lever Progressions"     },
  full_front_lever:  { strength_mastery: "Back Strength",       static_mastery: "Scapular Strength",    journey: "Lever Progressions"     },
  muscle_up:         { pull_strength: "Pull-Up Strength",       strength_mastery: "Upper Body Strength"                                   },
  ring_muscle_up:    { pull_strength: "Ring Pull Strength",     strength_mastery: "Ring Strength",       static_mastery: "Ring Stability"  },
  handstand:         { balance_mastery: "Balance & Control",    journey: "Handstand Progressions"                                         },
  press_handstand:   { balance_mastery: "Handstand Balance",    strength_mastery: "Press Strength",      mobility_mastery: "Pike Mobility" },
  handstand_push_up: { strength_mastery: "Press Strength",      balance_mastery: "Handstand Balance",   journey: "HSPU Progressions"      },
  one_arm_handstand: { balance_mastery: "One-Arm Balance",      strength_mastery: "Shoulder Strength",  journey: "Handstand Progressions" },
  human_flag:        { pull_strength: "Pulling Power",          strength_mastery: "Lateral Strength",   journey: "Flag Progressions"      },
  full_human_flag:   { pull_strength: "Pulling Power",          strength_mastery: "Lateral Strength",   journey: "Flag Progressions"      },
  tuck_human_flag:   { pull_strength: "Pull Power",             strength_mastery: "Lateral Strength",   static_mastery: "Body Tension"    },
  tuck_planche:      { strength_mastery: "Press Strength",      static_mastery: "Straight Arm Strength",journey: "Planche Progressions"   },
  full_planche:      { strength_mastery: "Press Strength",      static_mastery: "Straight Arm Strength",balance_mastery: "Body Control"   },
  straddle_planche:  { strength_mastery: "Press Strength",      static_mastery: "Straight Arm Strength",journey: "Planche Progressions"   },
  planche_lean:      { strength_mastery: "Press Strength",      static_mastery: "Straight Arm Strength"                                   },
  one_arm_pull_up:   { pull_strength: "Pull-Up Strength",       strength_mastery: "Unilateral Strength",grip_mastery: "Grip Strength"     },
  iron_cross:        { pull_strength: "Ring Pulling",           strength_mastery: "Ring Strength",      static_mastery: "Straight Arm"    },
  dragon_flag:       { strength_mastery: "Core & Lat Strength", static_mastery: "Anterior Chain",       journey: "Core Progressions"      },
  v_sit:             { strength_mastery: "Hip Flexor Strength", static_mastery: "Compression Strength", journey: "Core Progressions"      },
  l_sit:             { static_mastery: "Compression Strength",  strength_mastery: "Tricep & Core",      grip_mastery: "Wrist Strength"    },
  one_arm_push_up:   { push_strength: "One-Arm Press",          strength_mastery: "Unilateral Strength"                                   },
  archer_push_up:    { push_strength: "Lateral Press",          strength_mastery: "Unilateral Strength"                                   },
  archer_pull_up:    { pull_strength: "Lateral Pull",           strength_mastery: "Unilateral Strength"                                   },
  pistol_squat:      { strength_mastery: "Leg Strength",        mobility_mastery: "Ankle & Hip Mobility",balance_mastery: "Single Leg Balance"},
};

// ─── Main Export ──────────────────────────────────────────────────────────────

export function calcReadinessBreakdown(
  skillId: string,
  progress: SkillProgress,
): ReadinessBreakdownCategory[] {
  if (!progress.requirementProgress.length) return [];

  const overrides = SKILL_LABEL_OVERRIDES[skillId] ?? {};
  const map: Record<string, { label: string; icon: string; pctSum: number; met: number; total: number }> = {};

  for (const rp of progress.requirementProgress) {
    const { id, label, icon } = categoriseReq(rp.req);
    const finalLabel = overrides[id] ?? label;
    if (!map[id]) {
      map[id] = { label: finalLabel, icon, pctSum: 0, met: 0, total: 0 };
    }
    map[id].pctSum += rp.pct;
    map[id].total  += 1;
    if (rp.met) map[id].met += 1;
  }

  return Object.entries(map)
    .map(([id, g]) => ({
      id,
      label:      g.label,
      icon:       g.icon,
      pct:        Math.min(100, Math.round(g.pctSum / g.total)),
      metCount:   g.met,
      totalCount: g.total,
    }))
    .filter((c) => c.totalCount > 0)
    .sort((a, b) => a.pct - b.pct);  // weakest first
}

export function getWeakestCategory(
  breakdown: ReadinessBreakdownCategory[],
): ReadinessBreakdownCategory | null {
  return breakdown.find((c) => c.pct < 100) ?? null;
}

export function getStrongestCategory(
  breakdown: ReadinessBreakdownCategory[],
): ReadinessBreakdownCategory | null {
  if (!breakdown.length) return null;
  return [...breakdown].sort((a, b) => b.pct - a.pct)[0];
}
