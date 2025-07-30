<template>
  <slot />
</template>

<script setup lang="ts">
import { themeProps } from './meta'
import { useThemeProvide } from './hook'

const props = defineProps(themeProps)

useThemeProvide(props)
</script>
