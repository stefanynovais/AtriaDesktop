import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Em produção o site fica em https://stefanynovais.github.io/AtriaDesktop/
  base: process.env.NODE_ENV === 'production' || process.env.GITHUB_ACTIONS ? '/AtriaDesktop/' : '/',
})
