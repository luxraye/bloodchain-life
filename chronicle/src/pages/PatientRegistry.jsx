import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ChevronRight } from 'lucide-react'
import { useRegistry } from '../context/RegistryContext'
import ConstellationBoundary from '../components/ConstellationBoundary'
import { CONDITION_LABEL, CONDITION_STYLE } from '../data/seedRegistry.js'

export default function PatientRegistry() {
  const { patients } = useRegistry()
  const [filter, setFilter] = useState('ALL')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    let list = filter === 'ALL' ? patients : patients.filter((p) => p.condition === filter)
    if (q.trim()) {
      const s = q.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(s) || p.registryId.toLowerCase().includes(s) || p.site.toLowerCase().includes(s))
    }
    return list
  }, [patients, filter, q])

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <ConstellationBoundary />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users style={{ color: 'var(--burg-300)' }} /> Patient registry</h1>
        <input className="input-field mt-4 max-w-md" placeholder="Search name, registry ID, site…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'HAEMOPHILIA', 'SICKLE_CELL', 'THALASSEMIA'].map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filter === f ? 'tab-active' : 'tab-idle'}`}>
            {f === 'ALL' ? 'All' : CONDITION_LABEL[f]}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((p) => {
          const st = CONDITION_STYLE[p.condition]
          const openGaps = p.careGaps.filter((g) => g.status === 'OPEN').length
          return (
            <Link key={p.id} to={`/patients/${p.id}`} className="card block p-5 hover:border-[rgba(168,31,56,0.35)] transition group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="font-mono-ui text-xs font-bold" style={{ color: 'var(--burg-300)' }}>{p.registryId}</span>
                    <span className="badge" style={{ background: st.bg, color: st.color }}>{CONDITION_LABEL[p.condition]}</span>
                    {openGaps > 0 && <span className="badge-chronic">{openGaps} gap(s)</span>}
                  </div>
                  <h2 className="text-lg font-semibold text-white">{p.name}</h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{p.site}</p>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
