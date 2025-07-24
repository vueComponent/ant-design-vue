import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig, Plugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  appType: 'mpa',
  plugins: [
    vue(),
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
      },
    },
  },
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

interface ImportmapOptions {
  imports: Record<string, string>
}
function importmapPlugin(options: ImportmapOptions): Plugin {
  return {
    name: 'vite-plugin-importmap',
    apply: 'build',
    config() {
      return {
        build: {
          rollupOptions: {
            external: Object.keys(options.imports),
          },
        },
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return {
          html,
          tags: [
            {
              tag: 'script',
              attrs: {
                type: 'importmap',
              },
              children: JSON.stringify(options),
              injectTo: 'head-prepend',
            },
          ],
        }
      },
    },
  }
}
