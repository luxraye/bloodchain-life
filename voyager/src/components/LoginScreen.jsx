import { useState } from 'react'
import { Truck, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import BrandLogo from './BrandLogo.jsx'

const FEATURES = [
  { icon: '➤', label: 'Dispatch command', detail: 'National queue — assign couriers, STAT prioritisation' },
  { icon: '🌡', label: 'Cold chain', detail: '2–6°C monitoring, breach alerts on long-haul routes' },
  { icon: '◎', label: 'Custody map', detail: 'Deck.gl routes — Maun, Francistown, Kasane corridors' },
]

export default function LoginScreen() {
  const { login, isDemoMode } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDemo = async () => {
    setLoading(true)
    await login('', '')
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <div className="hidden lg:flex flex-col justify-between w-[440px] shrink-0 p-10 border-r border-white/10" style={{ background: 'var(--bg-surface)' }}>
        <div>
          <div className="flex items-center gap-3 mb-10">
            <BrandLogo size={36} />
            <div>
              <p className="text-xs font-bold text-white">Bloodchain</p>
              <p className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>National blood OS</p>
            </div>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#a3e635' }}>Voyager</p>
          <h1 className="text-2xl font-extrabold text-white mb-3">Logistics Command</h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            Desktop coordinator workstation for NBTS dispatch — not a courier-only phone app.
          </p>
          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg text-sm" style={{ background: 'rgba(132,204,22,0.15)', color: '#84cc16' }}>{f.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-white">{f.label}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>LOGISTICS_COMMAND · TRANSIT couriers</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="lg:hidden flex items-center gap-3 mb-8 w-full max-w-sm">
          <BrandLogo size={32} />
          <div>
            <p className="text-xs font-bold text-white">Voyager</p>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Logistics Command</p>
          </div>
        </div>
        <div className="w-full max-w-sm">
          {isDemoMode && (
            <div className="mb-4 rounded-xl px-4 py-3 text-xs" style={{ background: 'rgba(132,204,22,0.12)', color: '#a3e635', border: '1px solid rgba(132,204,22,0.25)' }}>
              Demo mode — 8 seeded dispatches and national cold-chain map
            </div>
          )}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-white mb-4">
              {isDemoMode ? 'Continue as demo coordinator' : 'Sign in'}
            </h2>
            {isDemoMode ? (
              <button type="button" onClick={handleDemo} disabled={loading} className="w-full rounded-xl py-3 font-semibold text-white flex justify-center gap-2" style={{ background: '#84cc16' }}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '→ Enter command centre'}
              </button>
            ) : (
              <form onSubmit={async (e) => { e.preventDefault(); setLoading(true); const { error: err } = await login(email, password); if (err) setError(err.message); setLoading(false) }} className="space-y-3">
                <input type="email" className="w-full rounded-xl px-4 py-3 text-sm bg-[var(--bg-raised)] border border-white/10 text-white" placeholder="command.logistics@nbts.gov.bw" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className="w-full rounded-xl px-4 py-3 text-sm bg-[var(--bg-raised)] border border-white/10 text-white" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className="text-xs text-red-400 flex gap-2"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
                <button type="submit" className="w-full rounded-xl py-3 font-semibold text-white" style={{ background: '#A81F38' }}>Sign in</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
