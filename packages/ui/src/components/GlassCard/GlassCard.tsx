import React from 'react'
import './GlassCard.css'

export type GlassCardAccent = 'none' | 'burg' | 'azure' | 'green' | 'red' | 'blue' | 'amber'

export interface GlassCardProps {
  /** Top-edge accent colour bar */
  accent?: GlassCardAccent
  /** Makes the card interactive (hover lift + cursor pointer) */
  interactive?: boolean
  /** Tighter or looser internal padding */
  padding?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  as?: keyof JSX.IntrinsicElements
}

export function GlassCard({
  accent = 'none',
  interactive = false,
  padding = 'md',
  children,
  className = '',
  onClick,
  as: Tag = 'div',
}: GlassCardProps) {
  return (
    // @ts-expect-error — dynamic tag is safe here
    <Tag
      className={[
        'bc-glass-card',
        `bc-glass-card--pad-${padding}`,
        accent !== 'none' ? `bc-glass-card--accent-${accent}` : '',
        interactive ? 'bc-glass-card--interactive' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </Tag>
  )
}
