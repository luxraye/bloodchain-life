import React from 'react'
import './StatCard.css'

export type StatTrend = 'up' | 'down' | 'neutral'

export interface StatCardProps {
  label: string
  value: React.ReactNode
  sub?: string
  trend?: StatTrend
  trendLabel?: string
  /** Colour the value using a semantic key */
  valueColor?: 'green' | 'red' | 'blue' | 'amber' | 'primary'
  interactive?: boolean
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const TREND_ICONS: Record<StatTrend, string> = {
  up:      '↑',
  down:    '↓',
  neutral: '→',
}

export function StatCard({
  label,
  value,
  sub,
  trend,
  trendLabel,
  valueColor = 'primary',
  interactive = false,
  className = '',
  onClick,
}: StatCardProps) {
  return (
    <div
      className={[
        'bc-stat-card',
        interactive ? 'bc-stat-card--interactive' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="bc-stat-card__label">{label}</div>
      <div className={`bc-stat-card__value bc-stat-card__value--${valueColor}`}>
        {value}
      </div>
      {sub && <div className="bc-stat-card__sub">{sub}</div>}
      {trend && trendLabel && (
        <div className={`bc-stat-card__trend bc-stat-card__trend--${trend}`}>
          <span aria-hidden="true">{TREND_ICONS[trend]}</span>
          {trendLabel}
        </div>
      )}
    </div>
  )
}
