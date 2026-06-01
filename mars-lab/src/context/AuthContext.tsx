/**
 * AuthContext — single source of truth for auth state across Mars Lab.
 */
import {
  createContext, useContext, useState, useEffect,
  type ReactNode,
} from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase'

const DEMO_USER = { id: 'demo-mars-001', name: 'Demo Analyst', email: 'demo@bloodchain.local', username: 'demo_analyst', role: 'LAB', roles: ['LAB'] }
const DEV_USER = { id: 'dev-mars-001', name: 'Dev Lab Tech', email: 'dev@bloodchain.local', username: 'dev_lab', role: 'LAB', roles: ['LAB'] }

export type AuthUser = typeof DEMO_USER

function parseSupaUser(u: {
  id: string; email?: string
  app_metadata?: Record<string, string>
  user_metadata?: Record<string, string>
} | null): AuthUser | null {
  if (!u) return null
  const role = (u.app_metadata?.role ?? 'PUBLIC').toUpperCase()
  return { id: u.id, name: u.user_metadata?.name ?? u.email ?? 'User', email: u.email ?? '', username: u.email ?? '', role, roles: [role] }
}

interface AuthCtx {
  user: AuthUser | null
  loading: boolean
  isDemoMode: boolean
  isGuest: boolean
  roles: string[]
  hasRole: (...r: string[]) => boolean
  login: (email: string, password: string) => Promise<{ error: Error | null }>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const demoMode = !SUPABASE_CONFIGURED
  const bypass = !demoMode && import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true'

  const [signedIn, setSignedIn] = useState(bypass || demoMode)
  const [supaUser, setSupaUser] = useState<AuthUser | null>(bypass ? DEV_USER : demoMode ? DEMO_USER : null)
  const [loading, setLoading] = useState(!demoMode && !bypass)

  useEffect(() => {
    if (demoMode || bypass || !supabase) return

    supabase.auth.getSession().then(({ data }) => {
      const parsed = parseSupaUser(data.session?.user ?? null)
      setSupaUser(parsed)
      setSignedIn(!!parsed)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const parsed = parseSupaUser(session?.user ?? null)
      setSupaUser(parsed)
      setSignedIn(!!parsed)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const user: AuthUser | null = !signedIn
    ? null
    : demoMode
      ? DEMO_USER
      : bypass
        ? DEV_USER
        : supaUser

  const hasRole = (...check: string[]) =>
    check.some(r => user?.roles?.includes(r.toUpperCase()))

  const login = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (demoMode) {
      setSignedIn(true)
      return { error: null }
    }
    if (!supabase) return { error: new Error('Supabase not configured') }
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (!result.error) {
      const parsed = parseSupaUser(result.data.user)
      setSupaUser(parsed)
      setSignedIn(!!parsed)
    }
    return { error: result.error as Error | null }
  }

  const logout = async () => {
    setSignedIn(false)
    setSupaUser(null)
    if (demoMode || bypass) return
    await supabase?.auth.signOut()
  }

  return (
    <Ctx.Provider value={{
      user, loading,
      isDemoMode: demoMode,
      isGuest: false,
      roles: user?.roles ?? [],
      hasRole,
      login,
      logout,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
