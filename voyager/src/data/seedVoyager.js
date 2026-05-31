function isoMinutesAgo(m) {
  return new Date(Date.now() - m * 60 * 1000).toISOString()
}

function isoHoursFromNow(h) {
  return new Date(Date.now() + h * 3600 * 1000).toISOString()
}

export const DEMO_COORDINATOR = {
  id: 'coord-voyager-001',
  name: 'Tshepo Modise',
  email: 'command.logistics@nbts.gov.bw',
  role: 'LOGISTICS_COMMAND',
  callsign: 'Logistics South',
  vehicle: 'Fleet oversight',
  region: 'Southern District',
  totalDeliveries: 1842,
}

/** Field couriers available for coordinator assignment */
export const DEMO_COURIERS = [
  { id: 'cour-01', label: 'Thabo Mpho · VOY-12', region: 'Gaborone South', status: 'ON_ROUTE' },
  { id: 'cour-02', label: 'Lorato Kgosi · VOY-07', region: 'Maun corridor', status: 'ON_ROUTE' },
  { id: 'cour-03', label: 'Kagiso Tshosa · VOY-09', region: 'Francistown', status: 'AVAILABLE' },
  { id: 'cour-04', label: 'Amantle Sebego · VOY-15', region: 'Gaborone', status: 'AVAILABLE' },
  { id: 'cour-05', label: 'Northern relay · VOY-03', region: 'Kasane relay', status: 'ON_ROUTE' },
]

const cold = (current, status, minsAgo = 5) => ({
  targetTempC: { min: 2, max: 6 },
  currentTempC: current,
  status,
  lastReadingAt: isoMinutesAgo(minsAgo),
  packType: 'Validated cold box (ISBT)',
  expiryAt: isoHoursFromNow(18),
})

export const DEMO_JOBS = [
  {
    id: 'job-voy-001',
    bloodType: 'O-',
    status: 'IN_TRANSIT',
    priority: 'STAT',
    shortId: 'VOY001',
    route: {
      source: 'NBTS Gaborone',
      destination: 'Princess Marina Hospital',
      distance: '8.4 km',
      eta: '18 min',
      destCoords: [-24.661, 25.913],
      sourceCoords: [-24.6545, 25.9086],
    },
    payload: '2 units RBC (STAT crossmatch)',
    manifestId: 'MAN-2026-0142',
    courierId: 'Thabo Mpho · VOY-12',
    coldChain: cold(4.1, 'OK', 2),
    custodyLog: { pickupTime: isoMinutesAgo(22), pickupBy: 'Lesego Molefe (Lab)' },
    incidents: [],
    updatedAt: isoMinutesAgo(2),
    createdAt: isoMinutesAgo(45),
  },
  {
    id: 'job-voy-002',
    bloodType: 'A+',
    status: 'PENDING',
    priority: 'NORMAL',
    shortId: 'VOY002',
    route: {
      source: 'NBTS Francistown',
      destination: 'Nyangabgwe Referral Hospital',
      distance: '5.2 km',
      eta: '11 min',
      destCoords: [-21.1833, 27.5167],
      sourceCoords: [-21.1661, 27.5145],
    },
    payload: '1 platelet apheresis unit',
    manifestId: 'MAN-2026-0143',
    courierId: 'Unassigned',
    coldChain: cold(3.8, 'OK', 8),
    custodyLog: {},
    incidents: [],
    updatedAt: isoMinutesAgo(10),
    createdAt: isoMinutesAgo(90),
  },
  {
    id: 'job-voy-003',
    bloodType: 'B+',
    status: 'IN_TRANSIT',
    priority: 'NORMAL',
    shortId: 'VOY003',
    route: {
      source: 'NBTS Gaborone',
      destination: 'Maun District Hospital',
      distance: '680 km',
      eta: '6h 40m',
      destCoords: [-19.9833, 23.4167],
      sourceCoords: [-24.6545, 25.9086],
    },
    payload: '4 units FFP (remote replenishment)',
    manifestId: 'MAN-2026-0144',
    courierId: 'Lorato Kgosi · VOY-07',
    coldChain: cold(8.4, 'BREACH', 1),
    custodyLog: { pickupTime: isoMinutesAgo(180), pickupBy: 'NBTS Dispatch' },
    incidents: [
      { type: 'TEMP_BREACH', severity: 'CRITICAL', timestamp: isoMinutesAgo(15), note: 'Pack sensor 8.4°C — investigate vehicle AC' },
    ],
    updatedAt: isoMinutesAgo(1),
    createdAt: isoMinutesAgo(200),
  },
  {
    id: 'job-voy-004',
    bloodType: 'AB-',
    status: 'FLAGGED',
    priority: 'STAT',
    shortId: 'VOY004',
    route: {
      source: 'Princess Marina Hospital',
      destination: 'NBTS Gaborone (return QC)',
      distance: '8.4 km',
      eta: 'Delayed +25m',
      destCoords: [-24.6545, 25.9086],
      sourceCoords: [-24.661, 25.913],
    },
    payload: '1 unit — suspected labelling discrepancy',
    manifestId: 'MAN-2026-0145',
    courierId: 'Thabo Mpho · VOY-12',
    coldChain: cold(5.2, 'WARNING', 3),
    custodyLog: { pickupTime: isoMinutesAgo(95), pickupBy: 'PMH Blood Bank' },
    incidents: [
      { type: 'ROUTE_DELAY', severity: 'MEDIUM', timestamp: isoMinutesAgo(20), note: 'Traffic incident A1 — ETA revised' },
    ],
    updatedAt: isoMinutesAgo(5),
    createdAt: isoMinutesAgo(120),
  },
  {
    id: 'job-voy-005',
    bloodType: 'O+',
    status: 'PENDING',
    priority: 'NORMAL',
    shortId: 'VOY005',
    route: {
      source: 'Gaborone CBD Mobile Drive',
      destination: 'NBTS Gaborone',
      distance: '3.1 km',
      eta: '8 min',
      destCoords: [-24.6545, 25.9086],
      sourceCoords: [-24.6282, 25.9231],
    },
    payload: '6 collected units (mobile drive batch)',
    manifestId: 'MAN-2026-0146',
    courierId: 'Unassigned',
    coldChain: cold(4.5, 'OK', 4),
    custodyLog: {},
    incidents: [],
    updatedAt: isoMinutesAgo(30),
    createdAt: isoMinutesAgo(35),
  },
  {
    id: 'job-voy-006',
    bloodType: 'A-',
    status: 'DELIVERED',
    priority: 'NORMAL',
    shortId: 'VOY006',
    route: {
      source: 'NBTS Gaborone',
      destination: 'Princess Marina Hospital',
      distance: '8.4 km',
      eta: 'Complete',
      destCoords: [-24.661, 25.913],
      sourceCoords: [-24.6545, 25.9086],
    },
    payload: '3 units RBC',
    manifestId: 'MAN-2026-0138',
    courierId: 'Thabo Mpho · VOY-12',
    coldChain: cold(3.9, 'OK', 45),
    custodyLog: {
      pickupTime: isoMinutesAgo(120),
      pickupBy: 'NBTS Dispatch',
      deliveryTime: isoMinutesAgo(75),
      deliveryBy: 'PMH Blood Bank',
    },
    incidents: [],
    updatedAt: isoMinutesAgo(70),
    createdAt: isoMinutesAgo(150),
  },
  {
    id: 'job-voy-007',
    bloodType: 'B-',
    status: 'PENDING',
    priority: 'STAT',
    shortId: 'VOY007',
    route: {
      source: 'NBTS Francistown',
      destination: 'Selibe Phikwe Hospital',
      distance: '92 km',
      eta: '1h 15m',
      destCoords: [-21.975, 27.84],
      sourceCoords: [-21.1661, 27.5145],
    },
    payload: '2 units RBC (neonatal)',
    manifestId: 'MAN-2026-0147',
    courierId: 'Unassigned',
    coldChain: cold(3.2, 'OK', 6),
    custodyLog: {},
    incidents: [],
    updatedAt: isoMinutesAgo(8),
    createdAt: isoMinutesAgo(15),
  },
  {
    id: 'job-voy-008',
    bloodType: 'O+',
    status: 'IN_TRANSIT',
    priority: 'NORMAL',
    shortId: 'VOY008',
    route: {
      source: 'NBTS Gaborone',
      destination: 'Kasane Outreach Clinic',
      distance: '950 km',
      eta: '9h 10m',
      destCoords: [-17.8167, 25.15],
      sourceCoords: [-24.6545, 25.9086],
    },
    payload: '2 units RBC + 1 FFP',
    manifestId: 'MAN-2026-0148',
    courierId: 'Northern relay · VOY-03',
    coldChain: cold(5.8, 'WARNING', 2),
    custodyLog: { pickupTime: isoMinutesAgo(300), pickupBy: 'NBTS Dispatch' },
    incidents: [],
    updatedAt: isoMinutesAgo(12),
    createdAt: isoMinutesAgo(320),
  },
]

export const DEMO_MAP_NODES = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [25.9086, -24.6545] }, properties: { name: 'NBTS Gaborone', type: 'BLOOD_BANK', currentInventoryLevel: 62, status: 'Active' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [27.5145, -21.1661] }, properties: { name: 'NBTS Francistown', type: 'BLOOD_BANK', currentInventoryLevel: 34, status: 'Active' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [25.913, -24.661] }, properties: { name: 'Princess Marina Hospital', type: 'HOSPITAL', currentInventoryLevel: 18, status: 'Active' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [27.5167, -21.1833] }, properties: { name: 'Nyangabgwe Referral', type: 'HOSPITAL', currentInventoryLevel: 11, status: 'Active' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [23.4167, -19.9833] }, properties: { name: 'Maun District Hospital', type: 'HOSPITAL', currentInventoryLevel: 4, status: 'Critical' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [25.9231, -24.6282] }, properties: { name: 'Gaborone CBD Mobile Drive', type: 'MOBILE_DRIVE', currentInventoryLevel: 8, status: 'Active' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [25.15, -17.8167] }, properties: { name: 'Kasane Outreach', type: 'CLINIC', currentInventoryLevel: 2, status: 'Low' } },
  ],
}

export const DEMO_MAP_ROUTES = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [[25.9086, -24.6545], [25.913, -24.661]] },
      properties: { dispatchId: 'job-voy-001', courierName: 'Thabo Mpho', bloodType: 'O-', status: 'IN_TRANSIT', originFacility: 'NBTS Gaborone', destinationFacility: 'Princess Marina Hospital' },
    },
    {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [[25.9086, -24.6545], [23.4167, -19.9833]] },
      properties: { dispatchId: 'job-voy-003', courierName: 'Lorato Kgosi', bloodType: 'B+', status: 'COMPROMISED_COLD_CHAIN', originFacility: 'NBTS Gaborone', destinationFacility: 'Maun District Hospital' },
    },
    {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [[25.913, -24.661], [25.9086, -24.6545]] },
      properties: { dispatchId: 'job-voy-004', courierName: 'Thabo Mpho', bloodType: 'AB-', status: 'DELAYED', originFacility: 'Princess Marina Hospital', destinationFacility: 'NBTS Gaborone' },
    },
    {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [[27.5145, -21.1661], [27.5167, -21.1833]] },
      properties: { dispatchId: 'job-voy-002', courierName: 'Pending assign', bloodType: 'A+', status: 'PENDING', originFacility: 'NBTS Francistown', destinationFacility: 'Nyangabgwe Referral' },
    },
    {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [[25.9086, -24.6545], [25.15, -17.8167]] },
      properties: { dispatchId: 'job-voy-008', courierName: 'Northern relay', bloodType: 'O+', status: 'IN_TRANSIT', originFacility: 'NBTS Gaborone', destinationFacility: 'Kasane Outreach' },
    },
  ],
}

export const DEMO_SHIFT_LOGS = [
  { id: 'ss-1', actionPerformed: 'Released', facility: 'NBTS Gaborone', userName: 'Lesego Molefe', createdAt: isoMinutesAgo(25) },
  { id: 'ss-2', actionPerformed: 'Dispatched for Transit', facility: 'NBTS Gaborone', userName: 'Tshepo Modise', createdAt: isoMinutesAgo(22) },
  { id: 'ss-3', actionPerformed: 'In Transit', facility: 'Route PMH', userName: 'Thabo Mpho', createdAt: isoMinutesAgo(18) },
  { id: 'ss-4', actionPerformed: 'Cold chain alert', facility: 'Maun route', userName: 'Sensor VOY-07', createdAt: isoMinutesAgo(15) },
  { id: 'ss-5', actionPerformed: 'Collected', facility: 'Gaborone CBD Drive', userName: 'Scyther field team', createdAt: isoMinutesAgo(35) },
  { id: 'ss-6', actionPerformed: 'Delivered', facility: 'Princess Marina Hospital', userName: 'PMH Blood Bank', createdAt: isoMinutesAgo(75) },
]

export const COLD_CHAIN_STATUS = {
  OK: { label: 'In range', color: '#84cc16', bg: 'rgba(132,204,22,0.15)' },
  WARNING: { label: 'Approaching limit', color: '#FFB800', bg: 'rgba(255,184,0,0.12)' },
  BREACH: { label: 'Cold chain breach', color: '#FF2D55', bg: 'rgba(255,45,85,0.15)' },
}
