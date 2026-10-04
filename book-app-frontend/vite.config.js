import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    hmr: {
      host: 'localhost',
      port: 5173,
    },
    proxy: {
      '/api': {
        target: 'http://backend:8443',
        changeOrigin: true,
        ws: true,
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('/api')
  }
})
