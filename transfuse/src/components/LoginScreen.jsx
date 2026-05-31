import { useState } from 'react'
import { Mail, Lock, AlertCircle, Loader2, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BrandLogo from './BrandLogo'

const FEATURES = [
  { icon: '⬟', label: 'Inventory Dashboard',   detail: 'Live blood stock by type, expiry alerts' },
  { icon: '♦',  label: 'Request Management',    detail: 'Emergency, family, and hospital orders' },
  { icon: '◉',  label: 'Standby Donor Pipeline', detail: 'Screening and directive workflows' },
  { icon: '✦',  label: 'Transfusion Log',        detail: 'Crossmatch, bedside verification, records' },
  { icon: '⬛', label: 'Haemovigilance',         detail: 'WHO-aligned adverse transfusion event reporting' },
]

export default function LoginScreen() {
  const { login, isDemoMode } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await login(email.trim(), password)
      if (err) setError(err.message)
    } catch {
      setError('Authentication failed. Please try again.')
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

      {/* ── Left panel ─────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[500px] shrink-0 relative overflow-hidden p-10"
        style={{ background: '#0C0F1A', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 30%, #A81F38 0%, transparent 65%)' }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 70%, #3A82B8 0%, transparent 70%)' }} />

        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <BrandLogo size={40} />
            <div>
              <p className="text-xs font-bold text-white tracking-wide">Bloodchain</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: '#4A5568' }}>Clinical infrastructure</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 mb-3">
            <Activity className="h-5 w-5" style={{ color: '#5BA4D4' }} />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#5BA4D4' }}>Transfuse</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Clinical Blood<br />Management
          </h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#8899A8' }}>
            Hospital-side platform for blood request management, inventory visibility, standby donor coordination, and transfusion documentation. Desktop-first, designed for clinical staff.
          </p>

          <div className="space-y-3">
            {FEATURES.map(f => (
              <div key={f.label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: 'rgba(168,31,56,0.12)', border: '1px solid rgba(168,31,56,0.25)', color: '#D96070' }}>
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

        <div className="relative z-10">
          <div className="h-px w-full mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <p className="font-mono text-[10px]" style={{ color: '#2E3548' }}>
            Authorised clinical personnel only · All sessions logged
          </p>
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 relative">
        <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full opacity-[0.04] blur-[80px]"
          style={{ background: '#3A82B8' }} />

        <div className="relative w-full max-w-[360px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center gap-2 mb-8 text-center">
            <BrandLogo size={48} />
            <div>
              <p className="text-sm font-bold text-white">Transfuse</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: '#4A5568' }}>Bloodchain · Clinical</p>
            </div>
          </div>

          {/* Demo banner */}
          {isDemoMode && (
            <div className="mb-5 rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(255,184,0,0.07)', border: '1px solid rgba(255,184,0,0.2)' }}>
              <span className="text-base mt-0.5">⚠</span>
              <div>
                <p className="text-xs font-bold mb-0.5" style={{ color: '#FFB800' }}>Demo mode — no credentials required</p>
                <p className="text-[11px] leading-relaxed" style={{ color: '#8899A8' }}>
                  Click <strong style={{ color: '#F0F4F8' }}>Access Clinical Console</strong> to enter with a demo account.
                </p>
              </div>
            </div>
          )}

          {/* Auth card */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: '#0C0F1A', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #4A1020, #A81F38, #3A82B8)' }} />

            <div className="px-6 pt-5 pb-2">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="h-8 w-0.5 rounded-full" style={{ background: '#3A82B8', boxShadow: '0 0 10px rgba(58,130,184,0.5)' }} />
                <h2 className="text-sm font-semibold" style={{ color: '#F0F4F8' }}>
                  {isDemoMode ? 'Continue as demo clinician' : 'Authenticate to continue'}
                </h2>
              </div>
              <p className="ml-3 mb-5 font-mono text-[10px]" style={{ color: '#4A5568' }}>
                MEDICAL · NURSE · DOCTOR · LAB_SUPERVISOR · SUPER_ADMIN
              </p>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Email */}
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: '#8899A8' }}>
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#4A5568' }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder={isDemoMode ? 'demo@bloodchain.local' : 'clinician@hospital.bw'}
                      className="h-10 w-full rounded-xl pl-9 pr-3 font-mono text-xs outline-none transition"
                      style={{ background: '#111422', border: '1px solid rgba(255,255,255,0.09)', color: '#F0F4F8' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(58,130,184,0.65)'; e.currentTarget.style.background = 'rgba(58,130,184,0.05)' }}
                      onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.background = '#111422' }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: '#8899A8' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#4A5568' }} />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 w-full rounded-xl pl-9 pr-3 font-mono text-xs outline-none transition"
                      style={{ background: '#111422', border: '1px solid rgba(255,255,255,0.09)', color: '#F0F4F8' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(58,130,184,0.65)'; e.currentTarget.style.background = 'rgba(58,130,184,0.05)' }}
                      onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.background = '#111422' }}
                    />
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
                    className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold text-white transition disabled:opacity-50"
                    style={{ background: '#1B3E5E', boxShadow: '0 0 20px rgba(58,130,184,0.3)' }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2A5F8F' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1B3E5E' }}>
                    {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…</> : '→ Access Clinical Console'}
                  </button>
                ) : (
                  <button type="submit" disabled={loading}
                    className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold text-white transition disabled:opacity-50"
                    style={{ background: '#1B3E5E', boxShadow: '0 0 20px rgba(58,130,184,0.3)' }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2A5F8F' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1B3E5E' }}>
                    {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Authenticating…</> : '→ Access Clinical Console'}
                  </button>
                )}
              </form>
            </div>

            <div className="px-6 py-4 mt-1 border-t border-white/[0.05]">
              <p className="text-center font-mono text-[10px]" style={{ color: '#2E3548' }}>
                {isDemoMode ? 'Demo environment · No data is persisted' : 'Authorised clinical personnel only · Session logged'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
