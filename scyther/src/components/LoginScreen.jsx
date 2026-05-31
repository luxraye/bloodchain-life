import { useState } from 'react'
import { Droplets, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: '✦', label: 'Donor Check-In',      detail: 'Omang lookup · Azure QR scan · eligibility at a glance' },
  { icon: '◉', label: 'Medical Screening',   detail: 'Vitals · deferral rules · auto-advance on pass' },
  { icon: '⬡', label: 'Phlebotomy',          detail: 'ISBT-128 labelling · bleed timer · unit registration' },
  { icon: '➤', label: 'Offline-capable',     detail: 'Local queue syncs when connectivity returns' },
]

export default function LoginScreen() {
  const { login, isDemoMode } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: authError } = await login(email.trim(), password)
      if (authError) setError(authError.message)
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoAccess = async () => {
    setLoading(true)
    await login('', '')
    setLoading(false)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#07090F' }}>

      <div
        className="hidden lg:flex flex-col justify-between w-[500px] shrink-0 relative overflow-hidden p-10"
        style={{ background: '#0C0F1A', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* HD background: style={{ backgroundImage: 'url(/branding/scyther-bg.jpg)', backgroundSize: 'cover' }} */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 25% 25%, #00FF88 0%, transparent 65%)' }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(168,31,56,0.15)', border: '1px solid rgba(168,31,56,0.35)' }}>
              <img src="/branding/logo.png" alt="Bloodchain" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">Bloodchain</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: '#4A5568' }}>
                National Blood Management Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 mb-3">
            <Droplets className="h-5 w-5" style={{ color: '#00FF88' }} />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#00FF88' }}>
              Scyther
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Blood Collection<br />Operations
          </h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#8899A8' }}>
            Field-first workstation for phlebotomists and collection coordinators — donor check-in through unit labelling at drives and fixed sites.
          </p>

          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#00FF88' }}>
                  {f.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">{f.label}</p>
                  <p className="font-mono text-[10px]" style={{ color: '#4A5568' }}>{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 font-mono text-[10px]" style={{ color: '#2E3548' }}>
          Collection staff only · All sessions logged
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 relative overflow-y-auto">
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full opacity-[0.05] blur-[80px]"
          style={{ background: '#A81F38' }} />

        <div className="relative w-full max-w-[360px] py-8">
          <div className="lg:hidden flex flex-col items-center gap-2 mb-8 text-center">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)' }}>
              <Droplets className="h-6 w-6" style={{ color: '#00FF88' }} />
            </div>
            <p className="text-sm font-bold text-white">Scyther · Collection</p>
          </div>

          {isDemoMode && (
            <div className="mb-5 rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(255,184,0,0.07)', border: '1px solid rgba(255,184,0,0.2)' }}>
              <span className="text-base mt-0.5">⚠</span>
              <div>
                <p className="text-xs font-bold mb-0.5" style={{ color: '#FFB800' }}>Demo mode — no credentials required</p>
                <p className="text-[11px] leading-relaxed" style={{ color: '#8899A8' }}>
                  Click <strong style={{ color: '#F0F4F8' }}>Enter Collection Console</strong> to continue.
                </p>
              </div>
            </div>
          )}

          <div className="rounded-2xl overflow-hidden"
            style={{ background: '#0C0F1A', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #064e3b, #00FF88, #064e3b)' }} />
            <div className="px-6 pt-5 pb-2">
              <h2 className="text-sm font-semibold mb-1" style={{ color: '#F0F4F8' }}>
                {isDemoMode ? 'Continue as demo collector' : 'Sign in to your account'}
              </h2>
              <p className="mb-5 font-mono text-[10px]" style={{ color: '#4A5568' }}>
                COLLECTION · STAFF · PHLEBOTOMY · ADMIN
              </p>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: '#8899A8' }}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#4A5568' }} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder={isDemoMode ? 'demo@bloodchain.local' : 'collector@nbts.bw'}
                      className="input-field pl-9" disabled={isDemoMode} />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: '#8899A8' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#4A5568' }} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" className="input-field pl-9" disabled={isDemoMode} />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs"
                    style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.25)', color: '#FF2D55' }}>
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
                  </div>
                )}

                {isDemoMode ? (
                  <button type="button" onClick={handleDemoAccess} disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-1"
                    style={{ background: '#15803d', boxShadow: '0 0 20px rgba(0,255,136,0.25)' }}>
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Loading…</> : '→ Enter Collection Console'}
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-1">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : '→ Enter Collection Console'}
                  </button>
                )}
              </form>
            </div>
            <div className="px-6 py-4 border-t border-white/[0.05]">
              <p className="text-center font-mono text-[10px]" style={{ color: '#2E3548' }}>
                {isDemoMode ? 'Demo environment · No data persisted' : 'Authorised collection personnel only'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
