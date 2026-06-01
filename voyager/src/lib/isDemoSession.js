import { SUPABASE_CONFIGURED } from './supabase.js'

/** True when Voyager should use local seed data. */
export function isDemoSession() {
  if (typeof window === 'undefined') return false
  if (import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true') return true
  if (!SUPABASE_CONFIGURED) return true
  return false
}
