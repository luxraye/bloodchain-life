import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase.js'

const DEMO_DONOR = {
  id: 'demo-azure-donor-001',
  name: 'Lesego Kgosidintsi',
  email: 'demo.donor@bloodchain.demo',
  username: 'demo_donor',
  role: 'PUBLIC',
  roles: ['PUBLIC'],
  phone: '71234567',
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
    phone: supaUser.phone ?? supaUser.user_metadata?.phone,
  }
}

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const bypass = import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true'
  const demoMode = !SUPABASE_CONFIGURED || bypass
  const [signedIn, setSignedIn] = useState(demoMode)
  const [supaUser, setSupaUser] = useState(demoMode ? DEMO_DONOR : null)
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

  const user = !signedIn ? null : demoMode ? DEMO_DONOR : supaUser

  const hasRole = (...check) => {
    if (!signedIn || !user) return false
    return check.some((r) => user.roles.includes(r.toUpperCase()))
  }

  const login = async (email, password) => {
    if (demoMode) {
      setSignedIn(true)
      return { error: null }
    }
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      const { data } = await supabase.auth.getUser()
      setSupaUser(parseUser(data.user))
      setSignedIn(true)
    }
    return { error }
  }

  const loginWithOtp = async (email) => {
    if (demoMode) return { error: null }
    if (!supabase) return { error: new Error('Supabase not configured') }
    return supabase.auth.signInWithOtp({ email })
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
        hasRole,
        isGuest: false,
        isDemoMode: demoMode,
        login,
        loginWithOtp,
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
