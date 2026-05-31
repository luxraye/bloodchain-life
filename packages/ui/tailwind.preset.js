/**
 * Bloodchain Tailwind Preset
 *
 * Add to each app's tailwind.config.js:
 *   const bcPreset = require('@bloodchain/ui/tailwind.preset')
 *   module.exports = { presets: [bcPreset], ... }
 *
 * This extends (not replaces) Tailwind's defaults — apps keep all
 * built-in utilities and gain Bloodchain-specific tokens via `bc-*` prefix.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        burg: {
          950: '#1A0509',
          900: '#2D0A12',
          800: '#4A1020',
          700: '#6B1423',
          600: '#8B1A2E',
          500: '#A81F38',
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
        neon: {
          green: '#00FF88',
          red:   '#FF2D55',
          blue:  '#00C8FF',
          amber: '#FFB800',
        },
        bc: {
          base:    '#07090F',
          surface: '#0C0F1A',
          raised:  '#111422',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        bc:    '8px',
        'bc-lg': '12px',
        'bc-xl': '16px',
      },
      boxShadow: {
        'glow-burg':  '0 0 20px rgba(168, 31, 56, 0.4)',
        'glow-azure': '0 0 20px rgba(0, 200, 255, 0.25)',
        'glow-green': '0 0 16px rgba(0, 255, 136, 0.3)',
        'glow-red':   '0 0 16px rgba(255, 45, 85, 0.3)',
      },
      backdropBlur: {
        glass: '16px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fold:   'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
