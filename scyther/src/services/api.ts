import apiClient from '../lib/apiClient'

const BASE_STATUS_LABELS: Record<string, string> = {
    COLLECTED: 'Collected',
    TESTING: 'Testing',
    QUARANTINE: 'Quarantine',
    RELEASED: 'Released',
    IN_TRANSIT: 'In Transit',
    USED: 'Used',
    DISCARDED: 'Discarded',
}

// ── Assets ───────────────────────────────────────────

export async function getBloodAssets(status?: string) {
    try {
        const url = status ? `/assets?status=${status}` : '/assets'
        const { data } = await apiClient.get(url)
        return (data.data ?? []).map((a: any) => ({
            ...a,
            statusLabel: BASE_STATUS_LABELS[a.status] ?? a.status,
            shortId: a.id.slice(-10).toUpperCase(),
        }))
    } catch { return [] }
}

export async function getAsset(id: string) {
    try { const { data } = await apiClient.get(`/assets/${id}`); return data.data ?? null } catch { return null }
}

export async function getAssetCustody(id: string) {
    try { const { data } = await apiClient.get(`/assets/${id}/custody`); return data } catch { return null }
}

export async function scanAsset(assetId: string, newStatus: string, location: string, notes?: string) {
    const { data } = await apiClient.post('/assets/scan', { assetId, newStatus, location, notes })
    return data.data
}

export async function createAsset(payload: { donorId: string; bloodType: string; location: string }) {
    const { data } = await apiClient.post('/assets', payload)
    return data.data
}

// ── Profile ──────────────────────────────────────────

export async function getMyProfile() {
    try { const { data } = await apiClient.get('/profile/me'); return data.data ?? null } catch { return null }
}

export async function updateMyProfile(payload: { name?: string; bloodType?: string; facilityId?: string }) {
    const { data } = await apiClient.patch('/profile/me', payload); return data.data
}

// ── Admin Users (for listing donors to attach assets) ─

export async function getUsers(role?: string) {
    try {
        const url = role ? `/admin/users?role=${role}` : '/admin/users'
        const { data } = await apiClient.get(url)
        return data.users ?? []
    } catch { return [] }
}
