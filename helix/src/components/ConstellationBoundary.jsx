import { Info } from 'lucide-react'

/**
 * Clarifies Helix vs Mars Lab / operational constellation — per CDC/WHO report scope.
 */
export default function ConstellationBoundary() {
  return (
    <div
      className="mb-6 flex gap-3 rounded-xl px-4 py-3 text-xs leading-relaxed"
      style={{
        background: 'rgba(58, 130, 184, 0.08)',
        border: '1px solid rgba(58, 130, 184, 0.25)',
        color: '#8899A8',
      }}
    >
      <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#5BA4D4' }} />
      <div>
        <p className="font-semibold text-white mb-1">Research layer — not national blood banking</p>
        <p>
          <strong style={{ color: '#5BA4D4' }}>Helix</strong> governs clinical trial specimens, study participants,
          ethics audit trails, and research custody. National TTI screening, unit release, and hospital transfusion
          remain in <strong style={{ color: '#D96070' }}>Mars Lab</strong>, <strong style={{ color: '#D96070' }}>Scyther</strong>, and{' '}
          <strong style={{ color: '#D96070' }}>Transfuse</strong>.
        </p>
      </div>
    </div>
  )
}
