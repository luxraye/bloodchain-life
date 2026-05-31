import { Info } from 'lucide-react'

/**
 * Clarifies High Command vs operational modules in the expanded national blood OS.
 */
export default function ConstellationBoundary() {
  return (
    <div
      className="mb-6 flex gap-3 rounded-xl px-4 py-3 text-xs leading-relaxed"
      style={{
        background: 'rgba(168, 31, 56, 0.08)',
        border: '1px solid rgba(168, 31, 56, 0.25)',
        color: '#8899A8',
      }}
    >
      <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#D96070' }} />
      <div>
        <p className="font-semibold text-white mb-1">Programme command — not a clinical workstation</p>
        <p>
          <strong style={{ color: '#D96070' }}>High Command</strong> is the Ministry and NBTS programme
          cockpit: national supply KPIs, cross-module health, staff provisioning, donor KYC, and the master
          custody ledger. Collection, lab, logistics, transfusion, chronic care, research, and regulatory
          review happen in their dedicated constellation apps — linked from the{' '}
          <strong style={{ color: '#D96070' }}>Constellation</strong> view.
        </p>
      </div>
    </div>
  )
}
