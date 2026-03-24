<template>
  <Portal :visible="open" :get-container="getContainer">
    <div :class="wrapClasses" :style="wrapStyle" @click="onMaskClick" @keydown="onKeydown">
      <Transition name="ant-zoom" @after-leave="onAfterLeave">
        <div
          v-if="open"
          ref="dialogRef"
          class="ant-modal ant-modal-confirm"
          :class="confirmClasses"
          :style="modalStyle"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          @click.stop
        >
          <div class="ant-modal-body">
            <div class="ant-modal-confirm-body-wrapper">
              <div class="ant-modal-confirm-body">
                <span v-if="iconNode" class="ant-modal-confirm-icon">
                  <component :is="iconNode" />
                </span>
                <span v-if="config.title" class="ant-modal-confirm-title">
                  <component :is="config.title" v-if="typeof config.title === 'function'" />
                  <template v-else>{{ config.title }}</template>
                </span>
                <div v-if="config.content" class="ant-modal-confirm-content">
                  <component :is="config.content" v-if="typeof config.content === 'function'" />
                  <template v-else>{{ config.content }}</template>
                </div>
              </div>
              <div class="ant-modal-confirm-btns">
                <button
                  v-if="showCancel"
                  class="ant-btn ant-btn-outlined"
                  v-bind="(config.cancelButtonProps as any)"
                  @click="onCancel"
                >
                  {{ config.cancelText || 'Cancel' }}
                </button>
                <button
                  ref="okBtnRef"
                  class="ant-btn ant-btn-solid"
                  :class="{ 'ant-btn-danger': config.type === 'error' }"
                  v-bind="(config.okButtonProps as any)"
                  :disabled="loading"
                  @click="onOk"
                >
                  <span v-if="loading" class="ant-btn-loading-icon">
                    <LoadingOutlined />
                  </span>
                  {{ config.okText || 'OK' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <Transition name="ant-fade">
      <div v-if="open" class="ant-modal-mask" :style="maskStyle" />
    </Transition>
  </Portal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, type Component } from 'vue'
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons-vue'
import { Portal } from '@/_internal/portal'
import type { ModalFuncProps, ModalType } from './types'

const props = defineProps<{
  config: ModalFuncProps
}>()

const emit = defineEmits<{
  (e: 'destroy'): void
}>()

const open = ref(true)
const loading = ref(false)

const dialogRef = ref<HTMLElement | null>(null)
const okBtnRef = ref<HTMLElement | null>(null)

// Focus management
onMounted(() => {
  nextTick(() => {
    if (props.config.autoFocusButton === 'cancel') {
      // focus cancel button if exists
    } else if (props.config.autoFocusButton !== null) {
      okBtnRef.value?.focus()
    }
  })
})

const showCancel = computed(() => {
  if (props.config.okCancel !== undefined) return props.config.okCancel
  return props.config.type === 'confirm'
})

const typeIconMap: Record<ModalType, Component> = {
  info: InfoCircleOutlined,
  success: CheckCircleOutlined,
  error: CloseCircleOutlined,
  warning: ExclamationCircleOutlined,
  confirm: ExclamationCircleOutlined,
}

const iconNode = computed(() => {
  if (props.config.icon) {
    return typeof props.config.icon === 'function' ? props.config.icon : () => props.config.icon
  }
  const type = props.config.type || 'confirm'
  return typeIconMap[type]
})

const confirmClasses = computed(() => {
  const type = props.config.type || 'confirm'
  return [
    `ant-modal-confirm-${type}`,
    props.config.class,
    props.config.wrapClassName,
  ]
})

const wrapClasses = computed(() => [
  'ant-modal-wrap',
  { 'ant-modal-centered': props.config.centered },
])

const wrapStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.config.zIndex != null) {
    style.zIndex = String(props.config.zIndex)
  }
  return style
})

const modalStyle = computed(() => {
  const style: Record<string, string> = {}
  const width = props.config.width ?? 416
  if (typeof width === 'number') {
    style.width = `${width}px`
  } else {
    style.width = width
  }
  return style
})

const maskStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.config.zIndex != null) {
    style.zIndex = String(props.config.zIndex)
  }
  return style
})

const getContainer = computed(() => undefined)

async function onOk() {
  if (props.config.onOk) {
    const result = props.config.onOk()
    if (result && typeof result === 'object' && 'then' in result) {
      loading.value = true
      try {
        await result
        close()
      } catch {
        loading.value = false
      }
      return
    }
  }
  close()
}

async function onCancel() {
  if (props.config.onCancel) {
    const result = props.config.onCancel()
    if (result && typeof result === 'object' && 'then' in result) {
      try {
        await result
      } catch {
        return
      }
    }
  }
  close()
}

function close() {
  open.value = false
}

function onMaskClick() {
  if (props.config.maskClosable) {
    onCancel()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (props.config.keyboard !== false && e.key === 'Escape') {
    e.stopPropagation()
    onCancel()
  }
}

function onAfterLeave() {
  props.config.afterClose?.()
  emit('destroy')
}

function update(newConfig: Partial<ModalFuncProps>) {
  Object.assign(props.config, newConfig)
}

defineExpose({ close, update })
</script>
