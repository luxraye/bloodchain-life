import { useState } from 'react'
import { X, UserCheck } from 'lucide-react'
import { DEMO_COURIERS } from '../data/seedVoyager.js'

export default function AssignCourierModal({ job, onAssign, onClose }) {
  const [selected, setSelected] = useState(null)

  const available = DEMO_COURIERS.filter(
    (c) => c.status === 'AVAILABLE' || job.courierId?.includes(c.label.split(' · ')[0]),
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-5"
        style={{ background: 'var(--bg-surface)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Assign courier</h3>
            <p className="text-[10px] font-mono text-neutral-500 mt-0.5">{job.shortId} · {job.route.source} → {job.route.destination}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {available.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c.id)}
              className={`w-full text-left rounded-xl px-3 py-2.5 border transition ${
                selected === c.id ? 'border-[rgba(132,204,22,0.5)]' : 'border-white/10 hover:border-white/20'
              }`}
              style={selected === c.id ? { background: 'rgba(132,204,22,0.1)' } : { background: 'var(--glass-bg)' }}
            >
              <p className="text-sm font-medium text-white">{c.label}</p>
              <p className="text-[10px] text-neutral-500">{c.region} · {c.status.replace('_', ' ')}</p>
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            const courier = DEMO_COURIERS.find((c) => c.id === selected)
            if (courier) onAssign(courier)
          }}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: '#84cc16' }}
        >
          <UserCheck className="w-4 h-4" />
          Confirm assignment
        </button>
      </div>
    </div>
  )
}
