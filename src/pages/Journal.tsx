import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { PrimaryButton, PageHeader, inputClass } from '../components/ui'
import { useApp } from '../context/AppContext'
import type { Mood } from '../lib/types'

const MOODS: { value: Mood; label: string }[] = [
  { value: 1, label: 'Heavy' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Even' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Strong' },
]

export default function Journal() {
  const { state, actions } = useApp()
  const [mood, setMood] = useState<Mood>(3)
  const [urge, setUrge] = useState(3)
  const [text, setText] = useState('')

  const today = new Date().toDateString()
  const checkedInToday = state.journal.some((j) => new Date(j.at).toDateString() === today)

  const save = () => {
    actions.addJournal({ mood, urge, text: text.trim() })
    setText('')
    setMood(3)
    setUrge(3)
  }

  return (
    <div className="rise">
      <PageHeader eyebrow={checkedInToday ? 'Checked in today' : 'Daily check-in'} title="Journal" />

      <section className="ivory-card rounded-[28px] p-5">
        <p className="eyebrow text-graphite">How are you, honestly?</p>
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`rounded-2xl border py-3 transition-colors ${mood === m.value ? 'border-piano bg-piano text-ivory' : 'border-hairline bg-ivory/60'}`}
            >
              <span className="block font-display text-xl leading-none">{m.value}</span>
              <span className="mt-1 block text-[0.6rem] tracking-[0.12em] uppercase opacity-70">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-baseline justify-between">
          <p className="eyebrow text-graphite">Urge intensity</p>
          <span className="font-display text-2xl tabular-nums">{urge}<span className="text-sm text-graphite">/10</span></span>
        </div>
        <input type="range" min={0} max={10} value={urge} onChange={(e) => setUrge(Number(e.target.value))} className="mt-2 w-full" aria-label="Urge intensity" />

        <textarea
          className={`${inputClass} mt-5 h-28 resize-none`}
          placeholder="What’s on your mind? What triggered you today, and what helped?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <PrimaryButton onClick={save} className="mt-4">Save entry</PrimaryButton>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium">Entries</h2>
        {state.journal.length === 0 ? (
          <p className="mt-3 text-sm text-graphite">Your first entry will appear here.</p>
        ) : (
          <ul className="mt-3">
            {state.journal.map((j) => (
              <li key={j.id} className="group border-b border-hairline py-4">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-graphite">
                    {new Date(j.at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} ·{' '}
                    {new Date(j.at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  <button
                    onClick={() => confirm('Delete this entry?') && actions.deleteJournal(j.id)}
                    aria-label="Delete entry"
                    className="p-1 text-graphite/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-piano focus:opacity-100"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="mt-2 flex gap-2 text-xs">
                  <span className="rounded-full bg-piano px-2.5 py-0.5 text-ivory">{MOODS[j.mood - 1].label}</span>
                  <span className="rounded-full border border-hairline px-2.5 py-0.5">Urge {j.urge}/10</span>
                </div>
                {j.text && <p className="mt-3 text-[0.95rem] leading-relaxed whitespace-pre-wrap">{j.text}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
