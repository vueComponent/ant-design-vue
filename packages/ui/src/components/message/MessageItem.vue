<template>
  <div :class="itemClasses" :style="item.args.style" @click="handleClick">
    <div class="ant-message-notice-content">
      <span v-if="iconNode" class="ant-message-icon">
        <component :is="iconNode" />
      </span>
      <span class="ant-message-text">
        <component :is="item.args.content" v-if="typeof item.args.content === 'function'" />
        <component :is="item.args.content" v-else-if="isVNode(item.args.content)" />
        <template v-else>{{ item.args.content }}</template>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watch, isVNode, type Component } from 'vue'
import {
  InfoCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  LoadingOutlined,
} from '@ant-design/icons-vue'
import type { InternalMessageItem, MessageType } from './types'

const props = defineProps<{
  item: InternalMessageItem
}>()

const emit = defineEmits<{
  (e: 'close', id: string): void
}>()

const typeIconMap: Record<MessageType, Component> = {
  info: InfoCircleFilled,
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
  loading: LoadingOutlined,
}

const iconNode = computed(() => {
  if (props.item.args.icon) {
    return typeof props.item.args.icon === 'function'
      ? props.item.args.icon
      : () => props.item.args.icon
  }
  const type = props.item.args.type || 'info'
  return typeIconMap[type]
})

const itemClasses = computed(() => [
  'ant-message-notice',
  `ant-message-${props.item.args.type || 'info'}`,
  props.item.args.class,
])

// Auto-close timer
let timer: ReturnType<typeof setTimeout> | null = null

function startTimer() {
  const duration = props.item.args.duration ?? 3
  if (duration > 0) {
    timer = setTimeout(() => {
      emit('close', props.item.id)
    }, duration * 1000)
  }
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function handleClick(event: MouseEvent) {
  props.item.args.onClick?.(event)
}

onMounted(() => {
  startTimer()
})

watch(
  () => props.item.args,
  () => {
    clearTimer()
    startTimer()
  },
)

onBeforeUnmount(() => {
  clearTimer()
})
</script>
