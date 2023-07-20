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
        144: '36rem',
        160: '40rem',
        176: '44rem',
        192: '48rem',
        208: '52rem',
        224: '56rem',
        240: '60rem',
        256: '64rem',
        272: '68rem',
        288: '72rem',
        304: '76rem',
        320: '80rem',
        336: '84rem',
        352: '88rem',
        368: '92rem',
        384: '96rem',
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
