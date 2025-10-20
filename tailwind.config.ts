import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          dark: 'var(--color-primary-dark)',
          blue: 'var(--color-primary-blue)',
          purple: 'var(--color-primary-purple)',
          white: 'var(--color-primary-white)',
          yellow: 'var(--color-primary-yellow)',
          green: 'var(--color-primary-green)',
          red: 'var(--color-primary-red)',
          pink: 'var(--color-primary-pink)',
          black: 'var(--color-primary-black)',
          purewhite: 'var(--color-primary-pure-white)',
          lavender: 'var(--color-primary-lavender)',
        },
        gray: {
          deepgraphite: 'var(--color-gray-deep-graphite)',
          lavender: 'var(--color-gray-lavender)',
          palelavender: 'var(--color-gray-pale-lavender)',
          lightlavender: 'var(--color-gray-light-lavender)',
          darkcharcoal: 'var(--color-gray-dark-charcoal)',
          darkgraphite: 'var(--color-gray-dark-graphite)',
          muted: 'var(--color-muted-gray)',
          light: 'var(--color-muted-light-gray)',
        },
        smalltitle: 'var(--small-title-color)',
      },
      borderRadius: {
        DEFAULT: 'var(--default-rounded)',
      },
      fontFamily: {
        murecho: 'var(--ff-murecho)',
      },
    },
    screens: {
      lg: '1024px',
      'only-mobile': { max: '1023px' },
    },
  },
};
