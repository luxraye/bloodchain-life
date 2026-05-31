import { useAuth } from '../context/AuthContext'
import { LogOut, Activity } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isDemoMode, isGuest } = useAuth()

  return (
    <header className="shrink-0" style={{ background: '#0C0F1A', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Demo banner */}
      {(isDemoMode || isGuest) && (
        <div
          className="px-6 py-1.5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{ background: 'rgba(255,184,0,0.07)', borderBottom: '1px solid rgba(255,184,0,0.15)', color: '#FFB800' }}
        >
          Demo mode · Clinical actions are simulated locally and never write to patient records
        </div>
      )}

      <div className="flex h-13 items-center justify-between px-5">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(168,31,56,0.15)', border: '1px solid rgba(168,31,56,0.3)' }}
            >
              <Activity className="h-4 w-4" style={{ color: '#A81F38' }} />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-[1.5px]"
              style={{ background: '#00FF88', borderColor: '#0C0F1A', boxShadow: '0 0 5px rgba(0,255,136,0.5)' }}
            />
          </div>

          <div className="h-5 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

          <div>
            <span className="font-mono text-[11px] font-semibold tracking-wide" style={{ color: '#F0F4F8' }}>
              Transfuse
            </span>
            <span className="font-mono text-[10px] ml-2" style={{ color: '#4A5568' }}>·</span>
            <span className="hidden font-mono text-[10px] tracking-wide ml-2 md:inline" style={{ color: '#4A5568' }}>
              Clinical Blood Management
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {user && (
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition"
              style={{ color: '#8899A8' }}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: '#8B1A2E' }}
              >
                {(user.name?.[0] ?? 'U').toUpperCase()}
              </span>
              <span className="hidden text-xs font-medium sm:inline" style={{ color: '#F0F4F8' }}>{user.name}</span>
              {user.role && (
                <span
                  className="hidden font-mono text-[9px] font-semibold uppercase tracking-widest rounded px-1.5 py-0.5 sm:inline"
                  style={{ background: 'rgba(168,31,56,0.15)', color: '#D96070', border: '1px solid rgba(168,31,56,0.25)' }}
                >
                  {user.role}
                </span>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition"
            style={{ color: '#4A5568' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F0F4F8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4A5568'; e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut size={12} />
            {isGuest ? 'Exit Demo' : 'Sign Out'}
          </button>
        </div>
      </div>
    </header>
  )
}
