import { extendsConfig } from '@ant-design-vue/vite-config'
import vue from '@ant-design-vue/vite-config/vue'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

export default extendsConfig(vue(__dirname), {
  resolve: {
    alias: {
      '~': resolve(__dirname, './assets'),
    },
  },
  plugins: [tailwindcss()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // inlineDynamicImports: false,
        manualChunks(id) {
          if (id.includes('tailwind.css')) {
            return 'tailwind'
          }
          if (id.includes('.css')) {
            return 'lib'
          }
        },
      },
    },
  },
})
