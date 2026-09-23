import { PageHeader } from '../components/ui'
import { useApp, useNow } from '../context/AppContext'
import { DAY, LEVELS, badgesFor, currentStart, elapsed, levelFor, nextMilestone, pastStreaks, xpFor } from '../lib/progress'

function fmtDays(ms: number) {
  const d = ms / DAY
  return d < 1 ? `${Math.floor(ms / 3_600_000)}h` : `${Math.floor(d)}d`
}

export default function Progress() {
  const { state } = useApp()
  const now = useNow(60_000)
  const xp = xpFor(state, now)
  const level = levelFor(xp)
  const badges = badgesFor(state, now)
  const earned = badges.filter((b) => b.earned).length
  const days = elapsed(currentStart(state), now).days
  const next = nextMilestone(days)
  const history = pastStreaks(state)

  return (
    <div className="rise">
      <PageHeader eyebrow="Your standing" title="Rank" />

      <section className="lacquer rounded-[32px] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow text-ivory/50">Level {level.number}</p>
            <p className="mt-1 font-display text-5xl font-medium">{level.name}</p>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-full border border-brass/60 font-display text-2xl text-brass-soft">
            {level.number}
          </div>
        </div>
        <div className="mt-7">
          <div className="h-[3px] overflow-hidden rounded-full bg-ivory/10">
            <div className="h-full rounded-full bg-gradient-to-r from-brass to-brass-soft" style={{ width: `${level.progress * 100}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[0.65rem] tracking-[0.16em] text-ivory/50 uppercase tabular-nums">
            <span>{xp.toLocaleString()} XP</span>
            <span>{level.next ? `${level.next.name} at ${level.next.xp.toLocaleString()}` : 'Summit reached'}</span>
          </div>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-ivory/45">
          Earn ~100 XP per clean day, 20 per journal entry and 15 per urge outlasted. A relapse resets streak XP only.
        </p>
      </section>

      <section className="mt-9">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-medium">Distinctions</h2>
          <span className="eyebrow text-graphite">
            {earned} / {badges.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b) => (
            <div key={b.id} className={`flex flex-col items-center rounded-3xl px-2 py-4 text-center ${b.earned ? 'ivory-card' : 'border border-dashed border-hairline'}`}>
              <div
                className={`grid h-16 w-16 place-items-center rounded-full font-display font-medium ${
                  b.earned
                    ? 'lacquer text-brass-soft ring-1 ring-brass/40 ring-offset-2 ring-offset-ivory'
                    : 'border border-hairline text-graphite/40'
                } ${b.mark.length > 3 ? 'text-[0.8rem] tracking-tight' : 'text-xl'}`}
              >
                <span className="relative">{b.mark}</span>
              </div>
              <p className={`mt-3 text-[0.78rem] font-medium ${b.earned ? '' : 'text-graphite/60'}`}>{b.title}</p>
              <p className="mt-0.5 text-[0.65rem] text-graphite/70">{b.detail}</p>
            </div>
          ))}
        </div>
        {next && (
          <p className="mt-4 text-center text-xs text-graphite">
            Next distinction in {next - days} day{next - days === 1 ? '' : 's'}.
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium">The ladder</h2>
        <ol className="mt-3">
          {LEVELS.map((l, i) => (
            <li key={l.name} className={`flex items-center justify-between border-b border-hairline py-2.5 text-sm ${i === level.index ? 'font-medium' : i > level.index ? 'text-graphite/60' : ''}`}>
              <span className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${i <= level.index ? 'bg-piano' : 'border border-hairline'}`} />
                <span className="font-display text-lg">{l.name}</span>
              </span>
              <span className="text-xs tabular-nums">{l.xp.toLocaleString()} XP</span>
            </li>
          ))}
        </ol>
      </section>

      {history.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-medium">Past streaks</h2>
          <ul className="mt-3">
            {history.slice(0, 10).map(({ relapse: r, ms }) => (
              <li key={r.id} className="flex items-center justify-between border-b border-hairline py-2.5 text-sm">
                <span>
                  {new Date(r.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  {r.trigger && <span className="ml-2 text-xs text-graphite">· {r.trigger}</span>}
                </span>
                <span className="font-display text-lg tabular-nums">{fmtDays(ms)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
