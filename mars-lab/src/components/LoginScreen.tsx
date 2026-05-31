import { useState } from 'react'
import { Mail, Lock, AlertCircle, Loader2, FlaskConical } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// ── App identity ───────────────────────────────────────────────────────
const APP = {
  name:        'Mars Lab',
  fullName:    'Laboratory & Screening Workstation',
  description: 'Clinical-grade workstation for blood bank laboratory staff. Barcode-driven specimen intake, infectious disease screening, component processing, and regulatory documentation — built to national blood service standards.',
  roles:       ['LAB', 'LAB_TECH', 'LAB_SUPERVISOR', 'SUPER_ADMIN'],
  features: [
    { icon: '⬡', label: 'TTI Screening Panel',   detail: 'HIV · HBsAg · HCV · Syphilis · Malaria' },
    { icon: '✦', label: 'Specimen Intake',        detail: 'Barcode scan or manual entry' },
    { icon: '◉', label: 'Chain of Custody',       detail: 'Full audit trail, JWT-signed' },
    { icon: '⬟', label: 'MoH Manifest Export',   detail: 'Compliance PDF generation' },
  ],
}

// ── Input component ────────────────────────────────────────────────────
function AuthInput({
  id, type, label, placeholder, value, onChange, icon,
}: {
  id: string; type: string; label: string; placeholder: string
  value: string; onChange: (v: string) => void; icon: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: '#8899A8' }}
      >
        {label}
      </label>
      <div className="relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
          style={{ color: focused ? '#A81F38' : '#4A5568', transition: 'color 0.18s' }}
        >
          {icon}
        </span>
        <input
          id={id}
          type={type}
          autoComplete={type === 'password' ? 'current-password' : 'email'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="h-10 w-full rounded-xl pl-9 pr-3 font-mono text-xs text-[#F0F4F8] outline-none transition-all"
          style={{
            background:  focused ? 'rgba(168,31,56,0.06)' : 'rgba(255,255,255,0.04)',
            border:      `1px solid ${focused ? 'rgba(168,31,56,0.6)' : 'rgba(255,255,255,0.09)'}`,
            boxShadow:   focused ? '0 0 0 3px rgba(168,31,56,0.1)' : 'none',
          }}
          onFocus={() => setFocused(true)}
          onBlur={()  => setFocused(false)}
        />
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────
export function LoginScreen() {
  const { login, isDemoMode } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: authError } = await login(email.trim(), password)
      if (authError) setError((authError as Error).message)
    } catch {
      setError('Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Demo mode: submit immediately auto-signs in via useAuth — just show the form
  const handleDemoAccess = async () => {
    setLoading(true)
    await login('', '')
    setLoading(false)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#07090F' }}>

      {/* ── Left panel — branding + app info ───────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[520px] shrink-0 relative overflow-hidden p-10"
        style={{ background: '#0C0F1A', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/*
          BACKGROUND IMAGE PLACEHOLDER
          When you have an HD image, add it like this:
          style={{ backgroundImage: 'url(/branding/mars-lab-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          and add a dark overlay div below it.
        */}

        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 30% 20%, #A81F38 0%, transparent 70%)',
          }}
        />

        {/* Fine grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo + platform */}
          <div className="flex items-center gap-3 mb-12">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(168,31,56,0.15)', border: '1px solid rgba(168,31,56,0.3)' }}
            >
              <img src="/branding/logo.png" alt="Bloodchain" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">Bloodchain</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: '#4A5568' }}>
                National Blood Management Platform
              </p>
            </div>
          </div>

          {/* App name */}
          <div className="flex items-center gap-2.5 mb-3">
            <FlaskConical className="h-5 w-5" style={{ color: '#5BA4D4' }} />
            <span
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: '#5BA4D4' }}
            >
              Mars Lab
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Laboratory &amp;<br />Screening Workstation
          </h1>
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#8899A8' }}>
            {APP.description}
          </p>

          {/* Features */}
          <div className="space-y-3">
            {APP.features.map(f => (
              <div key={f.label} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#5BA4D4' }}
                >
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

        {/* Footer */}
        <div className="relative z-10">
          <div className="h-px w-full mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <p className="font-mono text-[10px]" style={{ color: '#2E3548' }}>
            Authorised clinical personnel only · All sessions logged
          </p>
        </div>
      </div>

      {/* ── Right panel — auth form ────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 relative">

        {/* Ambient glow (right side) */}
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full opacity-[0.04] blur-[80px]"
          style={{ background: '#3A82B8' }}
        />

        <div className="relative w-full max-w-[360px]">

          {/* Mobile logo (hidden on desktop) */}
          <div className="lg:hidden flex flex-col items-center gap-2 mb-8 text-center">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(168,31,56,0.15)', border: '1px solid rgba(168,31,56,0.3)' }}
            >
              <img src="/branding/logo.png" alt="Bloodchain" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Mars Lab</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: '#4A5568' }}>
                Bloodchain · Laboratory Workstation
              </p>
            </div>
          </div>

          {/* Demo mode banner */}
          {isDemoMode && (
            <div
              className="mb-5 rounded-xl px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(255,184,0,0.07)', border: '1px solid rgba(255,184,0,0.2)' }}
            >
              <span className="text-base mt-0.5">⚠</span>
              <div>
                <p className="text-xs font-bold mb-0.5" style={{ color: '#FFB800' }}>
                  Demo mode — no credentials required
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: '#8899A8' }}>
                  Supabase is not configured. Click <strong style={{ color: '#F0F4F8' }}>Access Lab Console</strong> to enter with a demo account. Lab actions are simulated and no data is written.
                </p>
              </div>
            </div>
          )}

          {/* Auth card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#0C0F1A',
              border:     '1px solid rgba(255,255,255,0.08)',
              boxShadow:  '0 24px 64px rgba(0,0,0,0.6)',
            }}
          >
            {/* Accent bar */}
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #A81F38, #C4304E, #A81F38)' }} />

            <div className="px-6 pt-5 pb-2">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="h-8 w-0.5 rounded-full" style={{ background: '#A81F38', boxShadow: '0 0 10px rgba(168,31,56,0.5)' }} />
                <h2 className="text-sm font-semibold text-[#F0F4F8]">
                  {isDemoMode ? 'Continue as demo analyst' : 'Authenticate to continue'}
                </h2>
              </div>
              <p className="ml-3 mb-5 font-mono text-[10px]" style={{ color: '#4A5568' }}>
                {APP.roles.join(' · ')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <AuthInput
                  id="email"
                  type="email"
                  label="Email address"
                  placeholder={isDemoMode ? 'demo@bloodchain.local' : 'analyst@bloodchain.bw'}
                  value={email}
                  onChange={setEmail}
                  icon={<Mail className="h-3.5 w-3.5" />}
                />
                <AuthInput
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={setPassword}
                  icon={<Lock className="h-3.5 w-3.5" />}
                />

                {error && (
                  <div
                    className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs"
                    style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.25)', color: '#FF2D55' }}
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {error}
                  </div>
                )}

                {isDemoMode ? (
                  <button
                    type="button"
                    onClick={handleDemoAccess}
                    disabled={loading}
                    className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold text-white transition disabled:opacity-50"
                    style={{ background: '#A81F38', boxShadow: '0 0 20px rgba(168,31,56,0.35)' }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#C4304E' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#A81F38' }}
                  >
                    {loading
                      ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…</>
                      : '→ Access Lab Console'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold text-white transition disabled:opacity-50"
                    style={{ background: loading ? '#8B1A2E' : '#A81F38', boxShadow: '0 0 20px rgba(168,31,56,0.35)' }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#C4304E' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#A81F38' }}
                  >
                    {loading
                      ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Authenticating…</>
                      : '→ Access Lab Console'}
                  </button>
                )}
              </form>
            </div>

            <div className="px-6 py-4 mt-1 border-t border-white/[0.05]">
              <p className="text-center font-mono text-[10px]" style={{ color: '#2E3548' }}>
                {isDemoMode
                  ? 'Demo environment · No data is persisted'
                  : 'Authorised clinical personnel only · Session logged'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
