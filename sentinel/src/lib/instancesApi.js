const BASE = (import.meta.env.VITE_INSTANCES_API_URL || '').replace(/\/$/, '')
const API_KEY = import.meta.env.VITE_INSTANCES_API_KEY || ''

export function instancesApiConfigured() {
  return Boolean(BASE && API_KEY)
}

function authHeaders() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  }
}

async function parseError(res) {
  const body = await res.json().catch(() => ({}))
  return body.error || body.message || res.statusText || `HTTP ${res.status}`
}

export async function listInstances(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') qs.set(k, String(v))
  })
  const url = `${BASE}/api/v1/instances${qs.toString() ? `?${qs}` : ''}`
  const res = await fetch(url, { headers: authHeaders() })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function getInstance(id) {
  const res = await fetch(`${BASE}/api/v1/instances/${id}`, { headers: authHeaders() })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function reviewInstance(id, { status, reviewNotes }) {
  const res = await fetch(`${BASE}/api/v1/instances/${id}/review`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ status, reviewNotes }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export function instancesAdminUrl() {
  return import.meta.env.VITE_INSTANCES_ADMIN_URL || BASE || 'http://localhost:3000'
}
