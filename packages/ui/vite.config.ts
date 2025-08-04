import { extendsConfig } from '@ant-design-vue/vite-config'
import vue from '@ant-design-vue/vite-config/vue'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync, statSync } from 'node:fs'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

// 获取所有组件目录
function getComponents() {
  const componentsDir = resolve(__dirname, 'src/components')
  const components: Record<string, string> = {}

  try {
    const entries = readdirSync(componentsDir)
    entries.forEach(entry => {
      const fullPath = resolve(componentsDir, entry)
      if (statSync(fullPath).isDirectory()) {
        components[`components/${entry}`] = resolve(fullPath, 'index.ts')
      }
    })
  } catch (error) {
    console.warn('Failed to read components directory:', error)
  }

  return components
}

const components = getComponents()

export default extendsConfig(vue(__dirname, true), {
  resolve: {
    alias: {
      '~': resolve(__dirname, './assets'),
    },
  },
  plugins: [tailwindcss()],
  test: {
    alias: {
      [pkg.name]: resolve(__dirname, './src'),
    },
    globals: true,
    environment: 'jsdom',
    testTimeout: 5000,
    coverage: {
      include: ['src/**/*.{ts,vue}'],
      provider: 'v8',
      allowExternal: true,
      reporter: ['text', 'json', 'html'],
    },
    setupFiles: [resolve(__dirname, './test/setup.ts')],
  },
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        lib: resolve(__dirname, 'src/index.ts'),
        ...components,
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      output: {
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
