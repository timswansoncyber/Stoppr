import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { GhostButton, PrimaryButton, inputClass } from '../components/ui'

const GOALS = [30, 90, 180, 365]

function toLocalInput(d: Date) {
  const off = d.getTimezoneOffset() * 60_000
  return new Date(d.getTime() - off).toISOString().slice(0, 16)
}

export default function Onboarding() {
  const { actions } = useApp()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [startNow, setStartNow] = useState(true)
  const [start, setStart] = useState(() => toLocalInput(new Date()))
  const [goalDays, setGoalDays] = useState(90)
  const [reasons, setReasons] = useState(['', '', ''])

  const finish = () =>
    actions.completeOnboarding({
      name: name.trim(),
      trackedSince: startNow ? new Date().toISOString() : new Date(start).toISOString(),
      goalDays,
      reasons: reasons.map((r) => r.trim()).filter(Boolean),
    })

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col px-6 py-10">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-[2px] flex-1 rounded-full ${i <= step ? 'bg-piano' : 'bg-hairline'}`} />
        ))}
      </div>

      {step === 0 && (
        <section key="0" className="rise flex flex-1 flex-col">
          <div className="flex flex-1 flex-col justify-center">
            <img
              src={`${import.meta.env.BASE_URL}favicon.svg`}
              alt=""
              className="mx-auto mb-10 h-24 w-24 drop-shadow-[0_18px_22px_rgba(0,0,0,0.35)]"
            />
            <p className="eyebrow text-center text-graphite">Welcome to</p>
            <h1 className="mt-2 text-center font-display text-6xl font-medium tracking-tight">Stoppr</h1>
            <p className="mx-auto mt-5 max-w-xs text-center leading-relaxed text-graphite">
              A quiet, private place to break the habit, outlast the urges, and become someone you respect.
            </p>
            <p className="mx-auto mt-6 max-w-xs text-center text-xs text-graphite/70">
              Everything stays on this device. No accounts. No tracking.
            </p>
          </div>
          <PrimaryButton onClick={() => setStep(1)}>Begin</PrimaryButton>
        </section>
      )}

      {step === 1 && (
        <section key="1" className="rise flex flex-1 flex-col pt-12">
          <p className="eyebrow text-graphite">Step one</p>
          <h2 className="mt-2 font-display text-4xl font-medium">The essentials</h2>

          <label className="mt-8 block">
            <span className="eyebrow text-graphite">Your first name</span>
            <input className={`${inputClass} mt-2`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" />
          </label>

          <div className="mt-7">
            <span className="eyebrow text-graphite">When does your streak begin?</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => setStartNow(v)}
                  className={`rounded-2xl border px-4 py-3 text-sm transition-colors ${
                    startNow === v ? 'border-piano bg-piano text-ivory' : 'border-hairline bg-[#fcfaf5]'
                  }`}
                >
                  {v ? 'Right now' : 'Earlier'}
                </button>
              ))}
            </div>
            {!startNow && (
              <input
                type="datetime-local"
                className={`${inputClass} mt-2`}
                value={start}
                max={toLocalInput(new Date())}
                onChange={(e) => setStart(e.target.value)}
              />
            )}
          </div>

          <div className="mt-7">
            <span className="eyebrow text-graphite">Your first goal</span>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoalDays(g)}
                  className={`rounded-2xl border py-3 transition-colors ${
                    goalDays === g ? 'border-piano bg-piano text-ivory' : 'border-hairline bg-[#fcfaf5]'
                  }`}
                >
                  <span className="block font-display text-2xl leading-none">{g}</span>
                  <span className="text-[0.6rem] tracking-[0.16em] uppercase opacity-70">days</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto flex gap-3 pt-10">
            <GhostButton onClick={() => setStep(0)} className="flex-1">Back</GhostButton>
            <PrimaryButton onClick={() => setStep(2)} className="flex-[2]" disabled={!startNow && !start}>
              Continue
            </PrimaryButton>
          </div>
        </section>
      )}

      {step === 2 && (
        <section key="2" className="rise flex flex-1 flex-col pt-12">
          <p className="eyebrow text-graphite">Step two</p>
          <h2 className="mt-2 font-display text-4xl font-medium">Your reasons</h2>
          <p className="mt-3 text-sm leading-relaxed text-graphite">
            Why are you doing this? You’ll see these when an urge hits, so write them for that version of you.
          </p>
          <div className="mt-7 space-y-2">
            {reasons.map((r, i) => (
              <input
                key={i}
                className={inputClass}
                value={r}
                placeholder={['To be fully present with people I love', 'To reclaim my focus and energy', 'To keep promises to myself'][i]}
                onChange={(e) => setReasons(reasons.map((x, j) => (j === i ? e.target.value : x)))}
              />
            ))}
          </div>
          <div className="mt-auto flex gap-3 pt-10">
            <GhostButton onClick={() => setStep(1)} className="flex-1">Back</GhostButton>
            <PrimaryButton onClick={finish} className="flex-[2]">Start my streak</PrimaryButton>
          </div>
        </section>
      )}
    </div>
  )
}
