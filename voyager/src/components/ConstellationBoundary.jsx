import { Info } from 'lucide-react'

export default function ConstellationBoundary() {
  return (
    <div
      className="mb-4 flex gap-3 rounded-xl px-4 py-3 text-xs leading-relaxed"
      style={{
        background: 'rgba(132, 204, 22, 0.08)',
        border: '1px solid rgba(132, 204, 22, 0.25)',
        color: '#8899A8',
      }}
    >
      <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#84cc16' }} />
      <div>
        <p className="font-semibold text-white mb-1">Logistics command — not hospital transfusion</p>
        <p>
          <strong style={{ color: '#84cc16' }}>Voyager</strong> is the NBTS logistics coordinator workstation:
          dispatch queue, national cold-chain map, custody handovers, and incident escalation. Unit release and
          screening remain in <strong style={{ color: '#5BA4D4' }}>Mars Lab</strong>; transfusion orders in{' '}
          <strong style={{ color: '#D96070' }}>Transfuse</strong>; national programme KPIs in{' '}
          <strong style={{ color: '#D96070' }}>High Command</strong>.
        </p>
      </div>
    </div>
  )
}
