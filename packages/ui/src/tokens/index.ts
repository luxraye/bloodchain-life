/**
 * Bloodchain Design Tokens — JavaScript/TypeScript
 *
 * Use these when you need token values in JS (e.g. Chart.js, canvas, inline
 * styles that can't use CSS custom properties). For component styling, always
 * prefer the CSS custom properties in globals.css.
 */

export const colors = {
  burg: {
    950: '#1A0509',
    900: '#2D0A12',
    800: '#4A1020',
    700: '#6B1423',
    600: '#8B1A2E',
    500: '#A81F38', // brand primary
    400: '#C4304E',
    300: '#D96070',
    200: '#EAA0AA',
    100: '#F7DDE0',
    50:  '#FDF2F4',
  },
  azure: {
    950: '#060D18',
    900: '#0D1B2A',
    800: '#122840',
    700: '#1B3E5E',
    600: '#2A5F8F',
    500: '#3A82B8',
    400: '#5BA4D4',
    300: '#8EC4E8',
    200: '#C2E0F4',
    100: '#EAF5FC',
    50:  '#F5FBFF',
  },
  neutral: {
    950: '#04050A',
    900: '#07090F',
    800: '#0C0F1A',
    700: '#111422',
    600: '#1C2030',
    500: '#2E3548',
    400: '#4A5568',
    300: '#6B7A8D',
    200: '#8899A8',
    100: '#B8C5D0',
    50:  '#E8EEF3',
  },
  neon: {
    green: '#00FF88',
    red:   '#FF2D55',
    blue:  '#00C8FF',
    amber: '#FFB800',
  },
} as const

export const semanticColors = {
  // Status — blood unit lifecycle
  cleared:   colors.neon.green,
  quarantined: colors.neon.red,
  inTransit: colors.neon.blue,
  pending:   colors.neon.amber,
  expired:   colors.neutral[400],
  discarded: colors.neutral[400],
  // Text
  textPrimary:   '#F0F4F8',
  textSecondary: colors.neutral[200],
  textMuted:     colors.neutral[400],
} as const

export const fonts = {
  sans: "'Inter', 'Segoe UI', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Consolas', monospace",
} as const

export const shadows = {
  glow: {
    burg:  '0 0 20px rgba(168, 31, 56, 0.4)',
    azure: '0 0 20px rgba(0, 200, 255, 0.25)',
    green: '0 0 16px rgba(0, 255, 136, 0.3)',
    red:   '0 0 16px rgba(255, 45, 85, 0.3)',
  },
} as const

/** Blood unit status → semantic color mapping */
export const UNIT_STATUS_COLORS: Record<string, string> = {
  CLEARED:     colors.neon.green,
  AVAILABLE:   colors.neon.green,
  QUARANTINED: colors.neon.red,
  REACTIVE:    colors.neon.red,
  DISCARDED:   colors.neutral[400],
  EXPIRED:     colors.neutral[400],
  IN_TRANSIT:  colors.neon.blue,
  RESERVED:    colors.neon.blue,
  TRANSFUSED:  colors.azure[400],
  PENDING:     colors.neon.amber,
  PROCESSING:  colors.neon.amber,
} as const
