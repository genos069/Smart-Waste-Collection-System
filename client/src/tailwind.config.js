/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ MUST be class
  content: [
    "./index.html",      // ✅ IMPORTANT for Vite
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};