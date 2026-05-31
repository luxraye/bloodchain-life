import { Info } from 'lucide-react'

export default function ConstellationBoundary() {
  return (
    <div
      className="mb-5 flex gap-3 rounded-xl px-4 py-3 text-xs leading-relaxed"
      style={{
        background: 'rgba(0, 200, 255, 0.08)',
        border: '1px solid rgba(0, 200, 255, 0.22)',
        color: 'var(--text-secondary)',
      }}
    >
      <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#00C8FF' }} />
      <div>
        <p className="font-semibold text-slate-900 mb-1">Public donor portal</p>
        <p className="text-slate-600">
          <strong style={{ color: '#00C8FF' }}>Azure</strong> is for citizens — registration, eligibility, scheduling, and appeals.
          Collection happens in <strong style={{ color: '#84cc16' }}>Scyther</strong>; screening in{' '}
          <strong style={{ color: '#5BA4D4' }}>Mars Lab</strong>; hospital transfusion in{' '}
          <strong style={{ color: '#FF2D55' }}>Transfuse</strong>.
        </p>
      </div>
    </div>
  )
}
