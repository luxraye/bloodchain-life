import { Info } from 'lucide-react'

/**
 * Clarifies Transfuse vs Mars Lab / Scyther / Helix operational boundaries.
 */
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
        <p className="font-semibold text-white mb-1">Hospital clinical layer</p>
        <p>
          <strong style={{ color: '#5BA4D4' }}>Transfuse</strong> manages ward inventory visibility, blood
          requests, bedside transfusion verification, and haemovigilance reporting. National screening and unit
          release stay in <strong style={{ color: '#D96070' }}>Mars Lab</strong>; collection in{' '}
          <strong style={{ color: '#D96070' }}>Scyther</strong>; logistics in{' '}
          <strong style={{ color: '#D96070' }}>Voyager</strong>; clinical trials in{' '}
          <strong style={{ color: '#D96070' }}>Helix</strong>.
        </p>
      </div>
    </div>
  )
}
