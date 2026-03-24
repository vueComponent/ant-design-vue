<template>
  <div ref="containerRef" class="code-editor"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps<{
  modelValue: string
  dark?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const containerRef = ref<HTMLElement>()
let view: EditorView | null = null
let isExternalUpdate = false

onMounted(() => {
  if (!containerRef.value) return

  const extensions = [
    basicSetup,
    html(),
    EditorView.theme({
      '&': { height: '100%' },
      '.cm-scroller': { overflow: 'auto' },
    }),
    EditorView.updateListener.of(update => {
      if (update.docChanged && !isExternalUpdate) {
        emit('update:modelValue', update.state.doc.toString())
      }
    }),
  ]

  if (props.dark) {
    extensions.push(oneDark)
  }

  view = new EditorView({
    state: EditorState.create({ doc: props.modelValue, extensions }),
    parent: containerRef.value,
  })
})

watch(
  () => props.modelValue,
  newVal => {
    if (!view || view.state.doc.toString() === newVal) return
    isExternalUpdate = true
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: newVal },
    })
    isExternalUpdate = false
  },
)

onBeforeUnmount(() => {
  view?.destroy()
  view = null
})
</script>

<style>
.code-editor {
  height: 100%;
  font-size: 14px;
}
.code-editor .cm-editor {
  height: 100%;
}
</style>
