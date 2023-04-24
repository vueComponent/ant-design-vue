<docs>
---
order: 3
title:
  zh-CN: 禁用
  en-US: Disabled
---

## zh-CN

选择框的不可用状态。

## en-US

A disabled state of the `DatePicker`.

</docs>

<template>
  <a-space direction="vertical">
    <a-date-picker v-model:value="value1" />
    <a-date-picker v-model:value="value2" disabled picker="month" />
    <a-range-picker v-model:value="value3" disabled />
    <a-range-picker v-model:value="value4" :disabled="[false, true]" />
  </a-space>
</template>
<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { ref } from 'vue';
const dateFormat = 'YYYY-MM-DD';
const value1 = ref<Dayjs>(dayjs('2015-06-06', dateFormat));
const value2 = ref<Dayjs>(dayjs('2015-06', 'YYYY-MM'));
const value3 = ref<[Dayjs, Dayjs]>([
  dayjs('2015-06-06', dateFormat),
  dayjs('2015-06-06', dateFormat),
]);
const value4 = ref<[Dayjs, Dayjs]>([
  dayjs('2019-09-03', dateFormat),
  dayjs('2019-11-22', dateFormat),
]);
</script>
