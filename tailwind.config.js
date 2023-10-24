const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    colors: {
      primary: '#3cb2fe',
      'primary-hover': '#2c77a0',
      secondary: 'rgba(0, 0, 0, 0.40)',
      danger: '#dc3545',
      'danger-hover': '#a71d31',
      white: '#f2f2f2',
      black: colors.black,
      red: colors.red,
      green: colors.green,
      gray: colors.gray,
      orange: colors.orange,
      'side-bar': '#798586',
      modal: 'rgb(65,73,74)',
      'day-chart': '#242928',
      'video-bar': '#131617',
      'progress-bar': '#646f71',
      'live-channel': '#8fb5ec',
      'archive-channel': '#77a17a',
      transparent: colors.transparent
    },
    extend: {
      textColor: {
        default: '#b5bec0',
      },
      backgroundColor: {
        default: '#485454',
      },
      fontFamily: {
        custom: ['Helvetica', 'sans'],
      },
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
    minHeight: {
      '2row': '13.5rem',
    },
    opacity: {
      50: '.50',
      40: '.40',
      0: '.0',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
