/**
 * useAuth — High Command (ADMIN access only)
 * Supabase-powered. Preserves VITE_AUTH_BYPASS for demo mode.
 */
import { useState, useEffect } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase'

export interface AuthUser {
  id: string
  name: string
  email: string
  username: string
  role: string
  roles: string[]
}

const DEV_USER: AuthUser = {
  id: 'dev-hc-001',
  name: 'Dev Admin',
  email: 'dev@bloodchain.local',
  username: 'dev_admin',
  role: 'ADMIN',
  roles: ['ADMIN'],
}

const GUEST_USER: AuthUser = {
  id: 'guest-hc-001',
  name: 'Demo Visitor',
  email: 'guest@bloodchain.demo',
  username: 'demo_guest',
  role: 'ADMIN',
  roles: ['ADMIN'],
}

function isGuestDemoSession() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('guest') === '1'
}

function parseUser(supaUser: { id: string; email?: string; app_metadata?: Record<string, string>; user_metadata?: Record<string, string> } | null): AuthUser | null {
  if (!supaUser) return null
  const role = (supaUser.app_metadata?.role ?? 'PUBLIC').toUpperCase()
  return {
    id: supaUser.id,
    name: supaUser.user_metadata?.name ?? supaUser.email ?? 'User',
    email: supaUser.email ?? '',
    username: supaUser.email ?? '',
    role,
    roles: [role],
  }
}

export function useAuth() {
  const bypass = import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true'
  const guest = isGuestDemoSession()
  const demoMode = !SUPABASE_CONFIGURED || bypass
  const fallbackUser = guest ? GUEST_USER : demoMode ? DEV_USER : null
  const [user, setUser] = useState<AuthUser | null>(fallbackUser)
  const [loading, setLoading] = useState(!(demoMode || guest))

  useEffect(() => {
    if (demoMode || guest || !supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setUser(parseUser(data.session?.user ?? null))
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(parseUser(session?.user ?? null))
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [demoMode, guest])

  const hasRole = (...check: string[]) =>
    guest
      ? check.some(r => GUEST_USER.roles.includes(r.toUpperCase()))
      : demoMode
      ? check.some(r => DEV_USER.roles.includes(r.toUpperCase()))
      : check.some(r => r.toUpperCase() === user?.role)

  const exitGuestDemo = () => {
    if (typeof window === 'undefined') return
    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.delete('guest')
    window.location.href = nextUrl.toString()
  }

  return {
    user: guest ? GUEST_USER : demoMode ? DEV_USER : user,
    loading,
    roles: guest ? GUEST_USER.roles : demoMode ? DEV_USER.roles : (user ? [user.role] : []),
    hasRole,
    isGuest: guest,
    isDemoMode: demoMode,
    login: async (email: string, password: string) => {
      if (demoMode || guest) return { error: null }
      if (!supabase) return { error: new Error('Supabase not configured') }
      return supabase.auth.signInWithPassword({ email, password })
    },
    logout: () => guest ? Promise.resolve(exitGuestDemo()) : supabase?.auth.signOut() ?? Promise.resolve(),
  }
}
