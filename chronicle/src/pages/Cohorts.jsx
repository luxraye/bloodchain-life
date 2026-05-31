import { Layers } from 'lucide-react'
import { useRegistry } from '../context/RegistryContext'
import ConstellationBoundary from '../components/ConstellationBoundary'
import { CONDITION_LABEL, CONDITION_STYLE } from '../data/seedRegistry.js'

export default function Cohorts() {
  const { cohorts } = useRegistry()

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <ConstellationBoundary />
      <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-6"><Layers style={{ color: 'var(--burg-300)' }} /> Cohort definitions</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Read-only demo rules — production uses EDW + encounter windows per your registry policy.</p>
      <div className="space-y-4">
        {cohorts.map((c) => {
          const st = CONDITION_STYLE[c.condition]
          return (
            <div key={c.id} className="card p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="badge mr-2" style={{ background: st.bg, color: st.color }}>{CONDITION_LABEL[c.condition]}</span>
                  <h2 className="text-lg font-semibold text-white">{c.label}</h2>
                </div>
                <p className="text-2xl font-bold" style={{ color: st.color }}>{c.memberCount}</p>
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div><dt className="field-label">Encounter window</dt><dd style={{ color: 'var(--text-secondary)' }}>{c.encounterWindow}</dd></div>
                <div><dt className="field-label">Detection rule</dt><dd style={{ color: 'var(--text-secondary)' }}>{c.ruleSummary}</dd></div>
              </dl>
            </div>
          )
        })}
      </div>
    </div>
  )
}
