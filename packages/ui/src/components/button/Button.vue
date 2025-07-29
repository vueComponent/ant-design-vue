<template>
  <button :class="rootClass" @click="$emit('click', $event)" :disabled="disabled" :style="cssVars">
    <slot name="loading"></slot>
    <slot name="icon"></slot>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buttonProps, buttonEmits, ButtonSlots } from './meta'
import { getCssVarColor } from '@/utils/colorAlgorithm'

const props = defineProps(buttonProps)

defineEmits(buttonEmits)
defineSlots<ButtonSlots>()

// todo: color value should from theme provider
const color = computed(() => {
  if (props.disabled) {
    return 'rgba(0,0,0,0.25)'
  }
  if (props.color) {
    return props.color
  }
  if (props.danger) {
    return '#ff4d4f'
  }
  if (props.variant === 'text') {
    return '#000000'
  }

  return '#1677ff'
})

const rootClass = computed(() => {
  return {
    'ant-btn': true,
    [`ant-btn-${props.variant}`]: true,
    [`ant-btn-${props.size}`]: true,
    'ant-btn-danger': props.danger,
    'ant-btn-loading': props.loading,
    'ant-btn-disabled': props.disabled,
  }
})
const cssVars = computed(() => {
  return getCssVarColor(color.value)
})
</script>
