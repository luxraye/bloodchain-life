/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'asphalt': {
                    900: '#0f172a',
                    800: '#1e293b',
                    700: '#334155',
                },
                'safety-orange': {
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                },
                'neon-yellow': {
                    400: '#facc15',
                    500: '#eab308',
                },
                'signal-red': {
                    500: '#ef4444',
                    600: '#dc2626',
                },
                'relay-green': {
                    500: '#22c55e',
                    600: '#16a34a',
                },
            },
            fontFamily: {
                inter: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'slide-in': 'slideIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'fade-in': 'fadeIn 0.3s ease-out',
                'pulse-emergency': 'pulseEmergency 1.2s ease-in-out infinite',
                'scan-line': 'scanLine 2s linear infinite',
                'glow-orange': 'glowOrange 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                slideIn: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pulseEmergency: {
                    '0%, 100%': { borderColor: '#ef4444', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
                    '50%': { borderColor: '#fca5a5', boxShadow: '0 0 20px 4px rgba(239, 68, 68, 0.3)' },
                },
                scanLine: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                glowOrange: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(249, 115, 22, 0.3)' },
                    '50%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.6)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [],
}
