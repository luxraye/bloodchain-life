import apiClient from '../lib/api'
import { isDemoSession } from '../lib/isDemoSession'

const DEMO_PROFILE = {
    id: 'guest-mars-001',
    name: 'Demo Lab Tech',
    email: 'guest@bloodchain.demo',
    role: 'LAB',
    status: 'ACTIVE',
    facilityId: 'NBTS Gaborone',
    createdAt: new Date().toISOString(),
}

const STATUS_LABELS: Record<string, string> = {
    COLLECTED: 'Collected', TESTING: 'Testing', QUARANTINE: 'Quarantine',
    RELEASED: 'Released', IN_TRANSIT: 'In Transit', USED: 'Used', DISCARDED: 'Discarded',
}

// ── Assets ───────────────────────────────────────────

export async function getBloodAssets(status?: string) {
    if (isDemoSession()) return []
    try {
        const url = status ? `/assets?status=${status}` : '/assets'
        const { data } = await apiClient.get(url)
        return (data.data ?? []).map((a: any) => ({ ...a, statusLabel: STATUS_LABELS[a.status] ?? a.status, shortId: a.id.slice(-10).toUpperCase() }))
    } catch { return [] }
}

export async function getAsset(id: string) {
    if (isDemoSession()) return null
    try { const { data } = await apiClient.get(`/assets/${id}`); return data.data ?? null } catch { return null }
}

export async function getAssetCustody(id: string) {
    if (isDemoSession()) return { id, events: [] }
    try { const { data } = await apiClient.get(`/assets/${id}/custody`); return data } catch { return null }
}

export async function scanAsset(assetId: string, newStatus: string, location: string, notes?: string) {
    if (isDemoSession()) return { id: assetId, status: newStatus, currentLocation: location, notes }
    const { data } = await apiClient.post('/assets/scan', { assetId, newStatus, location, notes })
    return data.data
}

export async function createAsset(payload: { donorId: string; bloodType: string; location: string }) {
    if (isDemoSession()) {
        return { id: `demo-asset-${Date.now()}`, ...payload, status: 'INCOMING', createdAt: new Date().toISOString() }
    }
    const { data } = await apiClient.post('/assets', payload)
    return data.data
}

// ── Profile ───────────────────────────────────────────

export async function getMyProfile() {
    if (isDemoSession()) {
        try {
            return JSON.parse(sessionStorage.getItem('mars_guest_profile') || 'null') ?? DEMO_PROFILE
        } catch {
            return DEMO_PROFILE
        }
    }
    try { const { data } = await apiClient.get('/profile/me'); return data.data ?? null } catch { return null }
}

export async function updateMyProfile(payload: { name?: string; bloodType?: string; facilityId?: string }) {
    if (isDemoSession()) {
        const updated = { ...(await getMyProfile()), ...payload }
        sessionStorage.setItem('mars_guest_profile', JSON.stringify(updated))
        return updated
    }
    const { data } = await apiClient.patch('/profile/me', payload); return data.data
}
