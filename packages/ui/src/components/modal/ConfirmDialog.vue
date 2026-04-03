<template>
  <Modal
    :open="open"
    :width="config.width ?? 416"
    :centered="config.centered"
    :closable="config.closable ?? false"
    :mask="config.mask ?? true"
    :mask-closable="config.maskClosable ?? false"
    :keyboard="config.keyboard ?? true"
    :z-index="config.zIndex"
    :body-style="config.bodyStyle"
    :mask-style="config.maskStyle"
    :wrap-class-name="config.wrapClassName"
    :get-container="config.getContainer"
    :footer="false"
    :class="confirmClasses"
    @cancel="onDialogCancel"
    @after-close="onAfterLeave"
  >
    <template v-if="config.closeIcon !== undefined" #closeIcon>
      <RenderContent :value="config.closeIcon" />
    </template>

    <div class="ant-modal-confirm-body-wrapper">
      <div class="ant-modal-confirm-body">
        <span v-if="iconNode !== undefined && iconNode !== null" class="ant-modal-confirm-icon">
          <RenderContent :value="iconNode" />
        </span>
        <span v-if="config.title != null" class="ant-modal-confirm-title">
          <RenderContent :value="config.title" />
        </span>
        <div v-if="config.content != null" class="ant-modal-confirm-content">
          <RenderContent :value="config.content" />
        </div>
      </div>

      <RenderContent v-if="config.footer !== undefined" :value="config.footer" />
      <div v-else class="ant-modal-confirm-btns">
        <Button
          v-if="showCancel"
          ref="cancelBtnRef"
          v-bind="cancelButtonAttrs"
          @click="onCancel"
        >
          {{ config.cancelText || 'Cancel' }}
        </Button>
        <Button ref="okBtnRef" v-bind="okButtonAttrs" @click="onOk">
          {{ config.okText || 'OK' }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onMounted, ref, toRef, type PropType } from 'vue'
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import Button from '../button'
import Modal from './Modal.vue'
import type {
  ModalFuncConfigUpdate,
  ModalFuncProps,
  ModalRenderContent,
  ModalType,
} from './types'
import { resolveOkTypeProps } from './types'

defineOptions({ name: 'AConfirmDialog' })

const props = defineProps<{
  config: ModalFuncProps
}>()
const config = toRef(props, 'config')

const emit = defineEmits<{
  (e: 'destroy'): void
}>()

const open = ref(true)
const okLoading = ref(false)
const cancelLoading = ref(false)
const okBtnRef = ref<{ focus: () => void } | null>(null)
const cancelBtnRef = ref<{ focus: () => void } | null>(null)
const isLoading = computed(() => okLoading.value || cancelLoading.value)

function renderSomeContent(content?: ModalRenderContent) {
  if (typeof content === 'function') {
    return content()
  }
  return content
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return !!value && typeof (value as PromiseLike<unknown>).then === 'function'
}

function shouldCloseOnSyncResult(result: unknown) {
  return result !== false
}

const RenderContent = defineComponent({
  name: 'ModalRenderContent',
  props: {
    value: {
      type: null as unknown as PropType<ModalRenderContent>,
      default: undefined,
    },
  },
  setup(renderProps) {
    return () => renderSomeContent(renderProps.value)
  },
})

// Focus management
onMounted(() => {
  nextTick(() => {
    if (config.value.autoFocusButton === 'cancel') {
      cancelBtnRef.value?.focus()
    } else if (config.value.autoFocusButton !== null) {
      okBtnRef.value?.focus()
    }
  })
})

const showCancel = computed(() => {
  if (config.value.okCancel !== undefined) return config.value.okCancel
  return (config.value.type || 'confirm') === 'confirm'
})

const typeIconMap: Record<ModalType, ModalRenderContent> = {
  info: () => h(InfoCircleOutlined),
  success: () => h(CheckCircleOutlined),
  error: () => h(CloseCircleOutlined),
  warning: () => h(ExclamationCircleOutlined),
  confirm: () => h(ExclamationCircleOutlined),
}

const iconNode = computed(() => {
  if (Object.prototype.hasOwnProperty.call(config.value, 'icon')) {
    return config.value.icon ?? null
  }
  const type = config.value.type || 'confirm'
  return typeIconMap[type]
})

const confirmClasses = computed(() => {
  const type = config.value.type || 'confirm'
  return ['ant-modal-confirm', `ant-modal-confirm-${type}`, config.value.class]
})

const okButtonAttrs = computed(() => ({
  ...resolveOkTypeProps(config.value.okType),
  ...(config.value.okButtonProps ?? {}),
  loading: okLoading.value || config.value.okButtonProps?.loading,
  disabled: isLoading.value || config.value.okButtonProps?.disabled,
}))

const cancelButtonAttrs = computed(() => ({
  variant: 'outlined' as const,
  ...(config.value.cancelButtonProps ?? {}),
  loading: cancelLoading.value || config.value.cancelButtonProps?.loading,
  disabled: isLoading.value || config.value.cancelButtonProps?.disabled,
}))

async function onOk() {
  if (isLoading.value) return

  const action = config.value.onOk
  if (!action) {
    close()
    return
  }

  if (action.length) {
    action(close)
    return
  }

  const result = action()
  if (!isThenable(result)) {
    if (shouldCloseOnSyncResult(result)) {
      close()
    }
    return
  }

  okLoading.value = true
  try {
    await result
    close()
  } catch {
    okLoading.value = false
  }
}

async function handleCancel(event?: MouseEvent | KeyboardEvent) {
  if (isLoading.value) return

  const action = config.value.onCancel
  if (!action) {
    close()
    return
  }

  if (action.length) {
    action(close, event)
    return
  }

  try {
    const result = event === undefined ? action() : action(event)
    if (!isThenable(result)) {
      if (shouldCloseOnSyncResult(result)) {
        close()
      }
      return
    }

    cancelLoading.value = true
    await result
    close()
  } catch {
    cancelLoading.value = false
    // Keep dialog open on rejected cancel promises.
  }
}

async function onCancel() {
  await handleCancel()
}

function close() {
  if (!open.value) return
  okLoading.value = false
  cancelLoading.value = false
  open.value = false
}

function onDialogCancel(event: MouseEvent | KeyboardEvent) {
  void handleCancel(event)
}

function onAfterLeave() {
  config.value.afterClose?.()
  emit('destroy')
}

function update(newConfig: ModalFuncConfigUpdate) {
  Object.assign(
    config.value,
    typeof newConfig === 'function' ? newConfig(config.value) : newConfig,
  )
}

defineExpose({ close, update })
</script>
