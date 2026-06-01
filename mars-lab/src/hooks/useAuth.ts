/**
 * useAuth — Mars Lab
 *
 * No Supabase config → local demo login only (development).
 * Production requires Supabase credentials and signed-in staff.
 */
import { useState, useEffect } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase'

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

export type AuthUser = typeof DEMO_USER

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
  const bypass   = !demoMode && import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true'

  const [signedIn, setSignedIn] = useState(bypass || demoMode)
  const [user, setUser] = useState<AuthUser | null>(bypass ? DEV_USER : demoMode ? DEMO_USER : null)
  const [loading, setLoading] = useState(!demoMode && !bypass)

  useEffect(() => {
    if (demoMode || bypass || !supabase) return

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

  const activeUser: AuthUser | null = !signedIn
    ? null
    : demoMode
      ? DEMO_USER
      : bypass
        ? DEV_USER
        : user

  const hasRole = (...check: string[]) =>
    check.some(r => activeUser?.roles?.includes(r.toUpperCase()))

  const login = async (email: string, password: string) => {
    if (demoMode) {
      setSignedIn(true)
      return { error: null }
    }
    if (!supabase) return { error: new Error('Supabase not configured') }
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (!result.error) {
      const parsed = parseUser(result.data.user)
      setUser(parsed)
      setSignedIn(!!parsed)
    }
    return result
  }

  const logout = async () => {
    setSignedIn(false)
    setUser(null)
    if (demoMode || bypass) return
    await supabase?.auth.signOut()
  }

  return {
    user: activeUser,
    loading,
    roles: activeUser?.roles ?? [],
    hasRole,
    isGuest: false,
    isDemoMode: demoMode,
    login,
    logout,
  }
}
