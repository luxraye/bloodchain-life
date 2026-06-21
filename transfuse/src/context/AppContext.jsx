/**
 * Transfuse App Context — hospital clinical state only.
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getAssets } from '../lib/api.js'
import { getInventoryByType } from '../lib/collectionHelpers.js'

const AppContext = createContext(null)

const DEMO_REQUESTS = [
  { id: 'req_001', requesterType: 'PATIENT_FAMILY', patientName: 'M. Sithole', bloodType: 'O+', unitsNeeded: 2, urgency: 'CRITICAL', reason: 'Emergency surgery — trauma unit', status: 'PENDING', createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'req_002', requesterType: 'HOSPITAL_INTERNAL', patientName: 'Hospital Stock', bloodType: 'A-', unitsNeeded: 4, urgency: 'ROUTINE', reason: 'Monthly elective surgery stock', status: 'VERIFIED', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'req_003', requesterType: 'PATIENT_FAMILY', patientName: 'K. Moagi', bloodType: 'B+', unitsNeeded: 1, urgency: 'URGENT', reason: 'Post-operative anaemia', status: 'PENDING', createdAt: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'req_004', requesterType: 'HOSPITAL_INTERNAL', patientName: 'ICU Reserve', bloodType: 'O-', unitsNeeded: 6, urgency: 'URGENT', reason: 'ICU emergency reserve top-up', status: 'FULFILLED', createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
]

const DEMO_STANDBY = [
  { id: 'sb_001', name: 'T. Nakedi', bloodType: 'O-', phone: '+267 71 234 567', location: 'Gaborone CBD', distance: '2.1 km', status: 'STANDBY', eligibleSince: new Date(Date.now() - 70 * 86400000).toISOString() },
  { id: 'sb_002', name: 'R. Dlamini', bloodType: 'A+', phone: '+267 72 345 678', location: 'Tlokweng', distance: '5.8 km', status: 'APPROVED', eligibleSince: new Date(Date.now() - 90 * 86400000).toISOString() },
  { id: 'sb_003', name: 'M. Phiri', bloodType: 'B-', phone: '+267 73 456 789', location: 'Mogoditshane', distance: '8.2 km', status: 'STANDBY', eligibleSince: new Date(Date.now() - 65 * 86400000).toISOString() },
]

const DEMO_ADVERSE = [
  {
    id: 'AE-2026-0003',
    patientRef: 'PAT-2026-002',
    unitId: 'TF-2026-0034',
    eventType: 'Febrile non-haemolytic reaction',
    severity: 'MILD',
    status: 'UNDER_REVIEW',
    narrative: 'Temp 38.2°C within 2h of transfusion; resolved with paracetamol.',
    reportedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
]

// Hospital Transfusion Committee — standing review queue (the active HTC the
// WHO assessment found missing at Botswana hospitals).
const DEMO_HTC_REVIEWS = [
  {
    id: 'HTC-2026-021',
    kind: 'ADVERSE_EVENT',
    title: 'Acute haemolytic reaction — ABO incompatibility',
    patientRef: 'PAT-2026-002',
    unitId: 'TF-2026-0034',
    severity: 'SEVERE',
    priority: 'HIGH',
    summary: 'Suspected clerical mismatch; unit stopped at 15 mL. Root-cause review required.',
    status: 'PENDING_REVIEW',
    raisedBy: 'Blood Bank · on duty',
    raisedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'HTC-2026-022',
    kind: 'APPROPRIATENESS',
    title: 'Single-unit RBC in stable, non-bleeding patient',
    patientRef: 'PAT-2026-004',
    unitId: 'TF-2026-0051',
    severity: 'MODERATE',
    priority: 'MEDIUM',
    summary: 'Transfusion at Hb 8.4 g/dL without documented symptoms — appropriateness review.',
    status: 'PENDING_REVIEW',
    raisedBy: 'Haematology registrar',
    raisedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'HTC-2026-023',
    kind: 'MASSIVE_TRANSFUSION',
    title: 'Massive transfusion protocol activation — theatre',
    patientRef: 'PAT-2026-001',
    unitId: null,
    severity: 'MODERATE',
    priority: 'MEDIUM',
    summary: '8 units RBC + 4 FFP in obstetric haemorrhage. MTP audit + ratio review.',
    status: 'IN_REVIEW',
    raisedBy: 'Theatre lead',
    raisedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'HTC-2026-024',
    kind: 'NEAR_MISS',
    title: 'Wrong-blood-in-tube intercepted at lab',
    patientRef: 'PAT-2026-005',
    unitId: null,
    severity: 'MILD',
    priority: 'LOW',
    summary: 'Sample mislabel caught at grouping; no patient harm. Process review.',
    status: 'PENDING_REVIEW',
    raisedBy: 'Mars Lab',
    raisedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
]

export function AppProvider({ children }) {
  const [bloodUnits, setBloodUnits] = useState([])
  const [unitsLoading, setUnitsLoading] = useState(true)
  const [requests, setRequests] = useState(DEMO_REQUESTS)
  const [transfusions, setTransfusions] = useState([])
  const [standbyDonors, setStandbyDonors] = useState(DEMO_STANDBY)
  const [adverseEvents, setAdverseEvents] = useState(DEMO_ADVERSE)
  const [htcReviews, setHtcReviews] = useState(DEMO_HTC_REVIEWS)
  const [notifications, setNotifications] = useState([])

  const inventory = getInventoryByType(bloodUnits)

  useEffect(() => {
    let cancelled = false
    getAssets()
      .then(res => { if (!cancelled) setBloodUnits(res.data ?? []) })
      .catch(() => { if (!cancelled) setBloodUnits([]) })
      .finally(() => { if (!cancelled) setUnitsLoading(false) })
    return () => { cancelled = true }
  }, [])

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4500)
  }, [])

  const updateRequest = useCallback((id, updates) => {
    setRequests(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)))
  }, [])

  const addRequest = useCallback((req) => {
    const row = {
      id: `req_${Date.now().toString(36)}`,
      requesterType: 'HOSPITAL_INTERNAL',
      patientName: 'Hospital Stock',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      ...req,
    }
    setRequests(prev => [row, ...prev])
    return row
  }, [])

  const addTransfusion = useCallback((txn) => {
    setTransfusions(prev => [...prev, txn])
    setBloodUnits(prev => prev.map(u => (u.id === txn.unitId ? { ...u, status: 'USED' } : u)))
    addNotification(`Transfusion ${txn.id} recorded — unit marked USED`, 'success')
  }, [addNotification])

  const updateStandbyDonor = useCallback((id, updates) => {
    setStandbyDonors(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)))
  }, [])

  const addHtcReview = useCallback((review) => {
    const row = {
      id: `HTC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
      status: 'PENDING_REVIEW',
      priority: 'HIGH',
      raisedAt: new Date().toISOString(),
      ...review,
    }
    setHtcReviews(prev => [row, ...prev])
    return row
  }, [])

  const updateHtcReview = useCallback((id, updates) => {
    setHtcReviews(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)))
  }, [])

  const reportAdverseEvent = useCallback((payload) => {
    const row = {
      id: `AE-${new Date().getFullYear()}-${String(adverseEvents.length + 1).padStart(4, '0')}`,
      status: 'SUBMITTED',
      reportedAt: new Date().toISOString(),
      ...payload,
    }
    setAdverseEvents(prev => [row, ...prev])
    // Route every reported reaction onto the Hospital Transfusion Committee queue.
    addHtcReview({
      kind: 'ADVERSE_EVENT',
      title: payload.eventType || 'Adverse transfusion reaction',
      patientRef: payload.patientRef,
      unitId: payload.unitId ?? null,
      severity: payload.severity || 'MODERATE',
      priority: ['SEVERE', 'FATAL'].includes(payload.severity) ? 'HIGH' : 'MEDIUM',
      summary: payload.narrative || 'Adverse reaction reported for committee review.',
      raisedBy: 'Haemovigilance',
      linkedEventId: row.id,
    })
    return row
  }, [adverseEvents.length, addHtcReview])

  const updateAdverseEvent = useCallback((id, updates) => {
    setAdverseEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)))
  }, [])

  return (
    <AppContext.Provider value={{
      bloodUnits,
      setBloodUnits,
      unitsLoading,
      inventory,
      requests,
      updateRequest,
      addRequest,
      transfusions,
      addTransfusion,
      standbyDonors,
      updateStandbyDonor,
      adverseEvents,
      reportAdverseEvent,
      updateAdverseEvent,
      htcReviews,
      addHtcReview,
      updateHtcReview,
      notifications,
      addNotification,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be within AppProvider')
  return ctx
}
