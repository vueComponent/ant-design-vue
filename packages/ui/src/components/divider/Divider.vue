<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { type DividerProps, type DividerSlots, dividerDefaultProps } from './types'

defineOptions({ name: 'ADivider' })
const props = withDefaults(defineProps<DividerProps>(), dividerDefaultProps)
defineSlots<DividerSlots>()
const slots = useSlots()

const hasContent = computed(() => !!slots.default)
const hasCustomMarginLeft = computed(
  () => hasContent.value && props.orientation === 'left' && props.orientationMargin != null,
)
const hasCustomMarginRight = computed(
  () => hasContent.value && props.orientation === 'right' && props.orientationMargin != null,
)

const classes = computed(() => ({
  'ant-divider': true,
  [`ant-divider-${props.type}`]: true,
  'ant-divider-dashed': props.dashed,
  'ant-divider-plain': props.plain,
  'ant-divider-with-text': hasContent.value,
  [`ant-divider-with-text-${props.orientation}`]: hasContent.value,
  'ant-divider-no-default-orientation-margin-left': hasCustomMarginLeft.value,
  'ant-divider-no-default-orientation-margin-right': hasCustomMarginRight.value,
}))

const innerStyle = computed(() => {
  if (!hasContent.value || props.orientationMargin == null) return undefined

  const margin =
    typeof props.orientationMargin === 'number'
      ? `${props.orientationMargin}px`
      : props.orientationMargin

  if (props.orientation === 'left') return { marginLeft: margin }
  if (props.orientation === 'right') return { marginRight: margin }
  return undefined
})
</script>

<template>
  <div :class="classes" role="separator" :aria-orientation="type">
    <span
      v-if="hasContent"
      class="ant-divider-inner-text"
      :style="innerStyle"
    >
      <slot />
    </span>
  </div>
</template>
