import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { readdirSync, readFileSync } from 'node:fs'
import type { Plugin } from 'vite';
import { defineConfig } from 'vite'

const uiSrc = resolve(__dirname, '../../packages/ui/src')
const monorepoRoot = resolve(__dirname, '../..')
const oldCompsDir = resolve(monorepoRoot, 'components')

/** Scan demo .vue files from UI source at build/serve time */
function demoGlobPlugin(): Plugin {
  const VIRTUAL_ID = 'virtual:demo-glob'
  const RESOLVED_ID = '\0' + VIRTUAL_ID

  function scanDemos() {
    const compsDir = resolve(uiSrc, 'components')
    const result: Record<string, string[]> = {}
    for (const comp of readdirSync(compsDir)) {
      const demoDir = resolve(compsDir, comp, 'demo')
      try {
        const files = readdirSync(demoDir).filter(f => f.endsWith('.vue'))
        if (files.length) result[comp] = files.map(f => f.replace('.vue', ''))
      } catch { /* no demo dir */ }
    }
    return result
  }

  return {
    name: 'demo-glob',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      const demos = scanDemos()
      const imports: string[] = []
      const entries: string[] = []
      let i = 0
      for (const [comp, names] of Object.entries(demos).sort(([a], [b]) => a.localeCompare(b))) {
        for (const name of names) {
          const path = `${uiSrc}/components/${comp}/demo/${name}.vue`
          imports.push(`import _c${i} from ${JSON.stringify(path)}`)
          imports.push(`import _r${i} from ${JSON.stringify(path + '?raw')}`)
          entries.push(`  { component: ${JSON.stringify(comp)}, name: ${JSON.stringify(name)}, mod: _c${i}, raw: _r${i} }`)
          i++
        }
      }
      return `${imports.join('\n')}\nexport default [\n${entries.join(',\n')}\n]\n`
    },
  }
}

/**
 * Strip <docs> blocks from old demo .vue files.
 */
function stripDocsPlugin(): Plugin {
  return {
    name: 'strip-docs-block',
    enforce: 'pre',
    load(id) {
      if (!id.endsWith('.vue')) return
      if (!id.includes('/components/') || !id.includes('/demo/')) return
      // Only strip from old components dir (not packages/ui)
      if (id.includes('/packages/')) return
      const code = readFileSync(id, 'utf-8')
      if (code.includes('<docs')) {
        return code.replace(/<docs[\s\S]*?<\/docs>\s*/gi, '')
      }
    },
  }
}

/**
 * Scan old demo .vue files for comparison (rendered with new components).
 * Only includes components that also exist in new packages.
 */
function oldDemoGlobPlugin(): Plugin {
  const VIRTUAL_ID = 'virtual:old-demo-glob'
  const RESOLVED_ID = '\0' + VIRTUAL_ID

  function getComparableComponents(): Set<string> {
    const newCompsDir = resolve(uiSrc, 'components')
    const oldComps = new Set(
      readdirSync(oldCompsDir).filter(
        f => !f.startsWith('_') && !f.startsWith('.') && !f.endsWith('.ts'),
      ),
    )
    const newComps = new Set(
      readdirSync(newCompsDir).filter(
        f => !f.startsWith('_') && !f.startsWith('.') && !f.endsWith('.ts'),
      ),
    )
    return new Set([...oldComps].filter(c => newComps.has(c)))
  }

  function scanDemos() {
    const comparable = getComparableComponents()
    const result: Record<string, string[]> = {}
    for (const comp of comparable) {
      const demoDir = resolve(oldCompsDir, comp, 'demo')
      try {
        const files = readdirSync(demoDir).filter(
          f => f.endsWith('.vue') && f !== 'index.vue',
        )
        if (files.length) result[comp] = files.map(f => f.replace('.vue', ''))
      } catch { /* no demo dir */ }
    }
    return result
  }

  const isBuild = process.env.NODE_ENV === 'production'

  return {
    name: 'old-demo-glob',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      // Skip old demos in production build — they have missing deps (e.g. vue-request)
      if (isBuild) return 'export default []\n'
      const demos = scanDemos()
      // Use dynamic imports so demos with missing deps don't break the whole app
      const entries: string[] = []
      for (const [comp, names] of Object.entries(demos).sort(([a], [b]) => a.localeCompare(b))) {
        for (const name of names) {
          const path = `${oldCompsDir}/${comp}/demo/${name}.vue`
          entries.push(
            `  { component: ${JSON.stringify(comp)}, name: ${JSON.stringify(name)}, load: () => import(${JSON.stringify(path)}) }`,
          )
        }
      }
      return `export default [\n${entries.join(',\n')}\n]\n`
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [stripDocsPlugin(), vue(), tailwindcss(), demoGlobPlugin(), oldDemoGlobPlugin()],
  server: {
    fs: { allow: [monorepoRoot] },
  },
  resolve: {
    dedupe: ['@codemirror/state', '@codemirror/view', '@codemirror/language'],
    alias: {
      // Point to UI source for HMR, no build needed
      '@ant-design-vue/ui/style.css': resolve(uiSrc, 'style/base.css'),
      '@ant-design-vue/ui/tailwind.css': resolve(uiSrc, 'style/tailwind.css'),
      '@ant-design-vue/ui': resolve(uiSrc, 'index.ts'),
      // @/ and @ui/ are used by UI source internally
      '@ui/': `${uiSrc}/`,
      '@/': `${uiSrc}/`,
      // Playground own aliases
      '~/': resolve(__dirname, './assets') + '/',
      '#/': resolve(__dirname, './src') + '/',
      // Use full Vue build with runtime compiler for playground template compilation
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
})
