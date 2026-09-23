import { X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { LINES, TACTICS } from '../lib/content'
import { currentStart, elapsed } from '../lib/progress'

const PHASES = [
  { label: 'Breathe in', scale: 1 },
  { label: 'Hold', scale: 1 },
  { label: 'Breathe out', scale: 0.55 },
  { label: 'Hold', scale: 0.55 },
]
const PHASE_SECONDS = 4

const pick = <T,>(arr: T[], n: number) => [...arr].sort(() => Math.random() - 0.5).slice(0, n)

export default function Panic() {
  const { state, actions } = useApp()
  const navigate = useNavigate()
  const [tick, setTick] = useState(0)
  const [won, setWon] = useState(false)
  const line = useMemo(() => pick(LINES, 1)[0], [])
  const tactics = useMemo(() => pick(TACTICS, 3), [])
  const days = elapsed(currentStart(state), Date.now()).days

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const phase = PHASES[Math.floor(tick / PHASE_SECONDS) % PHASES.length]
  const count = PHASE_SECONDS - (tick % PHASE_SECONDS)
  const rounds = Math.floor(tick / (PHASE_SECONDS * PHASES.length))

  const finish = () => {
    actions.defeatUrge()
    setWon(true)
  }

  if (won) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-piano px-8 text-center text-ivory">
        <div className="rise">
          <p className="eyebrow text-brass-soft">Urge outlasted</p>
          <h1 className="mt-4 font-display text-5xl font-medium">Well held.</h1>
          <p className="mx-auto mt-4 max-w-xs text-ivory/60">
            That’s {state.urgesDefeated} urge{state.urgesDefeated === 1 ? '' : 's'} you’ve beaten. Each one makes the next one weaker.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-10 rounded-full border border-ivory/80 bg-ivory px-10 py-4 text-[0.72rem] font-medium tracking-[0.2em] text-piano uppercase"
          >
            Return
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto [color-scheme:dark] bg-[radial-gradient(90%_60%_at_50%_20%,#1d1d20_0%,#070708_70%)] text-ivory">
      <div className="mx-auto flex min-h-full max-w-md flex-col px-6 pt-6 pb-10">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-ivory/50">Stay with it</p>
          <button onClick={() => navigate(-1)} aria-label="Close" className="rounded-full border border-ivory/15 p-2 text-ivory/60 hover:text-ivory">
            <X size={18} strokeWidth={1.4} />
          </button>
        </div>

        <p className="mt-8 text-center font-display text-3xl leading-snug italic">“{line}”</p>

        <div className="relative my-10 grid aspect-square w-full place-items-center">
          <div className="absolute h-[78%] w-[78%] rounded-full border border-ivory/10" />
          <div
            className="absolute h-[78%] w-[78%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fbf8f1,#e2d9c5_55%,#b9ad94)] shadow-[0_0_80px_-10px_rgba(247,243,234,0.35)] transition-transform ease-in-out"
            style={{ transform: `scale(${phase.scale})`, transitionDuration: `${PHASE_SECONDS}s` }}
          />
          <div className="relative text-center text-piano">
            <p className="eyebrow">{phase.label}</p>
            <p className="font-display text-6xl leading-none font-medium tabular-nums">{count}</p>
          </div>
        </div>
        <p className="-mt-4 text-center text-[0.7rem] tracking-[0.2em] text-ivory/40 uppercase">
          {rounds} round{rounds === 1 ? '' : 's'} · {days} day{days === 1 ? '' : 's'} on the line
        </p>

        {state.reasons.length > 0 && (
          <section className="mt-10">
            <p className="eyebrow text-ivory/50">Remember why</p>
            <ul className="mt-3 space-y-2">
              {state.reasons.map((r, i) => (
                <li key={i} className="border-b border-ivory/10 pb-2 font-display text-xl">
                  {r}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <p className="eyebrow text-ivory/50">Do one of these now</p>
          <div className="mt-3 space-y-2">
            {tactics.map((t, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-ivory/10 bg-ivory/[0.03] px-4 py-3.5 text-sm leading-relaxed text-ivory/85">
                <span className="font-display text-lg text-brass-soft italic">{i + 1}</span>
                {t}
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={finish}
          className="mt-10 w-full rounded-full bg-ivory px-6 py-4 text-[0.72rem] font-medium tracking-[0.2em] text-piano uppercase shadow-[inset_0_1px_0_#fff] transition-transform active:scale-[0.98]"
        >
          The urge has passed
        </button>
      </div>
    </div>
  )
}
