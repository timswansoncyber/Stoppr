import type { AppState, DayStatus, Relapse } from './types'

export const DAY = 86_400_000

export function elapsed(startedAt: string, now: number) {
  const ms = Math.max(0, now - new Date(startedAt).getTime())
  return {
    ms,
    days: Math.floor(ms / DAY),
    hours: Math.floor((ms % DAY) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
  }
}

export const pad = (n: number) => String(n).padStart(2, '0')

const byTime = (a: Relapse, b: Relapse) => new Date(a.at).getTime() - new Date(b.at).getTime()

export function currentStart(state: AppState) {
  const last = [...state.relapses].sort(byTime).at(-1)
  return last && last.at > state.trackedSince ? last.at : state.trackedSince
}

// Each relapse closes the streak that preceded it; newest first.
export function pastStreaks(state: AppState) {
  let prev = new Date(state.trackedSince).getTime()
  return [...state.relapses]
    .sort(byTime)
    .map((relapse) => {
      const at = new Date(relapse.at).getTime()
      const ms = Math.max(0, at - prev)
      prev = at
      return { relapse, ms }
    })
    .reverse()
}

export function longestMs(state: AppState, now: number) {
  return Math.max(elapsed(currentStart(state), now).ms, ...pastStreaks(state).map((s) => s.ms))
}

export const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export function parseDayKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function dayBounds(key: string) {
  const start = parseDayKey(key)
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)
  return { start: start.getTime(), end: end.getTime() }
}

export function relapsesOn(state: AppState, key: string) {
  const { start, end } = dayBounds(key)
  return state.relapses.filter((r) => {
    const t = new Date(r.at).getTime()
    return t >= start && t < end
  })
}

export function dayStatus(state: AppState, key: string, now: number): DayStatus {
  const { start, end } = dayBounds(key)
  if (start > now) return 'future'
  if (relapsesOn(state, key).length > 0) return 'relapse'
  if (end <= new Date(state.trackedSince).getTime()) return 'untracked'
  return 'clean'
}

export const LEVELS = [
  { name: 'Initiate', xp: 0 },
  { name: 'Apprentice', xp: 300 },
  { name: 'Steadfast', xp: 800 },
  { name: 'Resolute', xp: 1500 },
  { name: 'Disciplined', xp: 3000 },
  { name: 'Composed', xp: 5000 },
  { name: 'Ascendant', xp: 8000 },
  { name: 'Sovereign', xp: 12000 },
  { name: 'Virtuoso', xp: 20000 },
  { name: 'Maestro', xp: 36500 },
]

export function xpFor(state: AppState, now: number) {
  const hours = elapsed(currentStart(state), now).ms / 3_600_000
  return Math.floor(hours * (100 / 24)) + state.journal.length * 20 + state.urgesDefeated * 15
}

export function levelFor(xp: number) {
  let index = 0
  LEVELS.forEach((l, i) => {
    if (xp >= l.xp) index = i
  })
  const current = LEVELS[index]
  const next = LEVELS[index + 1]
  const progress = next ? (xp - current.xp) / (next.xp - current.xp) : 1
  return { index, number: index + 1, name: current.name, next, progress, xp }
}

export interface Badge {
  id: string
  mark: string
  title: string
  detail: string
  earned: boolean
}

const MILESTONES: [number, string, string][] = [
  [1, 'I', 'First Light'],
  [3, 'III', 'Three Days'],
  [7, 'VII', 'One Week'],
  [14, 'XIV', 'Fortnight'],
  [30, 'XXX', 'One Month'],
  [60, 'LX', 'Two Months'],
  [90, 'XC', 'Reboot'],
  [180, 'CLXXX', 'Half Year'],
  [365, 'CCCLXV', 'One Year'],
]

export function badgesFor(state: AppState, now: number): Badge[] {
  const bestDays = longestMs(state, now) / DAY
  const milestones = MILESTONES.map(([days, mark, title]) => ({
    id: `d${days}`,
    mark,
    title,
    detail: `${days} day${days === 1 ? '' : 's'} clean`,
    earned: bestDays >= days,
  }))
  return [
    ...milestones,
    {
      id: 'first-entry',
      mark: '¶',
      title: 'First Page',
      detail: 'Write a journal entry',
      earned: state.journal.length >= 1,
    },
    {
      id: 'held',
      mark: '◆',
      title: 'Held the Line',
      detail: 'Outlast an urge',
      earned: state.urgesDefeated >= 1,
    },
    {
      id: 'ten-urges',
      mark: 'X',
      title: 'Unshaken',
      detail: 'Outlast ten urges',
      earned: state.urgesDefeated >= 10,
    },
  ]
}

export function nextMilestone(days: number) {
  return MILESTONES.find(([d]) => d > days)?.[0] ?? null
}

export function weekKeys(state: AppState, now: number) {
  const today = new Date(now)
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - i))
    const key = dayKey(day)
    return {
      key,
      label: day.toLocaleDateString(undefined, { weekday: 'narrow' }),
      status: dayStatus(state, key, now),
      today: i === 6,
    }
  })
}

// 6x7 grid of day keys for a month view, weeks starting on Sunday.
export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(year, month, 1 - first.getDay() + i)
    return { key: dayKey(d), date: d.getDate(), inMonth: d.getMonth() === month }
  })
}
