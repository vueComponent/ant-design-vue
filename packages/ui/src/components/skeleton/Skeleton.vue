<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { SkeletonProps, SkeletonAvatarProps, SkeletonTitleProps, SkeletonParagraphProps } from './types'
import { skeletonDefaultProps } from './types'

defineOptions({ name: 'ASkeleton' })
const props = withDefaults(defineProps<SkeletonProps>(), {
  loading: true,
  avatar: undefined,
  title: undefined,
  paragraph: undefined,
  active: false,
  round: false,
})
const slots = useSlots()

const hasChildren = computed(() => !!slots.default)

// Normalize avatar config (default: false)
const avatarConfig = computed<SkeletonAvatarProps | null>(() => {
  const avatar = props.avatar ?? false
  if (!avatar) return null
  if (avatar === true) return { size: 'default', shape: 'circle' }
  return { size: 'default', shape: 'circle', ...avatar }
})

// Normalize title config (default: true)
const titleConfig = computed<SkeletonTitleProps | null>(() => {
  const title = props.title ?? true
  if (!title) return null
  if (title === true) return {}
  return title
})

// Normalize paragraph config (default: true)
const paragraphConfig = computed<SkeletonParagraphProps | null>(() => {
  const paragraph = props.paragraph ?? true
  if (!paragraph) return null
  if (paragraph === true) return { rows: props.avatar ? 2 : 3 }
  return { rows: props.avatar ? 2 : 3, ...paragraph }
})

const titleWidth = computed(() => {
  if (!titleConfig.value) return undefined
  if (titleConfig.value.width != null) {
    return typeof titleConfig.value.width === 'number'
      ? `${titleConfig.value.width}px`
      : titleConfig.value.width
  }
  // Default: no paragraph = 38%, otherwise undefined (full width)
  if (!paragraphConfig.value) return '38%'
  return undefined
})

function getRowWidth(index: number, totalRows: number): string | undefined {
  if (!paragraphConfig.value?.width) {
    // Default: last row is 61%
    return index === totalRows - 1 ? '61%' : undefined
  }
  const w = paragraphConfig.value.width
  if (Array.isArray(w)) {
    return w[index] != null
      ? (typeof w[index] === 'number' ? `${w[index]}px` : String(w[index]))
      : undefined
  }
  // Single value applies to last row only
  return index === totalRows - 1
    ? (typeof w === 'number' ? `${w}px` : w)
    : undefined
}

const avatarSizeStyle = computed(() => {
  if (!avatarConfig.value) return undefined
  const s = avatarConfig.value.size
  if (typeof s === 'number') return { width: `${s}px`, height: `${s}px` }
  return undefined
})

const classes = computed(() => ({
  'ant-skeleton': true,
  'ant-skeleton-active': props.active,
  'ant-skeleton-with-avatar': !!avatarConfig.value,
  'ant-skeleton-round': props.round,
}))
</script>

<template>
  <div v-if="loading" :class="classes" role="status" aria-busy="true" aria-label="Loading content">
    <div v-if="avatarConfig" class="ant-skeleton-header">
      <span
        class="ant-skeleton-avatar"
        :class="{
          'ant-skeleton-avatar-lg': avatarConfig.size === 'large',
          'ant-skeleton-avatar-sm': avatarConfig.size === 'small',
          'ant-skeleton-avatar-circle': avatarConfig.shape === 'circle',
          'ant-skeleton-avatar-square': avatarConfig.shape === 'square',
        }"
        :style="avatarSizeStyle"
      />
    </div>
    <div class="ant-skeleton-content">
      <h3
        v-if="titleConfig"
        class="ant-skeleton-title"
        :style="titleWidth ? { width: titleWidth } : undefined"
      />
      <ul v-if="paragraphConfig" class="ant-skeleton-paragraph">
        <li
          v-for="i in (paragraphConfig.rows || 3)"
          :key="i"
          :style="getRowWidth(i - 1, paragraphConfig.rows || 3) ? { width: getRowWidth(i - 1, paragraphConfig.rows || 3) } : undefined"
        />
      </ul>
    </div>
  </div>
  <slot v-else />
</template>
