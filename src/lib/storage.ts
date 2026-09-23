import type { AppState } from './types'

const KEY = 'stoppr:v1'

export function defaultState(): AppState {
  return {
    version: 1,
    onboarded: false,
    name: '',
    trackedSince: new Date().toISOString(),
    goalDays: 90,
    reasons: [],
    relapses: [],
    journal: [],
    urgesDefeated: 0,
  }
}

type Legacy = Partial<Omit<AppState, 'relapses'>> & {
  startedAt?: string
  longestMs?: number
  relapses?: (AppState['relapses'][number] & { streakMs?: number })[]
}

// Early builds stored a current-streak start plus a per-relapse streak length instead of a tracking origin.
function migrate(saved: Legacy): Partial<AppState> {
  if (saved.trackedSince) return saved
  const origins = (saved.relapses ?? []).map((r) => new Date(r.at).getTime() - (r.streakMs ?? 0))
  const since = Math.min(new Date(saved.startedAt ?? Date.now()).getTime(), ...origins)
  const { startedAt: _s, longestMs: _l, ...rest } = saved
  return {
    ...rest,
    trackedSince: new Date(since).toISOString(),
    relapses: (rest.relapses ?? []).map(({ streakMs: _m, ...r }) => r),
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    return { ...defaultState(), ...migrate(JSON.parse(raw) as Legacy) }
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage can be unavailable (private mode, quota); the app keeps working in memory.
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

export const uid = () => crypto.randomUUID()
