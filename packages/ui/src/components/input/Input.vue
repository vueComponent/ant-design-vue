<template>
  <input
    class="ant-input"
    :class="classes"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { inputProps, inputEmits, InputSlots } from './meta'

const props = defineProps(inputProps)

defineEmits(inputEmits)
defineSlots<InputSlots>()

const classes = computed(() => {
  return [
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
    {
      'border-red-500': props.status === 'error',
      'border-yellow-500': props.status === 'warning',
    },
  ]
})
</script>
