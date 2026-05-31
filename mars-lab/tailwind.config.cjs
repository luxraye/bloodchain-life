/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        burg: {
          950: '#1A0509', 900: '#2D0A12', 800: '#4A1020', 700: '#6B1423',
          600: '#8B1A2E', 500: '#A81F38', 400: '#C4304E', 300: '#D96070',
          200: '#EAA0AA', 100: '#F7DDE0',
        },
        azure: {
          900: '#0D1B2A', 800: '#122840', 700: '#1B3E5E',
          600: '#2A5F8F', 500: '#3A82B8', 400: '#5BA4D4', 300: '#8EC4E8',
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
          border:  'rgba(255,255,255,0.09)',
        },
      },
      boxShadow: {
        'glow-burg':  '0 0 20px rgba(168,31,56,0.4)',
        'glow-red':   '0 0 12px rgba(255,45,85,0.5)',
        'glow-green': '0 0 12px rgba(0,255,136,0.35)',
        'glow-azure': '0 0 16px rgba(0,200,255,0.25)',
      },
      animation: {
        'pulse-slow':   'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow-pulse':   'glow-pulse 2s ease-in-out infinite',
        'fade-in':      'fade-in 0.2s ease forwards',
        'slide-in-right': 'slide-in-right 0.22s ease forwards',
      },
      keyframes: {
        'glow-pulse': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.3' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to:   { opacity: '1', transform: 'none' },
        },
      },
    },
  },
  plugins: [],
}
