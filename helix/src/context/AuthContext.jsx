import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase.js'

const DEMO_USER = {
  id: 'demo-helix-001',
  name: 'Demo Principal Investigator',
  email: 'demo@bloodchain.local',
  role: 'RESEARCH_PI',
  roles: ['RESEARCH_PI'],
}

const GUEST_USER = {
  id: 'guest-helix-001',
  name: 'Demo Visitor',
  email: 'guest@bloodchain.demo',
  role: 'RESEARCH_PI',
  roles: ['RESEARCH_PI'],
}

const ALLOWED = ['RESEARCH_PI', 'RESEARCH_COORDINATOR', 'RESEARCH', 'ETHICS_READ', 'ADMIN', 'SUPER_ADMIN']

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
  const demoMode = !SUPABASE_CONFIGURED
  const guestMode = isGuest()

  const [signedIn, setSignedIn] = useState(guestMode)
  const [supaUser, setSupaUser] = useState(guestMode ? GUEST_USER : null)
  const [loading, setLoading] = useState(!demoMode && !guestMode)

  useEffect(() => {
    if (demoMode || guestMode || !supabase) return
    supabase.auth.getSession().then(({ data }) => {
      const p = parseUser(data.session?.user ?? null)
      setSupaUser(p)
      setSignedIn(!!p)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const p = parseUser(session?.user ?? null)
      setSupaUser(p)
      setSignedIn(!!p)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line

  const user = !signedIn ? null : demoMode ? DEMO_USER : guestMode ? GUEST_USER : supaUser

  const hasRole = (...check) => {
    const list = check.length ? check : ALLOWED
    return list.some(r => user?.roles?.includes(r.toUpperCase()))
  }

  const isReadOnly = user?.roles?.includes('ETHICS_READ') && !user?.roles?.some(r => ['RESEARCH_PI', 'RESEARCH_COORDINATOR', 'ADMIN', 'SUPER_ADMIN'].includes(r))

  const login = async (email, password) => {
    if (demoMode || guestMode) { setSignedIn(true); return { error: null } }
    if (!supabase) return { error: new Error('Supabase not configured') }
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (!result.error) setSignedIn(true)
    return { error: result.error }
  }

  const logout = async () => {
    setSignedIn(false)
    setSupaUser(null)
    if (!demoMode && !guestMode && supabase) await supabase.auth.signOut()
    if (guestMode) {
      const url = new URL(window.location.href)
      url.searchParams.delete('guest')
      window.location.href = url.toString()
    }
  }

  return (
    <Ctx.Provider value={{ user, loading, isDemoMode: demoMode, isGuest: guestMode, isReadOnly, hasRole, login, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>')
  return ctx
}
