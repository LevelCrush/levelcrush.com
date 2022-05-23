const plugin = require('tailwindcss/plugin')

module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      fontFamily: {
        'sans': ['acumin-pro','sans-serif'],
        'headline': ['atrament-web','sans-serif']
      }
    },
  },
  plugins: [
    /**
     * @type {import('tailwindcss/plugin')}
     */
    plugin(function({ addVariant }) {
        addVariant('offcanvas-opened','.offcanvas[data-showing="1"] &')
        addVariant('offcanvas-closed','.offcanvas[data-showing="0"] &')
    })
  ],
}