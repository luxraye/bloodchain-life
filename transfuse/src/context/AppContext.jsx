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

export function AppProvider({ children }) {
  const [bloodUnits, setBloodUnits] = useState([])
  const [unitsLoading, setUnitsLoading] = useState(true)
  const [requests, setRequests] = useState(DEMO_REQUESTS)
  const [transfusions, setTransfusions] = useState([])
  const [standbyDonors, setStandbyDonors] = useState(DEMO_STANDBY)
  const [adverseEvents, setAdverseEvents] = useState(DEMO_ADVERSE)
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

  const reportAdverseEvent = useCallback((payload) => {
    const row = {
      id: `AE-${new Date().getFullYear()}-${String(adverseEvents.length + 1).padStart(4, '0')}`,
      status: 'SUBMITTED',
      reportedAt: new Date().toISOString(),
      ...payload,
    }
    setAdverseEvents(prev => [row, ...prev])
    return row
  }, [adverseEvents.length])

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
