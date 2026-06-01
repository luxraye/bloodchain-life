import { SUPABASE_CONFIGURED } from './supabase'

/** Local-only demo data when Supabase is not configured (development). */
export function isDemoSession(): boolean {
  if (typeof window === 'undefined') return false
  if (import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true') return true
  if (!SUPABASE_CONFIGURED) return true
  return false
}
