import Noir from './shared/utils/themes/noir'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devServer: {
    port: 3080,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api',
    },
  },
  typescript: {
    typeCheck: true
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    '@primevue/nuxt-module',
  ],
  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix',
    langDir: 'locales',
    locales: [
      { code: 'en', name: 'EN', file: 'en.json' },
      { code: 'uk', name: 'UA', file: 'uk.json' },
    ],
  },
  primevue: {
    components: {
      prefix: 'V', // now use <VButton />, <VInputText />, <VDialog />, ...
    },
    options: {
      pt: {
        button: {
          root: {
            class: [
              'w-full',
              'px-4 py-2',
              'border-none',
              'hover:bg-transparent',
              'hover:border-none',
              'hover:text-inherit',
              'focus:ring-0',
              'focus:shadow-none',
              'transition-none',
            ].join(' '),
          },
        },
        inputtext: {
          root: {
            class: 'w-full',
          },
        },
        password: {
          input: {
            class: 'w-full',
          },
        },
      },
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: 'light',
        },
      },
    },
  },
})
