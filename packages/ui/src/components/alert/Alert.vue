<script setup lang="ts">
import {
  Comment,
  computed,
  Fragment,
  isVNode,
  ref,
  Text,
  type Component,
  useAttrs,
  useSlots,
} from 'vue'
import CheckCircleFilled from '@ant-design/icons-vue/CheckCircleFilled'
import CheckCircleOutlined from '@ant-design/icons-vue/CheckCircleOutlined'
import InfoCircleFilled from '@ant-design/icons-vue/InfoCircleFilled'
import InfoCircleOutlined from '@ant-design/icons-vue/InfoCircleOutlined'
import ExclamationCircleFilled from '@ant-design/icons-vue/ExclamationCircleFilled'
import ExclamationCircleOutlined from '@ant-design/icons-vue/ExclamationCircleOutlined'
import CloseCircleFilled from '@ant-design/icons-vue/CloseCircleFilled'
import CloseCircleOutlined from '@ant-design/icons-vue/CloseCircleOutlined'
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined'
import type { AlertProps, AlertEmits, AlertSlots } from './types'
import { isArray, isNumber, isString } from '@/utils/util'

defineOptions({ name: 'AAlert', inheritAttrs: false })
const props = withDefaults(defineProps<AlertProps>(), {
  closable: undefined,
  showIcon: undefined,
  banner: undefined,
})
const emit = defineEmits<AlertEmits>()
defineSlots<AlertSlots>()
const slots = useSlots()
const attrs = useAttrs()

const closed = ref(false)

const RenderContent = (renderProps: { content: unknown }) => renderProps.content

const filledIconMap: Record<NonNullable<AlertProps['type']>, Component> = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
}

const outlinedIconMap: Record<NonNullable<AlertProps['type']>, Component> = {
  success: CheckCircleOutlined,
  info: InfoCircleOutlined,
  warning: ExclamationCircleOutlined,
  error: CloseCircleOutlined,
}

const rootAttrs = computed(() => {
  const { role: _role, ...rest } = attrs
  return rest
})

const rootRole = computed(() => {
  return typeof attrs.role === 'string' ? attrs.role : 'alert'
})

// When banner=true, type defaults to 'warning' if not explicitly set
const resolvedType = computed(() => {
  return props.type ?? (props.banner ? 'warning' : 'info')
})

// When banner=true, showIcon defaults to true
const showIconComputed = computed(() => {
  if (props.banner && props.showIcon === undefined) return true
  return props.showIcon
})

const closableComputed = computed(() => {
  // When closeText prop is truthy, closable becomes true to match upstream behavior.
  if (props.closeText) return true
  return props.closable || !!slots.closeText
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

function hasRenderableContent(value: unknown): boolean {
  if (value === null || value === undefined || value === false) return false
  if (isString(value)) return value !== ''
  if (isNumber(value)) return true
  if (isArray(value)) return value.some(hasRenderableContent)
  if (!isVNode(value)) return true
  if (value.type === Comment) return false
  if (value.type === Text || value.type === Fragment) {
    return hasRenderableContent(value.children)
  }
  return true
}

const closeTextPropMeta = computed(() => {
  const content = props.closeText === true ? null : props.closeText
  return {
    content,
    hasContent: hasRenderableContent(content),
    hasVisibleText: hasVisibleText(content),
  }
})

// Calculate what closeText content to display (string, VNode, or component)
const closeTextContent = computed(() => {
  return closeTextPropMeta.value.content
})

const closeTextRenderType = computed(() => {
  const value = closeTextContent.value
  if (!closeTextPropMeta.value.hasContent) return 'none'
  if (isString(value) || isNumber(value)) return 'text'
  if (isArray(value) || isVNode(value)) return 'nodes'
  return 'dynamic'
})

const closeTextSlotMeta = computed(() => {
  const content = slots.closeText?.()
  return {
    exists: !!slots.closeText,
    content,
    hasContent: hasRenderableContent(content),
    hasVisibleText: hasVisibleText(content),
  }
})

// Only omit aria-label when closeText is confidently visible text
const hasVisibleCloseText = computed(() => {
  return closeTextPropMeta.value.hasVisibleText || closeTextSlotMeta.value.hasVisibleText
})

const hasDescription = computed(() => {
  return !!props.description || !!slots.description
})

const defaultIconComponent = computed(() => {
  const iconMap = hasDescription.value ? outlinedIconMap : filledIconMap
  return iconMap[resolvedType.value]
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

function beforeLeaveHandler(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.maxHeight = `${el.offsetHeight}px`
  }
}

function leaveHandler(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.maxHeight = '0px'
  }
}

function afterLeaveHandler() {
  props.afterClose?.()
}
</script>

<template>
  <Transition
    name="ant-alert-slide-up"
    @before-leave="beforeLeaveHandler"
    @leave="leaveHandler"
    @after-leave="afterLeaveHandler"
  >
    <div v-if="!closed" v-bind="rootAttrs" :class="classes" :role="rootRole">
      <span v-if="showIconComputed" class="ant-alert-icon" aria-hidden="true">
        <slot name="icon">
          <component :is="defaultIconComponent" />
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
        <template v-if="closeTextSlotMeta.exists && closeTextSlotMeta.hasContent">
          <RenderContent :content="closeTextSlotMeta.content" />
        </template>
        <template v-else-if="closeTextRenderType === 'text'">
          <span class="ant-alert-close-text">{{ closeTextContent }}</span>
        </template>
        <template v-else-if="closeTextRenderType === 'nodes'">
          <RenderContent :content="closeTextContent" />
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
