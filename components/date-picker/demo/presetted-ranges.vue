<docs>
---
order: 6
title:
  zh-CN: 预设范围
  en-US: Preset Ranges
---

## zh-CN

可以预设常用的日期范围以提高用户体验。

## en-US

We can set presetted ranges to RangePicker to improve user experience.

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <a-date-picker :presets="presets" @change="onChange" />
    <a-range-picker :presets="rangePresets" @change="onRangeChange" />
    <a-range-picker
      style="width: 400px"
      show-time
      format="YYYY/MM/DD HH:mm:ss"
      :presets="rangePresets"
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
const onRangeChange = (values: RangeValue, dateStrings: [string, string], currentPreset?: any) => {
  if (values) {
    console.log('From: ', values[0], ', to: ', values[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    if (currentPreset) {
      console.log('Selected preset key: ', currentPreset.key);
      console.log('Selected preset label: ', currentPreset.label);
    } else {
      console.log('Manual selection (no preset)');
    }
  } else {
    console.log('Clear');
  }
};

const presets = ref([
  { label: 'Yesterday', value: dayjs().add(-1, 'd'), key: 'yesterday' },
  { label: 'Last Week', value: dayjs().add(-7, 'd'), key: 'lastweek' },
  { label: 'Last Month', value: dayjs().add(-1, 'month'), key: 'lastmonth' },
]);

const rangePresets = ref([
  { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()], key: 'last7days' },
  { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()], key: 'last14days' },
  { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()], key: 'last30days' },
  { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()], key: 'last90days' },
]);
</script>
