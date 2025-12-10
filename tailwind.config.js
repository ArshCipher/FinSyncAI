/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#050509',
          lighter: '#0a0a0f',
          border: 'rgba(255, 255, 255, 0.05)',
        },
        accent: {
          purple: '#a855f7',
          cyan: '#06b6d4',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-premium': 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.1), transparent 50%), radial-gradient(circle at 80% 100%, rgba(6, 182, 212, 0.1), transparent 50%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'bounce-dot': 'bounce-dot 1.4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
