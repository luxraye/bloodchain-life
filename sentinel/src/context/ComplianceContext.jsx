import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { buildSeedInstances, SEED_AUDIT, TEMPLATES } from '../data/seedCompliance.js'
import * as api from '../lib/instancesApi.js'

const Ctx = createContext(null)

export function ComplianceProvider({ children }) {
  const [instances, setInstances] = useState(() => buildSeedInstances())
  const [auditLog] = useState(SEED_AUDIT)
  const [loading, setLoading] = useState(false)
  const [apiConnected, setApiConnected] = useState(false)
  const [notifications, setNotifications] = useState([])

  const notify = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID()
    setNotifications((n) => [...n, { id, message, type }])
    setTimeout(() => setNotifications((n) => n.filter((x) => x.id !== id)), 4000)
  }, [])

  const refresh = useCallback(async () => {
    if (!api.instancesApiConfigured()) {
      setApiConnected(false)
      return
    }
    setLoading(true)
    try {
      const data = await api.listInstances()
      setInstances(Array.isArray(data) ? data : [])
      setApiConnected(true)
    } catch (e) {
      setApiConnected(false)
      notify(e.message || 'Could not reach Instances API — using demo data', 'error')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    refresh()
  }, [refresh])

  const stats = useMemo(() => {
    const submitted = instances.filter((i) => i.status === 'SUBMITTED')
    const flagged = instances.filter((i) => i.status === 'FLAGGED')
    const approved = instances.filter((i) => i.status === 'APPROVED')
    const overdue = instances.filter((i) => {
      if (!i.deadline || i.status === 'APPROVED' || i.status === 'REJECTED') return false
      return new Date(i.deadline) < new Date() && ['PENDING', 'IN_PROGRESS', 'SUBMITTED'].includes(i.status)
    })
    return {
      queue: submitted.length,
      flagged: flagged.length,
      approved: approved.length,
      overdue: overdue.length,
      total: instances.length,
    }
  }, [instances])

  const getById = useCallback(
    (id) => instances.find((i) => i.id === id),
    [instances],
  )

  const review = useCallback(
    async (id, status, reviewNotes) => {
      if (api.instancesApiConfigured() && apiConnected) {
        await api.reviewInstance(id, { status, reviewNotes })
        await refresh()
        notify(`Filing ${status.toLowerCase()}`)
        return
      }
      setInstances((list) =>
        list.map((inst) =>
          inst.id === id
            ? {
                ...inst,
                status,
                reviewNotes: reviewNotes || inst.reviewNotes,
                reviewedAt: new Date().toISOString(),
              }
            : inst,
        ),
      )
      notify(`Demo: marked ${status}`)
    },
    [apiConnected, notify, refresh],
  )

  return (
    <Ctx.Provider
      value={{
        instances,
        templates: TEMPLATES,
        auditLog,
        stats,
        loading,
        apiConnected,
        isDemoData: !api.instancesApiConfigured() || !apiConnected,
        notifications,
        refresh,
        getById,
        review,
        instancesAdminUrl: api.instancesAdminUrl,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useCompliance() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCompliance must be inside ComplianceProvider')
  return ctx
}
