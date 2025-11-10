import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/', // Set the base path for the application
  /* server: {
     proxy: {
      '/api': {
        target: 'http://192.168.1.112:8080',
        changeOrigin: true,
      },
    },
    historyApiFallback: true
  },*/
})
