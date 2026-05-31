import { LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import BrandLogo from './BrandLogo'

export default function Navbar({ profileName }) {
  const { user, logout, isGuest, isDemoMode } = useAuth()

  const firstName = (profileName || user?.name || user?.email)
    ?.split(/[\s@]/)[0] || 'Donor'

  return (
    <header className="shrink-0 border-b border-white/10" style={{ background: 'var(--bg-surface)' }}>
      {(isGuest || isDemoMode) && (
        <div
          className="px-4 py-2 text-xs font-medium lg:px-10"
          style={{ background: 'rgba(0, 200, 255, 0.1)', color: '#00C8FF', borderBottom: '1px solid rgba(0, 200, 255, 0.2)' }}
        >
          Demo mode — donor profile, journey, and scheduling use local seed data.
        </div>
      )}
      <div className="flex h-14 items-center justify-between px-4 lg:px-10">
        <div className="flex items-center gap-3 min-w-0">
          <BrandLogo size={36} />
          <div className="min-w-0">
            <span className="text-sm font-bold text-white tracking-tight">Azure</span>
            <p className="text-[9px] font-mono uppercase tracking-widest truncate" style={{ color: 'var(--text-muted)' }}>
              Public donor portal
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>
            {user && <>Welcome, <span className="font-medium text-white">{firstName}</span></>}
          </span>
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 transition"
            style={{ color: 'var(--text-secondary)' }}
          >
            <LogOut size={13} />
            {isGuest ? 'Exit demo' : 'Sign out'}
          </button>
        </div>
      </div>
    </header>
  )
}
