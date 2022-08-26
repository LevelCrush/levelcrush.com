/**
 * @type {import('tailwindcss/plugin')}
 */
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["acumin-pro", "sans-serif"],
        headline: ["atrament-web", "sans-serif"],
      },

      screens: {
        "2xl": "1536px",
        "4k": "2160px",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("offcanvas-opened", '.offcanvas[data-showing="1"] &');
      addVariant("offcanvas-closed", '.offcanvas[data-showing="0"] &');
      addVariant("is-member", '.offcanvas[data-is-member="1"] &');
      addVariant("is-not-member", '.offcanvas[data-is-member="0"] &');
      addVariant("expanded", ".expanded &");
      addVariant("expanded-hover", ".expanded:hover &");
      addVariant("toggle-yes", 'input[type="checkbox"]:checked + &');
    }),
  ],
};
