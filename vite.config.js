import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' – putanje su relativne, pa stranica radi i na GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
})
