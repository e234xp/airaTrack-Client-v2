const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    colors: {
      primary: '#6CBBFF',
      'primary-hover': '#2c77a0',
      'primary-border': '#80D3FF',
      secondary: '#1A1A1A',
      third: '#313131',
      panel: '#282828',
      header: '#1E1E1E',
      white: '#f2f2f2',
      black: colors.black,
      red: colors.red,
      green: colors.green,
      gray: colors.gray,
      orange: colors.orange,
      'side-bar': '#2C2C2C',
      modal: 'rgba(40, 40, 40, 1)',
      'video-bar': '#131617',
      'live-channel': '#8fb5ec',
      'archive-channel': '#77a17a',
      transparent: colors.transparent,
      general: 'rgba(100, 100, 100, 1)',
      label: 'rgba(180, 180, 180, 1)',
      'album-none': '#027CBC',
      'album-1': '#ED6060',
      'album-2': '#EDB45E',
      'album-3': '#63CF6D',
      'album-4': '#8482FF',
      'album-5': '#E17BF1',
      'ctrl-primary-hover-bg': '#2475A0'
    },
    extend: {
      textColor: {
        default: '#b5bec0',
      },
      backgroundColor: {
        'ctrl-switch': '#576264',
        default: '#485454',
      },
      boxShadow: {
        'cus': '2px 4px 12px 0px rgba(0, 0, 0, 0.25)',
        'btn': '2px 4px 8px 0px rgba(0, 0, 0, 0.15)'
      },
      borderColor: {
        modal: '#696969',
        panel: '#696969'
      },
      backgroundImage: {
        'ctrl-primary': 'linear-gradient(180deg, #4FADDF 0%, #3186B4 44.79%, #2475A0 47.4%, #3186B4 100%)',
        'ctrl-primary-hover': 'radial-gradient(50% 31.25% at 50% 100%, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, #4FADDF 0%, #3186B4 44.79%, #2475A0 47.4%, #3186B4 100%)',
        'ctrl-secondary': 'linear-gradient(180deg, #404040 0%, #232323 44.79%, #000 47.4%, #232323 100%)',
        'ctrl-secondary-hover': 'radial-gradient(50% 31.25% at 50% 100%, #67CAFF 0%, rgba(103, 202, 255, 0.00) 100%)',
        'ctrl-danger': 'linear-gradient(180deg, #B0342C 0%, #97231A 44.79%, #7D1810 47.4%, #96221A 100%)',
        'ctrl-danger-hover': 'radial-gradient(50% 31.25% at 50% 100%, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(180deg, #B0342C 0%, #97231A 44.79%, #7D1810 47.4%, #96221A 100%)',
        'ctrl-secondary-lg': 'linear-gradient(180deg, #404040 0%, #000 100%)',
        'ctrl-secondary-lg-hover': 'radial-gradient(50% 8% at 50% 100%, #67CAFF 0%, rgba(103, 202, 255, 0.00) 100%), linear-gradient(180deg, #404040 0%, #000 100%)'
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
      }
    },
    minHeight: {
      '2row': '13.5rem',
    },
    opacity: {
      80: '.80',
      50: '.50',
      40: '.40',
      30: '.30',
      20: '.20',
      0: '.0',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
