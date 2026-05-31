import axios from 'axios'
import { supabase } from './supabase'

const isGuestDemo = () =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('guest') === '1'

const normalizeUrl = (url: string) => {
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
  if (isGuestDemo()) {
    throw new Error('Guest demo mode blocks all network requests')
  }
  if (!supabase) throw new Error('Supabase not configured')
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) throw new Error('Missing active session')
  config.headers.Authorization = `Bearer ${session.access_token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!isGuestDemo() && supabase && error.response?.status === 401) {
      await supabase.auth.signOut()
    }
    return Promise.reject(error)
  }
)

export default api
