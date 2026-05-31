import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const { user, logout, isGuest, isDemoMode } = useAuth();

  return (
    <header className="flex shrink-0 flex-col border-b border-white/10" style={{ background: 'var(--bg-surface)' }}>
      {(isGuest || isDemoMode) && (
        <div className="px-4 py-2 text-xs font-medium lg:px-8" style={{ background: 'rgba(132,204,22,0.1)', color: '#a3e635', borderBottom: '1px solid rgba(132,204,22,0.2)' }}>
          Demo — 8 dispatches · cold-chain map
        </div>
      )}
      <div className="flex h-14 items-center justify-between px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo size={32} />
          <span className="text-sm font-semibold text-white">Voyager</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-xs sm:inline" style={{ color: 'var(--text-secondary)' }}>{user?.name}</span>
          <button type="button" onClick={() => logout()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ color: 'var(--text-secondary)' }}>
            <LogOut size={13} />
            {isGuest ? 'Exit' : 'Out'}
          </button>
        </div>
      </div>
    </header>
  );
}
