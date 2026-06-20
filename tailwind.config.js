/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ef4444',
        dark: {
          900: '#050505',
          800: '#0a0a0a',
          700: '#111827',
          600: '#1f2937',
          500: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        logo: ['Ethnocentric', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
