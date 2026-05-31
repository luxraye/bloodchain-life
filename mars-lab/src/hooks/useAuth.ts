/**
 * useAuth — Mars Lab
 *
 * Priority order:
 * 1. No Supabase config   → DEMO_MODE: login page shows, "Access Lab Console"
 *                           signs in without credentials, logout returns to login
 * 2. ?guest=1 in URL      → guest demo session
 * 3. VITE_AUTH_BYPASS=true (dev only) → skip auth, use DEV_USER
 * 4. Real Supabase session
 */
import { useState, useEffect } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase'

// ── Synthetic users ────────────────────────────────────────────────────
const DEMO_USER = {
  id: 'demo-mars-001', name: 'Demo Analyst',
  email: 'demo@bloodchain.local', username: 'demo_analyst',
  role: 'LAB', roles: ['LAB'],
}
const DEV_USER = {
  id: 'dev-mars-001', name: 'Dev Lab Tech',
  email: 'dev@bloodchain.local', username: 'dev_lab',
  role: 'LAB', roles: ['LAB'],
}
const GUEST_USER = {
  id: 'guest-mars-001', name: 'Demo Visitor',
  email: 'guest@bloodchain.demo', username: 'demo_guest',
  role: 'LAB', roles: ['LAB'],
}

export type AuthUser = typeof DEMO_USER

function isGuestDemoSession() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('guest') === '1'
}

function parseUser(u: {
  id: string; email?: string
  app_metadata?: Record<string, string>
  user_metadata?: Record<string, string>
} | null): AuthUser | null {
  if (!u) return null
  const role = (u.app_metadata?.role ?? 'PUBLIC').toUpperCase()
  return {
    id: u.id, name: u.user_metadata?.name ?? u.email ?? 'User',
    email: u.email ?? '', username: u.email ?? '',
    role, roles: [role],
  }
}

export function useAuth() {
  const demoMode = !SUPABASE_CONFIGURED
  const guest    = isGuestDemoSession()
  const bypass   = !demoMode && import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true'

  // signedIn tracks whether the user has actively authenticated
  // (even in demo mode we want them to click through the login screen)
  const [signedIn, setSignedIn] = useState(bypass || guest)
  const [user,     setUser]     = useState<AuthUser | null>(
    guest ? GUEST_USER : bypass ? DEV_USER : null,
  )
  const [loading, setLoading]   = useState(!demoMode && !bypass && !guest)

  // Real Supabase session listener
  useEffect(() => {
    if (demoMode || bypass || guest || !supabase) return

    supabase.auth.getSession().then(({ data }) => {
      const parsed = parseUser(data.session?.user ?? null)
      setUser(parsed)
      setSignedIn(!!parsed)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const parsed = parseUser(session?.user ?? null)
      setUser(parsed)
      setSignedIn(!!parsed)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Active user (what components see) ─────────────────────────────
  const activeUser: AuthUser | null = !signedIn
    ? null
    : demoMode
      ? DEMO_USER
      : guest
        ? GUEST_USER
        : bypass
          ? DEV_USER
          : user

  // ── hasRole ────────────────────────────────────────────────────────
  const hasRole = (...check: string[]) =>
    check.some(r => activeUser?.roles?.includes(r.toUpperCase()))

  // ── login ──────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    if (demoMode) {
      setSignedIn(true)
      return { error: null }
    }
    if (!supabase) return { error: new Error('Supabase not configured') }
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (!result.error) setSignedIn(true)
    return result
  }

  // ── logout ─────────────────────────────────────────────────────────
  const logout = async () => {
    setSignedIn(false)
    setUser(null)
    if (guest) {
      const url = new URL(window.location.href)
      url.searchParams.delete('guest')
      window.location.href = url.toString()
      return
    }
    if (demoMode || bypass) return
    await supabase?.auth.signOut()
  }

  return {
    user: activeUser,
    loading,
    roles: activeUser?.roles ?? [],
    hasRole,
    isGuest:    guest,
    isDemoMode: demoMode,
    login,
    logout,
  }
}
