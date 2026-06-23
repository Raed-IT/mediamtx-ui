import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    proxy: {
  "/v3": {
        target: "http://213.217.35.53:9997",
        changeOrigin: true,
      },
    
      '/api': {
        target: 'http://213.217.35.53:3000:9997',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/webrtc': {
        target: 'http://213.217.35.53:3000:8889',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/webrtc/, '')
      }
    }
  }
})
