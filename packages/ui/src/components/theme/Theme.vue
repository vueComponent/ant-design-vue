<template>
  <slot />
</template>

<script setup lang="ts">
import { themeProps } from './meta'
import { useThemeProvide } from './hook'
import { getCssVarColor } from '@/utils/colorAlgorithm'
import { watchEffect } from 'vue'

const props = defineProps(themeProps)

useThemeProvide(props)

const style = document.createElement('style')
watchEffect(() => {
  const cssVars = getCssVarColor(props.primaryColor, {
    appearance: props.appearance,
    backgroundColor: props.backgroundColor,
  })
  document.documentElement.classList.remove('light-theme', 'dark-theme')
  document.documentElement.classList.add(`${props.appearance}-theme`)
  style.textContent = `:root.${props.appearance}-theme {
    ${Object.entries(cssVars)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n')}
  }`
  document.head.appendChild(style)

  return () => {
    document.head.removeChild(style)
  }
})
</script>
