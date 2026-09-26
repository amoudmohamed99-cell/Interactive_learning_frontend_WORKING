import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Fix simli-client case-sensitivity issue (Client.js vs client.js)
    mainFields: ['module', 'main'],
  },
  build: {
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['simli-client'],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://interactivelearning-production.up.railway.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
