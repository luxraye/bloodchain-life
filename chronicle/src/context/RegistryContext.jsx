import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import {
  DEMO_PATIENTS,
  DEMO_EXCEPTIONS,
  DEMO_DISCREPANCIES,
  DEMO_COHORTS,
  getPatientById,
  registryStats,
} from '../data/seedRegistry.js'
import { chronicRegistryApi } from '../lib/api.js'

const Ctx = createContext(null)

function clonePatients(seed) {
  return seed.map((p) => ({
    ...p,
    carePlan: { ...p.carePlan, goals: [...(p.carePlan.goals || [])] },
    careGaps: [...(p.careGaps || [])],
    transfusions: [...(p.transfusions || [])],
    auditLog: [...(p.auditLog || [])],
    sdohFlags: [...(p.sdohFlags || [])],
  }))
}

export function RegistryProvider({ children }) {
  const [patients, setPatients] = useState(() => clonePatients(DEMO_PATIENTS))
  const [exceptions, setExceptions] = useState(() => [...DEMO_EXCEPTIONS])
  const [discrepancies] = useState(() => [...DEMO_DISCREPANCIES])
  const [cohorts] = useState(() => [...DEMO_COHORTS])
  const [notifications, setNotifications] = useState([])
  const [useApi, setUseApi] = useState(false)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!import.meta.env.VITE_API_URL) return
    setLoading(true)
    try {
      const res = await chronicRegistryApi.listPatients()
      if (res?.data?.length) {
        setPatients(res.data)
        setUseApi(true)
      }
      const ex = await chronicRegistryApi.listExceptions()
      if (ex?.data?.length) setExceptions(ex.data)
    } catch {
      setUseApi(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const stats = useMemo(() => registryStats(patients, exceptions), [patients, exceptions])

  const getPatient = useCallback((id) => {
    if (useApi) return patients.find((p) => p.id === id) ?? null
    return getPatientById(id) ?? patients.find((p) => p.id === id) ?? null
  }, [patients, useApi])

  const addNotification = useCallback((message, type = 'info') => {
    const nid = Date.now()
    setNotifications((prev) => [...prev, { id: nid, message, type }])
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== nid)), 4500)
  }, [])

  const updateException = useCallback(async (id, updates) => {
    setExceptions((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))
    if (useApi && import.meta.env.VITE_API_URL) {
      try {
        await chronicRegistryApi.patchException(id, updates)
      } catch {
        /* keep local demo state */
      }
    }
    addNotification('Exception updated', 'success')
  }, [addNotification, useApi])

  const updateCarePlan = useCallback((patientId, updates) => {
    setPatients((prev) => prev.map((p) => {
      if (p.id !== patientId) return p
      const next = { ...p, carePlan: { ...p.carePlan, ...updates } }
      next.auditLog = [...next.auditLog, { at: new Date().toISOString(), action: 'Care plan updated', user: 'Demo Coordinator' }]
      return next
    }))
    addNotification('Care plan saved', 'success')
  }, [addNotification])

  const resolveCareGap = useCallback((patientId, gapId) => {
    setPatients((prev) => prev.map((p) => {
      if (p.id !== patientId) return p
      return {
        ...p,
        careGaps: p.careGaps.map((g) => (g.id === gapId ? { ...g, status: 'RESOLVED' } : g)),
      }
    }))
    addNotification('Care gap marked resolved', 'success')
  }, [addNotification])

  return (
    <Ctx.Provider value={{
      patients,
      exceptions,
      discrepancies,
      cohorts,
      stats,
      loading,
      useApi,
      notifications,
      getPatient,
      updateException,
      updateCarePlan,
      resolveCareGap,
      addNotification,
      refresh,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useRegistry() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useRegistry must be inside RegistryProvider')
  return ctx
}
