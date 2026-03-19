/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          DEFAULT: '#131921',
          light: '#232F3E',
          yellow: '#FEBD69',
          orange: '#F3A847',
        }
      }
    },
  },
  plugins: [],
}
