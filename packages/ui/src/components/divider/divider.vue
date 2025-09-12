<script setup lang="ts">
  import type { ComputedRef, CSSProperties } from 'vue'
  import { computed, shallowRef } from 'vue'
  import type { DividerProps, DividerSlots } from './meta'
  import { DividerDefaultProps } from './meta'

  type SizeType = 'small' | 'middle' | 'large' | undefined
  const props = withDefaults(defineProps<DividerProps>(), DividerDefaultProps)
  const slots = defineSlots<DividerSlots>()

  const prefixCls = props.prefixCls
  // 此处的direction应从config-provider中取，暂时写死
  const direction = shallowRef<'ltr' | 'rtl'>('ltr')
  const sizeClassNameMap: Record<string, string> = { small: 'sm', middle: 'md' }
  // 此函数后续应在config-provider下，暂时放在这里
  function useSize<T extends string | undefined | number | object>(customSize?: T | ((ctxSize: SizeType) => T)): ComputedRef<T> {
    // 此处的size应从config-provider中取，暂时写死
    const size = undefined
    return computed(() => {
      if (!customSize) {
        return size as T
      }
      if (typeof customSize === 'string') {
        return customSize ?? size
      }
      if (typeof customSize === 'function') {
        return customSize(size)
      }
      return size as T
    })
  }
  const sizeFullName = useSize(props.size)
  const sizeCls = computed(() => sizeClassNameMap[sizeFullName.value])
  const hasChildren = computed(() => !!slots.default)
  const mergedOrientation = computed(() => {
    if (props.orientation === 'left') {
      return direction.value === 'rtl' ? 'end' : 'start'
    }
    if (props.orientation === 'right') {
      return direction.value === 'rtl' ? 'start' : 'end'
    }
    return props.orientation
  })
  const hasMarginStart = computed(() => mergedOrientation.value === 'start' && props.orientationMargin !== null)

  const hasMarginEnd = computed(() => mergedOrientation.value === 'end' && props.orientationMargin !== null)
  const cls = computed(() => {
    return {
      [prefixCls]: true,
      [`${prefixCls}-${props.type}`]: true,
      [`${prefixCls}-with-text`]: hasChildren.value,
      [`${prefixCls}-with-text-${mergedOrientation.value}`]: hasChildren.value,
      [`${prefixCls}-dashed`]: !!props.dashed,
      [`${prefixCls}-${props.variant}`]: props.variant !== 'solid',
      [`${prefixCls}-plain`]: !!props.plain,
      [`${prefixCls}-rtl`]: direction.value === 'rtl',
      [`${prefixCls}-no-default-orientation-margin-start`]: hasMarginStart.value,
      [`${prefixCls}-no-default-orientation-margin-end`]: hasMarginEnd.value,
      [`${prefixCls}-${sizeCls.value}`]: !!sizeCls.value,
    }
  })
  const memoizedOrientationMargin = computed(() => {
    if (typeof props.orientationMargin === 'number') {
      return props.orientationMargin
    }
    if (/^\d+$/.test(props.orientationMargin!)) {
      return Number(props.orientationMargin)
    }
    return props.orientationMargin!
  })
  const innerStyle: CSSProperties = {
    marginInlineStart: hasMarginStart.value ? memoizedOrientationMargin.value : undefined,
    marginInlineEnd: hasMarginEnd.value ? memoizedOrientationMargin.value : undefined,
  }
</script>

<template>
  <div v-bind="$attrs" :class="[cls]" :style="[innerStyle]" role="separator">
    <template v-if="$slots.default && type !== 'vertical'">
      <span :class="[`${prefixCls}-inner-text`]" :style="innerStyle">
        <slot />
      </span>
    </template>
  </div>
</template>

<style scoped></style>
