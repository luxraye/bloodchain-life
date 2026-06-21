/**
 * Community Blood Drive — Scyther demo seed (Blood for Life Botswana).
 *
 * Used as a local fallback when the Bloodchain Core API is unavailable, so the
 * BLB collection demo runs end-to-end offline. Donors carry:
 *   - Omang ID            → on-site identity verification + local deduplication
 *   - azure { ... }       → proof of the Scyther ↔ Azure donor-portal link
 *   - drives [ ... ]      → prior drives attended → "returning donor" retention story
 *
 * Donor shape matches mapUserToDonor() in context/AppContext.jsx, plus the demo
 * fields above (ignored by the API path, used by the collection UI).
 */

export const COMMUNITY_DRIVE = {
  id: 'drive-blb-2026-0620',
  name: 'Blood for Life — UB Campus Community Drive',
  organiser: 'Blood for Life Botswana',
  partner: 'University of Botswana · Student Health',
  date: '2026-06-20',
  location: 'University of Botswana, Gaborone',
  target: 120,
  registered: 14,
  returningShare: 0.5,
}

const DAY = 86400000

// helper: ISO date N days before now
const daysAgo = (n) => new Date(Date.now() - n * DAY).toISOString()

/** Prior BLB drives, referenced by returning donors below. */
export const PAST_DRIVES = {
  'drive-blb-2026-0301': { id: 'drive-blb-2026-0301', name: 'BLB — Main Mall Easter Drive', date: '2026-03-01' },
  'drive-blb-2025-1115': { id: 'drive-blb-2025-1115', name: 'BLB — Game City Festive Drive', date: '2025-11-15' },
  'drive-blb-2025-0712': { id: 'drive-blb-2025-0712', name: 'BLB — UB Campus Winter Drive', date: '2025-07-12' },
}

export const DRIVE_DONORS = [
  {
    id: 'b1f2c3d4-0001-4a1b-9c2d-000000000001',
    omang: '485612901', firstName: 'Lorato', lastName: 'Mokwena', gender: 'Female',
    dateOfBirth: '1994-02-11', bloodType: 'O+', phone: '+267 71 234 567', email: 'lorato.m@example.bw',
    lastDonation: daysAgo(111), totalDonations: 4, status: 'ELIGIBLE',
    azure: { linked: true, trustLevel: 3, donorSince: '2024-03-01' },
    drives: ['drive-blb-2026-0301', 'drive-blb-2025-1115', 'drive-blb-2025-0712'],
  },
  {
    id: 'b1f2c3d4-0002-4a1b-9c2d-000000000002',
    omang: '529334118', firstName: 'Tebogo', lastName: 'Seretse', gender: 'Male',
    dateOfBirth: '1989-09-23', bloodType: 'A+', phone: '+267 72 345 678', email: 'tebogo.seretse@example.bw',
    lastDonation: daysAgo(98), totalDonations: 2, status: 'ELIGIBLE',
    azure: { linked: true, trustLevel: 2, donorSince: '2025-07-10' },
    drives: ['drive-blb-2025-0712'],
  },
  {
    id: 'b1f2c3d4-0003-4a1b-9c2d-000000000003',
    omang: '601228470', firstName: 'Naledi', lastName: 'Phiri', gender: 'Female',
    dateOfBirth: '2001-12-05', bloodType: 'B+', phone: '+267 73 456 789', email: 'naledi.phiri@example.bw',
    lastDonation: null, totalDonations: 0, status: 'ELIGIBLE',
    azure: { linked: true, trustLevel: 1, donorSince: '2026-06-18' },
    drives: [],
  },
  {
    id: 'b1f2c3d4-0004-4a1b-9c2d-000000000004',
    omang: '447790255', firstName: 'Kagiso', lastName: 'Tau', gender: 'Male',
    dateOfBirth: '1996-06-30', bloodType: 'O-', phone: '+267 74 567 890', email: 'kagiso.tau@example.bw',
    lastDonation: daysAgo(132), totalDonations: 6, status: 'ELIGIBLE',
    azure: { linked: true, trustLevel: 3, donorSince: '2023-09-14' },
    drives: ['drive-blb-2026-0301', 'drive-blb-2025-1115'],
  },
  {
    id: 'b1f2c3d4-0005-4a1b-9c2d-000000000005',
    omang: '512006933', firstName: 'Boitumelo', lastName: 'Kgosana', gender: 'Female',
    dateOfBirth: '1992-04-18', bloodType: 'AB+', phone: '+267 75 678 901', email: 'boitumelo.k@example.bw',
    // donated 30 days ago → inside the 56-day window → DEFERRED
    lastDonation: daysAgo(30), totalDonations: 3, status: 'ELIGIBLE',
    azure: { linked: true, trustLevel: 2, donorSince: '2024-11-02' },
    drives: ['drive-blb-2026-0301'],
  },
  {
    id: 'b1f2c3d4-0006-4a1b-9c2d-000000000006',
    omang: '388451027', firstName: 'Mpho', lastName: 'Radipotsane', gender: 'Male',
    dateOfBirth: '1985-01-09', bloodType: 'A-', phone: '+267 76 789 012', email: 'mpho.r@example.bw',
    lastDonation: daysAgo(210), totalDonations: 9, status: 'ELIGIBLE',
    azure: { linked: true, trustLevel: 3, donorSince: '2022-05-20' },
    drives: ['drive-blb-2026-0301', 'drive-blb-2025-1115', 'drive-blb-2025-0712'],
  },
  {
    id: 'b1f2c3d4-0007-4a1b-9c2d-000000000007',
    omang: '655310894', firstName: 'Refilwe', lastName: 'Moeng', gender: 'Female',
    dateOfBirth: '1999-08-27', bloodType: 'O+', phone: '+267 71 890 123', email: 'refilwe.moeng@example.bw',
    lastDonation: null, totalDonations: 0, status: 'ELIGIBLE',
    azure: { linked: false, trustLevel: 0, donorSince: null },
    drives: [],
  },
  {
    id: 'b1f2c3d4-0008-4a1b-9c2d-000000000008',
    omang: '470982361', firstName: 'Onkarabile', lastName: 'Setlhare', gender: 'Male',
    dateOfBirth: '1993-11-14', bloodType: 'B-', phone: '+267 72 901 234', email: 'onkarabile.s@example.bw',
    lastDonation: daysAgo(76), totalDonations: 5, status: 'ELIGIBLE',
    azure: { linked: true, trustLevel: 2, donorSince: '2025-01-12' },
    drives: ['drive-blb-2025-1115'],
  },
  {
    id: 'b1f2c3d4-0009-4a1b-9c2d-000000000009',
    omang: '523447780', firstName: 'Gorata', lastName: 'Dube', gender: 'Female',
    dateOfBirth: '1997-03-02', bloodType: 'A+', phone: '+267 73 012 345', email: 'gorata.dube@example.bw',
    lastDonation: daysAgo(64), totalDonations: 1, status: 'ELIGIBLE',
    azure: { linked: true, trustLevel: 2, donorSince: '2026-03-01' },
    drives: ['drive-blb-2026-0301'],
  },
  {
    id: 'b1f2c3d4-0010-4a1b-9c2d-000000000010',
    omang: '419065512', firstName: 'Thabo', lastName: 'Molefe', gender: 'Male',
    dateOfBirth: '1990-07-21', bloodType: 'O+', phone: '+267 74 123 456', email: 'thabo.molefe@example.bw',
    lastDonation: daysAgo(150), totalDonations: 7, status: 'ELIGIBLE',
    azure: { linked: true, trustLevel: 3, donorSince: '2023-02-08' },
    drives: ['drive-blb-2025-1115', 'drive-blb-2025-0712'],
  },
  {
    id: 'b1f2c3d4-0011-4a1b-9c2d-000000000011',
    omang: '610778204', firstName: 'Keabetswe', lastName: 'Ramotswa', gender: 'Female',
    dateOfBirth: '2002-05-16', bloodType: 'B+', phone: '+267 75 234 567', email: 'keabetswe.r@example.bw',
    lastDonation: null, totalDonations: 0, status: 'ELIGIBLE',
    azure: { linked: true, trustLevel: 1, donorSince: '2026-06-19' },
    drives: [],
  },
  {
    id: 'b1f2c3d4-0012-4a1b-9c2d-000000000012',
    omang: '356129948', firstName: 'Ditiro', lastName: 'Pule', gender: 'Male',
    dateOfBirth: '1983-10-03', bloodType: 'AB-', phone: '+267 76 345 678', email: 'ditiro.pule@example.bw',
    lastDonation: daysAgo(189), totalDonations: 11, status: 'ELIGIBLE',
    azure: { linked: true, trustLevel: 3, donorSince: '2021-08-30' },
    drives: ['drive-blb-2026-0301', 'drive-blb-2025-1115', 'drive-blb-2025-0712'],
  },
]

const isUuid = (s) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s || '')

/** Is this donor returning (attended a prior drive or has donation history)? */
export function isReturningDonor(donor) {
  if (!donor) return false
  return (donor.drives?.length ?? 0) > 0 || (donor.totalDonations ?? 0) > 0
}

/** Human label + meta for a prior drive id. */
export function getDriveMeta(driveId) {
  return PAST_DRIVES[driveId] ?? { id: driveId, name: driveId, date: null }
}

/**
 * Local deduplication check for on-site Omang verification.
 *
 * Returns a verification summary the check-in UI uses to prove we catch
 * duplicates before the needle rather than after:
 *   - status: 'NEW' | 'MATCHED' | 'DUPLICATE_BLOCKED'
 *   - matches: other records sharing the Omang (should be unique)
 */
export function verifyOmang(donors, donor) {
  const omang = donor?.omang
  if (!omang) {
    return { status: 'UNVERIFIED', validFormat: false, matches: [], azureLinked: false }
  }
  const validFormat = /^\d{9}$/.test(omang)
  const matches = (donors || []).filter((d) => d.omang === omang && d.id !== donor.id)
  const isDuplicate = matches.length > 0
  const matchedExisting = isReturningDonor(donor)
  return {
    status: isDuplicate ? 'DUPLICATE_BLOCKED' : matchedExisting ? 'MATCHED' : 'NEW',
    validFormat,
    matches,
    azureLinked: Boolean(donor.azure?.linked),
    azureTrustLevel: donor.azure?.trustLevel ?? 0,
    uuidBacked: isUuid(donor.id),
  }
}
