import { SaveData, SAVE_KEY } from "./types";

// ─── Save current game progress to localStorage ─────────────────────

export function saveProgress(data: SaveData): void {
  try {
    const payload = { ...data, savedAt: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

// ─── Load saved game progress from localStorage ─────────────────────

export function loadProgress(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    // Basic validation
    if (!data.sceneId || typeof data.minigameWon !== "object") {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

// ─── Clear saved game progress ──────────────────────────────────────

export function clearProgress(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

// ─── Check if save exists ───────────────────────────────────────────

export function hasSavedProgress(): boolean {
  return loadProgress() !== null;
}

// ─── Format save timestamp for display ──────────────────────────────

export function formatSaveTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
