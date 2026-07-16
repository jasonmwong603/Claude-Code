import { STORAGE_KEY } from './config'
import { DEFAULT_PROFILE } from '../data/cosmetics'
import type { AppState } from '../types'

/* Real persistence for KeyDate.

   The v5 prototype used `window.storage` — an API that only exists inside a
   Claude.ai artifact. This replaces it with localStorage, which works the same
   way on the web AND inside the Capacitor WebView on iOS/Android, so no
   platform-specific code is needed for the MVP. (When accounts/sync arrive,
   swap the three functions below for a backend client — the rest of the app
   only ever calls loadState / saveState / clearState.) */

function migrate(s: Partial<AppState>): AppState {
  // Fill in fields added after a user's data was first written.
  if (!s.completedLessons) s.completedLessons = []
  if (s.xp === undefined) s.xp = 0
  if (!s.contributions) s.contributions = []
  if (!s.earnedBadges) s.earnedBadges = []
  if (!s.profile) s.profile = { ...DEFAULT_PROFILE }
  return s as AppState
}

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return migrate(JSON.parse(raw))
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be unavailable (private mode / quota). Failing to persist
    // should never crash the app; the in-memory state still works this session.
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
