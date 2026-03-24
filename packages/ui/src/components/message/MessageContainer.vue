<template>
  <div class="ant-message" :class="{ 'ant-message-rtl': rtl }" :style="containerStyle" :dir="rtl ? 'rtl' : undefined">
    <TransitionGroup name="ant-move-up" tag="div">
      <MessageItem
        v-for="item in messages"
        :key="item.id"
        :item="item"
        @close="onClose"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MessageItem from './MessageItem.vue'
import type { InternalMessageItem } from './types'

const props = defineProps<{
  messages: InternalMessageItem[]
  config: {
    top?: number | string
    rtl?: boolean
  }
}>()

const emit = defineEmits<{
  (e: 'close', id: string): void
}>()

const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.config.top != null) {
    style.top = typeof props.config.top === 'number' ? `${props.config.top}px` : props.config.top
  }
  return style
})

function onClose(id: string) {
  emit('close', id)
}

const rtl = computed(() => props.config.rtl === true)
</script>
