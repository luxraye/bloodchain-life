import type {
  User,
  LedgerRow,
  MapNode,
  TransitRoute,
  TremorDataPoint,
} from '../services/adminService'

function isoDaysAgo(days: number, hours = 0) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(d.getHours() - hours)
  return d.toISOString()
}

export const DEMO_ASSET_STATUS: Record<string, number> = {
  RELEASED: 124,
  IN_TRANSIT: 6,
  TESTING: 9,
  QUARANTINE: 4,
  DISCARDED: 7,
  USED: 87,
  COLLECTED: 18,
}

export const DEMO_USERS: User[] = [
  { id: 'admin-001', email: 'director@nbts.gov.bw', name: 'Dr. Gift Nakedi', role: 'ADMIN', facilityId: 'NBTS National HQ', status: 'ACTIVE', createdAt: isoDaysAgo(400), updatedAt: isoDaysAgo(1) },
  { id: 'admin-002', email: 'auditor@moh.gov.bw', name: 'Boitumelo Sebego', role: 'MOH_AUDITOR', facilityId: 'Ministry of Health', status: 'ACTIVE', createdAt: isoDaysAgo(200), updatedAt: isoDaysAgo(3) },
  { id: 'lab-001', email: 'lesego.molefe@nbts.gov.bw', name: 'Lesego Molefe', role: 'LAB', facilityId: 'NBTS Gaborone', status: 'ACTIVE', createdAt: isoDaysAgo(180), updatedAt: isoDaysAgo(2) },
  { id: 'lab-002', email: 'kago.ramotsabi@nbts.gov.bw', name: 'Kago Ramotsabi', role: 'LAB', facilityId: 'NBTS Francistown', status: 'ACTIVE', createdAt: isoDaysAgo(120), updatedAt: isoDaysAgo(5) },
  { id: 'med-001', email: 'kea.bantsi@hospital.bw', name: 'Kea Bantsi', role: 'MEDICAL', facilityId: 'Princess Marina Hospital', status: 'ACTIVE', createdAt: isoDaysAgo(90), updatedAt: isoDaysAgo(1) },
  { id: 'med-002', email: 'ono.machila@hospital.bw', name: 'Onkemetse Machila', role: 'MEDICAL', facilityId: 'Nyangabgwe Referral Hospital', status: 'ACTIVE', createdAt: isoDaysAgo(60), updatedAt: isoDaysAgo(4) },
  { id: 'transit-001', email: 'thabo.mpho@nbts.gov.bw', name: 'Thabo Mpho', role: 'TRANSIT', facilityId: 'NBTS Logistics — South', status: 'ACTIVE', createdAt: isoDaysAgo(75), updatedAt: isoDaysAgo(0) },
  { id: 'transit-002', email: 'lorato.kgosi@nbts.gov.bw', name: 'Lorato Kgosi', role: 'TRANSIT', facilityId: 'NBTS Logistics — North', status: 'ACTIVE', createdAt: isoDaysAgo(45), updatedAt: isoDaysAgo(2) },
  { id: 'log-001', email: 'command.logistics@nbts.gov.bw', name: 'Tshepo Modise', role: 'LOGISTICS_COMMAND', facilityId: 'NBTS National HQ', status: 'ACTIVE', createdAt: isoDaysAgo(300), updatedAt: isoDaysAgo(6) },
  { id: 'coord-001', email: 'chronic.coord@nhsrc.org.bw', name: 'Amantle Tshosa', role: 'MEDICAL', facilityId: 'NHSRC Gaborone', status: 'ACTIVE', createdAt: isoDaysAgo(30), updatedAt: isoDaysAgo(1) },
  { id: 'lab-003', email: 'suspended.lab@bloodchain.local', name: 'Demo Suspended Tech', role: 'LAB', facilityId: 'Maun District Hospital', status: 'SUSPENDED', createdAt: isoDaysAgo(500), updatedAt: isoDaysAgo(10) },
  { id: 'public-staff', email: 'portal.support@nbts.gov.bw', name: 'Azure Support Desk', role: 'PUBLIC', facilityId: null, status: 'ACTIVE', createdAt: isoDaysAgo(14), updatedAt: isoDaysAgo(14) },
]

const ledgerActions = [
  { action: 'Collected', role: 'MEDICAL', user: 'Kea Bantsi', email: 'kea.bantsi@hospital.bw', facility: 'Princess Marina Hospital' },
  { action: 'In Transit', role: 'TRANSIT', user: 'Thabo Mpho', email: 'thabo.mpho@nbts.gov.bw', facility: 'Route PMH → NBTS Gaborone' },
  { action: 'Received', role: 'LAB', user: 'Lesego Molefe', email: 'lesego.molefe@nbts.gov.bw', facility: 'NBTS Gaborone' },
  { action: 'Screened', role: 'LAB', user: 'Kago Ramotsabi', email: 'kago.ramotsabi@nbts.gov.bw', facility: 'NBTS Francistown' },
  { action: 'Released', role: 'LAB', user: 'Lesego Molefe', email: 'lesego.molefe@nbts.gov.bw', facility: 'NBTS Gaborone' },
  { action: 'In Transit', role: 'TRANSIT', user: 'Lorato Kgosi', email: 'lorato.kgosi@nbts.gov.bw', facility: 'Route NBTS → Nyangabgwe' },
  { action: 'Delivered', role: 'MEDICAL', user: 'Onkemetse Machila', email: 'ono.machila@hospital.bw', facility: 'Nyangabgwe Referral Hospital' },
  { action: 'Transfused', role: 'MEDICAL', user: 'Kea Bantsi', email: 'kea.bantsi@hospital.bw', facility: 'Princess Marina Hospital' },
  { action: 'Discarded', role: 'LAB', user: 'Lesego Molefe', email: 'lesego.molefe@nbts.gov.bw', facility: 'NBTS Gaborone' },
  { action: 'Quarantined', role: 'LAB', user: 'Kago Ramotsabi', email: 'kago.ramotsabi@nbts.gov.bw', facility: 'NBTS Francistown' },
]

export const DEMO_LEDGER_ROWS: LedgerRow[] = Array.from({ length: 28 }, (_, i) => {
  const step = ledgerActions[i % ledgerActions.length]
  const assetNum = String(Math.floor(i / 3) + 1).padStart(3, '0')
  return {
    id: `led-demo-${String(i + 1).padStart(3, '0')}`,
    assetId: `BW-2026-${assetNum}`,
    actionPerformed: step.action,
    userId: `user-${i % 6}`,
    userName: step.user,
    userRole: step.role,
    userEmail: step.email,
    facility: step.facility,
    createdAt: isoDaysAgo(Math.floor(i / 2), i % 8),
    updatedAt: isoDaysAgo(Math.floor(i / 2), i % 8),
  }
})

export const DEMO_MAP_NODES: MapNode[] = [
  { id: 'node-gab', name: 'NBTS Gaborone', type: 'LAB', lat: -24.6545, lng: 25.9086, status: 'ONLINE', inventory: 62 },
  { id: 'node-ftown', name: 'NBTS Francistown', type: 'LAB', lat: -21.1661, lng: 27.5145, status: 'ONLINE', inventory: 34 },
  { id: 'node-pmh', name: 'Princess Marina Hospital', type: 'HOSPITAL', lat: -24.661, lng: 25.913, status: 'ONLINE', inventory: 18 },
  { id: 'node-nyan', name: 'Nyangabgwe Referral', type: 'HOSPITAL', lat: -21.1833, lng: 27.5167, status: 'ONLINE', inventory: 11 },
  { id: 'node-maun', name: 'Maun District Hospital', type: 'HOSPITAL', lat: -19.9833, lng: 23.4167, status: 'DEGRADED', inventory: 4 },
  { id: 'node-drive', name: 'Gaborone CBD Mobile Drive', type: 'DRIVE', lat: -24.6282, lng: 25.9231, status: 'ONLINE', inventory: 8 },
  { id: 'node-kasane', name: 'Kasane Outreach', type: 'DRIVE', lat: -17.8167, lng: 25.15, status: 'OFFLINE', inventory: 0 },
]

export const DEMO_TRANSIT_ROUTES: TransitRoute[] = [
  {
    id: 'route-001',
    courierName: 'Thabo Mpho',
    from: { lat: -24.661, lng: 25.913, name: 'Princess Marina Hospital' },
    to: { lat: -24.6545, lng: 25.9086, name: 'NBTS Gaborone' },
    status: 'IN_TRANSIT',
    bloodType: 'O+',
  },
  {
    id: 'route-002',
    courierName: 'Lorato Kgosi',
    from: { lat: -24.6545, lng: 25.9086, name: 'NBTS Gaborone' },
    to: { lat: -21.1833, lng: 27.5167, name: 'Nyangabgwe Referral' },
    status: 'IN_TRANSIT',
    bloodType: 'A-',
  },
  {
    id: 'route-003',
    courierName: 'Tshepo Modise (oversight)',
    from: { lat: -21.1661, lng: 27.5145, name: 'NBTS Francistown' },
    to: { lat: -19.9833, lng: 23.4167, name: 'Maun District Hospital' },
    status: 'IN_TRANSIT',
    bloodType: 'B+',
  },
]

export const DEMO_WASTAGE: TremorDataPoint[] = [
  { date: '2026-01-05', 'O+': 2, 'A+': 1, 'B+': 0, 'A-': 0, 'AB+': 0, Discarded: 3 },
  { date: '2026-02-02', 'O+': 1, 'A+': 2, 'B+': 1, 'A-': 0, 'AB+': 0, Discarded: 4 },
  { date: '2026-03-01', 'O+': 3, 'A+': 0, 'B+': 0, 'A-': 1, 'AB+': 0, Discarded: 4 },
  { date: '2026-04-01', 'O+': 1, 'A+': 1, 'B+': 0, 'A-': 0, 'AB+': 0, Discarded: 2 },
  { date: '2026-04-08', 'O+': 2, 'A+': 0, 'B+': 1, 'A-': 0, 'AB+': 0, Discarded: 3 },
  { date: '2026-05-15', 'O+': 0, 'A+': 0, 'B+': 0, 'A-': 1, 'AB+': 1, Discarded: 2 },
]

export interface DemoKycUser {
  id: string
  name: string
  email: string
  trustLevel: number
  verificationDocUrl: string
  createdAt: string
  bloodType?: string
}

export const DEMO_KYC_QUEUE: DemoKycUser[] = [
  { id: 'kyc-001', name: 'Tumelo Mokgosi', email: 'tumelo.m@email.bw', trustLevel: 2, verificationDocUrl: 'https://placehold.co/600x400?text=Omang+Scan', createdAt: isoDaysAgo(1), bloodType: 'O+' },
  { id: 'kyc-002', name: 'Refilwe Phiri', email: 'refilwe.p@email.bw', trustLevel: 2, verificationDocUrl: 'https://placehold.co/600x400?text=Omang+PDF', createdAt: isoDaysAgo(2), bloodType: 'A+' },
  { id: 'kyc-003', name: 'Kabo Ntwaagae', email: 'kabo.n@email.bw', trustLevel: 2, verificationDocUrl: 'https://placehold.co/600x400?text=ID+Document', createdAt: isoDaysAgo(3), bloodType: 'B+' },
  { id: 'kyc-004', name: 'Oratile Seboni', email: 'oratile.s@email.bw', trustLevel: 2, verificationDocUrl: 'https://placehold.co/600x400?text=Omang+Scan', createdAt: isoDaysAgo(4), bloodType: 'AB+' },
  { id: 'kyc-005', name: 'Goitseone Molefi', email: 'goitseone.m@email.bw', trustLevel: 2, verificationDocUrl: 'https://placehold.co/600x400?text=Residence+Permit', createdAt: isoDaysAgo(5), bloodType: 'O-' },
  { id: 'kyc-006', name: 'Lesang Kgosidintsi', email: 'lesang.k@email.bw', trustLevel: 2, verificationDocUrl: 'https://placehold.co/600x400?text=Omang+Scan', createdAt: isoDaysAgo(6), bloodType: 'A-' },
]

export function filterDemoUsers(params?: { role?: string }) {
  const filtered =
    params?.role && params.role !== 'ALL'
      ? DEMO_USERS.filter((user) => user.role === params.role)
      : DEMO_USERS
  return { users: filtered, total: filtered.length }
}

export function filterDemoLedger(
  rows: LedgerRow[],
  params?: {
    pageIndex?: number
    pageSize?: number
    filterAction?: string
    filterFacility?: string
  },
) {
  let filtered = [...rows]
  if (params?.filterAction) {
    filtered = filtered.filter((r) =>
      r.actionPerformed.toLowerCase().includes(params.filterAction!.toLowerCase()),
    )
  }
  if (params?.filterFacility) {
    filtered = filtered.filter((r) =>
      r.facility.toLowerCase().includes(params.filterFacility!.toLowerCase()),
    )
  }
  const pageSize = params?.pageSize ?? 20
  const pageIndex = params?.pageIndex ?? 0
  const start = pageIndex * pageSize
  const page = filtered.slice(start, start + pageSize)
  return {
    success: true as const,
    data: page,
    meta: {
      totalRowCount: filtered.length,
      pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)),
      pageIndex,
      pageSize,
    },
  }
}
