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
        primary: {
          DEFAULT: '#4F46E5', // Deep Indigo
          hover: '#4338CA',
          light: '#EEF2FF',
          dark: '#3730A3',
          purple: '#7C3AED',
          blue: '#2563EB',
        },
        accent: {
          emerald: '#10B981',
          orange: '#F59E0B',
          pink: '#EC4899',
          cyan: '#06B6D4',
          blue: '#3B82F6',
          purple: '#8B5CF6',
        },
        light: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          secondary: '#F1F5F9',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#475569',
          subtle: '#94A3B8',
        },
        dark: {
          bg: '#0B1120',
          card: '#111827',
          secondary: '#172033',
          border: '#263244',
          text: '#F8FAFC',
          muted: '#CBD5E1',
          subtle: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 12px 20px -3px rgba(79, 70, 229, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
