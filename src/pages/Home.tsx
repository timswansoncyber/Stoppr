import { CalendarDays, ChevronUp, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import DaySheet from '../components/DaySheet'
import KeyStrip from '../components/KeyStrip'
import StreakCalendar from '../components/StreakCalendar'
import { GhostButton, PrimaryButton, Sheet, Stat, inputClass } from '../components/ui'
import { useApp, useNow } from '../context/AppContext'
import { TRIGGERS } from '../lib/content'
import { DAY, currentStart, elapsed, levelFor, longestMs, pad, xpFor } from '../lib/progress'

function greeting(now: number) {
  const h = new Date(now).getHours()
  return h < 5 ? 'Late night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function Home() {
  const { state, actions } = useApp()
  const now = useNow()
  const [sheet, setSheet] = useState(false)
  const [trigger, setTrigger] = useState<string>()
  const [note, setNote] = useState('')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [editingDay, setEditingDay] = useState<string | null>(null)

  const t = elapsed(currentStart(state), now)
  const level = levelFor(xpFor(state, now))
  const goalProgress = Math.min(1, t.ms / (state.goalDays * DAY))
  const best = Math.floor(longestMs(state, now) / DAY)

  const confirmRelapse = () => {
    actions.relapse({ trigger, note: note.trim() || undefined })
    setSheet(false)
    setTrigger(undefined)
    setNote('')
  }

  return (
    <div className="rise">
      <header className="flex items-center justify-between pt-8 pb-6">
        <div>
          <p className="eyebrow text-graphite">
            {new Date(now).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="mt-1 font-display text-[2rem] leading-none font-medium">
            {greeting(now)}
            {state.name && <span className="italic">, {state.name}</span>}
          </h1>
        </div>
        <Link to="/settings" aria-label="Settings" className="rounded-full border border-hairline p-2.5 text-graphite hover:text-piano">
          <Settings2 size={18} strokeWidth={1.4} />
        </Link>
      </header>

      <section className="lacquer rounded-[32px] px-6 pt-8 pb-7">
        <p className="eyebrow text-center text-ivory/50">Current streak</p>
        <div className="mt-3 flex items-end justify-center gap-3">
          <span className="font-display text-[7.5rem] leading-[0.8] font-medium tracking-tight">{t.days}</span>
          <span className="pb-2 font-display text-2xl text-ivory/70 italic">{t.days === 1 ? 'day' : 'days'}</span>
        </div>
        <p className="mt-5 text-center text-sm tracking-[0.3em] text-ivory/60 tabular-nums">
          {pad(t.hours)} : {pad(t.minutes)} : {pad(t.seconds)}
        </p>

        <div className="mt-7">
          <div className="flex justify-between text-[0.65rem] tracking-[0.18em] text-ivory/50 uppercase">
            <span>Goal · {state.goalDays} days</span>
            <span className="tabular-nums">{Math.floor(goalProgress * 100)}%</span>
          </div>
          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-ivory/10">
            <div className="h-full rounded-full bg-gradient-to-r from-brass to-brass-soft" style={{ width: `${goalProgress * 100}%` }} />
          </div>
        </div>
      </section>

      <section className="ivory-card mt-5 flex rounded-[28px] py-5">
        <Stat label="Best" value={best} sub="days" />
        <div className="w-px bg-hairline" />
        <Stat label="Level" value={level.number} sub={level.name} />
        <div className="w-px bg-hairline" />
        <Stat label="Urges" value={state.urgesDefeated} sub="outlasted" />
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-medium">{calendarOpen ? 'Calendar' : 'This week'}</h2>
          <button
            onClick={() => setCalendarOpen((o) => !o)}
            aria-expanded={calendarOpen}
            className="flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[0.62rem] font-medium tracking-[0.18em] text-graphite uppercase transition-colors hover:border-piano hover:text-piano"
          >
            {calendarOpen ? <ChevronUp size={13} strokeWidth={1.6} /> : <CalendarDays size={13} strokeWidth={1.6} />}
            {calendarOpen ? 'Week view' : 'Full calendar'}
          </button>
        </div>
        {calendarOpen ? (
          <StreakCalendar state={state} now={now} onSelect={setEditingDay} />
        ) : (
          <KeyStrip state={state} now={now} onSelect={setEditingDay} />
        )}
      </section>

      <DaySheet dayKey={editingDay} onClose={() => setEditingDay(null)} />

      {state.reasons.length > 0 && (
        <section className="mt-9">
          <h2 className="font-display text-xl font-medium">Why you started</h2>
          <ul className="mt-3 space-y-2">
            {state.reasons.map((r, i) => (
              <li key={i} className="flex gap-3 border-b border-hairline pb-2 text-[0.95rem]">
                <span className="font-display text-graphite italic">{['i', 'ii', 'iii', 'iv', 'v'][i] ?? i + 1}.</span>
                {r}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10">
        <button onClick={() => setSheet(true)} className="mx-auto block text-[0.7rem] tracking-[0.2em] text-graphite uppercase underline-offset-4 hover:text-piano hover:underline">
          I relapsed
        </button>
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)} title="Reset your streak">
        <p className="text-sm leading-relaxed text-graphite">
          It happens. Your {t.days}-day streak will be recorded and a new one begins now. Your level, badges and journal are kept.
        </p>
        <p className="eyebrow mt-6 text-graphite">What triggered it?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRIGGERS.map((tr) => (
            <button
              key={tr}
              onClick={() => setTrigger(trigger === tr ? undefined : tr)}
              className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                trigger === tr ? 'border-piano bg-piano text-ivory' : 'border-hairline'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>
        <textarea
          className={`${inputClass} mt-4 h-24 resize-none`}
          placeholder="What will you do differently next time? (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="mt-5 flex gap-3">
          <GhostButton onClick={() => setSheet(false)} className="flex-1">Cancel</GhostButton>
          <PrimaryButton onClick={confirmRelapse} className="flex-[2]">Begin again</PrimaryButton>
        </div>
      </Sheet>
    </div>
  )
}
