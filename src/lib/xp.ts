import { Skill, SkillName, SkillMap } from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const XP_PER_WORKOUT   = 25;
export const XP_PER_LEVEL     = 100;
export const COINS_PER_WORKOUT = 10;

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
  return (calcXPIntoLevel(xp) / XP_PER_LEVEL) * 100;
}

// ─── Rank System ──────────────────────────────────────────────────────────────

export interface RankInfo {
  label:       string;
  minLevel:    number;
  nextLevel:   number | null;
  color:       string;
  borderColor: string;
  bgColor:     string;
  icon:        string;
}

export const RANK_TABLE: RankInfo[] = [
  { label: "Beginner",         minLevel: 1,   nextLevel: 5,   color: "text-white/60",   borderColor: "border-white/10",     bgColor: "bg-white/5",       icon: "🌱" },
  { label: "Trainee",          minLevel: 5,   nextLevel: 10,  color: "text-green-400",  borderColor: "border-green-500/30", bgColor: "bg-green-500/10",  icon: "⚡" },
  { label: "Athlete",          minLevel: 10,  nextLevel: 20,  color: "text-sky-400",    borderColor: "border-sky-500/30",   bgColor: "bg-sky-500/10",    icon: "💪" },
  { label: "Advanced Athlete", minLevel: 20,  nextLevel: 35,  color: "text-purple-400", borderColor: "border-purple-500/30",bgColor: "bg-purple-500/10", icon: "🔥" },
  { label: "Elite",            minLevel: 35,  nextLevel: 50,  color: "text-orange-400", borderColor: "border-orange-500/30",bgColor: "bg-orange-500/10", icon: "⚔️" },
  { label: "Master",           minLevel: 50,  nextLevel: 75,  color: "text-yellow-400", borderColor: "border-yellow-500/30",bgColor: "bg-yellow-500/10", icon: "👑" },
  { label: "Grandmaster",      minLevel: 75,  nextLevel: 100, color: "text-yellow-300", borderColor: "border-yellow-400/40",bgColor: "bg-yellow-500/10", icon: "💎" },
  { label: "Legend",           minLevel: 100, nextLevel: null,color: "text-yellow-200", borderColor: "border-yellow-300/50",bgColor: "bg-yellow-400/10", icon: "🌟" },
];

export function getRankLabel(level: number): string {
  return getRankInfo(level).label;
}

export function getRankInfo(level: number): RankInfo {
  let rank = RANK_TABLE[0];
  for (const r of RANK_TABLE) {
    if (level >= r.minLevel) rank = r;
  }
  return rank;
}

// ─── Skill Defaults ───────────────────────────────────────────────────────────

export function createDefaultSkills(): SkillMap {
  return {
    "push-ups": { name: "push-ups", label: "Push-Ups", xp: 0, level: 1, icon: "🤜", color: "brand" },
    "pull-ups": { name: "pull-ups", label: "Pull-Ups", xp: 0, level: 1, icon: "🦅", color: "sky" },
    dips:       { name: "dips",     label: "Dips",     xp: 0, level: 1, icon: "⚡", color: "amber" },
  };
}

export function awardSkillXP(skills: SkillMap, skillName: SkillName, xp: number): SkillMap {
  const skill = skills[skillName];
  const newXP = skill.xp + xp;
  return { ...skills, [skillName]: { ...skill, xp: newXP, level: calcLevel(newXP) } };
}

export function getSkillAccentClass(color: string): string {
  const map: Record<string, string> = { brand: "text-green-400", sky: "text-sky-400", amber: "text-amber-400" };
  return map[color] ?? "text-green-400";
}

export function getSkillBarClass(color: string): string {
  const map: Record<string, string> = { brand: "bg-green-400", sky: "bg-sky-400", amber: "bg-amber-400" };
  return map[color] ?? "bg-green-400";
}

export function getSkillGlowClass(color: string): string {
  const map: Record<string, string> = {
    brand: "shadow-green-500/30", sky: "shadow-sky-500/30", amber: "shadow-amber-500/30",
  };
  return map[color] ?? "shadow-green-500/30";
}
