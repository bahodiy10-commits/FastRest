module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: { 500: '#0D9488', 600: '#0F766E' },
        copper: { 500: '#B45309' },
        charcoal: { DEFAULT: '#1C1C1E' },
        violet: { 500: '#7C3AED' },
        gold: { 500: '#F59E0B' },
      }
    },
  },
  plugins: [],
}
