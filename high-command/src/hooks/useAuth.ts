/**
 * useAuth — High Command (ADMIN access only)
 * Supabase-powered. Preserves VITE_AUTH_BYPASS for local dev only.
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
  const demoMode = !SUPABASE_CONFIGURED || bypass
  const [user, setUser] = useState<AuthUser | null>(demoMode ? DEV_USER : null)
  const [loading, setLoading] = useState(!demoMode)

  useEffect(() => {
    if (demoMode || !supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setUser(parseUser(data.session?.user ?? null))
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(parseUser(session?.user ?? null))
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [demoMode])

  const hasRole = (...check: string[]) =>
    demoMode
      ? check.some(r => DEV_USER.roles.includes(r.toUpperCase()))
      : check.some(r => r.toUpperCase() === user?.role)

  return {
    user: demoMode ? DEV_USER : user,
    loading,
    roles: demoMode ? DEV_USER.roles : (user ? [user.role] : []),
    hasRole,
    isGuest: false,
    isDemoMode: demoMode,
    login: async (email: string, password: string) => {
      if (demoMode) return { error: null }
      if (!supabase) return { error: new Error('Supabase not configured') }
      const result = await supabase.auth.signInWithPassword({ email, password })
      if (!result.error) setUser(parseUser(result.data.user))
      return { error: result.error }
    },
    logout: () => supabase?.auth.signOut() ?? Promise.resolve(),
  }
}
