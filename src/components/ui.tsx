import { X } from 'lucide-react'
import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function PageHeader({ eyebrow, title, right }: { eyebrow: string; title: string; right?: ReactNode }) {
  return (
    <header className="flex items-end justify-between pt-8 pb-6">
      <div>
        <p className="eyebrow text-graphite">{eyebrow}</p>
        <h1 className="mt-1 font-display text-[2.6rem] leading-none font-medium tracking-tight">{title}</h1>
      </div>
      {right}
    </header>
  )
}

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  // Portaled so animated (transformed) page wrappers don't become the containing block for the fixed overlay.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-piano/50 backdrop-blur-sm" onClick={onClose} />
      <div className="rise relative max-h-[90svh] w-full max-w-md overflow-y-auto rounded-t-[28px] border border-hairline bg-ivory p-6 pb-[max(env(safe-area-inset-bottom),24px)] sm:rounded-[28px]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-graphite hover:bg-ivory-deep">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function PrimaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`lacquer w-full rounded-full px-6 py-4 text-[0.72rem] font-medium tracking-[0.2em] uppercase transition-transform active:scale-[0.98] disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full rounded-full border border-piano/80 px-6 py-4 text-[0.72rem] font-medium tracking-[0.2em] uppercase transition-colors hover:bg-piano hover:text-ivory ${className}`}
    >
      {children}
    </button>
  )
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="flex-1 px-3 text-center">
      <p className="font-display text-3xl leading-none font-medium">{value}</p>
      <p className="eyebrow mt-2 text-graphite">{label}</p>
      {sub && <p className="mt-0.5 text-[0.7rem] text-graphite/80">{sub}</p>}
    </div>
  )
}

export const inputClass =
  'w-full rounded-2xl border border-hairline bg-[#fcfaf5] px-4 py-3 text-[0.95rem] outline-none placeholder:text-graphite/60 focus:border-piano'
