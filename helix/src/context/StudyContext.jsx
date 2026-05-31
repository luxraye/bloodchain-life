import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DEMO_STUDIES, getStudyById } from '../data/seedStudies.js'
import { researchApi } from '../lib/api.js'

const Ctx = createContext(null)

export function StudyProvider({ children }) {
  const [studies, setStudies] = useState(DEMO_STUDIES)
  const [loading, setLoading] = useState(false)
  const [useApi, setUseApi] = useState(false)

  const refresh = useCallback(async () => {
    if (!import.meta.env.VITE_API_URL) return
    setLoading(true)
    try {
      const res = await researchApi.listStudies()
      if (res?.data?.length) {
        setStudies(res.data)
        setUseApi(true)
      }
    } catch {
      setUseApi(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const [detailCache, setDetailCache] = useState({})

  const getStudy = useCallback((id) => {
    if (!id) return null
    if (detailCache[id]) return detailCache[id]
    if (useApi) return studies.find(s => s.id === id) ?? null
    return getStudyById(id)
  }, [studies, useApi, detailCache])

  const loadStudy = useCallback(async (id) => {
    if (!id || !import.meta.env.VITE_API_URL) return getStudyById(id)
    try {
      const res = await researchApi.getStudy(id)
      if (res?.data) {
        setDetailCache((c) => ({ ...c, [id]: res.data }))
        return res.data
      }
    } catch {
      /* fall through */
    }
    return getStudyById(id)
  }, [])

  return (
    <Ctx.Provider value={{ studies, loading, useApi, getStudy, loadStudy, refresh }}>
      {children}
    </Ctx.Provider>
  )
}

export function useStudies() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStudies must be inside <StudyProvider>')
  return ctx
}
