/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        "pa-chrome": ["puffin-arcade-chrome", "sans-serif"],
        "pa-dither": ["puffin-arcade-dither", "sans-serif"],
        "pa-regular": ["puffin-arcade-regular", "sans-serif"],
        "pa-yoko": ["puffin-arcade-yoko", "sans-serif"],
      },
    },
  },
  plugins: [],
};
