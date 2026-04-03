<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import CloseOutlined from '@ant-design/icons-vue/CloseOutlined'
import type { TagProps, TagEmits, TagSlots } from './types'
import { tagDefaultProps, isPresetColor, isPresetStatusColor } from './types'

defineOptions({ name: 'ATag' })
const props = withDefaults(defineProps<TagProps>(), tagDefaultProps)
const emit = defineEmits<TagEmits>()
defineSlots<TagSlots>()

const visible = ref(true)

watchEffect(() => {
  if (props.visible !== undefined) {
    visible.value = props.visible
  }
})

const isPreset = computed(() => isPresetColor(props.color))
const isStatus = computed(() => isPresetStatusColor(props.color))
const isCustomColor = computed(() => props.color && !isPreset.value && !isStatus.value)

const classes = computed(() => ({
  'ant-tag': true,
  [`ant-tag-${props.color}`]: isPreset.value || isStatus.value,
  'ant-tag-has-color': isCustomColor.value,
  'ant-tag-borderless': !props.bordered,
  'ant-tag-hidden': !visible.value,
}))

const customStyle = computed(() => {
  if (!isCustomColor.value) return undefined
  return {
    backgroundColor: props.color,
  }
})

function handleClose(e: MouseEvent) {
  emit('close', e)
  if (!e.defaultPrevented) {
    emit('update:visible', false)
    if (props.visible === undefined) {
      visible.value = false
    }
  }
}

function handleClick(e: MouseEvent) {
  emit('click', e)
}
</script>

<template>
  <span :class="classes" :style="customStyle" @click="handleClick">
    <slot name="icon" />
    <span v-if="$slots.icon && $slots.default"><slot /></span>
    <template v-else><slot /></template>
    <button v-if="closable" type="button" class="ant-tag-close-icon" aria-label="Remove tag" @click.stop="handleClose">
      <slot name="closeIcon">
        <CloseOutlined />
      </slot>
    </button>
  </span>
</template>
