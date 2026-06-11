import { LibrarySkill, ProgressionChain } from "./library-types";
import { LIBRARY_SKILLS, SKILL_LIBRARY_MAP, PROGRESSION_CHAINS } from "./library-data";
import { SkillProgress } from "./skill-requirements-types";

export function getSkillChain(skillId: string): ProgressionChain | null {
  return PROGRESSION_CHAINS.find((c) => c.skills.includes(skillId)) ?? null;
}

export function getSkillPositionInChain(skillId: string, chain: ProgressionChain): number {
  return chain.skills.indexOf(skillId);
}

export function getNextProgression(skillId: string): LibrarySkill | null {
  const skill = SKILL_LIBRARY_MAP[skillId];
  if (!skill || skill.progressions.length === 0) return null;
  return SKILL_LIBRARY_MAP[skill.progressions[0]] ?? null;
}

export function getPreviousProgression(skillId: string): LibrarySkill | null {
  const skill = SKILL_LIBRARY_MAP[skillId];
  if (!skill || skill.regressions.length === 0) return null;
  return SKILL_LIBRARY_MAP[skill.regressions[0]] ?? null;
}

export function filterLibrarySkills(
  skills: LibrarySkill[],
  query: string,
  domain: string,
  tier: string,
): LibrarySkill[] {
  let result = skills;
  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (domain && domain !== "all") {
    result = result.filter((s) => s.domain === domain);
  }
  if (tier && tier !== "all") {
    result = result.filter((s) => s.tier === tier);
  }
  return result;
}

export function getLegendarySkillsByReadiness(
  progressMap: Record<string, SkillProgress>,
): Array<{ skill: LibrarySkill; progress: SkillProgress | null }> {
  const legendary = LIBRARY_SKILLS.filter((s) => s.isLegendary);
  return legendary
    .map((skill) => ({
      skill,
      progress: progressMap[skill.id] ?? null,
    }))
    .sort((a, b) => {
      const pctA = a.progress?.pct ?? 0;
      const pctB = b.progress?.pct ?? 0;
      return pctB - pctA;
    });
}

export function searchLibrarySkills(query: string): LibrarySkill[] {
  if (!query.trim()) return LIBRARY_SKILLS;
  return filterLibrarySkills(LIBRARY_SKILLS, query, "all", "all");
}
