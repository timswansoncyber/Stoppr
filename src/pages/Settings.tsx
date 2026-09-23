import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GhostButton, PrimaryButton, inputClass } from '../components/ui'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { state, actions } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState(state.name)
  const [goalDays, setGoalDays] = useState(state.goalDays)
  const [reasons, setReasons] = useState(() => [...state.reasons, '', '', ''].slice(0, Math.max(3, state.reasons.length)))

  const save = () => {
    actions.update({
      name: name.trim(),
      goalDays: Math.max(1, goalDays || 1),
      reasons: reasons.map((r) => r.trim()).filter(Boolean),
    })
    navigate('/')
  }

  const reset = () => {
    if (confirm('Erase all Stoppr data on this device? This cannot be undone.')) actions.resetAll()
  }

  return (
    <div className="rise pb-8">
      <Link to="/" className="mt-8 inline-flex items-center gap-2 text-[0.68rem] tracking-[0.2em] text-graphite uppercase hover:text-piano">
        <ArrowLeft size={14} strokeWidth={1.5} /> Today
      </Link>
      <h1 className="mt-6 font-display text-[2.6rem] leading-none font-medium">Settings</h1>

      <label className="mt-8 block">
        <span className="eyebrow text-graphite">Name</span>
        <input className={`${inputClass} mt-2`} value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label className="mt-6 block">
        <span className="eyebrow text-graphite">Goal (days)</span>
        <input type="number" min={1} className={`${inputClass} mt-2`} value={goalDays} onChange={(e) => setGoalDays(Number(e.target.value))} />
      </label>

      <div className="mt-6">
        <span className="eyebrow text-graphite">Reasons</span>
        <div className="mt-2 space-y-2">
          {reasons.map((r, i) => (
            <input key={i} className={inputClass} value={r} onChange={(e) => setReasons(reasons.map((x, j) => (j === i ? e.target.value : x)))} />
          ))}
        </div>
        <button onClick={() => setReasons([...reasons, ''])} className="mt-2 text-xs tracking-[0.16em] text-graphite uppercase hover:text-piano">
          + Add reason
        </button>
      </div>

      <PrimaryButton onClick={save} className="mt-8">Save changes</PrimaryButton>

      <div className="rule my-10" />
      <p className="eyebrow text-graphite">Data</p>
      <p className="mt-2 text-sm leading-relaxed text-graphite">
        Stoppr stores everything in this browser only. Clearing site data or switching devices will start you fresh.
      </p>
      <GhostButton onClick={reset} className="mt-4 border-red-900/60 text-red-900 hover:bg-red-900 hover:text-ivory">
        Erase all data
      </GhostButton>
    </div>
  )
}
