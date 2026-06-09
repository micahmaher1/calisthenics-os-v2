---
name: project-achievement-system
description: Achievement system implementation details for Calisthenics OS
metadata:
  type: project
---

Achievement system fully implemented. Key facts:

- `files/` directory contains original reference files excluded from TypeScript via tsconfig
- Achievement types/data live in `src/lib/achievement-types.ts` and `src/lib/achievement-data.ts`
- Storage: `src/lib/achievement-storage.ts`, key: `calisthenics-os:achievements:v1`
- Logic: `src/lib/achievement-utils.ts` — `buildSnapshot`, `checkAchievements`, `computeStats`
- Hook: `src/hooks/useAchievements.ts` — reads both localStorage stores, queues notifications
- UI: `src/components/achievements/` — AchievementCard, AchievementToast, AchievementPage
- Route: `/achievements` page
- Header now has 🏆 Achievements link alongside 🌳 Skill Tree

**Why:** Integration of achievement tracking that reads from both AppState (workouts) and SkillTreeState (completed nodes). No shared context — each page independently calls `checkAndUpdate()` which reads localStorage directly.
