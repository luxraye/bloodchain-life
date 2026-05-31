import { Info } from 'lucide-react'

export default function ConstellationBoundary() {
  return (
    <div
      className="mb-6 flex gap-3 rounded-xl px-4 py-3 text-xs leading-relaxed"
      style={{
        background: 'rgba(168, 31, 56, 0.08)',
        border: '1px solid rgba(168, 31, 56, 0.22)',
        color: '#8899A8',
      }}
    >
      <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#D96070' }} />
      <div>
        <p className="font-semibold text-white mb-1">Care coordinator workstation</p>
        <p>
          <strong style={{ color: '#D96070' }}>Chronicle</strong> manages chronic cohorts, care gaps, and longitudinal plans.
          Acute transfusion is <strong style={{ color: '#5BA4D4' }}>Transfuse</strong>; national supply analytics are{' '}
          <strong style={{ color: '#5BA4D4' }}>High Command</strong>.
        </p>
      </div>
    </div>
  )
}
