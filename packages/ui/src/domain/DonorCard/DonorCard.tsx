import React from 'react'
import { GlassCard } from '../../components/GlassCard/GlassCard'
import { Badge } from '../../components/Badge/Badge'
import './DonorCard.css'

export type DonorEligibility = 'eligible' | 'deferred-temp' | 'deferred-perm' | 'unknown'

export interface DonorCardProps {
  donorId: string
  name: string
  bloodType?: string
  eligibility?: DonorEligibility
  lastDonation?: string  // ISO date string
  donationCount?: number
  haemoglobin?: number   // g/dL
  /** If true, renders a compact horizontal layout */
  compact?: boolean
  onClick?: () => void
  className?: string
}

const ELIGIBILITY_CONFIG: Record<
  DonorEligibility,
  { label: string; variant: 'cleared' | 'quarantined' | 'pending' | 'archived' }
> = {
  'eligible':      { label: 'Eligible',       variant: 'cleared' },
  'deferred-temp': { label: 'Temp. Deferred',  variant: 'pending' },
  'deferred-perm': { label: 'Perm. Deferred',  variant: 'quarantined' },
  'unknown':       { label: 'Unknown',         variant: 'archived' },
}

function weeksAgo(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime()
  const weeks = Math.floor(ms / (7 * 24 * 60 * 60 * 1000))
  if (weeks === 0) return 'This week'
  if (weeks === 1) return '1 week ago'
  return `${weeks} weeks ago`
}

export function DonorCard({
  donorId,
  name,
  bloodType,
  eligibility = 'unknown',
  lastDonation,
  donationCount,
  haemoglobin,
  compact = false,
  onClick,
  className = '',
}: DonorCardProps) {
  const elig = ELIGIBILITY_CONFIG[eligibility]

  return (
    <GlassCard
      interactive={!!onClick}
      padding={compact ? 'sm' : 'md'}
      className={['bc-donor-card', compact ? 'bc-donor-card--compact' : '', className]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      <div className="bc-donor-card__header">
        <div>
          <div className="bc-donor-card__name">{name}</div>
          <div className="bc-donor-card__id">{donorId}</div>
        </div>
        <div className="bc-donor-card__header-right">
          {bloodType && (
            <span className="bc-donor-card__blood-type">{bloodType}</span>
          )}
          <Badge variant={elig.variant}>{elig.label}</Badge>
        </div>
      </div>

      {!compact && (
        <div className="bc-donor-card__stats">
          {lastDonation && (
            <div className="bc-donor-card__stat">
              <span className="bc-donor-card__stat-label">Last donation</span>
              <span className="bc-donor-card__stat-value">
                {weeksAgo(lastDonation)}
              </span>
            </div>
          )}
          {donationCount !== undefined && (
            <div className="bc-donor-card__stat">
              <span className="bc-donor-card__stat-label">Total donations</span>
              <span className="bc-donor-card__stat-value">{donationCount}</span>
            </div>
          )}
          {haemoglobin !== undefined && (
            <div className="bc-donor-card__stat">
              <span className="bc-donor-card__stat-label">Haemoglobin</span>
              <span
                className="bc-donor-card__stat-value"
                style={{
                  color: haemoglobin >= 12.5 ? 'var(--bc-neon-green)' : 'var(--bc-neon-red)',
                }}
              >
                {haemoglobin} g/dL
              </span>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  )
}
