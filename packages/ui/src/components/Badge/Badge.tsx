import React from 'react'
import './Badge.css'

export type BadgeVariant =
  | 'cleared'
  | 'quarantined'
  | 'transit'
  | 'pending'
  | 'archived'
  | 'burg'
  | 'azure'

export interface BadgeProps {
  variant?: BadgeVariant
  dot?: boolean
  pulse?: boolean
  children: React.ReactNode
  className?: string
}

export function Badge({
  variant = 'archived',
  dot = true,
  pulse = false,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'bc-badge',
        `bc-badge--${variant}`,
        pulse ? 'bc-badge--pulse' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dot && <span className="bc-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
}
