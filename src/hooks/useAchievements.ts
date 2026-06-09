"use client";

import { useState, useEffect, useCallback } from "react";
import { AchievementState, AchievementNotification } from "@/lib/achievement-types";
import { loadAchievementState, saveAchievementState } from "@/lib/achievement-storage";
import { buildSnapshot, checkAchievements } from "@/lib/achievement-utils";
import { loadState } from "@/lib/storage";
import { loadTreeState } from "@/lib/skilltree-engine";
import { ACHIEVEMENT_MAP } from "@/lib/achievement-data";

export function useAchievements() {
  const [achState, setAchState] = useState<AchievementState | null>(null);
  const [notifQueue, setNotifQueue] = useState<AchievementNotification[]>([]);

  useEffect(() => {
    setAchState(loadAchievementState());
  }, []);

  // Auto-dismiss current notification after delay based on rarity
  useEffect(() => {
    if (notifQueue.length === 0) return;
    const current = notifQueue[0];
    const ach = ACHIEVEMENT_MAP[current.id];
    const delay =
      ach?.rarity === "secret_legendary" ? 9000
      : ach?.rarity === "legendary" ? 6000
      : 4000;
    const timer = setTimeout(() => {
      setNotifQueue((q) => q.slice(1));
    }, delay);
    return () => clearTimeout(timer);
  }, [notifQueue]);

  const checkAndUpdate = useCallback(() => {
    const appState  = loadState();
    const treeState = loadTreeState();
    const snapshot  = buildSnapshot(appState, treeState);

    setAchState((prev) => {
      if (!prev) return prev;
      const { newState, newlyUnlocked } = checkAchievements(prev, snapshot);
      if (newlyUnlocked.length === 0) return prev;
      saveAchievementState(newState);
      const notifs: AchievementNotification[] = newlyUnlocked.map((id) => ({
        id,
        triggeredAt: Date.now(),
      }));
      setNotifQueue((q) => [...q, ...notifs]);
      return newState;
    });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotifQueue((q) => q.slice(1));
  }, []);

  return { achState, notifQueue, checkAndUpdate, dismissNotification };
}
