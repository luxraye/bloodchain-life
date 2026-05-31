import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True only when both env vars are present and non-empty */
export const SUPABASE_CONFIGURED = !!(supabaseUrl && supabaseAnonKey)

/**
 * Supabase client — null when env vars are absent (dev / no-credential mode).
 * All callers must guard: `if (supabase) { ... }`
 */
export const supabase = SUPABASE_CONFIGURED
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null
