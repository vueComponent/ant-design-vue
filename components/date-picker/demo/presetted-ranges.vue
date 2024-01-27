<docs>
---
order: 6
title:
  zh-CN: 预设范围
  en-US: Preset Ranges
---

## zh-CN

可以预设常用的日期范围以提高用户体验。自 `4.1.1` 开始，preset value 支持回调函数返回值方式。

## en-US

We can set presetted ranges to RangePicker to improve user experience. Since `4.1.1`, preset value supports callback function.

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <a-date-picker :presets="presets" @change="onChange" />
    <a-range-picker :presets="rangePresets" @change="onRangeChange" />
    <a-range-picker
      style="width: 400px"
      show-time
      format="YYYY/MM/DD HH:mm:ss"
      :presets="[
        {
          label: 'Now ~ Eod',
          value: () => [dayjs(), dayjs().endOf('day')], // 5.8.0+ support function
        },
        ...rangePresets,
      ]"
      @change="onRangeChange"
    />
  </a-space>
</template>
<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { ref } from 'vue';
type RangeValue = [Dayjs, Dayjs];
const onChange = (date: Dayjs) => {
  if (date) {
    console.log('Date: ', date);
  } else {
    console.log('Clear');
  }
};
const onRangeChange = (dates: RangeValue, dateStrings: string[]) => {
  if (dates) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  } else {
    console.log('Clear');
  }
};

const presets = ref([
  { label: 'Yesterday', value: dayjs().add(-1, 'd') },
  { label: 'Last Week', value: dayjs().add(-7, 'd') },
  { label: 'Last Month', value: dayjs().add(-1, 'month') },
]);

const rangePresets = ref([
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
]);
</script>
