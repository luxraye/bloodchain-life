import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'

export default function Navbar() {
  const { user, logout, isDemoMode, isReadOnly } = useAuth()

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-white/[0.06] shrink-0" style={{ background: 'var(--bg-surface)' }}>
      <Link to="/" className="flex items-center gap-2.5">
        <BrandLogo size={28} />
        <span className="font-bold text-white text-sm">Helix</span>
        <span className="hidden sm:inline font-mono-ui text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Research</span>
      </Link>
      <div className="flex items-center gap-2">
        {isReadOnly && (
          <span className="badge" style={{ background: 'rgba(58,130,184,0.15)', color: 'var(--azure-300)' }}>Ethics read-only</span>
        )}
        {isDemoMode && (
          <span className="badge" style={{ background: 'rgba(255,184,0,0.12)', color: 'var(--neon-amber)' }}>Demo</span>
        )}
        <span className="text-xs hidden md:inline" style={{ color: 'var(--text-secondary)' }}>{user?.name}</span>
        <button type="button" onClick={() => logout()} className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 min-h-0">
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>
    </header>
  )
}
