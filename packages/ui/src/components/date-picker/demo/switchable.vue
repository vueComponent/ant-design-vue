<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 300px">
    <a-select v-model:value="type" style="width: 120px">
      <a-select-option value="time">Time</a-select-option>
      <a-select-option value="date">Date</a-select-option>
      <a-select-option value="week">Week</a-select-option>
      <a-select-option value="month">Month</a-select-option>
      <a-select-option value="quarter">Quarter</a-select-option>
      <a-select-option value="year">Year</a-select-option>
    </a-select>

    <a-time-picker v-if="type === 'time'" />
    <a-date-picker v-else :picker="type" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PickerMode } from '../types'

const type = ref<PickerMode | 'time'>('date')
</script>
