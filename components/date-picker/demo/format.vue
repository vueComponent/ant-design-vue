<docs>
---
order: 1
title:
  zh-CN: 日期格式
  en-US: Date Format
---

## zh-CN

使用 `format` 属性，可以自定义日期显示格式。

## en-US

We can set the date format by `format`.

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <a-date-picker v-model:value="value1" :format="dateFormat" />
    <a-date-picker v-model:value="value2" :format="dateFormatList" />
    <a-date-picker v-model:value="value3" :format="monthFormat" picker="month" />
    <a-range-picker v-model:value="value4" :format="dateFormat" />
    <a-date-picker v-model:value="value5" :format="customFormat" />
    <a-date-picker v-model:value="value6" :format="customWeekStartEndFormat" picker="week" />
  </a-space>
</template>
<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { ref } from 'vue';
const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

const customWeekStartEndFormat = value =>
  `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
    .endOf('week')
    .format(weekFormat)}`;
const value1 = ref<Dayjs>(dayjs('2015/01/01', dateFormat));
const value2 = ref<Dayjs>(dayjs('01/01/2015', dateFormatList[0]));
const value3 = ref<Dayjs>(dayjs('2015/01', monthFormat));
const value4 = ref<[Dayjs, Dayjs]>([
  dayjs('2015/01/01', dateFormat),
  dayjs('2015/01/01', dateFormat),
]);
const value5 = ref<Dayjs>(dayjs('2015/01/01', dateFormat));
const value6 = ref<Dayjs>(dayjs());
const customFormat = value => `custom format: ${value.format(dateFormat)}`;
</script>
