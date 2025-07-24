import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { extendsConfig } from './index.js'
import lib from './vite.config.lib.js'

/**
 * @type {import('./index.d.ts').GetUserConfig}
 */
export default dirname =>
  extendsConfig(
    lib(dirname),
    defineConfig(({ mode }) => {
      return {
        plugins: [vue()],
        build: {
          cssCodeSplit: true,
          rollupOptions: {
            output: {
              exports: 'named',
              globals: {
                vue: 'Vue',
              },
            },
          },
        },
      }
    }),
  )
