import { useState } from 'react'
import { Mail, Lock, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const FEATURES = [
  { icon: '⬟', label: 'National command', detail: 'Supply, logistics, wastage — programme KPIs' },
  { icon: '◎', label: 'Constellation', detail: 'Eight modules: collection → lab → hospital → chronic → research → compliance' },
  { icon: '⬡', label: 'Governance', detail: 'Keymaster, master ledger, donor KYC, ministry reports' },
]

export default function LoginScreen() {
  const { login, isDemoMode, isGuest } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleDemo = async () => {
    setLoading(true)
    await login('', '')
    setLoading(false)
  }

  if (isGuest) {
    return null
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#07090F' }}>
      <div className="hidden lg:flex flex-col justify-between w-[440px] shrink-0 p-10 border-r border-white/10" style={{ background: '#0C0F1A' }}>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#D96070' }}>Bloodchain</p>
          <h1 className="text-2xl font-extrabold text-white mb-3">High Command</h1>
          <p className="text-sm text-neutral-400 leading-relaxed mb-8">
            Ministry and NBTS programme cockpit for the national blood OS — not a donation app monitor.
          </p>
          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg text-sm" style={{ background: 'rgba(168,31,56,0.15)', color: '#D96070' }}>{f.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-white">{f.label}</p>
                  <p className="text-[10px] text-neutral-500">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-neutral-600 font-mono">MoH · NBTS · BMRA programme directors</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {isDemoMode && (
            <div className="mb-4 rounded-xl px-4 py-3 text-xs" style={{ background: 'rgba(168,31,56,0.12)', color: '#D96070', border: '1px solid rgba(168,31,56,0.25)' }}>
              Demo mode — enter without credentials or use <code className="font-mono">?guest=1</code>
            </div>
          )}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4" style={{ color: '#D96070' }} />
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Programme access</span>
            </div>
            <h2 className="text-base font-semibold text-neutral-100 mb-1">
              {isDemoMode ? 'Continue as demo director' : 'Administrator sign-in'}
            </h2>
            <p className="text-xs text-neutral-500 mb-5">ADMIN, SUPER_ADMIN, or MOH_AUDITOR required.</p>

            {isDemoMode ? (
              <button
                type="button"
                onClick={handleDemo}
                disabled={loading}
                className="w-full flex justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition"
                style={{ background: '#A81F38' }}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '→ Enter programme cockpit'}
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-neutral-400">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="director@nbts.gov.bw"
                      required
                      className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-800 pl-9 pr-3 text-sm text-neutral-100 outline-none focus:border-[#A81F38] focus:ring-2 focus:ring-[rgba(168,31,56,0.2)]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-medium text-neutral-400">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-800 pl-9 pr-3 text-sm text-neutral-100 outline-none focus:border-[#A81F38] focus:ring-2 focus:ring-[rgba(168,31,56,0.2)]"
                    />
                  </div>
                </div>
                {error && (
                  <p className="text-xs flex gap-2 text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ background: '#A81F38' }}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
