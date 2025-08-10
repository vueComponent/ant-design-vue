<template>
  <button
    ref="buttonRef"
    :class="rootClass"
    @click="handleClick"
    :disabled="disabled"
    :style="cssVars"
  >
    <Wave :target="buttonRef" />
    <slot name="loading">
      <LoadingOutlined v-if="loading" />
    </slot>
    <slot name="icon"></slot>
    <span><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ButtonSlots, ButtonProps, ButtonEmits, buttonDefaultProps } from './meta'
import { getCssVarColor } from '@/utils/colorAlgorithm'
import { useThemeInject } from '../theme/hook'
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined'
import { defaultColor } from '../theme/meta'
import { Wave } from '../wave'

const props = withDefaults(defineProps<ButtonProps>(), buttonDefaultProps)
const buttonRef = ref<HTMLButtonElement | null>(null)
const emit = defineEmits<ButtonEmits>()
defineSlots<ButtonSlots>()

const theme = useThemeInject()

const color = computed(() => {
  if (props.color) {
    return props.color
  }

  if (props.danger) {
    return 'red'
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
  return color.value.toLowerCase() !== defaultColor.toLowerCase()
    ? getCssVarColor(color.value, {
        appearance: theme.appearance,
        backgroundColor: theme.backgroundColor,
      })
    : {}
})

const handleClick = (event: MouseEvent) => {
  emit('click', event)
  if (props.href !== undefined && props.href !== null) {
    window.open(props.href, props.target)
  }
}
</script>
