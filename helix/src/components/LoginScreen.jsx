import { useState } from 'react'
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'

const FEATURES = [
  { icon: '⌬', label: 'Study registry', detail: 'Protocol · ethics · multi-site (IRB-ready)' },
  { icon: '◉', label: 'Pre-analytical', detail: 'Accession · cold-chain receipt QC · aliquots' },
  { icon: '⬡', label: 'Research custody', detail: 'Trial specimens — separate from NBTS units' },
  { icon: '⬟', label: 'Audit & export', detail: 'ALCOA+ trail · IRB packet (CSV)' },
]

export default function LoginScreen() {
  const { login, isDemoMode } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await login(email.trim(), password)
      if (err) setError(err.message)
    } catch {
      setError('Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    setLoading(true)
    await login('', '')
    setLoading(false)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div
        className="hidden lg:flex flex-col justify-between w-[500px] shrink-0 relative p-10"
        style={{ background: 'var(--bg-surface)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 25% 20%, #A81F38 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 80%, #3A82B8 0%, transparent 70%)' }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <BrandLogo size={36} />
            <div>
              <p className="text-xs font-bold text-white">Bloodchain</p>
              <p className="font-mono-ui text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Research infrastructure
              </p>
            </div>
          </div>

          <p className="font-mono-ui text-[11px] font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--burg-300)' }}>
            Helix
          </p>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Research &<br />Clinical Trials
          </h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
            Trial specimen governance aligned with public-health LIMS practice — without replacing national blood banking in Mars Lab.
          </p>

          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex gap-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: 'rgba(168,31,56,0.12)', border: '1px solid rgba(168,31,56,0.25)', color: 'var(--burg-300)' }}
                >
                  {f.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">{f.label}</p>
                  <p className="font-mono-ui text-[10px]" style={{ color: 'var(--text-muted)' }}>{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 font-mono-ui text-[10px]" style={{ color: '#2E3548' }}>
          Institution-agnostic · Research personnel only
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-[360px]">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <BrandLogo size={40} />
            <div>
              <p className="text-sm font-bold text-white">Helix</p>
              <p className="font-mono-ui text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Bloodchain Research</p>
            </div>
          </div>

          {isDemoMode && (
            <div
              className="mb-5 rounded-xl px-4 py-3 text-xs"
              style={{ background: 'rgba(255,184,0,0.07)', border: '1px solid rgba(255,184,0,0.2)', color: 'var(--neon-amber)' }}
            >
              Demo mode — click <strong className="text-white">Enter Research Console</strong> to continue.
            </div>
          )}

          <div className="card overflow-hidden">
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #4A1020, #A81F38, #3A82B8)' }} />
            <div className="p-6">
              <h2 className="text-sm font-semibold text-white mb-4">
                {isDemoMode ? 'Continue as demo researcher' : 'Sign in'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="field-label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                    <input type="email" className="input-field pl-9" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isDemoMode} placeholder="pi@institution.bw" />
                  </div>
                </div>
                <div>
                  <label className="field-label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                    <input type="password" className="input-field pl-9" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isDemoMode} placeholder="••••••••" />
                  </div>
                </div>
                {error && (
                  <p className="text-xs flex gap-2" style={{ color: 'var(--neon-red)' }}>
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
                  </p>
                )}
                {isDemoMode ? (
                  <button type="button" onClick={handleDemo} disabled={loading} className="btn-primary w-full flex justify-center gap-2 mt-1">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '→ Enter Research Console'}
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="btn-primary w-full mt-1">Sign in</button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
