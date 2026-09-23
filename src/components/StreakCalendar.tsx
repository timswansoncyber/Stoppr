import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { dayKey, dayStatus, monthGrid } from '../lib/progress'
import type { AppState, DayStatus } from '../lib/types'

const CELL: Record<DayStatus, string> = {
  clean: 'border border-hairline bg-gradient-to-b from-[#fffdf8] to-ivory-deep text-piano shadow-[inset_0_1px_0_#fff,0_2px_4px_-2px_rgba(60,45,20,0.25)]',
  relapse: 'lacquer text-ivory',
  untracked: 'border border-dashed border-hairline text-graphite/50',
  future: 'text-graphite/30',
}

export default function StreakCalendar({ state, now, onSelect }: { state: AppState; now: number; onSelect: (key: string) => void }) {
  const today = new Date(now)
  const todayKey = dayKey(today)
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const isCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth()

  const cells = monthGrid(view.y, view.m).map((c) => ({ ...c, status: dayStatus(state, c.key, now) }))
  const inMonth = cells.filter((c) => c.inMonth)
  const clean = inMonth.filter((c) => c.status === 'clean').length
  const relapses = inMonth.filter((c) => c.status === 'relapse').length

  const shift = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1)
    setView({ y: d.getFullYear(), m: d.getMonth() })
  }

  return (
    <div className="ivory-card rise rounded-[28px] p-4">
      <div className="flex items-center justify-between px-1">
        <button onClick={() => shift(-1)} aria-label="Previous month" className="rounded-full p-2 text-graphite hover:bg-ivory-deep hover:text-piano">
          <ChevronLeft size={18} strokeWidth={1.4} />
        </button>
        <p className="font-display text-2xl font-medium">
          {new Date(view.y, view.m).toLocaleDateString(undefined, { month: 'long' })}{' '}
          <span className="text-graphite italic">{view.y}</span>
        </p>
        <button
          onClick={() => shift(1)}
          disabled={isCurrentMonth}
          aria-label="Next month"
          className="rounded-full p-2 text-graphite hover:bg-ivory-deep hover:text-piano disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronRight size={18} strokeWidth={1.4} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="pb-1 text-[0.6rem] tracking-[0.18em] text-graphite/70">
            {d}
          </span>
        ))}
        {cells.map((c) =>
          c.inMonth ? (
            <button
              key={c.key}
              onClick={() => onSelect(c.key)}
              disabled={c.status === 'future'}
              aria-label={`${c.key}: ${c.status}`}
              className={`relative grid aspect-square place-items-center rounded-xl font-display text-lg tabular-nums transition-transform active:scale-95 disabled:cursor-default ${CELL[c.status]} ${
                c.key === todayKey ? 'ring-1 ring-brass ring-offset-2 ring-offset-[#f8f4eb]' : ''
              }`}
            >
              <span className="relative">{c.date}</span>
            </button>
          ) : (
            <span key={c.key} />
          ),
        )}
      </div>

      <div className="rule my-4" />
      <div className="flex items-center justify-between px-1 text-[0.65rem] tracking-[0.14em] text-graphite uppercase">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-hairline bg-[#fffdf8]" /> Clean {clean}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-piano" /> Relapse {relapses}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-dashed border-graphite/50" /> Untracked
        </span>
      </div>
      <p className="mt-3 text-center text-xs text-graphite/80">Tap any day to correct it.</p>
    </div>
  )
}
