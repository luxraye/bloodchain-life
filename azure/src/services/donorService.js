import apiClient from '../lib/apiClient.js'
import { getApiBaseUrl } from '../lib/apiBase.js'
import { DONOR_VERIFICATIONS_BUCKET, VERIFICATION_DOC_SIGNED_URL_SECONDS } from '../lib/storage.js'
import { supabase } from '../lib/supabase.js'

import { isDemoSession } from '../lib/isDemoSession.js'

const DEMO_PROFILE = {
    id: 'guest-azure-001',
    name: 'Demo Visitor',
    email: 'guest@bloodchain.demo',
    phone: '71234567',
    bloodType: 'O+',
    age: 27,
    gender: 'Female',
    region: 'Gaborone',
    medicalConditions: 'None',
    trustLevel: 2,
    status: 'ELIGIBLE',
    nextEligibleDate: null,
    badges: ['early_adopter'],
    healthStats: {
        iron: [12.8, 13.1, 12.9, 13.4],
        pulse: [72, 74, 70, 73],
        bp: ['118/74', '120/76', '117/73', '121/77'],
        dates: ['Jan', 'Feb', 'Mar', 'Apr'],
    },
}

const DEMO_DONATIONS = [
    {
        id: 'don-001',
        bloodUnitId: 'BC-AZ-240401',
        collectionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
        status: 'USED',
        statusLabel: 'Issued to hospital',
    },
    {
        id: 'don-002',
        bloodUnitId: 'BC-AZ-231220',
        collectionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
        status: 'RELEASED',
        statusLabel: 'Released from screening',
    },
]

const DEMO_REQUESTS = [
    {
        id: 'req-001',
        patientName: 'Neo Pheto',
        hospitalName: 'Princess Marina Hospital',
        bloodTypeNeeded: 'O-',
        urgencyLevel: 'CRITICAL',
        status: 'PENDING_VERIFICATION',
        createdAt: new Date().toISOString(),
    },
]

const DEMO_STOCK = {
    message: 'Demo mode: national stock is healthy in most regions, with urgent pressure on O- and platelets.',
}

const DEMO_CENTERS = [
    { id: 'ctr-001', name: 'Gaborone Blood Centre', county: 'Gaborone', distanceKm: 4.2, etaMinutes: 12, status: 'OPEN' },
    { id: 'ctr-002', name: 'Princess Marina Hospital', county: 'Gaborone', distanceKm: 7.4, etaMinutes: 18, status: 'OPEN' },
]

const DEMO_SLOTS = [
    { id: 'slot-001', date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), window: '09:00 - 09:30', centerName: 'Gaborone Blood Centre', capacityRemaining: 3, bookedAt: null },
    { id: 'slot-002', date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(), window: '11:00 - 11:30', centerName: 'Princess Marina Hospital', capacityRemaining: 5, bookedAt: null },
]

const DEMO_EDUCATION = {
    tips: [
        { id: 'tip-1', title: 'Hydrate before you donate', body: 'Drink extra water in the hours before you visit a collection point.' },
        { id: 'tip-2', title: 'Eat iron-rich meals', body: 'Balanced meals help maintain healthy haemoglobin levels between donations.' },
    ],
    articles: [
        { id: 'art-1', title: 'Why blood donation matters', source: 'WHO', url: 'https://www.who.int' },
        { id: 'art-2', title: 'How often can I donate?', source: 'WHO', url: 'https://www.who.int' },
    ],
}

const DEMO_NEARBY_REQUESTS = [
    {
        id: 'nearby-001',
        patientName: 'Mpho T.',
        hospitalName: 'Bokamoso Hospital',
        bloodTypeNeeded: 'A+',
        urgencyLevel: 'CRITICAL',
        createdAt: new Date().toISOString(),
        distanceKm: 14.5,
        displayResponders: 2,
        myResponse: false,
    },
]

function readGuestState() {
    if (typeof window === 'undefined') return {}
    try {
        return JSON.parse(sessionStorage.getItem('azure_guest_demo_state') || '{}')
    } catch {
        return {}
    }
}

function writeGuestState(nextState) {
    if (typeof window === 'undefined') return
    sessionStorage.setItem('azure_guest_demo_state', JSON.stringify(nextState))
}

// ── Profile ──────────────────────────────────────────
export async function getMyProfile() {
    if (isDemoSession()) {
        return readGuestState().profile ?? DEMO_PROFILE
    }
    try { const { data } = await apiClient.get('/profile/me'); return data.data ?? null } catch { return null }
}
export async function updateMyProfile(payload) {
    if (isDemoSession()) {
        const current = readGuestState()
        const profile = { ...(current.profile ?? DEMO_PROFILE), ...payload }
        writeGuestState({ ...current, profile })
        return profile
    }
    const { data } = await apiClient.patch('/profile/me', payload); return data.data
}

// ── Registration (public — no token needed) ──────────
export async function registerDonor({ email, password, name, bloodType, accepted_terms_at }) {
    if (isDemoSession()) {
        const current = readGuestState()
        const profile = {
            ...(current.profile ?? DEMO_PROFILE),
            email,
            name,
            bloodType: bloodType ?? DEMO_PROFILE.bloodType,
            accepted_terms_at,
        }
        writeGuestState({ ...current, profile })
        return profile
    }
    const url = `${getApiBaseUrl()}/register`
    let res
    try {
        res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, bloodType, accepted_terms_at }),
        })
    } catch (e) {
        const msg = e?.message || ''
        if (msg === 'Failed to fetch' || e?.name === 'TypeError') {
            throw new Error(
                'Cannot reach the API. From the repo root, start bloodchain-core (e.g. cd bloodchain-core && yarn dev) so it listens on port 4000, then try again.'
            )
        }
        throw e
    }
    const text = await res.text()
    let json = {}
    try {
        json = text ? JSON.parse(text) : {}
    } catch {
        /* non-JSON error body */
    }
    if (!res.ok) {
        if (res.status === 502 || res.status === 503) {
            throw new Error(
                'The API is not responding. Start bloodchain-core on port 4000 (yarn dev in bloodchain-core), then retry.'
            )
        }
        throw new Error(json.error || `Registration failed (${res.status})`)
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) throw new Error(signInError.message)
    return json.data
}

// ── Document Upload (Level 1 → 2) ────────────────────
export async function uploadVerificationDoc(file) {
    if (isDemoSession()) {
        return `demo://verification/${encodeURIComponent(file.name)}`
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const ext = file.name.split('.').pop()
    const path = `${user.id}/omang.${ext}`
    const { error } = await supabase.storage
        .from(DONOR_VERIFICATIONS_BUCKET)
        .upload(path, file, { upsert: true })
    if (error) throw new Error(error.message)
    const { data: signed, error: signError } = await supabase.storage
        .from(DONOR_VERIFICATIONS_BUCKET)
        .createSignedUrl(path, VERIFICATION_DOC_SIGNED_URL_SECONDS)
    if (signError) throw new Error(signError.message)
    return signed.signedUrl
}

export async function submitForVerification(docUrl) {
    if (isDemoSession()) {
        const current = readGuestState()
        const profile = { ...(current.profile ?? DEMO_PROFILE), trustLevel: 2, verificationDocUrl: docUrl }
        writeGuestState({ ...current, profile })
        return profile
    }
    const { data } = await apiClient.patch('/profile/me', { trustLevel: 2, verificationDocUrl: docUrl })
    return data.data
}

// ── Donation history ─────────────────────────────────
export async function getDonationHistory() {
    if (isDemoSession()) return readGuestState().donations ?? DEMO_DONATIONS
    try { const { data } = await apiClient.get('/assets/my-donations'); return data.data ?? [] } catch { return [] }
}

export async function getDonationJourney() {
    if (isDemoSession()) {
        return [
            { id: 'j-1', label: 'Donation captured', description: 'Your unit was registered at Gaborone Blood Centre.', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 88).toISOString(), status: 'DEFAULT', meta: { location: 'Gaborone Blood Centre' } },
            { id: 'j-2', label: 'Screened and cleared', description: 'Laboratory testing marked the unit safe for release.', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 86).toISOString(), status: 'HIGHLIGHT', meta: { facility: 'Mars Lab' } },
            { id: 'j-3', label: 'Issued to hospital', description: 'The blood unit was delivered for patient care.', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 84).toISOString(), status: 'DEFAULT', meta: { ward: 'Trauma Ward' } },
        ]
    }
    throw new Error('Donation journey endpoint is not implemented yet')
}

// ── Blood unit custody (read-only for donors) ────────
export async function getAssetCustody(assetId) {
    if (isDemoSession()) return { id: assetId, events: [] }
    try { const { data } = await apiClient.get(`/assets/${assetId}/custody`); return data } catch { return null }
}

export async function getNationalStockLevels() {
    if (isDemoSession()) return DEMO_STOCK
    const { data } = await apiClient.get('/admin/stats')
    return data?.data ?? data ?? null
}
export async function getDonationCenters() { if (isDemoSession()) return DEMO_CENTERS; throw new Error('Donation centers endpoint is not implemented yet') }
export async function getScheduleSlots() { if (isDemoSession()) return readGuestState().slots ?? DEMO_SLOTS; throw new Error('Schedule slots endpoint is not implemented yet') }
export async function bookScheduleSlot(slotId) {
    if (isDemoSession()) {
        const current = readGuestState()
        const slots = (current.slots ?? DEMO_SLOTS).map((slot) =>
            slot.id === slotId ? { ...slot, bookedAt: new Date().toISOString() } : slot
        )
        writeGuestState({ ...current, slots })
        return slots.find((slot) => slot.id === slotId) ?? null
    }
    throw new Error('Schedule booking endpoint is not implemented yet')
}
export async function getDonationEducation() { if (isDemoSession()) return DEMO_EDUCATION; throw new Error('Donation education endpoint is not implemented yet') }
export async function getNearbyRequests() { if (isDemoSession()) return readGuestState().nearbyRequests ?? DEMO_NEARBY_REQUESTS; throw new Error('Nearby requests endpoint is not implemented yet') }
export async function respondToNearbyRequest(requestId, action = 'PLEDGE') {
    if (isDemoSession()) {
        const current = readGuestState()
        const nearbyRequests = (current.nearbyRequests ?? DEMO_NEARBY_REQUESTS).map((req) =>
            req.id === requestId
                ? { ...req, myResponse: action === 'PLEDGE', displayResponders: action === 'PLEDGE' ? req.displayResponders + 1 : Math.max(0, req.displayResponders - 1) }
                : req
        )
        writeGuestState({ ...current, nearbyRequests })
        return nearbyRequests
    }
    throw new Error('Nearby request response endpoint is not implemented yet')
}
export async function getRequests() { if (isDemoSession()) return readGuestState().requests ?? DEMO_REQUESTS; throw new Error('Requests endpoint is not implemented yet') }
export async function createRequest(payload) {
    if (isDemoSession()) {
        const current = readGuestState()
        const nextRequest = {
            id: `demo-req-${Date.now()}`,
            ...payload,
            status: 'PENDING_VERIFICATION',
            createdAt: new Date().toISOString(),
        }
        const requests = [nextRequest, ...(current.requests ?? DEMO_REQUESTS)]
        writeGuestState({ ...current, requests })
        return nextRequest
    }
    throw new Error('Requests endpoint is not implemented yet')
}
export function getStoredSession() { try { return JSON.parse(localStorage.getItem('azure_session') || 'null') } catch { return null } }
export async function getUserProfile() { return getMyProfile() }
