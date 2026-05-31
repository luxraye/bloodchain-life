/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#dc2626', // Tailwind red-600
        },
      },
      boxShadow: {
        'soft-card': '0 18px 45px rgba(15, 23, 42, 0.12)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}

