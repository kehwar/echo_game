// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Enable static site generation for GitHub Pages
  ssr: false,
  
  // Configure for GitHub Pages deployment
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/echo_game/' : '/',
    buildAssetsDir: '/assets/',
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },
  
  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false,
  },
  
  // ESLint module
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/i18n', '@pinia/nuxt'],

  // Global CSS
  css: ['~/assets/css/main.css'],

  // Shadcn-nuxt configuration
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  // i18n configuration
  i18n: {
    langDir: 'locales',
    locales: [
      {
        code: 'en-US',
        name: 'English (US)',
        file: 'en-US.json'
      },
      {
        code: 'es-ES',
        name: 'Español',
        file: 'es-ES.json'
      }
    ],
    defaultLocale: 'en-US',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts'
  },
  
  // Nitro configuration for static generation
  nitro: {
    preset: 'static',
  },
})
