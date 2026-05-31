import { STATUS_STYLE } from '../data/seedCompliance.js'

export default function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.PENDING
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      {status.replace('_', ' ')}
    </span>
  )
}
