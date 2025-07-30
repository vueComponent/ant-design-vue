<template>
  <button :class="rootClass" @click="handleClick" :disabled="disabled" :style="cssVars">
    <slot name="loading">
      <LoadingOutlined v-if="loading" />
    </slot>
    <slot name="icon"></slot>
    <span><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
import { computed, Fragment } from 'vue'
import { buttonProps, buttonEmits, ButtonSlots } from './meta'
import { getCssVarColor } from '@/utils/colorAlgorithm'
import { useThemeInject } from '../theme/hook'
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined'

const props = defineProps(buttonProps)

const emit = defineEmits(buttonEmits)
defineSlots<ButtonSlots>()

const theme = useThemeInject()

const color = computed(() => {
  if (props.color) {
    return props.color
  }

  if (props.danger) {
    return theme.dangerColor
  }

  return theme.primaryColor
})

const rootClass = computed(() => {
  return {
    'ant-btn': true,
    [`ant-btn-${props.variant}`]: true,
    [`ant-btn-${props.size}`]: true,
    'ant-btn-danger': props.danger,
    'ant-btn-loading': props.loading,
    'ant-btn-disabled': props.disabled,
    'ant-btn-custom-color': props.color || props.danger,
  }
})
const cssVars = computed(() => {
  return getCssVarColor(color.value)
})

const handleClick = (event: MouseEvent) => {
  emit('click', event)
  if (props.href) {
    window.open(props.href, props.target)
  }
}
</script>
