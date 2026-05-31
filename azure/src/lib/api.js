import axios from 'axios'
import { supabase } from './supabase.js'

const normalizeUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const protocol = (url.includes('localhost') || url.includes('127.0.0.1')) ? 'http://' : 'https://';
  return protocol + url;
};

const api = axios.create({
  baseURL: normalizeUrl(import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'),
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  console.log('[API Interceptor] Session token:', session?.access_token ? session.access_token.substring(0, 20) + '...' : 'NONE')
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default api
