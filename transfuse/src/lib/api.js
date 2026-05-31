import { supabase, SUPABASE_CONFIGURED } from './supabase.js'

// Demo blood units for no-backend mode
const DEMO_UNITS = [
  { id: 'TF-2026-0041', donorId: 'D-7812', bloodType: 'O+',  type: 'O+',  status: 'AVAILABLE', currentLocation: 'Blood Bank Ward 3', createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),  expiresAt: new Date(Date.now() + 32 * 86400000).toISOString() },
  { id: 'TF-2026-0039', donorId: 'D-7809', bloodType: 'A-',  type: 'A-',  status: 'AVAILABLE', currentLocation: 'Blood Bank Ward 3', createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),  expiresAt: new Date(Date.now() + 3  * 86400000).toISOString() },
  { id: 'TF-2026-0038', donorId: 'D-7805', bloodType: 'B+',  type: 'B+',  status: 'QUARANTINE', currentLocation: 'Lab Hold',          createdAt: new Date(Date.now() - 7 * 3600000).toISOString(),  expiresAt: new Date(Date.now() + 28 * 86400000).toISOString() },
  { id: 'TF-2026-0037', donorId: 'D-7801', bloodType: 'AB+', type: 'AB+', status: 'AVAILABLE', currentLocation: 'Blood Bank Ward 3', createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),  expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() },
  { id: 'TF-2026-0036', donorId: 'D-7798', bloodType: 'O-',  type: 'O-',  status: 'AVAILABLE', currentLocation: 'Emergency Reserve', createdAt: new Date(Date.now() - 10 * 3600000).toISOString(), expiresAt: new Date(Date.now() + 31 * 86400000).toISOString() },
  { id: 'TF-2026-0035', donorId: 'D-7794', bloodType: 'A+',  type: 'A+',  status: 'AVAILABLE', currentLocation: 'Blood Bank Ward 3', createdAt: new Date(Date.now() - 12 * 3600000).toISOString(), expiresAt: new Date(Date.now() + 5  * 86400000).toISOString() },
  { id: 'TF-2026-0034', donorId: 'D-7790', bloodType: 'B-',  type: 'B-',  status: 'USED',      currentLocation: 'Ward 7',            createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), expiresAt: new Date(Date.now() + 29 * 86400000).toISOString() },
  { id: 'TF-2026-0033', donorId: 'D-7785', bloodType: 'O+',  type: 'O+',  status: 'AVAILABLE', currentLocation: 'Blood Bank Ward 3', createdAt: new Date(Date.now() - 16 * 3600000).toISOString(), expiresAt: new Date(Date.now() + 27 * 86400000).toISOString() },
]

const BASE = (() => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'
  if (url.startsWith('http')) return url
  const proto = url.includes('localhost') ? 'http://' : 'https://'
  return proto + url
})()

async function getToken() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function authFetch(path, options = {}) {
  const token = await getToken()
  if (!token) throw new Error('Authentication required')
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers ?? {}) },
  })
  if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.error || `API error ${res.status}`) }
  return res.json()
}

export async function getAssets() {
  if (!SUPABASE_CONFIGURED) return { data: DEMO_UNITS }
  try {
    const json = await authFetch('/assets')
    return { data: (json.data ?? []).map(a => ({ ...a, type: a.bloodType, expiresAt: a.expiresAt || new Date(Date.parse(a.createdAt) + 35 * 86400000).toISOString() })) }
  } catch { return { data: DEMO_UNITS } }
}

export async function getActivityLog() {
  if (!SUPABASE_CONFIGURED) return { data: [] }
  try { const json = await authFetch('/activity/shift-sync'); return { data: json.data ?? [] } }
  catch { return { data: [] } }
}
