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
      note: colors.red,
      gray: colors.gray,
    },
    extend: {
      spacing: {
        112: '28rem',
      },
    },
    opacity: {
      50: '.50',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
