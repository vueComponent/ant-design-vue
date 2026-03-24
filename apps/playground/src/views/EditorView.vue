<template>
  <div class="editor-layout">
    <!-- Editor -->
    <div class="editor-pane">
      <div class="editor-toolbar">
        <RouterLink v-if="backLink" :to="backLink" class="editor-back">&larr; {{ backLabel }}</RouterLink>
        <span v-else class="editor-label">Playground</span>
        <div class="editor-actions">
          <button class="editor-btn" @click="resetCode">Reset</button>
          <button class="editor-btn editor-btn-primary" @click="shareCode">
            {{ copied ? 'Copied!' : 'Share' }}
          </button>
        </div>
      </div>
      <CodeEditor v-model="code" class="editor-cm" />
    </div>

    <!-- Divider -->
    <div class="editor-divider" @mousedown="startResize"></div>

    <!-- Preview -->
    <div class="editor-preview">
      <div v-if="error" class="editor-error">
        <strong>Error</strong>
        <pre>{{ error }}</pre>
      </div>
      <div v-else class="editor-preview-content">
        <component :is="compiledComponent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  shallowRef,
  computed,
  watch,
  defineComponent,
  markRaw,
  onErrorCaptured,
} from 'vue'
import * as Vue from 'vue'
import { transform } from 'sucrase'
import { useRoute } from 'vue-router'
import { findDemo } from '#/data/demos'
import CodeEditor from '#/components/CodeEditor.vue'
import DEFAULT_CODE from '#/assets/default-code.txt?raw'

const route = useRoute()

// --- Route-based state ---
const componentName = computed(() => route.params.component as string | undefined)
const demoName = computed(() => route.params.demo as string | undefined)
const demoInfo = computed(() => {
  if (componentName.value && demoName.value) {
    return findDemo(componentName.value, demoName.value)
  }
  return undefined
})

const initialCode = computed(() => {
  if (demoInfo.value) return demoInfo.value.raw
  return loadCodeFromHash() || DEFAULT_CODE.trim()
})

const backLink = computed(() => (componentName.value ? `/${componentName.value}` : null))
const backLabel = computed(() => componentName.value ?? '')

// --- Editor state ---
const code = ref(initialCode.value)
const error = ref('')
const compiledComponent = shallowRef<ReturnType<typeof defineComponent>>()
const copied = ref(false)

// Reset code when navigating to a different demo
watch(
  () => route.fullPath,
  () => {
    code.value = initialCode.value
    error.value = ''
  },
)

// --- Vue APIs available in script setup ---
const VUE_API_NAMES = [
  'ref', 'reactive', 'computed', 'watch', 'watchEffect',
  'onMounted', 'onBeforeMount', 'onUnmounted', 'onBeforeUnmount',
  'nextTick', 'h', 'toRef', 'toRefs',
  'shallowRef', 'shallowReactive', 'triggerRef',
  'provide', 'inject', 'readonly',
  'unref', 'isRef', 'isReactive', 'isReadonly',
  'markRaw', 'toRaw',
] as const

const vueApiValues = VUE_API_NAMES.map(name => (Vue as any)[name])

// --- Compilation ---
function compileSFC(source: string) {
  const templateMatch =
    source.match(/<template>([\s\S]*?)<\/template>\s*$/) ||
    source.match(/<template>([\s\S]*)<\/template>/)
  if (!templateMatch) throw new Error('Missing <template> block')
  const template = templateMatch[1]

  const scriptSetupMatch = source.match(
    /<script\s+setup(?:\s+lang="ts")?\s*>([\s\S]*?)<\/script>/,
  )
  if (!scriptSetupMatch) return markRaw(defineComponent({ template }))

  let scriptContent = scriptSetupMatch[1].trim()

  // Strip TypeScript → JavaScript
  scriptContent = transform(scriptContent, {
    transforms: ['typescript'],
  }).code

  // Strip imports (Vue APIs provided automatically)
  scriptContent = scriptContent.replace(/^\s*import\s+.*?from\s+['"].*?['"]\s*;?\s*$/gm, '')
  scriptContent = scriptContent.replace(/^\s*import\s+['"].*?['"]\s*;?\s*$/gm, '')

  // Find top-level bindings
  const bindings: string[] = []
  const varRegex = /(?:^|\n)\s*(?:const|let|var)\s+(?:\[([^\]]+)\]|\{([^}]+)\}|(\w+))/g
  let m
  while ((m = varRegex.exec(scriptContent)) !== null) {
    if (m[1]) {
      bindings.push(...m[1].split(',').map(v => v.trim()))
    } else if (m[2]) {
      bindings.push(
        ...m[2].split(',').map(v => {
          const parts = v.trim().split(':')
          return (parts.length > 1 ? parts[1] : parts[0]).trim().split('=')[0].trim()
        }),
      )
    } else if (m[3]) {
      bindings.push(m[3])
    }
  }
  const funcRegex = /(?:^|\n)\s*function\s+(\w+)/g
  while ((m = funcRegex.exec(scriptContent)) !== null) {
    bindings.push(m[1])
  }

  const setupBody = `${scriptContent}\nreturn { ${[...new Set(bindings)].join(', ')} }`
  const setupFn = new Function(...VUE_API_NAMES, setupBody)
  return markRaw(defineComponent({ setup: () => setupFn(...vueApiValues), template }))
}

function compileCode(source: string) {
  try {
    compiledComponent.value = compileSFC(source)
    error.value = ''
  } catch (e: any) {
    error.value = e.message || String(e)
  }
}

onErrorCaptured((err: Error) => {
  error.value = err.message
  return false
})

// Debounced compilation
let timer: ReturnType<typeof setTimeout>
watch(code, val => {
  clearTimeout(timer)
  timer = setTimeout(() => compileCode(val), 300)
})
compileCode(code.value)

// --- URL hash sharing ---
function loadCodeFromHash(): string | null {
  const hash = location.hash.slice(1)
  if (!hash) return null
  try {
    return decodeURIComponent(atob(hash))
  } catch {
    return null
  }
}

function shareCode() {
  const encoded = btoa(encodeURIComponent(code.value))
  history.replaceState(null, '', `${route.path}#${encoded}`)
  navigator.clipboard?.writeText(location.href).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}

function resetCode() {
  code.value = initialCode.value
  history.replaceState(null, '', route.path)
}

// --- Resizable divider ---
const startResize = (e: MouseEvent) => {
  const container = (e.target as HTMLElement).parentElement!
  const editorPane = container.querySelector('.editor-pane') as HTMLElement
  const preview = container.querySelector('.editor-preview') as HTMLElement
  const startX = e.clientX
  const startWidth = editorPane.offsetWidth
  const total = container.offsetWidth

  const onMove = (e: MouseEvent) => {
    const w = Math.max(200, Math.min(total - 200, startWidth + e.clientX - startX))
    const pct = (w / total) * 100
    editorPane.style.width = `${pct}%`
    preview.style.width = `${100 - pct}%`
  }
  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
</script>

<style>
.editor-layout {
  display: flex;
  height: 100%;
  min-height: 0;
}

.editor-pane {
  width: 50%;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 40px;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  background: #fafafa;
}

.editor-back {
  font-size: 13px;
  color: #1677ff;
  text-decoration: none;
  text-transform: capitalize;
}
.editor-back:hover {
  text-decoration: underline;
}

.editor-label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.editor-actions {
  display: flex;
  gap: 6px;
}

.editor-btn {
  padding: 3px 10px;
  font-size: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}
.editor-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
}

.editor-btn-primary {
  background: #1677ff;
  border-color: #1677ff;
  color: #fff;
}
.editor-btn-primary:hover {
  opacity: 0.85;
  color: #fff;
  border-color: #1677ff;
}

.editor-cm {
  flex: 1;
  min-height: 0;
}

.editor-divider {
  width: 4px;
  cursor: col-resize;
  background: #f0f0f0;
  flex-shrink: 0;
  transition: background 0.2s;
}
.editor-divider:hover {
  background: #1677ff;
}

.editor-preview {
  width: 50%;
  min-width: 200px;
  overflow: auto;
}

.editor-preview-content {
  padding: 24px;
}

.editor-error {
  padding: 16px;
  margin: 16px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  color: #ff4d4f;
  font-size: 13px;
}
.editor-error strong {
  display: block;
  margin-bottom: 8px;
}
.editor-error pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'SF Mono', 'Fira Code', monospace;
}
</style>
