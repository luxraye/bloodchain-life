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

const GUEST_USER = {
  id: 'guest-azure-001',
  name: 'Demo Visitor',
  email: 'guest@bloodchain.demo',
  username: 'demo_guest',
  role: 'PUBLIC',
  roles: ['PUBLIC'],
}

function isGuestDemoSession() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('guest') === '1'
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
  const guestMode = isGuestDemoSession()
  const demoMode = !SUPABASE_CONFIGURED || bypass
  const [signedIn, setSignedIn] = useState(guestMode)
  const [supaUser, setSupaUser] = useState(null)
  const [loading, setLoading] = useState(!guestMode && !demoMode)

  useEffect(() => {
    if (demoMode || guestMode || !supabase) return

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
  }, [demoMode, guestMode])

  const user = !signedIn ? null : guestMode ? GUEST_USER : demoMode ? DEMO_DONOR : supaUser

  const hasRole = (...check) => {
    if (!signedIn || !user) return false
    return check.some((r) => user.roles.includes(r.toUpperCase()))
  }

  const exitGuestDemo = () => {
    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.delete('guest')
    window.location.href = nextUrl.toString()
  }

  const login = async (email, password) => {
    if (guestMode) return { error: null }
    if (demoMode) {
      setSignedIn(true)
      return { error: null }
    }
    if (!supabase) return { error: new Error('Supabase not configured') }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) setSignedIn(true)
    return { error }
  }

  const loginWithOtp = async (email) => {
    if (demoMode || guestMode) return { error: null }
    if (!supabase) return { error: new Error('Supabase not configured') }
    return supabase.auth.signInWithOtp({ email })
  }

  const logout = async () => {
    if (guestMode) {
      exitGuestDemo()
      return
    }
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
        isGuest: guestMode,
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
