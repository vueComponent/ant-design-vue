<template>
  <button class="ant-btn" :class="classes" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buttonProps, buttonEmits, ButtonSlots } from './meta'

const props = defineProps(buttonProps)

defineEmits(buttonEmits)
defineSlots<ButtonSlots>()

const classes = computed(() => {
  return [
    'rounded-md px-4 py-2 cursor-pointer',
    props.type,
    {
      'bg-primary text-primary-content': props.type === 'primary',
      'bg-secondary text-secondary-content': props.type === 'secondary',
    },
  ]
})
</script>
