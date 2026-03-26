<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled'
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled'
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled'
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled'
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined'
import type { AlertProps, AlertEmits, AlertSlots } from './types'
import { alertDefaultProps } from './types'

defineOptions({ name: 'AAlert' })
const props = withDefaults(defineProps<AlertProps>(), alertDefaultProps)
const emit = defineEmits<AlertEmits>()
defineSlots<AlertSlots>()
const slots = useSlots()

const closed = ref(false)

// When banner=true, type defaults to 'warning' if not explicitly set
const resolvedType = computed(() => {
  if (props.banner && props.type === 'info') return 'warning'
  return props.type
})

// When banner=true, showIcon defaults to true
const showIconComputed = computed(() => {
  if (props.banner) return true
  return props.showIcon
})

const closableComputed = computed(() => {
  // When closeText prop is set, closable becomes true
  if (props.closeText) return true
  return props.closable || !!slots.closeText || !!slots.closeIcon
})

// Calculate what closeText content to display (when closeText prop is a string)
const closeTextContent = computed(() => {
  // If closeText is a string, show it; if it's true, show nothing (just icon)
  if (typeof props.closeText === 'string') {
    return props.closeText
  }
  return null
})

// Check if there's actual close content (slot or non-true prop)
const hasCloseContent = computed(() => {
  return !!slots.closeText || closeTextContent.value
})

const hasDescription = computed(() => {
  return !!props.description || !!slots.description
})

const hasMessage = computed(() => {
  return !!props.message || !!slots.message || !!slots.default
})

const classes = computed(() => ({
  'ant-alert': true,
  [`ant-alert-${resolvedType.value}`]: true,
  'ant-alert-with-description': hasDescription.value,
  'ant-alert-banner': props.banner,
  'ant-alert-closable': closableComputed.value,
  'ant-alert-no-icon': !showIconComputed.value,
}))

function handleClose(event: MouseEvent) {
  emit('close', event)
  closed.value = true
}

function afterLeaveHandler() {
  props.afterClose?.()
}
</script>

<template>
  <Transition name="ant-alert-slide-up" @after-leave="afterLeaveHandler">
    <div v-if="!closed" :class="classes" role="alert">
      <span v-if="showIconComputed" class="ant-alert-icon" aria-hidden="true">
        <slot name="icon">
          <CheckCircleFilled v-if="resolvedType === 'success'" />
          <InfoCircleFilled v-else-if="resolvedType === 'info'" />
          <ExclamationCircleFilled v-else-if="resolvedType === 'warning'" />
          <CloseCircleFilled v-else-if="resolvedType === 'error'" />
        </slot>
      </span>
      <div class="ant-alert-content">
        <div v-if="hasMessage" class="ant-alert-message">
          <slot name="message">
            <slot>{{ message }}</slot>
          </slot>
        </div>
        <div v-if="hasDescription" class="ant-alert-description">
          <slot name="description">{{ description }}</slot>
        </div>
      </div>
      <div v-if="$slots.action" class="ant-alert-action">
        <slot name="action" />
      </div>
      <button
        v-if="closableComputed"
        type="button"
        class="ant-alert-close-icon"
        :aria-label="!hasCloseContent ? 'Close' : undefined"
        @click="handleClose"
      >
        <slot name="closeText">
          <template v-if="closeTextContent">
            <span class="ant-alert-close-text">{{ closeTextContent }}</span>
          </template>
          <template v-else>
            <slot name="closeIcon">
              <CloseOutlined />
            </slot>
          </template>
        </slot>
      </button>
    </div>
  </Transition>
</template>
