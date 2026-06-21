import { SUPABASE_CONFIGURED } from './supabase.js'

/** Local-only demo data when Supabase is not configured (development). */
export function isDemoSession() {
  if (typeof window === 'undefined') return false
  if (import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true') return true
  if (!SUPABASE_CONFIGURED) return true
  return false
}

/**
 * Whether collection writes (e.g. finalize unit) should stay local for briefing demos.
 * True when: guest/demo auth, BLB community-drive seed is active, or pilot flag is set.
 */
export function shouldSimulateCollectionWrite({ drive } = {}) {
  if (isDemoSession()) return true
  if (drive) return true
  if (import.meta.env.VITE_PILOT_DEMO === 'true') return true
  return false
}
