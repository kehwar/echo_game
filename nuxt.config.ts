// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // Enable static site generation for GitHub Pages
  ssr: false,
  
  // Configure for GitHub Pages deployment
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/echo_game/' : '/',
    buildAssetsDir: '/assets/',
  },
  
  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false,
  },
  
  // ESLint module
  modules: ['@nuxt/eslint'],
  
  // Nitro configuration for static generation
  nitro: {
    preset: 'static',
  },
})
