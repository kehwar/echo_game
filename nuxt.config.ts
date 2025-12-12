// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', 'shadcn-nuxt'],

  // Global CSS
  css: ['~/assets/css/main.css'],

  // Shadcn-nuxt configuration
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  
  // Nitro configuration for static generation
  nitro: {
    preset: 'static',
  },
})
