import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', 
  build: {
    outDir: 'dist', 
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://stylish-8dn8.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    port: 4173,
    open: true,
  },
})
