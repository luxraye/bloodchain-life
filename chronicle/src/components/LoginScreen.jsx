import { useState } from 'react'
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'

const FEATURES = [
  { icon: '⊕', label: 'Exception queue', detail: 'Missed visits · factor lapses · rising-risk outreach' },
  { icon: '◉', label: 'Care plans', detail: 'MCC-style custodian, prophylaxis, goals' },
  { icon: '♦', label: 'Registry ops', detail: 'Haemophilia · sickle cell · thalassaemia cohorts' },
  { icon: '⬟', label: 'Reports', detail: 'Patient · exception · progress · population (BPOMAS-ready)' },
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
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div className="hidden lg:flex flex-col justify-between w-[500px] shrink-0 relative p-10" style={{ background: 'var(--bg-surface)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ background: 'radial-gradient(ellipse 80% 60% at 25% 20%, #A81F38 0%, transparent 70%)' }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 80%, #3A82B8 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <BrandLogo size={36} />
            <div>
              <p className="text-xs font-bold text-white">Bloodchain</p>
              <p className="font-mono-ui text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Chronic care infrastructure</p>
            </div>
          </div>
          <p className="font-mono-ui text-[11px] font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--burg-300)' }}>
            Chronicle
          </p>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">Care Coordinator<br />Workstation</h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
            Population health registry for lifelong blood conditions — start from exceptions, not spreadsheets.
          </p>
          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm badge-chronic">{f.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-white">{f.label}</p>
                  <p className="font-mono-ui text-[10px]" style={{ color: 'var(--text-muted)' }}>{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 font-mono-ui text-[10px]" style={{ color: '#2E3548' }}>NHSRC · specialist clinics · BPOMAS aggregates via reports</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-[360px]">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <BrandLogo size={40} />
            <p className="text-sm font-bold text-white">Chronicle</p>
          </div>
          {isDemoMode && (
            <div className="mb-5 rounded-xl px-4 py-3 text-xs badge-chronic">
              Demo mode — click <strong className="text-white">Enter Workstation</strong> to continue.
            </div>
          )}
          <div className="card overflow-hidden">
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #4A1020, #A81F38, #3A82B8)' }} />
            <div className="p-6 space-y-3">
              <h2 className="text-sm font-semibold text-white">{isDemoMode ? 'Continue as demo coordinator' : 'Sign in'}</h2>
              {!isDemoMode && (
                <form onSubmit={async (e) => { e.preventDefault(); setLoading(true); const { error: err } = await login(email, password); if (err) setError(err.message); setLoading(false) }} className="space-y-3">
                  <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="coordinator@nhsrc.org.bw" />
                  <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                  {error && <p className="text-xs flex gap-2" style={{ color: 'var(--neon-red)' }}><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
                  <button type="submit" disabled={loading} className="btn-primary w-full">Sign in</button>
                </form>
              )}
              {isDemoMode && (
                <button type="button" onClick={handleDemo} disabled={loading} className="btn-primary w-full flex justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '→ Enter Workstation'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
