import type { LabAsset } from './types'

const now = Date.now()
const ts  = (offsetH: number) => new Date(now - offsetH * 3_600_000).toISOString()
const exp = (days: number)    => new Date(now + days * 86_400_000).toISOString()

export const mockLabAssets: LabAsset[] = [
  {
    id:                  'BC-2026-0041',
    donorId:             'D-7812',
    collectionTimestamp: ts(3.5),
    expirationDate:      exp(32),
    bloodType:           'O+',
    componentType:       'Whole Blood',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'RELEASED',
    chainOfCustody: [
      { actor: 'System',      action: 'Unit registered from Scyther collection', time: ts(3.5) },
      { actor: 'M. Dube',    action: 'Received at lab — intake logged',          time: ts(3.2) },
      { actor: 'M. Dube',    action: 'TTI screening initiated',                  time: ts(2.8) },
      { actor: 'M. Dube',    action: 'All panels returned NEGATIVE',             time: ts(1.4) },
      { actor: 'K. Sithole', action: 'Supervisor review — released to inventory',time: ts(0.8) },
    ],
  },
  {
    id:                  'BC-2026-0039',
    donorId:             'D-7809',
    collectionTimestamp: ts(5.1),
    expirationDate:      exp(3),
    bloodType:           'A−',
    componentType:       'Plasma',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'QUARANTINE',
    chainOfCustody: [
      { actor: 'System',   action: 'Unit registered from Scyther collection', time: ts(5.1) },
      { actor: 'R. Moche', action: 'Received at lab — intake logged',          time: ts(4.9) },
      { actor: 'R. Moche', action: 'Quarantined — approaching expiry window',  time: ts(1.0) },
    ],
  },
  {
    id:                  'BC-2026-0038',
    donorId:             'D-7805',
    collectionTimestamp: ts(7.2),
    expirationDate:      exp(28),
    bloodType:           'B+',
    componentType:       'Whole Blood',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'POSITIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'BIOHAZARD',
    chainOfCustody: [
      { actor: 'System',      action: 'Unit registered from Scyther collection',      time: ts(7.2) },
      { actor: 'M. Dube',    action: 'Received at lab — intake logged',               time: ts(7.0) },
      { actor: 'M. Dube',    action: 'TTI screening initiated',                       time: ts(6.5) },
      { actor: 'M. Dube',    action: 'HBsAg returned REACTIVE — unit quarantined',   time: ts(4.2) },
      { actor: 'K. Sithole', action: 'Supervisor verified — biohazard discard order', time: ts(3.8) },
    ],
  },
  {
    id:                  'BC-2026-0037',
    donorId:             'D-7801',
    collectionTimestamp: ts(8.5),
    expirationDate:      exp(30),
    bloodType:           'AB+',
    componentType:       'Whole Blood',
    viralScreening: { hiv: 'PENDING', hepB: 'PENDING', hepC: 'PENDING', syphilis: 'PENDING' },
    status: 'TESTING',
    chainOfCustody: [
      { actor: 'System',   action: 'Unit registered from Scyther collection', time: ts(8.5) },
      { actor: 'R. Moche', action: 'Received at lab — intake logged',          time: ts(8.2) },
      { actor: 'R. Moche', action: 'Loaded onto TTI Analyzer — rack 7',        time: ts(0.4) },
    ],
  },
  {
    id:                  'BC-2026-0036',
    donorId:             'D-7798',
    collectionTimestamp: ts(10.0),
    expirationDate:      exp(31),
    bloodType:           'O−',
    componentType:       'Whole Blood',
    viralScreening: { hiv: 'PENDING', hepB: 'PENDING', hepC: 'PENDING', syphilis: 'PENDING' },
    status: 'INCOMING',
    chainOfCustody: [
      { actor: 'System',   action: 'Unit registered from Scyther collection', time: ts(10.0) },
      { actor: 'R. Moche', action: 'Received at lab — intake logged',          time: ts(0.1) },
    ],
  },
  {
    id:                  'BC-2026-0035',
    donorId:             'D-7794',
    collectionTimestamp: ts(12.0),
    expirationDate:      exp(5),
    bloodType:           'A+',
    componentType:       'Platelets',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'RELEASED',
    chainOfCustody: [
      { actor: 'System',      action: 'Unit registered from Scyther collection', time: ts(12.0) },
      { actor: 'M. Dube',    action: 'Received at lab — intake logged',          time: ts(11.8) },
      { actor: 'M. Dube',    action: 'TTI screening — all NEGATIVE',            time: ts(9.5)  },
      { actor: 'K. Sithole', action: 'Released — assigned to Voyager transit',   time: ts(8.0)  },
    ],
  },
  {
    id:                  'BC-2026-0034',
    donorId:             'D-7790',
    collectionTimestamp: ts(14.0),
    expirationDate:      exp(29),
    bloodType:           'B−',
    componentType:       'Whole Blood',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'POSITIVE' },
    status: 'DISCARDED',
    chainOfCustody: [
      { actor: 'System',      action: 'Unit registered from Scyther collection',   time: ts(14.0) },
      { actor: 'R. Moche',   action: 'Received at lab — intake logged',            time: ts(13.8) },
      { actor: 'R. Moche',   action: 'Syphilis RPR returned REACTIVE',             time: ts(10.2) },
      { actor: 'K. Sithole', action: 'Supervisor verified — biohazard discarded',  time: ts(9.0)  },
    ],
  },
  {
    id:                  'BC-2026-0033',
    donorId:             'D-7785',
    collectionTimestamp: ts(16.5),
    expirationDate:      exp(27),
    bloodType:           'O+',
    componentType:       'RBC',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'RELEASED',
    chainOfCustody: [
      { actor: 'System',      action: 'Unit registered from Scyther collection', time: ts(16.5) },
      { actor: 'M. Dube',    action: 'Received at lab — intake logged',          time: ts(16.2) },
      { actor: 'M. Dube',    action: 'TTI screening — all NEGATIVE',            time: ts(13.0) },
      { actor: 'M. Dube',    action: 'Component split from BC-2026-0032',       time: ts(12.5) },
      { actor: 'K. Sithole', action: 'Released to cold storage',                 time: ts(11.0) },
    ],
  },
]

/** Units currently in active processing queue (INCOMING / TESTING / QUARANTINE) */
export const mockBatchQueue = mockLabAssets
  .filter(u => ['INCOMING', 'TESTING', 'QUARANTINE'].includes(u.status))

/** Shift summary stats */
export const mockShiftStats = {
  date:          new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  analyst:       'M. Dube',
  supervisor:    'K. Sithole',
  received:      8,
  processed:     6,
  released:      3,
  discarded:     2,
  inProgress:    3,
  reactiveRate:  '25%',
  avgTurnaround: '2h 14m',
}
