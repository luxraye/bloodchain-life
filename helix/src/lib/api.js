const BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
    const token = localStorage.getItem('helix_token')
    if (token) headers.Authorization = `Bearer ${token}`
    else headers.Authorization = 'Bearer dev-bypass'
  }
  const res = await fetch(`${BASE}/api/v1${path}`, { ...options, headers })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const researchApi = {
  listStudies: () => request('/research/studies'),
  getStudy: (id) => request(`/research/studies/${id}`),
  exportAudit: (id) => request(`/research/studies/${id}/audit/export`),
}
