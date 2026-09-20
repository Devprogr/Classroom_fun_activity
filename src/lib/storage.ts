import type { AppState } from "../types";
import { createSeedBehaviours, createSeedRewards } from "./seed";

export const STORAGE_KEY = "classpoints:v1";

export function createInitialState(): AppState {
  return {
    setupComplete: false,
    pin: null,
    classInfo: { name: "", createdAt: Date.now() },
    students: [],
    behaviours: createSeedBehaviours(),
    rewards: createSeedRewards(),
    log: [],
  };
}

function isValidState(value: unknown): value is AppState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.students) &&
    Array.isArray(v.behaviours) &&
    Array.isArray(v.rewards) &&
    Array.isArray(v.log) &&
    typeof v.classInfo === "object" &&
    v.classInfo !== null
  );
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    if (!isValidState(parsed)) return createInitialState();
    return parsed;
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable (private mode, quota exceeded). Nothing
    // sensible to do from a kiosk-style classroom app besides drop the write.
  }
}
