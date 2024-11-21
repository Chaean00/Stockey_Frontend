/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');
export default withMT({
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', './index.html'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      gray: {
        100: '#F2F4F6', //sidebar bg
        200: '#E0E8F0', //sidebar selected
        300: '#DDDDDD', //stroke
        400: '#A1A4AF', //sidebar gray text
      },
      black: '#313544',
      red: { 100: '#FF7A73', 200: '#F04452' },
      blue: {
        100: '#88AAFD',
        200: '#0046FF',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Arial', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
});
