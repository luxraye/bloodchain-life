import { useCompliance } from '../context/ComplianceContext'
import { useAuth } from '../context/AuthContext'
import { LogOut, RefreshCw } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isDemoMode } = useAuth()
  const { isDemoData, apiConnected, loading, refresh } = useCompliance()

  return (
    <header className="shrink-0" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      {isDemoMode && (
        <div className="px-6 py-1.5 text-center font-mono-ui text-[10px] font-semibold uppercase tracking-widest badge-regulatory">
          {isDemoData ? 'Demo mode · local compliance seed' : 'Live · Instances API'}
        </div>
      )}
      <div className="flex h-14 items-center justify-between px-5">
        <span className="font-mono-ui text-sm font-semibold text-white">
          Sentinel <span style={{ color: 'var(--text-muted)' }}>· Regulatory review</span>
        </span>
        <div className="flex items-center gap-3">
          {apiConnected && (
            <span className="badge" style={{ background: 'rgba(0,255,136,0.12)', color: '#00FF88' }}>API</span>
          )}
          <button type="button" onClick={refresh} disabled={loading} className="btn-ghost text-xs flex items-center gap-1 py-2" title="Refresh from Instances">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {user && (
            <>
              <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>{user.name}</span>
              <span className="badge-regulatory">{user.role}</span>
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
