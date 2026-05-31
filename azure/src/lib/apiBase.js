/**
 * API base URL for fetch/axios.
 * In local dev without VITE_API_URL, use same-origin /api/v1 so Vite can proxy to bloodchain-core.
 */
export function getApiBaseUrl() {
  const env = import.meta.env.VITE_API_URL?.trim()
  if (env) {
    const u = env.replace(/\/$/, '')
    if (u.startsWith('http')) return u
    const protocol = u.includes('localhost') || u.includes('127.0.0.1') ? 'http://' : 'https://'
    return `${protocol}${u}`
  }
  if (import.meta.env.DEV) return '/api/v1'
  return 'http://localhost:4000/api/v1'
}
