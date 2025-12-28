// https://nuxt.com/docs/api/configuration/nuxt-config

const isDev = process.env.NODE_ENV !== 'production'
const baseURL = isDev ? '/' : '/echo_game/'

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Enable static site generation for GitHub Pages
  ssr: false,
  
  // Configure for GitHub Pages deployment
  app: {
    baseURL,
    buildAssetsDir: '/assets/',
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}icon.svg` },
        { rel: 'apple-touch-icon', href: `${baseURL}apple-touch-icon.png` },
        { rel: 'manifest', href: `${baseURL}manifest.webmanifest` },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', content: '#7c3aed' },
        { name: 'apple-mobile-web-app-title', content: 'Echo Game' },
      ],
    },
  },
  
  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false,
  },
  
  // ESLint module
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/i18n', '@pinia/nuxt', '@vite-pwa/nuxt'],

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

  // PWA configuration
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Echo Game',
      short_name: 'Echo Game',
      description: 'A phone-on-forehead charades game for group play',
      theme_color: '#7c3aed',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: baseURL,
      start_url: baseURL,
      icons: [
        {
          src: `${baseURL}icon-192x192.png`,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: `${baseURL}icon-512x512.png`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: `${baseURL}icon-512x512.png`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: baseURL,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,wav}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600, // Check for updates every hour
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
})
