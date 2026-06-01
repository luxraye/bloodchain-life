import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabase.js'

const DEMO_USER = {
  id: 'demo-sentinel-001',
  name: 'Demo Regulatory Reviewer',
  email: 'reviewer@bmra.gov.bw',
  role: 'REGULATOR_REVIEWER',
  roles: ['REGULATOR_REVIEWER', 'REVIEWER'],
}

const ALLOWED = ['REGULATOR_REVIEWER', 'REGULATOR_ADMIN', 'REVIEWER', 'TENANT_ADMIN', 'ADMIN', 'SUPER_ADMIN']

function parseUser(u) {
  if (!u) return null
  const role = (u.app_metadata?.role ?? 'PUBLIC').toUpperCase()
  return { id: u.id, name: u.user_metadata?.name ?? u.email ?? 'User', email: u.email ?? '', role, roles: [role] }
}

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const demoMode = !SUPABASE_CONFIGURED
  const [signedIn, setSignedIn] = useState(demoMode)
  const [supaUser, setSupaUser] = useState(demoMode ? DEMO_USER : null)
  const [loading, setLoading] = useState(!demoMode)

  useEffect(() => {
    if (demoMode || !supabase) return
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

  const user = !signedIn ? null : demoMode ? DEMO_USER : supaUser

  const hasRole = (...check) => {
    const list = check.length ? check : ALLOWED
    return list.some((r) => user?.roles?.includes(r.toUpperCase()) || user?.role === r.toUpperCase())
  }

  const login = async (email, password) => {
    if (demoMode) { setSignedIn(true); return { error: null } }
    if (!supabase) return { error: new Error('Supabase not configured') }
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (!result.error) {
      const p = parseUser(result.data.user)
      setSupaUser(p)
      setSignedIn(!!p)
    }
    return { error: result.error }
  }

  const logout = async () => {
    setSignedIn(false)
    setSupaUser(null)
    if (!demoMode && supabase) await supabase.auth.signOut()
  }

  return (
    <Ctx.Provider value={{ user, loading, isDemoMode: demoMode, isGuest: false, hasRole, login, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
