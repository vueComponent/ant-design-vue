<script setup lang="ts">
import { Comment, computed, Fragment, isVNode, ref, Text, useSlots } from 'vue'
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled'
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled'
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled'
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled'
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined'
import type { AlertProps, AlertEmits, AlertSlots } from './types'
import { alertDefaultProps } from './types'
import { isArray, isNumber, isString } from '@/utils/util'

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
  if (props.closeText !== undefined && props.closeText !== null && props.closeText !== false) return true
  return props.closable || !!slots.closeText || !!slots.closeIcon
})

// Calculate what closeText content to display (string, VNode, or component)
const closeTextContent = computed(() => {
  // If closeText is true, show nothing (just icon)
  if (props.closeText === true) return null
  return props.closeText
})

const closeTextRenderType = computed(() => {
  const value = closeTextContent.value
  if (value === null || value === undefined || value === false || value === '') return 'none'
  if (isString(value) || isNumber(value)) return 'text'
  if (isArray(value) || isVNode(value)) return 'nodes'
  return 'dynamic'
})

function hasVisibleText(value: unknown): boolean {
  if (value === null || value === undefined || value === false) return false
  if (isString(value) || isNumber(value)) {
    return String(value).trim().length > 0
  }
  if (isArray(value)) return value.some(hasVisibleText)
  if (!isVNode(value)) return false
  const ariaHidden = (value.props as Record<string, unknown> | null | undefined)?.['aria-hidden']
  if (ariaHidden === true || ariaHidden === 'true' || ariaHidden === '') return false
  if (value.type === Comment) return false
  if (value.type === Text || value.type === Fragment) {
    return hasVisibleText(value.children)
  }
  return hasVisibleText(value.children)
}

const closeTextSlotMeta = computed(() => {
  const content = slots.closeText?.()
  return {
    exists: !!slots.closeText,
    content,
    hasVisibleText: hasVisibleText(content),
  }
})

// Only omit aria-label when closeText is confidently visible text
const hasVisibleCloseText = computed(() => {
  return hasVisibleText(closeTextContent.value) || closeTextSlotMeta.value.hasVisibleText
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
        :aria-label="hasVisibleCloseText ? undefined : 'Close'"
        @click="handleClose"
      >
        <template v-if="closeTextSlotMeta.exists">
          <component :is="() => closeTextSlotMeta.content" />
        </template>
        <template v-else-if="closeTextRenderType === 'text'">
          <span class="ant-alert-close-text">{{ closeTextContent }}</span>
        </template>
        <template v-else-if="closeTextRenderType === 'nodes'">
          <component :is="() => closeTextContent" />
        </template>
        <template v-else-if="closeTextRenderType === 'dynamic'">
          <component :is="closeTextContent" />
        </template>
        <template v-else>
          <slot name="closeIcon">
            <CloseOutlined />
          </slot>
        </template>
      </button>
    </div>
  </Transition>
</template>
