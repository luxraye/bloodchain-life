import apiClient from '../lib/api.js'

const isGuestDemo = () =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('guest') === '1'

const DEMO_PROFILE = {
    id: 'guest-voyager-001',
    name: 'Demo Courier',
    email: 'guest@bloodchain.demo',
    role: 'TRANSIT',
    status: 'ACTIVE',
    facilityId: 'NBTS Gaborone Depot',
    createdAt: new Date().toISOString(),
}

const STATUS_LABELS = {
    COLLECTED: 'Collected', TESTING: 'Testing', QUARANTINE: 'Quarantine',
    RELEASED: 'Released', IN_TRANSIT: 'In Transit', USED: 'Used', DISCARDED: 'Discarded',
}

// ── Assets ───────────────────────────────────────────

export async function getBloodAssets(status) {
    if (isGuestDemo()) return []
    try {
        const url = status ? `/assets?status=${status}` : '/assets'
        const { data } = await apiClient.get(url)
        return (data.data ?? []).map(a => ({ ...a, statusLabel: STATUS_LABELS[a.status] ?? a.status, shortId: a.id.slice(-10).toUpperCase() }))
    } catch { return [] }
}

export async function getAsset(id) {
    if (isGuestDemo()) return null
    try { const { data } = await apiClient.get(`/assets/${id}`); return data.data ?? null } catch { return null }
}

export async function getAssetCustody(id) {
    if (isGuestDemo()) return { id, events: [] }
    try { const { data } = await apiClient.get(`/assets/${id}/custody`); return data } catch { return null }
}

export async function scanAsset(assetId, newStatus, location, notes) {
    if (isGuestDemo()) return { id: assetId, status: newStatus, currentLocation: location, notes }
    const { data } = await apiClient.post('/assets/scan', { assetId, newStatus, location, notes })
    return data.data
}

// ── Profile ───────────────────────────────────────────

export async function getMyProfile() {
    if (isGuestDemo()) {
        try {
            return JSON.parse(sessionStorage.getItem('voyager_guest_profile') || 'null') ?? DEMO_PROFILE
        } catch {
            return DEMO_PROFILE
        }
    }
    try { const { data } = await apiClient.get('/profile/me'); return data.data ?? null } catch { return null }
}

export async function updateMyProfile(payload) {
    if (isGuestDemo()) {
        const updated = { ...(await getMyProfile()), ...payload }
        sessionStorage.setItem('voyager_guest_profile', JSON.stringify(updated))
        return updated
    }
    const { data } = await apiClient.patch('/profile/me', payload); return data.data
}
