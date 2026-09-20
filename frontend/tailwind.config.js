/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#000000',
        navy: {
          DEFAULT: '#14213D',
          light: '#1e3057',
          dark: '#0e172c'
        },
        accent: {
          DEFAULT: '#FCA311',
          hover: '#e59206',
          light: '#fff4e0'
        },
        neutral: {
          DEFAULT: '#E5E5E5',
          light: '#f5f5f5',
          dark: '#cccccc'
        },
        surface: '#FFFFFF'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
