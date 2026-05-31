/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Bloodchain tokens
        burg: {
          50: '#FDF2F4', 100: '#F7DDE0', 200: '#EAA0AA', 300: '#D96070',
          400: '#C4304E', 500: '#A81F38', 600: '#8B1A2E', 700: '#6B1423',
          800: '#4A1020', 900: '#2D0A12',
        },
        azure: {
          50: '#F5FBFF', 100: '#EAF5FC', 200: '#C2E0F4', 300: '#8EC4E8',
          400: '#5BA4D4', 500: '#3A82B8', 600: '#2A5F8F', 700: '#1B3E5E',
          800: '#122840', 900: '#0D1B2A',
        },
        // Scyther-inherited clinical UI tokens
        'brand-red': {
          50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
          400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c',
          800: '#991b1b', 900: '#7f1d1d',
        },
        'med-blue': {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a',
        },
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn: { '0%': { transform: 'translateX(-8px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
