<template>
  <div
    :class="itemClasses"
    :style="item.args.style"
    @click="item.args.onClick?.()"
    @mouseenter="clearTimer"
    @mouseleave="startTimer"
  >
    <div class="ant-notification-notice-content">
      <div :class="contentClasses" role="alert">
        <span v-if="hasCustomIcon" class="ant-notification-notice-icon">
          <RenderNode :content="item.args.icon" />
        </span>
        <component :is="typeIconComponent" v-else-if="typeIconComponent" :class="iconClasses" />
        <div class="ant-notification-notice-message">
          <RenderNode :content="item.args.message" />
        </div>
        <div v-if="item.args.description" class="ant-notification-notice-description">
          <RenderNode :content="item.args.description" />
        </div>
        <div v-if="item.args.btn" class="ant-notification-notice-btn">
          <RenderNode :content="item.args.btn" />
        </div>
      </div>
    </div>
    <button
      type="button"
      class="ant-notification-notice-close"
      aria-label="Close"
      @click.stop="$emit('close', item.id)"
    >
      <span class="ant-notification-close-x">
        <RenderNode v-if="hasCustomCloseIcon" :content="item.args.closeIcon" />
        <CloseOutlined v-else class="ant-notification-close-icon" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  type Component,
  computed,
  defineComponent,
  isVNode,
  onBeforeUnmount,
  onMounted,
  type PropType,
  type VNode,
  watch,
} from 'vue'
import {
  InfoCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  CloseOutlined,
} from '@ant-design/icons-vue'
import type { InternalNotificationItem, NotificationType } from './types'

type RenderableContent = string | VNode | (() => VNode)

const RenderNode = defineComponent({
  name: 'NotificationRenderNode',
  props: {
    content: {
      type: [String, Object, Function] as PropType<RenderableContent | undefined>,
      default: undefined,
    },
  },
  setup(renderProps) {
    return () => {
      if (typeof renderProps.content === 'function') {
        return renderProps.content()
      }
      return isVNode(renderProps.content) ? renderProps.content : (renderProps.content ?? null)
    }
  },
})

const props = defineProps<{
  item: InternalNotificationItem
}>()

const emit = defineEmits<{
  (e: 'close', id: string): void
}>()

const typeIconMap: Record<NotificationType, Component> = {
  info: InfoCircleFilled,
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
}

const hasCustomIcon = computed(() => props.item.args.icon !== undefined)

const typeIconComponent = computed(() => {
  if (hasCustomIcon.value || !props.item.args.type) return null
  return typeIconMap[props.item.args.type]
})

const hasIcon = computed(() => hasCustomIcon.value || Boolean(typeIconComponent.value))

const contentClasses = computed(() => ({
  'ant-notification-notice-with-icon': hasIcon.value,
}))

const iconClasses = computed(() => [
  'ant-notification-notice-icon',
  props.item.args.type ? `ant-notification-notice-icon-${props.item.args.type}` : '',
])

const hasCustomCloseIcon = computed(() => props.item.args.closeIcon !== undefined)

const itemClasses = computed(() => [
  'ant-notification-notice',
  'ant-notification-notice-closable',
  props.item.args.type ? `ant-notification-notice-${props.item.args.type}` : '',
  props.item.args.class,
])

// Auto-close timer
let timer: ReturnType<typeof setTimeout> | null = null

function startTimer() {
  clearTimer()

  const duration = props.item.args.duration
  // duration null means never auto-close
  if (duration === null) return
  const d = duration ?? 4.5
  if (d > 0) {
    timer = setTimeout(() => {
      emit('close', props.item.id)
    }, d * 1000)
  }
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

onMounted(() => {
  startTimer()
})

watch([() => props.item.updateMark, () => props.item.args.duration], () => {
  startTimer()
})

onBeforeUnmount(() => {
  clearTimer()
})
</script>
