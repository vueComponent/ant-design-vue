<script setup lang="ts">
import { computed, useSlots, useAttrs, type CSSProperties } from 'vue'
import type { SpaceProps, SpaceSlots, SpaceSize, SpaceSizePreset } from './types'
import { spaceDefaultProps, SPACE_SIZE_MAP, GLOBAL_SIZE_MAP, filterEmpty } from './types'
import { useConfigInject } from '@/hooks'

defineOptions({ name: 'ASpace', inheritAttrs: false })
const props = withDefaults(defineProps<SpaceProps>(), spaceDefaultProps)
defineSlots<SpaceSlots>()

const slots = useSlots()
const attrs = useAttrs()

// Support global size from ConfigProvider and RTL direction
const { size: globalSize, direction: rtlDirection } = useConfigInject()

function resolveSize(size: SpaceSize | undefined): number {
  if (size === undefined) return 0
  return typeof size === 'string' ? SPACE_SIZE_MAP[size as SpaceSizePreset] ?? 0 : size
}

// Merge prop size with global size (prop takes precedence)
const mergedSize = computed(() => {
  if (props.size !== undefined) return props.size
  const global = globalSize.value
  // Only inherit non-default ConfigProvider size (default 'md' should not override Space's 'small' default)
  if (typeof global === 'string' && global !== 'md' && global in GLOBAL_SIZE_MAP) {
    return GLOBAL_SIZE_MAP[global]!
  }
  return 'small'
})

const gap = computed(() => {
  const size = mergedSize.value
  if (Array.isArray(size)) {
    return [resolveSize(size[0]), resolveSize(size[1])] as [number, number]
  }
  const s = resolveSize(size as SpaceSize)
  return [s, s] as [number, number]
})

const hasSplit = computed(() => !!slots.split)

// Add RTL support
const isRtl = computed(() => rtlDirection.value === 'rtl')

const classes = computed(() => ({
  'ant-space': true,
  [`ant-space-${props.direction}`]: true,
  'ant-space-rtl': isRtl.value,
  'ant-space-align-center': !props.align && props.direction === 'horizontal',
  [`ant-space-align-${props.align}`]: !!props.align,
}))

const containerStyle = computed(() => {
  const [h, v] = gap.value
  const style: CSSProperties = {}

  if (!hasSplit.value) {
    style.columnGap = `${h}px`
    style.rowGap = `${v}px`
  }

  if (props.wrap) {
    style.flexWrap = 'wrap'
  }

  return style
})

const splitItemGap = computed(() => {
  const [h, v] = gap.value
  const style: CSSProperties = {
    columnGap: `${h / 2}px`,
    rowGap: `${v}px`,
  }
  if (props.wrap) {
    style.flexWrap = 'wrap'
  }
  return style
})

const validChildren = computed(() => filterEmpty(slots.default?.()))

// Return null if no children
const shouldRender = computed(() => validChildren.value.length > 0)
</script>

<template>
  <div
    v-if="shouldRender"
    :class="[classes, attrs.class]"
    :style="[hasSplit ? splitItemGap : containerStyle, attrs.style as CSSProperties]"
  >
    <template v-if="hasSplit">
      <template v-for="(child, index) in validChildren" :key="child.key ?? index">
        <div class="ant-space-item">
          <component :is="child" />
        </div>
        <span
          v-if="index < validChildren.length - 1"
          class="ant-space-item-split"
        >
          <slot name="split" />
        </span>
      </template>
    </template>
    <slot v-else />
  </div>
</template>
