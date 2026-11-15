/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#faf7fd',
          100: '#f3eefb',
          200: '#e8ddf7',
          300: '#d7c2f1',
          400: '#be9de7',
          500: '#a375dc',
          600: '#8c55ce',
          700: '#7641b5',
          800: '#623795',
          900: '#522f7a',
        },
        pastel: {
          blue: '#e8f1fc',
          purple: '#ede9fe',
          mint: '#e6f7f2',
          rose: '#fce7f3',
          amber: '#fef3c7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'breathe-slow': 'breathe 16s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '25%': { transform: 'scale(1.45)', opacity: '1' },
          '50%': { transform: 'scale(1.45)', opacity: '1' },
          '75%': { transform: 'scale(1)', opacity: '0.85' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}

