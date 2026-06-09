import { Skill, SkillName, SkillMap } from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const XP_PER_WORKOUT = 25;
export const XP_PER_LEVEL = 100;

// ─── Level Calculations ───────────────────────────────────────────────────────

export function calcLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function calcXPIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function calcXPToNextLevel(xp: number): number {
  return XP_PER_LEVEL - calcXPIntoLevel(xp);
}

export function calcLevelProgress(xp: number): number {
  // Returns 0–100 (percent)
  return (calcXPIntoLevel(xp) / XP_PER_LEVEL) * 100;
}

// ─── Rank Labels ──────────────────────────────────────────────────────────────

const RANKS = [
  { min: 1, label: "Recruit" },
  { min: 5, label: "Novice" },
  { min: 10, label: "Athlete" },
  { min: 20, label: "Warrior" },
  { min: 35, label: "Elite" },
  { min: 50, label: "Legend" },
];

export function getRankLabel(level: number): string {
  let rank = RANKS[0].label;
  for (const r of RANKS) {
    if (level >= r.min) rank = r.label;
  }
  return rank;
}

// ─── Skill Defaults ───────────────────────────────────────────────────────────

export function createDefaultSkills(): SkillMap {
  return {
    "push-ups": {
      name: "push-ups",
      label: "Push-Ups",
      xp: 0,
      level: 1,
      icon: "🤜",
      color: "brand",
    },
    "pull-ups": {
      name: "pull-ups",
      label: "Pull-Ups",
      xp: 0,
      level: 1,
      icon: "🦅",
      color: "sky",
    },
    dips: {
      name: "dips",
      label: "Dips",
      xp: 0,
      level: 1,
      icon: "⚡",
      color: "amber",
    },
  };
}

// ─── Skill XP Award ───────────────────────────────────────────────────────────

export function awardSkillXP(
  skills: SkillMap,
  skillName: SkillName,
  xp: number
): SkillMap {
  const skill = skills[skillName];
  const newXP = skill.xp + xp;
  return {
    ...skills,
    [skillName]: {
      ...skill,
      xp: newXP,
      level: calcLevel(newXP),
    },
  };
}

// ─── Skill Color Helpers ──────────────────────────────────────────────────────

export function getSkillAccentClass(color: string): string {
  const map: Record<string, string> = {
    brand: "text-green-400",
    sky: "text-sky-400",
    amber: "text-amber-400",
  };
  return map[color] ?? "text-green-400";
}

export function getSkillBarClass(color: string): string {
  const map: Record<string, string> = {
    brand: "bg-green-400",
    sky: "bg-sky-400",
    amber: "bg-amber-400",
  };
  return map[color] ?? "bg-green-400";
}

export function getSkillGlowClass(color: string): string {
  const map: Record<string, string> = {
    brand: "shadow-green-500/30",
    sky: "shadow-sky-500/30",
    amber: "shadow-amber-500/30",
  };
  return map[color] ?? "shadow-green-500/30";
}
