/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        burg: {
          950: '#1A0509', 900: '#2D0A12', 800: '#4A1020', 700: '#6B1423',
          600: '#8B1A2E', 500: '#A81F38', 400: '#C4304E', 300: '#D96070',
          200: '#EAA0AA', 100: '#F7DDE0', 50: '#FDF2F4',
        },
        azure: {
          950: '#060D18', 900: '#0D1B2A', 800: '#122840', 700: '#1B3E5E',
          600: '#2A5F8F', 500: '#3A82B8', 400: '#5BA4D4', 300: '#8EC4E8',
          200: '#C2E0F4', 100: '#EAF5FC', 50: '#F5FBFF',
        },
        neon: {
          green: '#00FF88', red: '#FF2D55', blue: '#00C8FF', amber: '#FFB800',
        },
        bc: {
          base: '#07090F', surface: '#0C0F1A', raised: '#111422',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      backdropBlur: { glass: '16px' },
      animation: {
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'fade-up':    'fade-up 0.5s ease forwards',
        'glow':       'glow-pulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.35' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-burg':  '0 0 24px rgba(168,31,56,0.45)',
        'glow-azure': '0 0 20px rgba(0,200,255,0.25)',
        'glow-green': '0 0 16px rgba(0,255,136,0.3)',
        'glow-red':   '0 0 16px rgba(255,45,85,0.3)',
        'card':       '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
