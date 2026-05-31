import React from 'react'
import { Badge } from '../../components/Badge/Badge'
import type { BadgeVariant } from '../../components/Badge/Badge'
import { UNIT_STATUS_COLORS } from '../../tokens'

/**
 * Canonical blood unit status values across the platform.
 * Any string not in this union falls back to 'archived' styling.
 */
export type BloodUnitStatus =
  | 'CLEARED'
  | 'AVAILABLE'
  | 'QUARANTINED'
  | 'REACTIVE'
  | 'IN_TRANSIT'
  | 'RESERVED'
  | 'PENDING'
  | 'PROCESSING'
  | 'TRANSFUSED'
  | 'DISCARDED'
  | 'EXPIRED'

const STATUS_VARIANT: Record<BloodUnitStatus, BadgeVariant> = {
  CLEARED:     'cleared',
  AVAILABLE:   'cleared',
  QUARANTINED: 'quarantined',
  REACTIVE:    'quarantined',
  IN_TRANSIT:  'transit',
  RESERVED:    'transit',
  PENDING:     'pending',
  PROCESSING:  'pending',
  TRANSFUSED:  'azure',
  DISCARDED:   'archived',
  EXPIRED:     'archived',
}

const STATUS_LABEL: Record<BloodUnitStatus, string> = {
  CLEARED:     'Cleared',
  AVAILABLE:   'Available',
  QUARANTINED: 'Quarantined',
  REACTIVE:    'Reactive',
  IN_TRANSIT:  'In Transit',
  RESERVED:    'Reserved',
  PENDING:     'Pending Review',
  PROCESSING:  'Processing',
  TRANSFUSED:  'Transfused',
  DISCARDED:   'Discarded',
  EXPIRED:     'Expired',
}

const URGENT_STATUSES: BloodUnitStatus[] = ['QUARANTINED', 'REACTIVE', 'EXPIRED']

export interface BloodUnitBadgeProps {
  status: BloodUnitStatus | string
  /** Override the display label */
  label?: string
  className?: string
}

export function BloodUnitBadge({ status, label, className }: BloodUnitBadgeProps) {
  const s = status as BloodUnitStatus
  const variant: BadgeVariant = STATUS_VARIANT[s] ?? 'archived'
  const displayLabel = label ?? STATUS_LABEL[s] ?? status
  const pulse = URGENT_STATUSES.includes(s)

  return (
    <Badge variant={variant} pulse={pulse} className={className}>
      {displayLabel}
    </Badge>
  )
}

/** Exposes the raw color for a status (useful for charts/canvas) */
export function getStatusColor(status: string): string {
  return UNIT_STATUS_COLORS[status as BloodUnitStatus] ?? '#4A5568'
}
