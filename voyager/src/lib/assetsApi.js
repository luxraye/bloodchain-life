/**
 * Voyager Assets API — bloodchain-core with demo seed fallback
 */
import apiClient from './api.js'
import { isDemoSession } from './isDemoSession.js'
import { DEMO_JOBS } from '../data/seedVoyager.js'
import { getDemoJobs } from './demoJobsStore.js'

export async function fetchJobs() {
  if (isDemoSession()) return getDemoJobs()
  try {
    const [releasedRes, transitRes] = await Promise.all([
      apiClient.get('/assets?status=RELEASED'),
      apiClient.get('/assets?status=IN_TRANSIT'),
    ])
    const released = (releasedRes.data?.data ?? []).map(toJob)
    const inTransit = (transitRes.data?.data ?? []).map(toJob)
    const merged = [...inTransit, ...released]
    if (import.meta.env.DEV && merged.length === 0) return DEMO_JOBS
    return merged
  } catch {
    if (import.meta.env.DEV) return DEMO_JOBS
    return []
  }
}

function toJob(asset) {
  return {
    id: asset.id,
    bloodType: asset.bloodType,
    status: asset.status,
    priority: 'NORMAL',
    shortId: asset.id.slice(-10).toUpperCase(),
    route: {
      source: asset.currentLocation ?? 'NBTS',
      destination: asset.donor?.facilityId ?? 'Hospital',
    },
    donor: asset.donor ?? null,
    custodyLog: {},
    incidents: [],
    coldChain: null,
    updatedAt: asset.updatedAt,
    createdAt: asset.createdAt,
  }
}

export async function scanAsset(assetId, newStatus, location) {
  if (isDemoSession()) {
    return { id: assetId, status: newStatus, currentLocation: location }
  }
  const { data } = await apiClient.post('/assets/scan', { assetId, newStatus, location })
  return data.data
}

export async function getAssetCustody(assetId) {
  if (isDemoSession()) return { id: assetId, events: [] }
  try {
    const { data } = await apiClient.get(`/assets/${assetId}/custody`)
    return data
  } catch {
    return null
  }
}
