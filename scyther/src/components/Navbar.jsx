import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { useNetwork } from '../hooks/useNetwork'
import { Wifi, WifiOff, RefreshCw, LogOut, Radio } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isGuest, isDemoMode } = useAuth()
  const { shiftSyncAt } = useApp()
  const { isOnline, isSyncing } = useNetwork()

  const shiftLive = shiftSyncAt && Date.now() - shiftSyncAt.getTime() < 60_000

  return (
    <header className="flex-shrink-0 border-b border-white/[0.06]" style={{ background: '#0C0F1A' }}>
      {(isGuest || isDemoMode) && (
        <div className="px-6 py-2 text-xs font-medium border-b border-amber-500/20"
          style={{ background: 'rgba(255,184,0,0.08)', color: '#FFB800' }}>
          {isGuest ? 'Guest demo — records stay in this tab only.' : 'Demo mode — connect Supabase for production auth.'}
        </div>
      )}
      <div className="h-14 flex items-center justify-between px-4 md:px-6 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img src="/branding/logo.png" alt="Bloodchain" className="h-8 w-8 shrink-0 rounded-lg object-contain" />
          <span className="text-sm font-semibold text-white truncate hidden sm:inline">Bloodchain</span>
          <span className="text-[10px] font-mono uppercase tracking-wider hidden md:inline" style={{ color: '#4A5568' }}>
            Collection
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {shiftSyncAt && (
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono font-semibold"
              style={{
                background: shiftLive ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${shiftLive ? 'rgba(0,255,136,0.35)' : 'rgba(255,255,255,0.08)'}`,
                color: shiftLive ? '#00FF88' : '#8899A8',
              }}
              title="Shift activity syncs automatically every 30s"
            >
              <Radio className={`w-3 h-3 ${shiftLive ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">{shiftLive ? 'Shift live' : 'Shift sync'}</span>
            </div>
          )}

          {isSyncing ? (
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.3)', color: '#FFB800' }}>
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="hidden sm:inline">Syncing…</span>
            </div>
          ) : isOnline ? (
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)', color: '#00FF88' }}>
              <Wifi className="w-3 h-3" />
              <span className="hidden sm:inline">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.3)', color: '#FF2D55' }}>
              <WifiOff className="w-3 h-3" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}

          {user && (
            <span className="text-xs hidden lg:inline truncate max-w-[140px]" style={{ color: '#8899A8' }}>
              {user.name}
            </span>
          )}
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition min-h-[40px]"
            style={{ color: '#8899A8', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#F0F4F8' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8899A8' }}
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
