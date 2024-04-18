/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#004c9b',
        'custom-yellow': '#f7de07'
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}

