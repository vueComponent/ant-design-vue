<script setup lang="ts">
import { computed, useSlots, useAttrs, provide } from 'vue'
import type { SpaceCompactProps } from './types'
import { spaceCompactDefaultProps, filterEmpty, spaceCompactContextKey } from './types'
import { useConfigInject } from '@/hooks'
import CompactItem from './CompactItem.vue'

defineOptions({ name: 'ASpaceCompact', inheritAttrs: false })
const props = withDefaults(defineProps<SpaceCompactProps>(), spaceCompactDefaultProps)

const slots = useSlots()
const attrs = useAttrs()

// Provide context to mark we're inside a SpaceCompact (for nested detection)
provide(spaceCompactContextKey, true)

// Add RTL support
const { direction: rtlDirection } = useConfigInject()
const isRtl = computed(() => rtlDirection.value === 'rtl')

const classes = computed(() => ({
  'ant-space-compact': true,
  [`ant-space-compact-${props.direction}`]: true,
  'ant-space-compact-block': props.block,
  'ant-space-compact-rtl': isRtl.value,
  [`ant-space-compact-align-${props.align}`]: !!props.align,
}))

const validChildren = computed(() => filterEmpty(slots.default?.() || []))
</script>

<template>
  <div v-if="validChildren.length > 0" :class="[classes, attrs.class]" :style="attrs.style" role="group">
    <CompactItem
      v-for="(child, index) in validChildren"
      :key="child.key ?? index"
      :compact-size="props.size"
      :compact-direction="props.direction"
      :is-first-item="index === 0"
      :is-last-item="index === validChildren.length - 1"
    >
      <component :is="child" />
    </CompactItem>
  </div>
</template>
