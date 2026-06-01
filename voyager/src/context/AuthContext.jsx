import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase.js'
import { DEMO_COORDINATOR } from '../data/seedVoyager.js'

const DEV_USER = {
  id: 'dev-voyager-001',
  name: DEMO_COORDINATOR.name,
  email: DEMO_COORDINATOR.email,
  username: 'dev_coordinator',
  role: 'LOGISTICS_COMMAND',
  roles: ['LOGISTICS_COMMAND'],
}

function parseUser(supaUser) {
  if (!supaUser) return null
  const role = (supaUser.app_metadata?.role ?? 'PUBLIC').toUpperCase()
  return {
    id: supaUser.id,
    name: supaUser.user_metadata?.name ?? supaUser.email,
    email: supaUser.email,
    username: supaUser.email,
    role,
    roles: [role],
  }
}

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const bypass = import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true'
  const demoMode = !SUPABASE_CONFIGURED || bypass
  const [signedIn, setSignedIn] = useState(demoMode)
  const [supaUser, setSupaUser] = useState(demoMode ? DEV_USER : null)
  const [loading, setLoading] = useState(!demoMode)

  useEffect(() => {
    if (demoMode || !supabase) return

    supabase.auth.getSession().then(({ data }) => {
      const parsed = parseUser(data.session?.user ?? null)
      setSupaUser(parsed)
      setSignedIn(!!parsed)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const parsed = parseUser(session?.user ?? null)
      setSupaUser(parsed)
      setSignedIn(!!parsed)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [demoMode])

  const user = !signedIn ? null : demoMode ? DEV_USER : supaUser

  const hasRole = (...check) => {
    if (!signedIn || !user) return false
    if (demoMode) return check.some((r) => DEV_USER.roles.includes(r.toUpperCase()))
    return check.some((r) => r.toUpperCase() === user.role)
  }

  const login = async (email, password) => {
    if (demoMode) {
      setSignedIn(true)
      return { error: null }
    }
    if (!supabase) return { error: new Error('Supabase not configured') }
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (!result.error) {
      const parsed = parseUser(result.data.user)
      setSupaUser(parsed)
      setSignedIn(!!parsed)
    }
    return { error: result.error }
  }

  const logout = async () => {
    setSignedIn(false)
    setSupaUser(null)
    if (!demoMode && supabase) await supabase.auth.signOut()
  }

  return (
    <AuthCtx.Provider
      value={{
        user,
        loading,
        roles: user?.roles ?? (user ? [user.role] : []),
        hasRole,
        isGuest: false,
        isDemoMode: demoMode,
        login,
        logout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
