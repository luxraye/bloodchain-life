import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Droplets,
  Eye,
  EyeOff,
  History,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Shield,
  User,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAuth } from './hooks/useAuth.js'
import Navbar from './components/Navbar'
import ConstellationBoundary from './components/ConstellationBoundary'
import TrustBadge from './components/TrustBadge'
import DonorProfile from './pages/DonorProfile'
import TermsModal from './components/legal/TermsModal'
import {
  bookScheduleSlot,
  createRequest,
  getDonationHistory,
  getDonationJourney,
  getDonationCenters,
  getDonationEducation,
  getNearbyRequests,
  getNationalStockLevels,
  updateMyProfile,
  getRequests,
  getUserProfile,
  getScheduleSlots,
  registerDonor,
  respondToNearbyRequest,
} from './services/donorService'
import {
  addCalendarMonths,
  compareCollectionDateDesc,
  formatLocalDate,
  NEXT_ELIGIBLE_RULE,
  NEXT_ELIGIBLE_RULE_DETAIL,
  parseValidDate,
} from './lib/dates.js'

const TABS = {
  HOME: 'home',
  HISTORY: 'history',
  REQUEST: 'request',
  PROFILE: 'profile',
}

function App() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState(TABS.HOME)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) {
      getUserProfile().then(setProfile)
    }
  }, [user])

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div
        className="h-8 w-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(0, 200, 255, 0.2)', borderTopColor: '#00C8FF' }}
      />
    </div>
  )

  if (!user) return <LoginScreen />

  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--bg-base)' }}>
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col overflow-hidden border-x border-white/10 shadow-2xl"
        style={{ background: 'var(--bg-surface)' }}
      >
        <Navbar profileName={profile?.name} />
        <DesktopTabStrip activeTab={activeTab} onChange={setActiveTab} />
        <main className="relative flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 text-slate-900 p-4 pb-24 lg:px-10 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="h-full"
            >
              {activeTab === TABS.HOME && <Dashboard profile={profile} onProfileUpdate={setProfile} />}
              {activeTab === TABS.HISTORY && <DonationHistory />}
              {activeTab === TABS.REQUEST && (
                <RequestBlood
                  onRequestCreated={() => {
                    setActiveTab(TABS.HOME)
                  }}
                />
              )}
              {activeTab === TABS.PROFILE && (
                <div className="space-y-10">
                  <DonorProfile session={user} profile={profile} onProfileUpdate={setProfile} />
                  <Profile session={user} profile={profile} onProfileUpdate={setProfile} hideTrustBadge />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  )
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

function LoginScreen() {
  const { login, loginWithOtp, isDemoMode } = useAuth()
  const [panel, setPanel] = useState('signin')
  const [signinWithMagic, setSigninWithMagic] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regBloodType, setRegBloodType] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
  const [termsModalOpen, setTermsModalOpen] = useState(false)

  const resetError = () => setError('')

  const handlePasswordSignIn = async (e) => {
    e.preventDefault()
    resetError()
    setLoading(true)
    try {
      const { error: authError } = await login(email.trim(), password)
      if (authError) setError(authError.message)
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async (e) => {
    e.preventDefault()
    resetError()
    setLoading(true)
    try {
      const { error: authError } = await loginWithOtp(email.trim())
      if (authError) setError(authError.message)
      else setMagicSent(true)
    } catch (err) {
      setError(err.message || 'Unable to send magic link')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    resetError()
    if (!hasAcceptedTerms) {
      setError('Please accept the Terms of Service to create an account.')
      return
    }
    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (regPassword !== regConfirm) {
      setError('Passwords do not match.')
      return
    }
    const accepted_terms_at = new Date().toISOString()
    setLoading(true)
    try {
      await registerDonor({
        email: regEmail.trim(),
        password: regPassword,
        name: regName.trim(),
        bloodType: regBloodType || undefined,
        accepted_terms_at,
      })
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--bg-base)' }}>
      <TermsModal open={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col overflow-y-auto border-x border-white/10 px-5 py-10 shadow-2xl sm:px-10 lg:px-16 lg:py-16" style={{ background: 'var(--bg-surface)' }}>
        
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-red-400/20 blur-3xl" />
        <div className="absolute top-32 -right-32 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex w-full flex-col items-center text-center lg:w-[min(100%,380px)] lg:shrink-0 lg:items-start lg:text-left">
            <div className="mb-6 flex w-full justify-center lg:justify-start">
          <img src="/logo.png" alt="Bloodchain Logo" className="h-20 w-auto object-contain drop-shadow-md" onError={(e) => e.target.style.display = 'none'} />
        </div>

            <div className="mb-2 w-full space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-sm" style={{ borderColor: 'rgba(0,200,255,0.35)', background: 'rgba(0,200,255,0.1)', color: '#00C8FF' }}>
            <Droplets className="h-3.5 w-3.5" />
            Azure · Public donor portal
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Welcome</h1>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Create a donor account or sign in with email and password. You can also request a one-time sign-in link if you prefer.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full min-w-0 max-w-lg flex-1 lg:mx-0">
        {isDemoMode && (
          <div className="relative z-10 mb-4 rounded-xl border border-red-100 bg-red-50/90 px-4 py-3 text-xs text-red-800">
            <p className="font-semibold">Demo mode</p>
            <p className="mt-1 text-red-700/90">Seeded donor profile, journey, scheduling, and nearby appeals — no Supabase required.</p>
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true)
                await login('', '')
                setLoading(false)
              }}
              className="mt-3 w-full btn-azure py-2.5 text-sm disabled:opacity-60"
            >
              {loading ? 'Opening…' : '→ Explore as demo donor'}
            </button>
          </div>
        )}
        <div className="relative z-10 mb-4 flex rounded-xl border border-slate-200/80 bg-white/40 p-1 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => { setPanel('signin'); resetError(); setMagicSent(false); setHasAcceptedTerms(false) }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${panel === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => { setPanel('register'); resetError(); setMagicSent(false); setHasAcceptedTerms(false) }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${panel === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Create account
          </button>
        </div>

        <div className="relative z-10 rounded-3xl border border-white/60 bg-white/60 p-6 backdrop-blur-xl shadow-soft-card">
          {magicSent ? (
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <Mail className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-slate-900">Check your inbox</h2>
              <p className="mb-6 text-sm text-slate-600">
                We sent a secure link to <span className="font-semibold">{email}</span>. Open it on this device to finish signing in.
              </p>
              <button
                type="button"
                onClick={() => { setMagicSent(false); setSigninWithMagic(false) }}
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Back to sign in
              </button>
            </div>
          ) : panel === 'signin' ? (
            <div className="space-y-4">
              {!signinWithMagic ? (
                <form onSubmit={handlePasswordSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700" htmlFor="signin-email">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="signin-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700" htmlFor="signin-password">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="signin-password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { resetError(); setSigninWithMagic(true) }}
                    className="w-full text-center text-sm font-medium text-slate-600 underline-offset-2 hover:text-red-600 hover:underline"
                  >
                    Use email link instead of password
                  </button>
                </form>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <p className="text-xs text-slate-500">
                    We will email you a one-time link. You need access to your inbox on this device or another you can open the link from.
                  </p>
              <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700" htmlFor="magic-email">Email</label>
                <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="magic-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-red-500"
                      />
                </div>
              </div>
              {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      'Send sign-in link'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { resetError(); setSigninWithMagic(false) }}
                    className="w-full text-center text-sm font-medium text-slate-600 hover:text-slate-800"
                  >
                    Back to password sign-in
              </button>
            </form>
          )}
        </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="reg-name">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="reg-email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="reg-password">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="reg-confirm">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="reg-confirm"
                    type="password"
                    autoComplete="new-password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700" htmlFor="reg-blood">Blood type (optional)</label>
                <select
                  id="reg-blood"
                  value={regBloodType}
                  onChange={(e) => setRegBloodType(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Prefer not to say / unknown</option>
                  {BLOOD_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                <input
                  id="reg-accept-terms"
                  type="checkbox"
                  checked={hasAcceptedTerms}
                  onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                  aria-describedby="reg-terms-copy"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <p id="reg-terms-copy" className="text-xs leading-snug text-slate-500">
                  I agree to the Bloodchain{' '}
                  <button
                    type="button"
                    onClick={() => setTermsModalOpen(true)}
                    className="font-semibold text-red-700 underline decoration-red-300 underline-offset-2 hover:text-red-800"
                  >
                    Terms of Service
                  </button>
                  {' '}and consent to the processing of my health data.
                </p>
              </div>

              {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={loading || !hasAcceptedTerms}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>
          )}
        </div>
            <p className="mt-6 text-center text-[11px] text-slate-400 lg:text-left">Bloodchain Botswana · National blood programme</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ profile: initialProfile, onProfileUpdate }) {
  const [profile, setProfile] = useState(initialProfile || null)

  useEffect(() => {
    if (initialProfile) setProfile(initialProfile);
  }, [initialProfile])
  const [donations, setDonations] = useState(null)
  const [requests, setRequests] = useState(null)
  const [nationalStock, setNationalStock] = useState(null)
  const [centers, setCenters] = useState(null)
  const [slots, setSlots] = useState(null)
  const [nearbyRequests, setNearbyRequests] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingDonations, setLoadingDonations] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [loadingStock, setLoadingStock] = useState(true)
  const [loadingCenters, setLoadingCenters] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [bookingSlotId, setBookingSlotId] = useState(null)
  const [loadingNearby, setLoadingNearby] = useState(true)
  const [reactingId, setReactingId] = useState(null)

  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          const data = await getUserProfile()
          if (!cancelled) {
            setProfile(data)
          }
        } finally {
          if (!cancelled) setLoadingProfile(false)
        }
      })()

      ; (async () => {
        try {
          const data = await getDonationHistory()
          if (!cancelled) setDonations(data)
        } finally {
          if (!cancelled) setLoadingDonations(false)
        }
      })()

      ; (async () => {
        try {
          const data = await getRequests()
          if (!cancelled) setRequests(data)
        } finally {
          if (!cancelled) setLoadingRequests(false)
        }
      })()

      ; (async () => {
        try {
          const data = await getNationalStockLevels()
          if (!cancelled) setNationalStock(data)
        } finally {
          if (!cancelled) setLoadingStock(false)
        }
      })()

      ; (async () => {
        try {
          const data = await getDonationCenters()
          if (!cancelled) setCenters(data)
        } finally {
          if (!cancelled) setLoadingCenters(false)
        }
      })()

      ; (async () => {
        try {
          const data = await getScheduleSlots()
          if (!cancelled) setSlots(data)
        } finally {
          if (!cancelled) setLoadingSlots(false)
        }
      })()

      ; (async () => {
        try {
          const data = await getNearbyRequests(105)
          if (!cancelled) setNearbyRequests(data)
        } finally {
          if (!cancelled) setLoadingNearby(false)
        }
      })()

    return () => {
      cancelled = true
    }
  }, [])

  const donationCount = donations?.length ?? 0
  const livesSaved = donationCount * 3

  const nextEligibleFromHistory = useMemo(() => {
    if (!donations || donations.length === 0) return null
    const sorted = [...donations].sort(compareCollectionDateDesc)
    const last = sorted.find((d) => parseValidDate(d.collectionDate))
    if (!last) return null
    return addCalendarMonths(last.collectionDate, 3)
  }, [donations])

  const statusCard = useMemo(() => {
    if (!profile) return null
    if (profile.status === 'ELIGIBLE') {
      return (
        <div className="rounded-2xl bg-emerald-50 p-4 shadow-soft-card">
          <div className="mb-2 flex items-center gap-2 text-emerald-700">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Donation status
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-base font-semibold text-emerald-900">
              You can donate today!
            </p>
            {nextEligibleFromHistory && (
              <p className="text-[11px] font-medium text-emerald-800">
                Next suggested:{" "}
                {nextEligibleFromHistory.toLocaleDateString()}
              </p>
            )}
          </div>
          <p className="mt-1 text-xs text-emerald-700">
            Visit your nearest authorised donation centre to give blood.
          </p>
        </div>
      )
    }

    return (
      <div className="rounded-2xl bg-slate-900 p-4 text-slate-50 shadow-soft-card">
        <div className="mb-2 flex items-center gap-2 text-slate-300">
          <Activity className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Temporary deferral
          </span>
        </div>
        <p className="text-base font-semibold">
          Next donation:{' '}
          <span className="font-bold">
            {formatLocalDate(profile.nextEligibleDate) ?? 'See your deferral notice or contact your collection centre'}
          </span>
        </p>
        <p className="mt-1 text-xs text-slate-300">
          We&apos;ll remind you when you&apos;re able to donate again.
        </p>
      </div>
    )
  }, [profile, nextEligibleFromHistory])

  return (
    <div className="space-y-5 pb-4">
      <ConstellationBoundary />
      <section>
        {loadingStock ? (
          <div className="h-7 w-full max-w-xs animate-pulse rounded-full bg-slate-200" />
        ) : nationalStock ? (
          <div className="inline-flex w-full items-center gap-2 overflow-hidden rounded-full bg-red-50 px-3 py-1 text-[11px] font-medium text-red-800 shadow-soft-card">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-red-500">
              National stock
            </span>
            <div className="flex-1 overflow-hidden">
              <motion.div
                initial={{ x: 16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="truncate"
              >
                {nationalStock.message}
              </motion.div>
            </div>
          </div>
        ) : null}
      </section>

      <NextDonationCard
        loadingSlots={loadingSlots}
        loadingDonations={loadingDonations}
        slots={slots}
        nextEligible={nextEligibleFromHistory}
        onBookSlot={async (slotId) => {
          try {
            setBookingSlotId(slotId)
            await bookScheduleSlot(slotId)
            const updated = await getScheduleSlots()
            setSlots(updated)
          } finally {
            setBookingSlotId(null)
          }
        }}
        bookingSlotId={bookingSlotId}
      />

      <header className="space-y-1">
        {loadingProfile ? (
          <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
        ) : (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Hello,
          </p>
        )}
        {loadingProfile ? (
          <div className="h-7 w-40 animate-pulse rounded-full bg-slate-200" />
        ) : (
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {profile?.name}
          </h2>
        )}
      </header>

      {loadingProfile ? (
        <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-200" />
      ) : (
        statusCard
      )}

      <motion.section
        className="grid grid-cols-3 gap-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <StatCard
            label="Donations"
            value={loadingDonations ? <SkeletonDot /> : <span>{donationCount}</span>}
            icon={<Droplets className="h-4 w-4 text-red-600" />}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <StatCard
            label="Lives saved"
            value={loadingDonations ? <SkeletonDot /> : <span>{livesSaved}</span>}
            icon={<Activity className="h-4 w-4 text-emerald-600" />}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <StatCard
            label="Blood type"
            value={loadingProfile ? <SkeletonDot /> : <span>{profile?.bloodType}</span>}
            icon={<Shield className="h-4 w-4 text-slate-700" />}
          />
        </motion.div>
      </motion.section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Donation centres near you
          </h3>
          {!loadingCenters && centers && centers.length > 0 && (
            <span className="text-[10px] font-medium text-slate-400">
              {centers[0]?.county ?? 'Gaborone'} region
            </span>
          )}
        </div>

        {loadingCenters ? (
          <div className="space-y-2">
            <SkeletonRow />
            <SkeletonRow className="w-3/4" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-soft-card">
            <div className="relative h-32 w-full bg-[radial-gradient(circle_at_20%_20%,rgba(248,250,252,0.15),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(248,250,252,0.12),transparent_55%)]">
              <div className="absolute inset-4 rounded-2xl border border-slate-700/80" />
              <div className="absolute inset-6 grid grid-cols-3 grid-rows-3 gap-2 opacity-30">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-700/60"
                  />
                ))}
              </div>
              {centers && centers.slice(0, 3).map((center, index) => {
                const positions = [
                  { top: '25%', left: '20%' },
                  { top: '55%', left: '55%' },
                  { top: '35%', left: '75%' },
                ]
                const pos = positions[index] || positions[0]
                const isPrimary = index === 0
                return (
                  <div
                    key={center.id}
                    className="absolute"
                    style={pos}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${isPrimary
                        ? 'border-red-400 bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.45)]'
                        : 'border-slate-400 bg-slate-200'
                        }`}
                    >
                      <MapPin
                        className={`h-3 w-3 ${isPrimary ? 'text-white' : 'text-slate-700'
                          }`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-1.5 bg-slate-950/80 px-3 pb-3 pt-2 min-h-[4rem]">
              {!centers || centers.length === 0 ? (
                <p className="text-[11px] text-slate-400 py-1 text-center">
                  Donation centre locations will appear here once available. Visit your nearest authorised centre in the meantime.
                </p>
              ) : (
                centers.slice(0, 2).map((center) => (
                  <div
                    key={center.id}
                    className="flex items-center justify-between rounded-xl bg-slate-900/60 px-2 py-1.5"
                  >
                    <div>
                      <p className="text-[11px] font-semibold text-slate-50">
                        {center.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {center.distanceKm.toFixed(1)} km · ~{center.etaMinutes} min
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${center.status === 'OPEN'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-200'
                        }`}
                    >
                      {center.status === 'OPEN' ? 'Open' : 'Planned'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Active requests
          </h3>
        </div>

        {loadingRequests ? (
          <div className="space-y-2">
            <SkeletonRow />
            <SkeletonRow className="w-3/4" />
          </div>
        ) : !requests || requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/40 backdrop-blur-md px-6 py-8 text-center shadow-inner">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100/50 text-slate-400">
              <History className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No active requests</p>
            <p className="mt-1 text-xs text-slate-500">
              Start a new request from the Request tab to see it actively tracked here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <RequestCard request={req} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Nearby urgent appeals (≤ 105 km)
          </h3>
        </div>

        {loadingNearby ? (
          <div className="space-y-2">
            <SkeletonRow />
            <SkeletonRow className="w-2/3" />
          </div>
        ) : !nearbyRequests || nearbyRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/40 backdrop-blur-md px-6 py-8 text-center shadow-inner">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50/50 text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No urgent appeals</p>
            <p className="mt-1 text-xs text-slate-500">
              There are no active appeals within 105 km right now. You&apos;ll see them here when hospitals flag a need.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {nearbyRequests.map((req) => (
              <article
                key={req.id}
                className="rounded-2xl bg-white p-3 shadow-soft-card"
              >
                <div className="mb-1 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {req.patientName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {req.hospitalName}
                    </p>
                  </div>
                  <div className="text-right text-[11px]">
                    <p className="font-semibold text-red-600">
                      {req.bloodTypeNeeded}
                    </p>
                    <p className="text-slate-500">
                      {req.distanceKm.toFixed(1)} km away
                    </p>
                  </div>
                </div>
                <div className="mb-2 flex items-center justify-between text-[10px] text-slate-500">
                  <span>
                    {req.urgencyLevel === 'CRITICAL' ? 'Critical' : 'Routine'} ·{' '}
                    {parseValidDate(req.createdAt)?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) ?? '—'}
                  </span>
                  <span>
                    {req.displayResponders}{' '}
                    {req.displayResponders === 1 ? 'person' : 'people'} on
                    standby
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    disabled={reactingId === req.id}
                    onClick={async () => {
                      setReactingId(req.id)
                      try {
                        const nextAction = req.myResponse ? 'CANCEL' : 'PLEDGE'
                        await respondToNearbyRequest(req.id, nextAction)
                        const updated = await getNearbyRequests(105)
                        setNearbyRequests(updated)
                      } finally {
                        setReactingId(null)
                      }
                    }}
                    className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-sm transition ${req.myResponse
                      ? 'bg-slate-900 text-slate-50'
                      : 'bg-red-600 text-white hover:bg-red-700'
                      } disabled:cursor-not-allowed disabled:opacity-80`}
                  >
                    {req.myResponse ? "You're on standby" : "I'm available"}
                  </button>
                  <p className="text-[10px] text-slate-500">
                    Azure will share your pledge with the national programme only.
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function DonationHistory() {
  const [journey, setJourney] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastDonation, setLastDonation] = useState(null)
  const [loadingDonation, setLoadingDonation] = useState(true)
  const [showUnitId, setShowUnitId] = useState(false)

  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          const steps = await getDonationJourney()
          if (!cancelled) {
            setJourney(steps)
          }
        } finally {
          if (!cancelled) setLoading(false)
        }
      })()

      ; (async () => {
        try {
          const history = await getDonationHistory()
          if (!cancelled && history && history.length > 0) {
            const sorted = [...history].sort(compareCollectionDateDesc)
            setLastDonation(sorted[0])
          }
        } finally {
          if (!cancelled) setLoadingDonation(false)
        }
      })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-5 pb-4">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          The journey
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          Your last donation
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          From the moment it was collected to the life it helped save.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow-soft-card">
        {loadingDonation ? (
          <div className="space-y-2">
            <SkeletonRow className="w-1/2" />
            <SkeletonRow className="w-3/4" />
          </div>
        ) : !lastDonation || !lastDonation.bloodUnitId ? (
          <p className="text-xs text-slate-500">
            Once your next donation is recorded, a private blood unit ID will appear
            here.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Blood unit ID
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                  A private identifier that follows this unit through every stage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUnitId((prev) => !prev)}
                className="inline-flex h-7 items-center gap-1 rounded-full bg-slate-100 px-2 text-[11px] font-medium text-slate-600"
              >
                {showUnitId ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Reveal
                  </>
                )}
              </button>
            </div>
            <div className="mt-1 rounded-xl bg-slate-900 px-3 py-2 font-mono text-sm tracking-[0.2em] text-slate-50">
              {showUnitId
                ? lastDonation.bloodUnitId
                : '•••••••••••••••'.slice(0, lastDonation.bloodUnitId.length)}
            </div>
            <p className="text-[10px] text-slate-500">
              Treat this like a password. Only share it with authorised health
              professionals if requested.
            </p>
            {lastDonation.statusLabel && (
              <p className="mt-2 text-xs font-medium text-slate-700">
                Current status: <span className="text-slate-900">{lastDonation.statusLabel}</span>
              </p>
            )}
          </div>
        )}
      </section>

      <div className="rounded-2xl bg-white p-4 shadow-soft-card">
        {loading ? (
          <div className="space-y-4">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : !journey ? (
          <p className="text-xs text-slate-500">
            We don&apos;t have a donation journey to show yet.
          </p>
        ) : (
          <ol className="relative border-l border-slate-200">
            {journey.map((step, index) => {
              const isLast = index === journey.length - 1
              const isHighlight = step.status === 'HIGHLIGHT'
              return (
                <li key={step.id} className="mb-6 ml-4 last:mb-0">
                  <div
                    className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border-2 ${isHighlight
                      ? 'border-amber-400 bg-amber-100 shadow-[0_0_0_4px_rgba(250,204,21,0.35)]'
                      : 'border-slate-300 bg-white'
                      }`}
                  />
                  <div
                    className={`rounded-2xl px-3 py-2.5 ${isHighlight
                      ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50'
                      : 'bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {step.label}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {parseValidDate(step.date)?.toLocaleString() ?? '—'}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-slate-800">
                      {step.description}
                    </p>
                    {step.meta?.location && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {step.meta.location}
                      </div>
                    )}
                    {step.meta?.facility && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] text-slate-500">
                        <Shield className="h-3 w-3" />
                        {step.meta.facility}
                      </div>
                    )}
                    {step.meta?.ward && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[11px] text-amber-800">
                        <Activity className="h-3 w-3" />
                        Patient in {step.meta.ward}
                      </div>
                    )}
                  </div>
                  {!isLast && (
                    <div className="mt-1 h-4 w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </div>
  )
}

function RequestBlood({ onRequestCreated }) {
  const [patientName, setPatientName] = useState('')
  const [hospital, setHospital] = useState('')
  const [bloodType, setBloodType] = useState('O+')
  const [region, setRegion] = useState('')
  const [urgency, setUrgency] = useState('ROUTINE')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!patientName.trim() || !hospital || !bloodType || !region) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      await createRequest({
        patientName: patientName.trim(),
        hospitalName: hospital,
        bloodTypeNeeded: bloodType,
        region: region,
        urgencyLevel: urgency, // Routine / Critical
      })
      setSuccess('Request captured. Status: pending verification.')
      setPatientName('')
      setHospital('')
      setRegion('')
      setBloodType('O+')
      setUrgency('ROUTINE')
      if (onRequestCreated) {
        onRequestCreated()
      }
    } catch {
      setError('Unable to create request right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5 pb-4">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          The lifeline
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          Request blood
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Capture a request for a family member or friend needing blood.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl bg-white p-4 shadow-soft-card"
      >
        <div className="space-y-2">
          <label
            htmlFor="patientName"
            className="text-xs font-medium text-slate-700"
          >
            Patient name
          </label>
          <input
            id="patientName"
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Full name as on hospital file"
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="hospital"
            className="text-xs font-medium text-slate-700"
          >
            Hospital
          </label>
          <select
            id="hospital"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select a facility</option>
            <option value="SKMTH">Scottish Livingstone Hospital (SKMTH)</option>
            <option value="PRH">Princess Marina Hospital (PRH)</option>
            <option value="NYH">Nyangabwe Referral Hospital</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label
              htmlFor="bloodType"
              className="text-xs font-medium text-slate-700"
            >
              Blood type needed
            </label>
            <select
              id="bloodType"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="region"
              className="text-xs font-medium text-slate-700"
            >
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select a region</option>
              <option value="Gaborone">Gaborone</option>
              <option value="Francistown">Francistown</option>
              <option value="Maun">Maun</option>
              <option value="Kasane">Kasane</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">

          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-700">
              Urgency level
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUrgency('ROUTINE')}
                className={`flex-1 rounded-xl border px-2 py-2 text-xs font-medium ${urgency === 'ROUTINE'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
              >
                Routine
              </button>
              <button
                type="button"
                onClick={() => setUrgency('CRITICAL')}
                className={`flex-1 rounded-xl border px-2 py-2 text-xs font-medium ${urgency === 'CRITICAL'
                  ? 'border-red-600 bg-red-600 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
              >
                Critical
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-red-600 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:bg-red-400"
        >
          {submitting ? 'Submitting…' : 'Submit request'}
        </button>
      </form>
    </div>
  )
}

function Profile({ session, profile: initialProfile, onProfileUpdate, hideTrustBadge = false }) {
  const [profile, setProfile] = useState(initialProfile || null)

  useEffect(() => {
    if (initialProfile) setProfile(initialProfile);
  }, [initialProfile])
  const [loading, setLoading] = useState(true)
  const [education, setEducation] = useState(null)
  const [loadingEducation, setLoadingEducation] = useState(true)
  const [lastDonation, setLastDonation] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', age: '', gender: '', region: '', medicalConditions: '' })

  useEffect(() => {
    let cancelled = false
      ; (async () => {
        try {
          const data = await getUserProfile()
          if (!cancelled) {
            setProfile(data)
          }
        } finally {
          if (!cancelled) setLoading(false)
        }
      })()

      ; (async () => {
        try {
          const history = await getDonationHistory()
          if (!cancelled && history && history.length > 0) {
            const sorted = [...history].sort(compareCollectionDateDesc)
            setLastDonation(sorted[0])
          }
        } finally {
          // no extra flag
        }
      })()

      ; (async () => {
        try {
          const data = await getDonationEducation()
          if (!cancelled) {
            setEducation(data)
          }
        } finally {
          if (!cancelled) setLoadingEducation(false)
        }
      })()

    return () => {
      cancelled = true
    }
  }, [])

  const healthStats = profile?.healthStats

  const computedNextEligible = useMemo(() => {
    if (!lastDonation) return null
    return addCalendarMonths(lastDonation.collectionDate, 3)
  }, [lastDonation])

  const handleEditToggle = () => {
    if (!editMode && profile) {
      setEditForm({
        name: profile.name || '',
        age: profile.age || '',
        gender: profile.gender || '',
        region: profile.region || '',
        medicalConditions: profile.medicalConditions || ''
      })
    }
    setEditMode(!editMode)
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const updated = await updateMyProfile({
        name: editForm.name || undefined,
        age: editForm.age ? parseInt(editForm.age, 10) : null,
        gender: editForm.gender,
        region: editForm.region,
        medicalConditions: editForm.medicalConditions
      })
      setProfile(updated)
      onProfileUpdate(updated)
      setEditMode(false)
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <div className="space-y-5 pb-4">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          Profile
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Quantified self
        </h2>
        <p className="text-xs font-medium text-slate-500">
          Your donor identity, health trends, and achievements in one place.
        </p>
      </header>

      <DigitalIdCard
        loading={loading}
        name={profile?.name}
        bloodType={profile?.bloodType}
        age={profile?.age}
        gender={profile?.gender}
        trustLvl={profile?.trustLevel || 1}
      />

      {!hideTrustBadge && !loading && profile && (
        <section className="space-y-3 rounded-2xl bg-white p-4 shadow-soft-card">
          <TrustBadge
            trustLevel={profile.trustLevel || 1}
            onUpgraded={async () => {
              const data = await getUserProfile()
              setProfile(data)
              onProfileUpdate(data)
            }}
          />
        </section>
      )}

      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-soft-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Donor details
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Information on file with Bloodchain.
            </p>
          </div>
          <button
            type="button"
            onClick={handleEditToggle}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition"
          >
            {editMode ? <User className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </button>
        </div>

        {editMode ? (
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Full Name</label>
              <input type="text" placeholder="e.g. John Doe" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Age</label>
              <input type="number" value={editForm.age} onChange={e => setEditForm({ ...editForm, age: e.target.value })} className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Gender</label>
              <select value={editForm.gender} onChange={e => setEditForm({ ...editForm, gender: e.target.value })} className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Region</label>
              <select value={editForm.region} onChange={e => setEditForm({ ...editForm, region: e.target.value })} className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Select region</option>
                <option value="Gaborone">Gaborone</option>
                <option value="Francistown">Francistown</option>
                <option value="Maun">Maun</option>
                <option value="Kasane">Kasane</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Medical Conditions</label>
              <input type="text" placeholder="e.g. None, Hypertension..." value={editForm.medicalConditions} onChange={e => setEditForm({ ...editForm, medicalConditions: e.target.value })} className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="pt-2 flex gap-2">
              <button type="button" onClick={handleSaveProfile} disabled={savingProfile} className="flex-1 rounded-xl bg-red-600 py-2 text-xs font-medium text-white shadow-sm hover:bg-red-700 transition">
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={handleEditToggle} disabled={savingProfile} className="flex-1 rounded-xl bg-slate-100 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 transition">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <dl className="mt-3 space-y-2 text-xs">
            <DetailRow
              label="Blood type"
              value={loading ? '•••' : profile?.bloodType}
            />
            <DetailRow
              label="Age"
              value={loading ? '•••' : profile?.age || 'Not provided'}
            />
            <DetailRow
              label="Gender"
              value={loading ? '•••' : profile?.gender || 'Not provided'}
            />
            <DetailRow
              label="Region"
              value={loading ? '•••' : profile?.region || 'Not provided'}
            />
            <DetailRow
              label="Medical Notes"
              value={loading ? '•••' : profile?.medicalConditions || 'None'}
            />
            <DetailRow
              label="Mobile number"
              value={session.phone ? `+267 ${session.phone}` : 'On file'}
            />
            <DetailRow
              label="Next eligible donation"
              value={
                loading
                  ? '•••'
                  : computedNextEligible
                    ? computedNextEligible.toLocaleDateString()
                    : formatLocalDate(profile?.nextEligibleDate)
                      ?? NEXT_ELIGIBLE_RULE
              }
            />
          </dl>
        )}
      </section>

      <HealthTrendsCard loading={loading} healthStats={healthStats} />

      <AchievementsGrid loading={loading} badges={profile?.badges || []} />

      <EducationCard loading={loadingEducation} education={education} />
    </div>
  )
}

function DigitalIdCard({ loading, name, bloodType, age, gender, trustLvl = 1 }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="relative h-44 w-full print:h-auto print:max-w-sm print:border print:border-slate-200 print:bg-white">
      <div className="mb-2 flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={() => setFlipped((prev) => !prev)}
          className="text-[11px] font-medium text-slate-500 underline-offset-2 hover:underline"
        >
          {flipped ? 'Show front of card' : 'Show QR side'}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-50 shadow-sm hover:bg-slate-800"
        >
          Print card
        </button>
      </div>
      <button
        type="button"
        onClick={() => setFlipped((prev) => !prev)}
        className="relative block h-40 w-full rounded-2xl print:h-auto"
        aria-label="Flip digital donor ID"
      >
        <div className="perspective-1000 relative h-full w-full">
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="relative h-full w-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className={`absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/20 p-5 text-white shadow-2xl print:hidden overflow-hidden ${trustLvl === 3
                ? 'bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900'
                : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900'
                }`}
              style={{
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Holographic / Glass Shine Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

              <div className="relative z-10 flex items-start justify-between">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50 drop-shadow-sm">
                    Azure Donor ID
                  </p>
                  <p className="text-base font-bold tracking-tight drop-shadow-sm">
                    {loading ? '•••• ••••' : name}
                  </p>
                  <p className="text-[11px] font-medium text-white/70">
                    {loading ? '—' : bloodType || '—'} •{' '}
                    {gender ? gender.charAt(0) + gender.slice(1).toLowerCase() : 'Donor'}{' '}
                    {age ? `• ${age} yrs` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur-md ${trustLvl === 3 ? 'bg-amber-300 text-amber-900' : 'bg-white/20 text-white'
                    }`}>
                    {trustLvl === 3 ? 'Verified Gold' : 'Network Donor'}
                  </span>
                </div>
              </div>
              <div className="relative z-10 mt-3 flex items-end justify-between text-[10px] text-white/70">
                <div>
                  <p className="font-bold uppercase tracking-[0.16em] text-white/90">
                    Bloodchain Botswana
                  </p>
                  <p className="mt-0.5 text-[9px] text-white/50">
                    Present this card or QR at donation.
                  </p>
                </div>
                <div className="h-8 w-16 rounded bg-white/20 backdrop-blur-md shadow-inner" />
              </div>
            </div>

            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-slate-900 shadow-soft-card print:hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Donor QR
              </p>
              <div className="mt-2 h-20 w-20 rounded-md bg-gradient-to-br from-slate-900 to-slate-700 p-2">
                <div className="flex h-full w-full items-center justify-center rounded bg-white">
                  <div className="h-14 w-14 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:6px_6px]" />
                </div>
              </div>
              <p className="mt-2 text-[10px] text-slate-500">
                Scan at participating donation centres for instant lookup.
              </p>
            </div>
          </motion.div>
        </div>
      </button>
    </div>
  )
}

function HealthTrendsCard({ loading, healthStats }) {
  const hasData =
    healthStats &&
    Array.isArray(healthStats.iron) &&
    healthStats.iron.length > 0

  const chartData =
    hasData &&
    healthStats.iron.map((value, index) => ({
      label: healthStats.dates?.[index] ?? `D${index + 1}`,
      iron: value,
      pulse: healthStats.pulse?.[index] ?? null,
    }))

  const vitalsData =
    healthStats &&
    healthStats.bp?.map((bpValue, index) => {
      const [sys, dia] = bpValue.split('/').map((n) => Number(n))
      return {
        label: `V${index + 1}`,
        systolic: sys,
        diastolic: dia,
      }
    })

  return (
    <section className="space-y-3 rounded-2xl bg-white p-4 shadow-soft-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Health trends
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Key values from your recent donations.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <SkeletonRow />
          <SkeletonRow className="w-4/5" />
          <div className="h-24 w-full animate-pulse rounded-xl bg-slate-100" />
        </div>
      ) : !hasData ? (
        <p className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-500">
          No health data recorded yet. Trends will appear here after your donations are processed.
        </p>
      ) : (
        <>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: -30, right: 4 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  domain={['dataMin - 0.3', 'dataMax + 0.3']}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-white/40 bg-white/60 p-3 shadow-lg backdrop-blur-md">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {label}
                          </p>
                          <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                            <span className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                            {payload[0].value} <span className="text-[10px] font-medium text-slate-500">g/dL</span>
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="iron"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {vitalsData && vitalsData.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
              {vitalsData.map((vital) => (
                <div
                  key={vital.label}
                  className="rounded-xl bg-slate-50 px-2 py-1.5"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                    {vital.label}
                  </p>
                  <p className="mt-0.5 font-semibold text-slate-900">
                    {vital.systolic}/{vital.diastolic}
                  </p>
                  <p className="text-[10px] text-slate-500">mmHg</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

function AchievementsGrid({ loading, badges }) {
  const allAchievements = [
    {
      id: 'early_adopter',
      label: 'Early adopter',
      description: 'Joined Azure in the pilot phase.',
    },
    {
      id: 'holiday_hero',
      label: 'Holiday hero',
      description: 'Donated during a national holiday.',
    },
    {
      id: 'vein_hero',
      label: 'Vein hero',
      description: 'Multiple successful donations recorded.',
    },
  ]

  return (
    <section className="space-y-3 rounded-2xl bg-white p-4 shadow-soft-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Achievements
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Badges unlocked across your donation journey.
          </p>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {allAchievements.map((ach) => {
          const active = badges.includes(ach.id)
          return (
            <div
              key={ach.id}
              className={`flex h-20 flex-col justify-between rounded-2xl border px-2 py-2 ${active
                ? 'border-red-500/60 bg-red-50'
                : 'border-slate-200 bg-slate-50'
                }`}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${active
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                    }`}
                >
                  {active ? '★' : '☆'}
                </div>
                <p
                  className={`text-[10px] font-semibold ${active ? 'text-red-900' : 'text-slate-600'
                    }`}
                >
                  {ach.label}
                </p>
              </div>
              <p className="text-[9px] font-medium text-slate-500">
                {ach.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function NextDonationCard({
  loadingSlots,
  loadingDonations,
  slots,
  nextEligible,
  onBookSlot,
  bookingSlotId,
}) {
  const upcomingSlots = slots ?? []

  const formatDateLabel = (dateString) =>
    formatLocalDate(dateString, { month: 'short', day: 'numeric' }) ?? '—'

  return (
    <section className="space-y-2 rounded-2xl bg-white p-4 shadow-soft-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Next donation
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Plan your next visit around your eligibility window.
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
            Eligible from
          </p>
          <p className="mt-0.5 text-base font-semibold text-slate-900">
            {loadingDonations
              ? 'Calculating…'
              : nextEligible
                ? nextEligible.toLocaleDateString()
                : NEXT_ELIGIBLE_RULE}
          </p>
          {!loadingDonations && !nextEligible && (
            <p className="mt-1 text-[11px] font-medium text-slate-500">
              {NEXT_ELIGIBLE_RULE_DETAIL}
            </p>
          )}
        </div>
        {!loadingDonations && nextEligible && (
          <p className="text-[11px] font-medium text-emerald-700">
            Every 3 months from last donation
          </p>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-[11px] font-medium text-slate-500">
          Suggested slots in the next 2 weeks
        </p>
        {loadingSlots ? (
          <div className="flex gap-2">
            <SkeletonRow className="h-8 w-24" />
            <SkeletonRow className="h-8 w-24" />
            <SkeletonRow className="h-8 w-24" />
          </div>
        ) : upcomingSlots.length === 0 ? (
          <p className="text-[11px] text-slate-500">
            No available slots yet. Check back soon or visit a walk-in centre.
          </p>
        ) : (
          <div className="flex snap-x gap-2 overflow-x-auto pb-1">
            {upcomingSlots.map((slot) => {
              const booked = Boolean(slot.bookedAt)
              const isBooking = bookingSlotId === slot.id
              const slotDate = parseValidDate(slot.date)
              const disabled =
                booked || Boolean(nextEligible && slotDate && slotDate < nextEligible)

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={disabled || isBooking}
                  onClick={() => onBookSlot(slot.id)}
                  className={`flex min-w-[120px] snap-start flex-col rounded-2xl border px-2 py-2 text-left ${disabled
                    ? 'border-slate-200 bg-slate-50 text-slate-400'
                    : 'border-red-100 bg-red-50 text-red-900 hover:border-red-300'
                    }`}
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em]">
                    {formatDateLabel(slot.date)}
                  </span>
                  <span className="mt-0.5 text-[11px] font-semibold">
                    {slot.window}
                  </span>
                  <span className="mt-0.5 text-[10px] text-slate-500">
                    {slot.centerName}
                  </span>
                  <span className="mt-0.5 text-[10px] text-slate-500">
                    {booked
                      ? 'Reminder set'
                      : `${slot.capacityRemaining} spots left`}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function EducationCard({ loading, education }) {
  return (
    <section className="space-y-3 rounded-2xl bg-white p-4 shadow-soft-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Learn about donation
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Stay safe and informed with trusted guidance.
          </p>
        </div>
      </div>

      {loading || !education ? (
        <div className="space-y-2">
          <SkeletonRow />
          <SkeletonRow className="w-4/5" />
          <SkeletonRow className="w-2/3" />
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {education.tips.map((tip) => (
              <li
                key={tip.id}
                className="rounded-xl bg-slate-50 px-3 py-2 text-[11px]"
              >
                <p className="font-semibold text-slate-900">{tip.title}</p>
                <p className="mt-0.5 text-slate-600">{tip.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-3 space-y-1">
            <p className="text-[11px] font-semibold text-slate-500">
              From the World Health Organization
            </p>
            <ul className="space-y-1.5 text-[11px]">
              {education.articles.map((article) => (
                <li key={article.id}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-red-600 underline-offset-2 hover:underline"
                  >
                    <span className="font-medium">{article.title}</span>
                    <span className="text-[10px] text-slate-500">
                      ({article.source})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  )
}

function DesktopTabStrip({ activeTab, onChange }) {
  const items = [
    { id: TABS.HOME, label: 'Home', icon: Droplets },
    { id: TABS.HISTORY, label: 'History', icon: History },
    { id: TABS.REQUEST, label: 'Request', icon: Activity },
    { id: TABS.PROFILE, label: 'Profile', icon: User },
  ]
  return (
    <nav className="hidden shrink-0 border-b border-white/10 px-6 py-2 lg:block lg:px-10" style={{ background: 'var(--bg-raised)' }}>
      <div className="mx-auto flex max-w-7xl items-center gap-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isActive
                ? 'tab-azure-active shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function BottomNav({ activeTab, onChange }) {
  const items = [
    { id: TABS.HOME, label: 'Home', icon: Droplets },
    { id: TABS.HISTORY, label: 'History', icon: History },
    { id: TABS.REQUEST, label: 'Request', icon: Activity },
    { id: TABS.PROFILE, label: 'Profile', icon: User },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className="flex flex-1 flex-col items-center gap-0.5"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs ${isActive
                  ? 'tab-azure-active shadow-md'
                  : 'text-slate-500'
                  }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span
                className={`text-[10px] font-medium ${isActive ? 'text-slate-900' : 'text-slate-500'
                  }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-2 shadow-soft-card">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
          {label}
        </span>
        {icon}
      </div>
      <div className="text-lg font-semibold text-slate-900">{value}</div>
    </div>
  )
}

function RequestCard({ request }) {
  const badge =
    request.status === 'PENDING_VERIFICATION'
      ? {
        label: 'Pending verification',
        className: 'bg-amber-50 text-amber-800',
      }
      : {
        label: request.status,
        className: 'bg-slate-100 text-slate-700',
      }

  return (
    <article className="rounded-2xl bg-white p-3 shadow-soft-card">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-900">
          {request.patientName}
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>
      <p className="text-[11px] text-slate-500">
        {request.hospitalName} • {request.bloodTypeNeeded}{' '}
        {request.urgencyLevel === 'CRITICAL' && (
          <span className="font-semibold text-red-600">· Critical</span>
        )}
      </p>
      <p className="mt-1 text-[10px] text-slate-400">
        Created {parseValidDate(request.createdAt)?.toLocaleString() ?? '—'}
      </p>
    </article>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  )
}

function SkeletonRow({ className = '' }) {
  return (
    <div className={`h-4 w-full animate-pulse rounded-full bg-slate-200 ${className}`} />
  )
}

function SkeletonDot() {
  return (
    <span className="inline-flex h-3 w-10 animate-pulse rounded-full bg-slate-200" />
  )
}

export default App
