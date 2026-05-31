import { mockLabAssets, mockShiftStats } from '../../mockData'
import { formatIsbt128 } from '../../lib/isbt128'
import StatusBadge, { ViralBadge } from '../StatusBadge'
import type { LabAssetStatus } from '../../types'

function StatTile({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{ background: '#111422', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] mb-1" style={{ color: '#4A5568' }}>
        {label}
      </div>
      <div className="font-mono text-2xl font-extrabold tracking-tight" style={{ color: color ?? '#F0F4F8' }}>
        {value}
      </div>
    </div>
  )
}

function viralStatus(asset: typeof mockLabAssets[0]): 'PENDING' | 'SAFE' | 'BIOHAZARD' {
  if (asset.status === 'BIOHAZARD' || asset.status === 'DISCARDED') return 'BIOHAZARD'
  if (!asset.viralScreening) return 'PENDING'
  const vals = Object.values(asset.viralScreening)
  if (vals.some(v => v === 'POSITIVE')) return 'BIOHAZARD'
  if (vals.some(v => v === 'PENDING'))  return 'PENDING'
  return 'SAFE'
}

export default function ResultsView() {
  const s = mockShiftStats
  const processed = mockLabAssets.filter(a =>
    ['RELEASED', 'BIOHAZARD', 'DISCARDED', 'QUARANTINE'].includes(a.status)
  )

  return (
    <div className="h-full overflow-y-auto scroll-thin p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Shift header */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: '#0C0F1A', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #A81F38, #C4304E, #A81F38)' }} />
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] mb-0.5" style={{ color: '#4A5568' }}>
                Shift Report
              </div>
              <div className="text-base font-bold" style={{ color: '#F0F4F8' }}>{s.date}</div>
              <div className="text-xs mt-0.5" style={{ color: '#8899A8' }}>
                Analyst: <span style={{ color: '#F0F4F8' }}>{s.analyst}</span>
                {' · '}
                Supervisor: <span style={{ color: '#F0F4F8' }}>{s.supervisor}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: '#00FF88', boxShadow: '0 0 6px rgba(0,255,136,0.5)' }}
              />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#00FF88' }}>
                Shift open
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Received"      value={s.received}      />
          <StatTile label="Released"      value={s.released}      color="#00FF88" />
          <StatTile label="Discarded"     value={s.discarded}     color="#FF2D55" />
          <StatTile label="In Progress"   value={s.inProgress}    color="#FFB800" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatTile label="Avg Turnaround" value={s.avgTurnaround} color="#00C8FF" />
          <StatTile label="Reactive Rate"  value={s.reactiveRate}  color="#FF2D55" />
          <StatTile label="Processed"      value={s.processed}     />
        </div>

        {/* Results table */}
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: '#4A5568' }}>
            Processed units this shift
          </div>
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: '#0C0F1A', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111422' }}>
                  {['Unit ID', 'Type', 'Blood', 'TTI Status', 'Disposition', 'Last Event'].map(h => (
                    <th key={h} className="px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#4A5568' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processed.map((asset, i) => (
                  <tr
                    key={asset.id}
                    style={{
                      borderBottom: i < processed.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                    className="transition-colors"
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td className="px-4 py-3 font-mono-ui text-[11px] font-semibold" style={{ color: '#8EC4E8' }}>
                      {formatIsbt128(asset.id)}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#8899A8' }}>
                      {asset.componentType}
                    </td>
                    <td className="px-4 py-3 font-mono-ui text-sm font-extrabold" style={{ color: '#D96070' }}>
                      {asset.bloodType}
                    </td>
                    <td className="px-4 py-3">
                      <ViralBadge status={viralStatus(asset)} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={asset.status as LabAssetStatus} />
                    </td>
                    <td className="px-4 py-3 text-[11px]" style={{ color: '#4A5568' }}>
                      {asset.chainOfCustody.length > 0
                        ? asset.chainOfCustody[asset.chainOfCustody.length - 1].action.slice(0, 36) + '…'
                        : '—'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {processed.length === 0 && (
              <div className="py-12 text-center font-mono text-[11px] uppercase tracking-widest" style={{ color: '#4A5568' }}>
                No units processed this shift yet
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
