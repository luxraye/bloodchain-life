/**
 * @bloodchain/ui
 * Bloodchain shared component library
 *
 * Usage:
 *   import '@bloodchain/ui/styles'              // once, at app root
 *   import { Button, Input, GlassCard } from '@bloodchain/ui'
 */

// ── Styles (re-exported so apps can import from the package) ──────────
export { default as GlobalStyles } from './styles/globals.css?inline'

// ── Tokens ────────────────────────────────────────────────────────────
export * from './tokens/index'

// ── Base Components ───────────────────────────────────────────────────
export { Button }      from './components/Button/Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button/Button'

export { Badge }       from './components/Badge/Badge'
export type { BadgeProps, BadgeVariant } from './components/Badge/Badge'

export { Input }       from './components/Input/Input'
export type { InputProps, InputState, InputFeedback } from './components/Input/Input'

export { Select }      from './components/Select/Select'
export type { SelectProps, SelectOption } from './components/Select/Select'

export { GlassCard }   from './components/GlassCard/GlassCard'
export type { GlassCardProps, GlassCardAccent } from './components/GlassCard/GlassCard'

export { Accordion, AccordionItem } from './components/Accordion/Accordion'
export type { AccordionProps, AccordionItemProps } from './components/Accordion/Accordion'

export { StatCard }    from './components/StatCard/StatCard'
export type { StatCardProps, StatTrend } from './components/StatCard/StatCard'

export { Modal }       from './components/Modal/Modal'
export type { ModalProps, ModalSize } from './components/Modal/Modal'

// ── Domain Components ─────────────────────────────────────────────────
export { BloodUnitBadge, getStatusColor } from './domain/BloodUnitBadge/BloodUnitBadge'
export type { BloodUnitBadgeProps, BloodUnitStatus } from './domain/BloodUnitBadge/BloodUnitBadge'

export { AuditEntry }  from './domain/AuditEntry/AuditEntry'
export type { AuditEntryProps } from './domain/AuditEntry/AuditEntry'

export { DonorCard }   from './domain/DonorCard/DonorCard'
export type { DonorCardProps, DonorEligibility } from './domain/DonorCard/DonorCard'
