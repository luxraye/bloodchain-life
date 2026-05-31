import { SAMPLE_STATUS } from '../data/seedStudies'

const STATUS_COLOR = {
  REGISTERED: '#8899A8',
  COLLECTED: '#D96070',
  IN_TRANSIT: '#5BA4D4',
  RECEIVED_BIOBANK: '#00FF88',
  ALIQUOTED: '#00C8FF',
  IN_ANALYSIS: '#a78bfa',
  ARCHIVED: '#4A5568',
  DESTROYED: '#FF2D55',
}

export default function CustodyTimeline({ events, compact }) {
  if (!events?.length) {
    return <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No custody events recorded.</p>
  }

  const sorted = [...events].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  return (
    <ol className={compact ? 'space-y-2' : 'space-y-3'}>
      {sorted.map((ev, i) => (
        <li key={ev.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
              style={{ background: STATUS_COLOR[ev.status] ?? '#8899A8', boxShadow: `0 0 8px ${STATUS_COLOR[ev.status] ?? '#8899A8'}55` }}
            />
            {i < sorted.length - 1 && <div className="w-px flex-1 min-h-[24px] my-1" style={{ background: 'rgba(255,255,255,0.08)' }} />}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge font-mono-ui" style={{ background: 'rgba(168,31,56,0.12)', color: STATUS_COLOR[ev.status] ?? '#D96070' }}>
                {ev.status}
              </span>
              <span className="font-mono-ui text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {new Date(ev.createdAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
            <p className="text-xs mt-1 text-white">
              {ev.actorName} · <span style={{ color: 'var(--text-secondary)' }}>{ev.actorRole}</span>
            </p>
            <p className="text-[11px] font-mono-ui mt-0.5" style={{ color: 'var(--text-muted)' }}>{ev.location}</p>
            {ev.notes && <p className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>{ev.notes}</p>}
          </div>
        </li>
      ))}
      {!compact && (
        <li className="text-[9px] font-mono-ui mt-2" style={{ color: '#2E3548' }}>
          Research specimen lifecycle (not NBTS BloodAsset status)
        </li>
      )}
    </ol>
  )
}
