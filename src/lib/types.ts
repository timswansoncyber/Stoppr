export interface Relapse {
  id: string
  at: string
  trigger?: string
  note?: string
}

export type Mood = 1 | 2 | 3 | 4 | 5

export interface JournalEntry {
  id: string
  at: string
  mood: Mood
  urge: number
  text: string
}

export type DayStatus = 'clean' | 'relapse' | 'untracked' | 'future'

export interface AppState {
  version: 1
  onboarded: boolean
  name: string
  trackedSince: string
  goalDays: number
  reasons: string[]
  relapses: Relapse[]
  journal: JournalEntry[]
  urgesDefeated: number
}
