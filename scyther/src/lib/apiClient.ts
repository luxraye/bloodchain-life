/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { supabase } from './supabase.js'

const isGuestDemo = () =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('guest') === '1'

const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const protocol = (url.includes('localhost') || url.includes('127.0.0.1')) ? 'http://' : 'https://';
    return protocol + url;
};

const meta = import.meta as any
const apiClient = axios.create({
    baseURL: normalizeUrl(meta.env?.VITE_API_URL || 'http://localhost:4000/api/v1'),
    headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(async (config) => {
    if (isGuestDemo()) {
        throw new Error('Guest demo mode blocks all network requests')
    }
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) throw new Error('Missing active session')
    config.headers.Authorization = `Bearer ${token}`
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await supabase.auth.signOut()
        }
        return Promise.reject(error)
    }
)

export default apiClient
