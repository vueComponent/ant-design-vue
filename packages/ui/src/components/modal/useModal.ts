import { defineComponent, shallowRef, h, shallowReactive } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'
import type { ConfirmDialogInstance, ModalFuncConfigUpdate, ModalFuncProps, ModalFuncReturn, ModalType } from './types'

interface ModalEntry {
  key: number
  config: ModalFuncProps
  instance: ConfirmDialogInstance | null
}

export function useModal(): [
  {
    confirm: (config: ModalFuncProps) => ModalFuncReturn
    info: (config: ModalFuncProps) => ModalFuncReturn
    success: (config: ModalFuncProps) => ModalFuncReturn
    error: (config: ModalFuncProps) => ModalFuncReturn
    warning: (config: ModalFuncProps) => ModalFuncReturn
  },
  ReturnType<typeof defineComponent>,
] {
  let nextKey = 0
  const entries = shallowReactive<ModalEntry[]>([])

  function removeEntry(entry: ModalEntry) {
    const idx = entries.indexOf(entry)
    if (idx > -1) entries.splice(idx, 1)
  }

  function open(config: ModalFuncProps): ModalFuncReturn {
    const key = nextKey++
    const configRef = shallowRef({ ...config })
    const entry: ModalEntry = { key, config: configRef.value, instance: null }
    entries.push(entry)

    function destroy() {
      if (entry.instance) {
        entry.instance.close()
        return
      }
      removeEntry(entry)
    }

    function update(newConfig: ModalFuncConfigUpdate) {
      configRef.value =
        typeof newConfig === 'function'
          ? newConfig(configRef.value)
          : { ...configRef.value, ...newConfig }
      entry.config = { ...configRef.value }
      // Trigger reactivity
      const idx = entries.indexOf(entry)
      if (idx > -1) {
        entries.splice(idx, 1, { ...entry })
      }
    }

    return { destroy, update }
  }

  function withType(type: ModalType) {
    return (config: ModalFuncProps): ModalFuncReturn => {
      return open({ ...config, type, okCancel: type === 'confirm' })
    }
  }

  const modal = {
    confirm: withType('confirm'),
    info: withType('info'),
    success: withType('success'),
    error: withType('error'),
    warning: withType('warning'),
  }

  const ContextHolder = defineComponent({
    name: 'ModalContextHolder',
    setup() {
      return () =>
        entries.map((entry) =>
          h(ConfirmDialog, {
            key: entry.key,
            config: entry.config,
            ref: (el) => {
              entry.instance = el as unknown as ConfirmDialogInstance | null
            },
            onDestroy: () => {
              removeEntry(entry)
            },
          }),
        )
    },
  })

  return [modal, ContextHolder]
}
