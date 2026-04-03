import { createApp, shallowRef, h, type App } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'
import type { ConfirmDialogInstance, ModalFuncConfigUpdate, ModalFuncProps, ModalFuncReturn, ModalType } from './types'

const openDialogs: Array<{ app: App; destroy: () => void }> = []

export function confirm(config: ModalFuncProps): ModalFuncReturn {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const configRef = shallowRef({ ...config })

  let dialogInstance: ConfirmDialogInstance | null = null
  let cleanedUp = false
  let closing = false

  function cleanup() {
    if (cleanedUp) return
    cleanedUp = true
    dialogInstance = null
    app.unmount()
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
    const idx = openDialogs.indexOf(entry)
    if (idx > -1) openDialogs.splice(idx, 1)
  }

  const app = createApp({
    setup() {
      return () =>
        h(ConfirmDialog, {
          config: configRef.value,
          onDestroy: cleanup,
          ref: (el) => {
            dialogInstance = el as unknown as ConfirmDialogInstance | null
          },
        })
    },
  })

  app.mount(container)

  const entry = { app, destroy }

  openDialogs.push(entry)

  function destroy() {
    if (cleanedUp || closing) return
    if (dialogInstance) {
      closing = true
      dialogInstance.close()
      return
    }
    cleanup()
  }

  function update(newConfig: ModalFuncConfigUpdate) {
    configRef.value =
      typeof newConfig === 'function'
        ? newConfig(configRef.value)
        : { ...configRef.value, ...newConfig }
  }

  return { destroy, update }
}

function withType(type: ModalType) {
  return (config: ModalFuncProps): ModalFuncReturn => {
    return confirm({
      ...config,
      type,
      okCancel: type === 'confirm',
    })
  }
}

export const modalConfirm = withType('confirm')
export const modalInfo = withType('info')
export const modalSuccess = withType('success')
export const modalError = withType('error')
export const modalWarning = withType('warning')

export function destroyAll() {
  while (openDialogs.length) {
    const dialog = openDialogs.pop()
    dialog?.destroy()
  }
}
