<template>
  <div :class="rootClass" role="group">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import type { ButtonGroupProps } from './types'
import { resolveSize, BUTTON_GROUP_KEY } from './types'

defineOptions({ name: 'AButtonGroup' })
const props = defineProps<ButtonGroupProps>()

const resolvedSize = computed(() => props.size ? resolveSize(props.size) : undefined)

provide(BUTTON_GROUP_KEY, { size: resolvedSize })

const rootClass = computed(() => ({
  'ant-btn-group': true,
  [`ant-btn-group-${resolvedSize.value}`]: !!resolvedSize.value,
}))
</script>
