import { BookOpen, Feather, Home, Medal } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

function Tab({ to, label, Icon }: { to: string; label: string; Icon: LucideIcon }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center gap-1 py-2 text-[0.6rem] tracking-[0.16em] uppercase transition-colors ${
          isActive ? 'text-ivory' : 'text-ivory/40 hover:text-ivory/70'
        }`
      }
    >
      <Icon size={19} strokeWidth={1.4} />
      {label}
    </NavLink>
  )
}

export default function TabBar() {
  const navigate = useNavigate()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),12px)]">
      <div className="lacquer relative flex w-full max-w-md items-center rounded-[28px] px-2 py-1">
        <Tab to="/" label="Today" Icon={Home} />
        <Tab to="/progress" label="Rank" Icon={Medal} />
        <div className="flex flex-1 items-center justify-center">
          <button
            onClick={() => navigate('/panic')}
            aria-label="Panic button"
            className="grid h-[54px] w-[54px] place-items-center rounded-full bg-gradient-to-b from-[#fffdf8] to-ivory-deep text-piano shadow-[inset_0_1px_0_#fff,0_8px_18px_-8px_rgba(0,0,0,0.9)] ring-1 ring-brass/70 ring-offset-2 ring-offset-piano transition-transform active:scale-95"
          >
            {/* Left padding offsets the trailing letter-spacing; text-box trims to cap height so the caps center optically. */}
            <span className="pl-[0.12em] font-display text-[0.8rem] leading-none font-semibold tracking-[0.12em] uppercase [text-box:trim-both_cap_alphabetic]">
              Halt
            </span>
          </button>
        </div>
        <Tab to="/learn" label="Learn" Icon={BookOpen} />
        <Tab to="/journal" label="Journal" Icon={Feather} />
      </div>
    </nav>
  )
}
