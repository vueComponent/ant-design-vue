<script setup lang="ts">
import { computed, inject } from 'vue'
import type { CSSProperties } from 'vue'
import type { ColProps, ColSize, ColSpanType } from './types'
import { rowContextKey } from './types'
import { useBreakpoint, responsiveArray } from '@/hooks'
import type { Breakpoint } from '@/hooks'

defineOptions({ name: 'ACol' })
const props = defineProps<ColProps>()
const screens = useBreakpoint()
const rowContext = inject(rowContextKey, null)

/** Normalize responsive prop: number → { span: n }, object → as-is */
function normalizeSize(val: ColSpanType | ColSize | undefined): ColSize | undefined {
  if (val == null) return undefined
  if (typeof val === 'object') return val
  return { span: val }
}

/** Resolve the active responsive overrides (largest matching breakpoint wins) */
const activeSize = computed<ColSize>(() => {
  for (const bp of responsiveArray) {
    if (screens.value[bp]) {
      const val = normalizeSize(props[bp])
      if (val) return val
    }
  }
  return {}
})

const resolvedSpan = computed(() => activeSize.value.span ?? props.span)
const resolvedOffset = computed(() => activeSize.value.offset ?? props.offset ?? 0)
const resolvedPush = computed(() => activeSize.value.push ?? props.push ?? 0)
const resolvedPull = computed(() => activeSize.value.pull ?? props.pull ?? 0)
const resolvedOrder = computed(() => activeSize.value.order ?? props.order)

function parseFlex(flex: number | string): string {
  if (typeof flex === 'number') return `${flex} ${flex} auto`
  // If it looks like a CSS dimension (e.g. "100px", "30%"), treat as fixed basis
  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) return `0 0 ${flex}`
  return flex
}

const colStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  const span = Number(resolvedSpan.value)
  const offset = Number(resolvedOffset.value)
  const push = Number(resolvedPush.value)
  const pull = Number(resolvedPull.value)

  // Flex
  if (props.flex) {
    style.flex = parseFlex(props.flex)
  } else if (!isNaN(span)) {
    if (span === 0) {
      style.display = 'none'
    } else {
      const pct = `${(span / 24) * 100}%`
      style.flex = `0 0 ${pct}`
      style.maxWidth = pct
    }
  }

  // Offset
  if (offset > 0) {
    style.marginInlineStart = `${(offset / 24) * 100}%`
  }

  // Push / Pull (position-based reordering)
  if (push > 0) {
    style.insetInlineStart = `${(push / 24) * 100}%`
  }
  if (pull > 0) {
    style.insetInlineEnd = `${(pull / 24) * 100}%`
  }

  // Order
  if (resolvedOrder.value != null) {
    style.order = Number(resolvedOrder.value)
  }

  // Gutter padding from Row context
  if (rowContext) {
    const [h] = rowContext.gutter.value
    if (h > 0) {
      style.paddingLeft = `${h / 2}px`
      style.paddingRight = `${h / 2}px`
    }
  }

  return style
})
</script>

<template>
  <div class="ant-col" :style="colStyle">
    <slot />
  </div>
</template>
