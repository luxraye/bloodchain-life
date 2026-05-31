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

const GUEST_USER = {
  id: 'guest-voyager-001',
  name: DEMO_COORDINATOR.name,
  email: 'guest@bloodchain.demo',
  username: 'demo_guest',
  role: 'LOGISTICS_COMMAND',
  roles: ['LOGISTICS_COMMAND', 'TRANSIT'],
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

  const user = !signedIn ? null : guestMode ? GUEST_USER : demoMode ? DEV_USER : supaUser

  const hasRole = (...check) => {
    if (!signedIn || !user) return false
    if (guestMode) return check.some((r) => GUEST_USER.roles.includes(r.toUpperCase()))
    if (demoMode) return check.some((r) => DEV_USER.roles.includes(r.toUpperCase()))
    return check.some((r) => r.toUpperCase() === user.role)
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
        roles: user?.roles ?? (user ? [user.role] : []),
        hasRole,
        isGuest: guestMode,
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
