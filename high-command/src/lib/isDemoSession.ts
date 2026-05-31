import { SUPABASE_CONFIGURED } from './supabase'

/** True when High Command should use local seed data (guest URL, auth bypass, or no Supabase). */
export function isDemoSession(): boolean {
  if (typeof window === 'undefined') return false
  if (new URLSearchParams(window.location.search).get('guest') === '1') return true
  if (import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true') return true
  if (!SUPABASE_CONFIGURED) return true
  return false
}
