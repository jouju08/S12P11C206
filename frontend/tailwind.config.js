/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        NPSfont: ['NPSfont', ...defaultTheme.fontFamily.sans],
        CuteFont: ['CuteFont', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        main: {
          background: '#FFF7E1',
          beige: '#ECCDB4',
          btn: '#FFDEA9',
          carrot: '#FF8462',
          choose: '#E86161',
          pink: '#FFEDED',
          point: '#FFC8A4',
          point2: '#FFBF78',
          strawberry: '#FFB0B0',
          success: '#A0EE6F',
        },
        text: {
          first: '#222222',
          second: '#515151',
          third: '#B1B1B1',
          white: '#FFFFFF',
        },
        gray: {
          50: '#FFFFFF',
          100: '#E7E7E7',
          200: '#CFCFCF',
          300: '#9F9F9F',
          400: '#787878',
          500: '#4B4B4B',
          600: '#000000',
        },
      },
    },
  },
  plugins: [],
};
