import { SUPABASE_CONFIGURED } from './supabase'

/** True when High Command should use local seed data (dev bypass or no Supabase). */
export function isDemoSession(): boolean {
  if (typeof window === 'undefined') return false
  if (import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true') return true
  if (!SUPABASE_CONFIGURED) return true
  return false
}
