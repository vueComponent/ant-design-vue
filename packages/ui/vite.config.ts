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
    lib: {
      name: 'antd',
      entry: {
        lib: resolve(__dirname, 'src/index.ts'),
      },
      formats: ['umd'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
  },
})
