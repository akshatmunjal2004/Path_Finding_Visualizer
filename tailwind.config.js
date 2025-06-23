/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#27374D',
        accent: '#9DB2BF',
        highlight: '#DDE6ED',
        wall: '#1C1F26',
        visited: '#748DA6'
      }
    }
  },
  plugins: [],
}
