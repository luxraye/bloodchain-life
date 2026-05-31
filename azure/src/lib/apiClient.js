import axios from 'axios'
import { supabase } from './supabase.js'
import { getApiBaseUrl } from './apiBase.js'

import { isDemoSession } from './isDemoSession.js'

const apiClient = axios.create({
    baseURL: getApiBaseUrl(),
    headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(async (config) => {
    if (isDemoSession()) {
        throw new Error('Guest demo mode blocks all network requests')
    }

    const isBypass = import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true'

    if (isBypass) {
        config.headers.Authorization = 'Bearer dev-bypass'
    } else {
        if (!supabase) throw new Error('Supabase not configured')
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`
        } else {
            throw new Error('Missing active session')
        }
    }

    return config
}, (error) => Promise.reject(error))

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // If a 401 comes back and we're not in bypass mode, the session is gone —
        // Supabase will handle the redirect via onAuthStateChange in useAuth.
        if (!isDemoSession() && supabase && error.response?.status === 401 && !(import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === 'true')) {
            supabase.auth.signOut()
        }
        return Promise.reject(error)
    }
)

export default apiClient
