// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amajac: {
          50: "#f0f9f0",
          100: "#dcf2dc",
          200: "#bce5bc",
          300: "#8bd18b",
          400: "#52b552",
          500: "#3a9a3a", // COR PRINCIPAL
          600: "#2d7a2d", // COR ESCURA
          700: "#276127",
          800: "#224e22",
          900: "#1e411e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [forms, typography],
};