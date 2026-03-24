<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Dayjs } from 'dayjs'

defineOptions({ name: 'ATimeRangePicker', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    value?: [Dayjs, Dayjs] | null
    placeholder?: [string, string]
    format?: string
    disabled?: boolean
    bordered?: boolean
    size?: 'sm' | 'md' | 'lg'
    placement?: string
    allowClear?: boolean
    use12Hours?: boolean
    hourStep?: number
    minuteStep?: number
    secondStep?: number
    separator?: string
    order?: boolean
  }>(),
  {
    placeholder: () => ['Start time', 'End time'],
    bordered: true,
    allowClear: true,
    separator: '~',
    order: true,
  },
)

const emit = defineEmits<{
  (e: 'update:value', val: [Dayjs, Dayjs] | null): void
  (e: 'change', val: [Dayjs, Dayjs] | null, timeStrings: [string, string]): void
}>()

const startValue = computed(() => props.value?.[0] ?? null)
const endValue = computed(() => props.value?.[1] ?? null)

function handleStartChange(val: Dayjs | null) {
  const newVal: [Dayjs, Dayjs] | null =
    val && endValue.value ? [val, endValue.value] : val ? [val, val] : null
  emit('update:value', newVal)
}

function handleEndChange(val: Dayjs | null) {
  const newVal: [Dayjs, Dayjs] | null =
    startValue.value && val ? [startValue.value, val] : val ? [val, val] : null
  emit('update:value', newVal)
}

const wrapperClass = computed(() => ({
  'ant-picker-range': true,
  'ant-picker-borderless': !props.bordered,
  [`ant-picker-${props.size}`]: !!props.size,
}))
</script>

<template>
  <div :class="wrapperClass" v-bind="$attrs" style="display: inline-flex; align-items: center; gap: 8px;">
    <a-time-picker
      :value="startValue"
      :placeholder="placeholder[0]"
      :format="format"
      :disabled="disabled"
      :bordered="bordered"
      :size="size"
      :placement="placement"
      :allow-clear="allowClear"
      :use12-hours="use12Hours"
      :hour-step="hourStep"
      :minute-step="minuteStep"
      :second-step="secondStep"
      @update:value="handleStartChange"
    />
    <span class="ant-picker-separator">{{ separator }}</span>
    <a-time-picker
      :value="endValue"
      :placeholder="placeholder[1]"
      :format="format"
      :disabled="disabled"
      :bordered="bordered"
      :size="size"
      :placement="placement"
      :allow-clear="allowClear"
      :use12-hours="use12Hours"
      :hour-step="hourStep"
      :minute-step="minuteStep"
      :second-step="secondStep"
      @update:value="handleEndChange"
    />
  </div>
</template>
