import { Info } from 'lucide-react'

export default function ConstellationBoundary() {
  return (
    <div
      className="mb-6 flex gap-3 rounded-xl px-4 py-3 text-xs leading-relaxed"
      style={{
        background: 'rgba(124, 58, 237, 0.08)',
        border: '1px solid rgba(124, 58, 237, 0.25)',
        color: '#8899A8',
      }}
    >
      <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--sentinel-300)' }} />
      <div>
        <p className="font-semibold text-white mb-1">Regulatory layer — not clinical operations</p>
        <p>
          <strong style={{ color: 'var(--sentinel-300)' }}>Sentinel</strong> is the Bloodchain reviewer workstation for
          structured regulator filings (BMRA returns, QMS surveillance, hemovigilance). The compliance engine — templates,
          JWT submission receipts, file hashes, and tenant isolation — runs in{' '}
          <strong style={{ color: '#5BA4D4' }}>Instances</strong>. Collection, lab, logistics, and hospital transfusion
          remain in <strong style={{ color: '#D96070' }}>Mars Lab</strong>, <strong style={{ color: '#D96070' }}>Scyther</strong>, and{' '}
          <strong style={{ color: '#D96070' }}>Transfuse</strong>. Chronic registries live in{' '}
          <strong style={{ color: '#FFB800' }}>Chronicle</strong>; research custody in <strong style={{ color: '#5BA4D4' }}>Helix</strong>.
        </p>
      </div>
    </div>
  )
}
