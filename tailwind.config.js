const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    colors: {
      primary: '#2a7398',
      'primary-hover': '#6e9eb8',
      secondary: '#2b3b3d',
      white: '#ffffff',
      note: colors.red,
      gray: colors.gray,
    },
    extend: {
      spacing: {
        112: '28rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
