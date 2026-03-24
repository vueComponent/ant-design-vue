<script setup lang="ts">
import { computed } from 'vue'
import type { CheckableTagProps, CheckableTagEmits, CheckableTagSlots } from './types'

defineOptions({ name: 'ACheckableTag' })
const props = defineProps<CheckableTagProps>()
const emit = defineEmits<CheckableTagEmits>()
defineSlots<CheckableTagSlots>()

const classes = computed(() => ({
  'ant-tag': true,
  'ant-tag-checkable': true,
  'ant-tag-checkable-checked': props.checked,
}))

function handleClick(e: MouseEvent) {
  emit('click', e)
  const newChecked = !props.checked
  emit('update:checked', newChecked)
  emit('change', newChecked)
}
</script>

<template>
  <span
    :class="classes"
    role="checkbox"
    :aria-checked="checked || false"
    tabindex="0"
    @click="handleClick"
    @keydown.enter.space.prevent="handleClick($event as unknown as MouseEvent)"
  >
    <slot />
  </span>
</template>
