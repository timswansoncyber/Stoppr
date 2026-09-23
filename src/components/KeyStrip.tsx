import { weekKeys } from '../lib/progress'
import type { AppState, DayStatus } from '../lib/types'

const KEY_STYLES: Record<DayStatus, string> = {
  clean: 'border-hairline bg-gradient-to-b from-[#fffdf8] to-ivory-deep shadow-[inset_0_1px_0_#fff,inset_0_-3px_0_rgba(0,0,0,0.05)]',
  relapse: 'border-piano bg-gradient-to-b from-[#26262a] to-piano shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
  untracked: 'border-dashed border-hairline bg-transparent',
  future: 'border-hairline bg-ivory',
}

const LABELS: Record<DayStatus, string> = { clean: 'clean', relapse: 'relapse', untracked: 'not tracked', future: 'upcoming' }

export default function KeyStrip({ state, now, onSelect }: { state: AppState; now: number; onSelect: (key: string) => void }) {
  const keys = weekKeys(state, now)
  return (
    <div>
      <div className="flex h-24 gap-[3px]">
        {keys.map((k) => (
          <button
            key={k.key}
            onClick={() => onSelect(k.key)}
            aria-label={`${k.key}: ${LABELS[k.status]}. Edit day`}
            className={`relative flex-1 rounded-b-md border transition-transform active:translate-y-[2px] ${KEY_STYLES[k.status]}`}
          >
            {k.today && <span className="absolute inset-x-0 bottom-2 mx-auto h-1 w-1 rounded-full bg-brass-soft" />}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-[3px]">
        {keys.map((k) => (
          <span key={k.key} className={`flex-1 text-center text-[0.6rem] tracking-[0.18em] ${k.today ? 'text-piano' : 'text-graphite/70'}`}>
            {k.label}
          </span>
        ))}
      </div>
    </div>
  )
}
