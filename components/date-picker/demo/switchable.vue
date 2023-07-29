<docs>
---
order: 1.1
title:
  zh-CN: 切换不同的选择器
  en-US: Switchable picker
---

## zh-CN

提供选择器，自由切换不同类型的日期选择器，常用于日期筛选场合。

## en-US

Switch in different types of pickers by Select.
</docs>
<template>
  <a-space direction="vertical" :size="12">
    <a-select v-model:value="type">
      <a-select-option value="time">Time</a-select-option>
      <a-select-option value="date">Date</a-select-option>
      <a-select-option value="week">Week</a-select-option>
      <a-select-option value="month">Month</a-select-option>
      <a-select-option value="quarter">Quarter</a-select-option>
      <a-select-option value="year">Year</a-select-option>
    </a-select>
    <template v-if="type === 'time'">
      <a-time-picker />
    </template>
    <template v-else>
      <a-date-picker :picker="type" />
    </template>
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const type = ref<any>('time');
</script>
