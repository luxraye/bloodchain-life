const BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
    headers.Authorization = 'Bearer dev-bypass'
  }
  const res = await fetch(`${BASE}/api/v1${path}`, { ...options, headers })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const chronicRegistryApi = {
  listPatients: () => request('/chronic-registry/patients'),
  getPatient: (id) => request(`/chronic-registry/patients/${id}`),
  listExceptions: () => request('/chronic-registry/exceptions'),
  patchException: (id, body) => request(`/chronic-registry/exceptions/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
}

export async function patchExceptionIfApi(useApi, id, body, localUpdater) {
  if (useApi && import.meta.env.VITE_API_URL) {
    const res = await chronicRegistryApi.patchException(id, body)
    return res?.data
  }
  localUpdater()
  return null
}
