import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isDemoMode } = useAuth()

  return (
    <header className="shrink-0" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      {isDemoMode && (
        <div className="px-6 py-1.5 text-center font-mono-ui text-[10px] font-semibold uppercase tracking-widest badge-chronic">
          Demo mode · Coordinator actions are local only
        </div>
      )}
      <div className="flex h-14 items-center justify-between px-5">
        <span className="font-mono-ui text-sm font-semibold text-white">
          Chronicle <span style={{ color: 'var(--text-muted)' }}>· Care coordination</span>
        </span>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>{user.name}</span>
              <span className="badge" style={{ background: 'rgba(168,31,56,0.15)', color: '#D96070' }}>{user.role}</span>
            </>
          )}
          <button type="button" onClick={logout} className="btn-ghost text-xs flex items-center gap-1 py-2">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
