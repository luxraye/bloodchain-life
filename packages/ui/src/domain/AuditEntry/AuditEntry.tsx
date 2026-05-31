import React from 'react'
import './AuditEntry.css'

export interface AuditEntryProps {
  /** Event type, e.g. "UNIT_STATUS_CHANGED" */
  event: string
  /** ISO timestamp string */
  timestamp: string
  /** Human-readable summary */
  summary: React.ReactNode
  /** Who performed the action */
  actor?: string
  actorRole?: string
  /** Short cryptographic proof snippet */
  signature?: string
  /** Hash snippet */
  hash?: string
  facility?: string
  className?: string
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-GB', {
      year:   'numeric',
      month:  'short',
      day:    '2-digit',
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    })
  } catch {
    return iso
  }
}

export function AuditEntry({
  event,
  timestamp,
  summary,
  actor,
  actorRole,
  signature,
  hash,
  facility,
  className = '',
}: AuditEntryProps) {
  return (
    <div className={['bc-audit-entry', className].filter(Boolean).join(' ')}>
      <div className="bc-audit-entry__header">
        <span className="bc-audit-entry__event">{event}</span>
        <div className="bc-audit-entry__meta">
          {signature && (
            <span className="bc-audit-entry__chip bc-audit-entry__chip--signed">
              SIGNED
            </span>
          )}
          <time className="bc-audit-entry__time" dateTime={timestamp}>
            {formatTimestamp(timestamp)}
          </time>
        </div>
      </div>

      <p className="bc-audit-entry__summary">{summary}</p>

      <div className="bc-audit-entry__footer">
        {actor && (
          <span className="bc-audit-entry__detail">
            {actor}
            {actorRole && (
              <span className="bc-audit-entry__role">{actorRole}</span>
            )}
          </span>
        )}
        {facility && (
          <span className="bc-audit-entry__detail">{facility}</span>
        )}
        {signature && (
          <span className="bc-audit-entry__mono">JWT: {signature}</span>
        )}
        {hash && (
          <span className="bc-audit-entry__mono">SHA-256: {hash}</span>
        )}
      </div>
    </div>
  )
}
