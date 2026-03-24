<template>
  <div style="max-width: 300px">
    <a-range-picker
      :value="displayValue"
      :disabled-date="disabledDate"
      @change="onChange"
      @openChange="onOpenChange"
      @calendarChange="onCalendarChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Dayjs } from 'dayjs'
import type { RangeValue } from '../types'

const dates = ref<Dayjs[]>([])
const value = ref<RangeValue>()
const hackValue = ref<RangeValue>()

const displayValue = computed(() => hackValue.value || value.value)

function disabledDate(current: Dayjs): boolean {
  if (!dates.value || dates.value.length === 0) {
    return false
  }
  const tooLate = dates.value[0] && current.diff(dates.value[0], 'days') > 7
  const tooEarly = dates.value[1] && dates.value[1].diff(current, 'days') > 7
  return !!tooEarly || !!tooLate
}

function onOpenChange(open: boolean) {
  if (open) {
    dates.value = []
    hackValue.value = undefined
  } else {
    hackValue.value = undefined
  }
}

function onChange(val: RangeValue) {
  value.value = val
}

function onCalendarChange(val: [Dayjs | null, Dayjs | null]) {
  dates.value = val.filter((d): d is Dayjs => d != null)
}
</script>
