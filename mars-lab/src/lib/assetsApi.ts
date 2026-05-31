/**
 * Mars Lab Assets API — wired to bloodchain-core
 * Replaces the localStorage phantom adapter.
 * Exports the same function signatures so BatchProcessor needs zero changes.
 */
import apiClient from './api'
import type { LabAsset, LabAssetStatus } from '../types'

/** Map a BloodAsset from bloodchain-core into Mars Lab's LabAsset shape */
function toLabAsset(raw: any): LabAsset {
  const now = new Date().toISOString()
  return {
    id: raw.id,
    donorId: raw.donorId ?? 'unknown',
    collectionTimestamp: raw.createdAt ?? now,
    expirationDate: new Date(Date.parse(raw.createdAt ?? now) + 35 * 86_400_000).toISOString(),
    bloodType: raw.bloodType ?? 'O+',
    componentType: 'Whole Blood',
    viralScreening: { hiv: 'PENDING', hepB: 'PENDING', hepC: 'PENDING', syphilis: 'PENDING' },
    status: raw.status === 'COLLECTED' ? 'INCOMING' : raw.status as LabAssetStatus,
    chainOfCustody: (raw.custodyEvents ?? []).map((e: any) => ({
      actor: e.actorName ?? 'System',
      action: e.status,
      time: e.createdAt,
    })),
  }
}

/** Fetch all assets, optionally filtered by status */
export async function getAssets(status?: string): Promise<LabAsset[]> {
  try {
    // Map 'COLLECTED' → fetch all for the processing board; 'ALL' same
    const url = (!status || status === 'ALL' || status === 'COLLECTED')
      ? '/assets'
      : `/assets?status=${status}`
    const { data } = await apiClient.get(url)
    return (data.data ?? []).map(toLabAsset)
  } catch {
    return []
  }
}

/**
 * Update an asset's status and write a custody event.
 * Maps mars-lab's internal status names back to bloodchain-core's enum.
 */
export async function scanAsset(
  assetId: string,
  newStatus: LabAssetStatus,
  location: string,
): Promise<void> {
  const statusMap: Record<string, string> = {
    INCOMING: 'COLLECTED',
    TESTING: 'TESTING',
    QUARANTINE: 'QUARANTINE',
    RELEASED: 'RELEASED',
    DISCARDED: 'DISCARDED',
    BIOHAZARD: 'DISCARDED',
  }
  const coreStatus = statusMap[newStatus] ?? newStatus
  await apiClient.post('/assets/scan', { assetId, newStatus: coreStatus, location })
}

/** Split a unit — not yet supported in bloodchain-core; graceful no-op */
export async function splitAsset(_assetId: string, _components: string[]): Promise<void> {
  console.warn('[splitAsset] Component split not yet implemented in bloodchain-core')
}

/** Create a blood asset in bloodchain-core */
export async function createBloodAsset(asset: Partial<LabAsset>): Promise<LabAsset> {
  const { data } = await apiClient.post('/assets', {
    donorId: asset.donorId,
    bloodType: asset.bloodType,
    location: 'NBTS Main Lab',
  })
  return toLabAsset(data.data)
}
