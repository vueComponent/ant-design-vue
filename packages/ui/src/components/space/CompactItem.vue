<script setup lang="ts">
import { provide, inject, computed } from 'vue'
import { spaceCompactItemContextKey, spaceCompactContextKey } from './types'
import type { SizeType, SpaceCompactItemContext } from './types'

const props = defineProps<{
  compactSize?: SizeType
  compactDirection?: 'horizontal' | 'vertical'
  isFirstItem: boolean
  isLastItem: boolean
}>()

// Detect if we're inside a nested SpaceCompact
const hasParentCompact = inject(spaceCompactContextKey, false)

// If nested, inherit isFirstItem/isLastItem from parent context
const parentContext = inject<SpaceCompactItemContext | undefined>(spaceCompactItemContextKey, undefined)

// Use parent's isFirstItem/isLastItem if nested, otherwise use own props
const resolvedIsFirstItem = computed(() =>
  hasParentCompact && parentContext ? parentContext.isFirstItem : props.isFirstItem,
)
const resolvedIsLastItem = computed(() =>
  hasParentCompact && parentContext ? parentContext.isLastItem : props.isLastItem,
)

// Provide context for child components (Button, Input, Select etc.)
provide(spaceCompactItemContextKey, {
  get compactSize() {
    return props.compactSize
  },
  get compactDirection() {
    return props.compactDirection
  },
  get isFirstItem() {
    return resolvedIsFirstItem.value
  },
  get isLastItem() {
    return resolvedIsLastItem.value
  },
})
</script>

<template>
  <div class="ant-space-compact-item">
    <slot />
  </div>
</template>
