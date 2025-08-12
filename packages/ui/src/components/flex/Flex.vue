<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import { computed, withDefaults } from 'vue'
  import { type FlexProps, flexDefaultProps } from './meta'
  import { isPresetSize } from '@/utils/gapSize'
  import createFlexClassNames from './utils'

  defineOptions({ name: 'AFlex' })
  const props = withDefaults(defineProps<FlexProps>(), flexDefaultProps)

  const mergedCls = computed(() => [
    createFlexClassNames(props.prefixCls, props),
    {
      'ant-flex': true,
      'ant-flex-vertical': props.vertical,
      'ant-flex-rtl': false,
      [`ant-flex-gap-${props.gap}`]: isPresetSize(props.gap),
    }
  ])

  const mergedStyle = computed(() => {
    const style: CSSProperties = {}
    
    if (props.flex) {
      style.flex = props.flex
    }

    if (props.gap && !isPresetSize(props.gap)) {
      style.gap = `${props.gap}px`
    }

    return style
  })
</script>

<template>
  <component :is="componentTag" :class="[$attrs.class, mergedCls]" :style="[$attrs.style, mergedStyle]" v-bind="$attrs">
    <slot />
  </component>
</template>

<style scoped></style>
