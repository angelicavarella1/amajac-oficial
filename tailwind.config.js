/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "amajac-green": "#2E7D32",
        "amajac-green-dark": "#1B5E20", 
        "amajac-green-light": "#4CAF50",
      }
    },
  },
  plugins: [
    typography,
  ],
}
