/**
 * Scyther AuthContext — shared auth state across all components.
 * Same pattern as mars-lab and transfuse.
 */
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase.js'

const DEMO_USER  = { id: 'demo-scyther-001', name: 'Demo Collector', email: 'demo@bloodchain.local', role: 'COLLECTION', roles: ['COLLECTION'] }
const GUEST_USER = { id: 'guest-scyther-001', name: 'Demo Visitor',   email: 'guest@bloodchain.demo', role: 'COLLECTION', roles: ['COLLECTION'] }

function isGuest() {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('guest') === '1'
}

function parseUser(u) {
  if (!u) return null
  const role = (u.app_metadata?.role ?? 'PUBLIC').toUpperCase()
  return { id: u.id, name: u.user_metadata?.name ?? u.email ?? 'User', email: u.email ?? '', role, roles: [role] }
}

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const demoMode  = !SUPABASE_CONFIGURED
  const guestMode = isGuest()

  const [signedIn, setSignedIn] = useState(guestMode)
  const [supaUser, setSupaUser] = useState(guestMode ? GUEST_USER : null)
  const [loading,  setLoading]  = useState(!demoMode && !guestMode)

  useEffect(() => {
    if (demoMode || guestMode || !supabase) return
    supabase.auth.getSession().then(({ data }) => {
      const p = parseUser(data.session?.user ?? null)
      setSupaUser(p); setSignedIn(!!p); setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const p = parseUser(session?.user ?? null)
      setSupaUser(p); setSignedIn(!!p); setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line

  const user = !signedIn ? null : demoMode ? DEMO_USER : guestMode ? GUEST_USER : supaUser

  const hasRole = (...check) => check.some(r => user?.roles?.includes(r.toUpperCase()))

  const login = async (email, password) => {
    if (demoMode) { setSignedIn(true); return { error: null } }
    if (!supabase) return { error: new Error('Supabase not configured') }
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (!result.error) setSignedIn(true)
    return { error: result.error }
  }

  const logout = async () => {
    setSignedIn(false); setSupaUser(null)
    if (!demoMode && !guestMode && supabase) await supabase.auth.signOut()
    if (guestMode) {
      const url = new URL(window.location.href)
      url.searchParams.delete('guest')
      window.location.href = url.toString()
    }
  }

  return (
    <Ctx.Provider value={{ user, loading, isDemoMode: demoMode, isGuest: guestMode, roles: user?.roles ?? [], hasRole, login, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>')
  return ctx
}
