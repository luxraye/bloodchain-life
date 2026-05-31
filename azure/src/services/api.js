import apiClient from '../lib/api.js'
import { DONOR_VERIFICATIONS_BUCKET, VERIFICATION_DOC_SIGNED_URL_SECONDS } from '../lib/storage.js'
import { supabase } from '../lib/supabase.js'

// ── Profile ──────────────────────────────────────────
export async function getMyProfile() {
  try { const { data } = await apiClient.get('/profile/me'); return data.data ?? null } catch { return null }
}
export async function updateMyProfile(payload) {
  const { data } = await apiClient.patch('/profile/me', payload); return data.data
}

// ── Registration (public — no token needed) ──────────
export async function registerDonor({ email, password, name, bloodType, accepted_terms_at }) {
  const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1'
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, bloodType, accepted_terms_at }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Registration failed')
  // Auto sign-in after DB registration
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) throw new Error(signInError.message)
  return json.data
}

// ── Document Upload (Level 1 → 2) ────────────────────
export async function uploadVerificationDoc(file) {
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
  const { data } = await apiClient.patch('/profile/me', { trustLevel: 2, verificationDocUrl: docUrl })
  return data.data
}


// ── Donation history ─────────────────────────────────
export async function getDonationHistory() {
  try { const { data } = await apiClient.get('/assets/my-donations'); return data.data ?? [] } catch { return [] }
}

export async function getDonationJourney() {
  return []
}

// ── Blood unit custody (read-only for donors) ────────
export async function getAssetCustody(assetId) {
  try { const { data } = await apiClient.get(`/assets/${assetId}/custody`); return data } catch { return null }
}

// ── Static / local fallbacks ─────────────────────────
export async function getNationalStockLevels() { return null }
export async function getDonationCenters() { return [] }
export async function getScheduleSlots() { return [] }
export async function bookScheduleSlot(slotId) { return { slotId, bookedAt: new Date().toISOString() } }
export async function getDonationEducation() { return { tips: [], articles: [] } }
export async function getNearbyRequests() { return [] }
export async function respondToNearbyRequest(requestId, action) { return { requestId, status: action === 'PLEDGE' ? 'PLEDGED' : null } }

const REQUESTS_KEY = 'azure_requests'
const load = () => { try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]') } catch { return [] } }
const save = (r) => { try { localStorage.setItem(REQUESTS_KEY, JSON.stringify(r)) } catch { } }
export async function getRequests() { return load() }
export async function createRequest(payload) {
  const r = { id: `req_${Date.now()}`, status: 'PENDING_VERIFICATION', createdAt: new Date().toISOString(), ...payload }
  save([r, ...load()]); return r
}
export function getStoredSession() { try { return JSON.parse(localStorage.getItem('azure_session') || 'null') } catch { return null } }
export async function getUserProfile() { return getMyProfile() }
