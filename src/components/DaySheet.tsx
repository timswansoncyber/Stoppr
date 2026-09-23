import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { TRIGGERS } from '../lib/content'
import { dayBounds, dayStatus, parseDayKey, relapsesOn } from '../lib/progress'
import { GhostButton, PrimaryButton, Sheet, inputClass } from './ui'

const MOODS = ['Heavy', 'Low', 'Even', 'Good', 'Strong']

function DayForm({ dayKey, onClose }: { dayKey: string; onClose: () => void }) {
  const { state, actions } = useApp()
  const now = Date.now()
  const status = dayStatus(state, dayKey, now)
  const existing = relapsesOn(state, dayKey)[0]
  const [choice, setChoice] = useState<'clean' | 'relapse' | null>(status === 'clean' || status === 'relapse' ? status : null)
  const [trigger, setTrigger] = useState(existing?.trigger)
  const [note, setNote] = useState(existing?.note ?? '')

  const { start, end } = dayBounds(dayKey)
  const entries = state.journal.filter((j) => {
    const t = new Date(j.at).getTime()
    return t >= start && t < end
  })
  const isToday = start <= now && now < end

  const save = () => {
    if (!choice) return
    actions.setDay(dayKey, { status: choice, trigger: choice === 'relapse' ? trigger : undefined, note: choice === 'relapse' ? note.trim() || undefined : undefined })
    onClose()
  }

  return (
    <>
      <p className="eyebrow text-graphite">
        {status === 'untracked' ? 'Not tracked yet' : status === 'relapse' ? 'Marked as relapse' : isToday ? 'Today · in progress' : 'Marked clean'}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {(['clean', 'relapse'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setChoice(v)}
            className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
              choice === v
                ? v === 'clean'
                  ? 'border-piano bg-[#fffdf8] ring-1 ring-piano'
                  : 'lacquer border-piano'
                : 'border-hairline bg-[#fcfaf5] opacity-70'
            }`}
          >
            <span className="relative block font-display text-2xl leading-none">{v === 'clean' ? 'Clean' : 'Relapsed'}</span>
            <span className="relative mt-1.5 block text-xs opacity-70">{v === 'clean' ? 'Held the line' : 'Slipped this day'}</span>
          </button>
        ))}
      </div>

      {choice === 'relapse' && (
        <div className="rise">
          <p className="eyebrow mt-5 text-graphite">Trigger</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TRIGGERS.map((tr) => (
              <button
                key={tr}
                onClick={() => setTrigger(trigger === tr ? undefined : tr)}
                className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${trigger === tr ? 'border-piano bg-piano text-ivory' : 'border-hairline'}`}
              >
                {tr}
              </button>
            ))}
          </div>
          <textarea
            className={`${inputClass} mt-3 h-20 resize-none`}
            placeholder="Notes (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      )}

      {status === 'untracked' && choice && (
        <p className="mt-4 text-xs leading-relaxed text-graphite">
          This day is before your tracked history. Saving it extends your history back to here, and the days in between count as clean.
        </p>
      )}
      {status === 'clean' && choice === 'relapse' && !isToday && (
        <p className="mt-4 text-xs leading-relaxed text-graphite">Your streak will restart from the following day.</p>
      )}
      {status === 'relapse' && choice === 'clean' && (
        <p className="mt-4 text-xs leading-relaxed text-graphite">This removes the relapse, and your streak is recalculated.</p>
      )}

      {entries.length > 0 && (
        <div className="mt-5">
          <p className="eyebrow text-graphite">Journal that day</p>
          <ul className="mt-2 space-y-2">
            {entries.map((j) => (
              <li key={j.id} className="rounded-2xl border border-hairline bg-[#fcfaf5] px-3.5 py-2.5 text-sm">
                <span className="text-xs text-graphite">
                  {MOODS[j.mood - 1]} · Urge {j.urge}/10
                </span>
                {j.text && <p className="mt-1 line-clamp-2">{j.text}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <GhostButton onClick={onClose} className="flex-1">Cancel</GhostButton>
        <PrimaryButton onClick={save} disabled={!choice} className="flex-[2]">Save day</PrimaryButton>
      </div>
    </>
  )
}

export default function DaySheet({ dayKey, onClose }: { dayKey: string | null; onClose: () => void }) {
  const title = dayKey ? parseDayKey(dayKey).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : ''
  return (
    <Sheet open={dayKey !== null} onClose={onClose} title={title}>
      {dayKey && <DayForm key={dayKey} dayKey={dayKey} onClose={onClose} />}
    </Sheet>
  )
}
