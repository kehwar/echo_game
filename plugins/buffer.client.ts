/**
 * Buffer polyfill plugin for client-side rendering
 * This makes Node.js Buffer available in the browser for libraries like gray-matter
 */
import { Buffer } from 'buffer'

export default defineNuxtPlugin(() => {
  // Make Buffer available globally in the browser
  if (typeof window !== 'undefined') {
    (window as typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer
  }
})
