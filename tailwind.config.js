/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#060709',
          900: '#0c0e14',
          800: '#131722',
          700: '#1d2333',
        },
        gold: {
          300: '#fde68a',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          accent: '#d4af37',
          shimmer: '#fff2b2',
        },
        cyber: {
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          emerald: '#10b981',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Syne', 'Outfit', 'sans-serif']
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.3))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.6))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    },
  },
  plugins: [],
}
