import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/images': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    },
    // Add headers for development
    headers: {
      'Content-Security-Policy':
        "default-src 'self' 'unsafe-inline' data: blob: https://fonts.googleapis.com; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://fonts.googleapis.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: blob: http://localhost:5001 https://localhost:5001 http://localhost:3000; " +
        "connect-src 'self' *;"
    }
  },
  build: {
    // Ensure build outputs are compatible
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})