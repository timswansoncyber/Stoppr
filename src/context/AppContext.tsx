import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dayBounds, dayKey, relapsesOn } from '../lib/progress'
import { clearState, defaultState, loadState, saveState, uid } from '../lib/storage'
import type { AppState, JournalEntry } from '../lib/types'

export interface DayEdit {
  status: 'clean' | 'relapse'
  trigger?: string
  note?: string
}

function applyDayEdit(s: AppState, key: string, edit: DayEdit): AppState {
  const { start, end } = dayBounds(key)
  const now = Date.now()
  const since = new Date(s.trackedSince).getTime()
  const onDay = new Set(relapsesOn(s, key).map((r) => r.id))

  if (edit.status === 'clean') {
    return {
      ...s,
      relapses: s.relapses.filter((r) => !onDay.has(r.id)),
      trackedSince: start < since ? new Date(start).toISOString() : s.trackedSince,
    }
  }

  const existing = s.relapses.find((r) => onDay.has(r.id))
  if (existing) {
    return {
      ...s,
      relapses: s.relapses.map((r) => (r.id === existing.id ? { ...r, trigger: edit.trigger, note: edit.note } : r)),
    }
  }

  // Past days are logged at the last moment of the day so the streak restarts the following morning.
  const at = key === dayKey(new Date(now)) ? now : end - 1
  const atIso = new Date(at).toISOString()
  return {
    ...s,
    relapses: [...s.relapses, { id: uid(), at: atIso, trigger: edit.trigger, note: edit.note }],
    trackedSince: at < since ? atIso : s.trackedSince,
  }
}

interface Actions {
  completeOnboarding: (p: Pick<AppState, 'name' | 'trackedSince' | 'goalDays' | 'reasons'>) => void
  relapse: (p: { trigger?: string; note?: string }) => void
  setDay: (key: string, edit: DayEdit) => void
  defeatUrge: () => void
  addJournal: (p: Omit<JournalEntry, 'id' | 'at'>) => void
  deleteJournal: (id: string) => void
  update: (p: Partial<AppState>) => void
  resetAll: () => void
}

const Ctx = createContext<{ state: AppState; actions: Actions } | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const actions = useMemo<Actions>(
    () => ({
      completeOnboarding: (p) => setState((s) => ({ ...s, ...p, onboarded: true })),
      relapse: ({ trigger, note }) =>
        setState((s) => ({
          ...s,
          relapses: [...s.relapses, { id: uid(), at: new Date().toISOString(), trigger, note }],
        })),
      setDay: (key, edit) => setState((s) => applyDayEdit(s, key, edit)),
      defeatUrge: () => setState((s) => ({ ...s, urgesDefeated: s.urgesDefeated + 1 })),
      addJournal: (p) =>
        setState((s) => ({
          ...s,
          journal: [{ ...p, id: uid(), at: new Date().toISOString() }, ...s.journal],
        })),
      deleteJournal: (id) => setState((s) => ({ ...s, journal: s.journal.filter((j) => j.id !== id) })),
      update: (p) => setState((s) => ({ ...s, ...p })),
      resetAll: () => {
        clearState()
        setState(defaultState())
      },
    }),
    [],
  )

  return <Ctx.Provider value={{ state, actions }}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}
