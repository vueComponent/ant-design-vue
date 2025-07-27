import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig, Plugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    watch: {
      ignored: ['!**/node_modules/@ant-design-vue/**'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './assets'),
    },
  },
})
