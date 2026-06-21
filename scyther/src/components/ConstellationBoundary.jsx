import { Info } from 'lucide-react'

/** Clarifies Scyther vs hospital / lab boundaries (matches Transfuse pattern). */
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
        <p className="font-semibold text-white mb-1">Field collection layer</p>
        <p>
          <strong style={{ color: '#D96070' }}>Scyther</strong> handles donor check-in, screening, phlebotomy,
          and drive-day labelling. Donor retention and scheduling live in{' '}
          <strong style={{ color: '#5BA4D4' }}>Azure</strong>; laboratory release in{' '}
          <strong style={{ color: '#D96070' }}>Mars Lab</strong>; hospital transfusion in{' '}
          <strong style={{ color: '#D96070' }}>Transfuse</strong>.
        </p>
      </div>
    </div>
  )
}
