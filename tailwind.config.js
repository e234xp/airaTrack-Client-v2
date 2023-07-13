const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    colors: {
      primary: '#3183b1',
      'primary-hover': '#2c77a0',
      secondary: '#151e1e',
      white: '#ffffff',
      red: colors.red,
      gray: colors.gray,
    },
    extend: {
      spacing: {
        112: '28rem',
        128: '32rem',
      },
    },
    opacity: {
      50: '.50',
      40: '.40',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
