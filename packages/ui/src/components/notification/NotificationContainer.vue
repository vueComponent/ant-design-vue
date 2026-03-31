<template>
  <div :class="containerClasses" :style="containerStyle">
    <TransitionGroup :name="transitionName">
      <NotificationItem
        v-for="item in state.items"
        :key="item.id"
        :item="item"
        @close="$emit('close', $event)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NotificationItem from './NotificationItem.vue'
import type { InternalNotificationItem, NotificationPlacement } from './types'

const props = defineProps<{
  state: {
    items: InternalNotificationItem[]
    placement: NotificationPlacement
    top?: number | string
    bottom?: number | string
    rtl?: boolean
  }
}>()

defineEmits<{
  (e: 'close', id: string): void
}>()

const containerClasses = computed(() => [
  'ant-notification',
  `ant-notification-${props.state.placement}`,
  props.state.rtl ? 'ant-notification-rtl' : '',
])

const transitionName = computed(() => {
  const p = props.state.placement
  if (p.includes('Left') || p === 'top' || p === 'bottom') {
    return p.includes('bottom') ? 'ant-move-up' : 'ant-move-down'
  }
  return p.includes('bottom') ? 'ant-move-up' : 'ant-move-down'
})

const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  const p = props.state.placement
  const topVal = props.state.top ?? 24
  const bottomVal = props.state.bottom ?? 24

  if (p.includes('top') || p === 'top') {
    style.top = typeof topVal === 'number' ? `${topVal}px` : topVal
  }
  if (p.includes('bottom') || p === 'bottom') {
    style.bottom = typeof bottomVal === 'number' ? `${bottomVal}px` : bottomVal
  }

  return style
})
</script>
