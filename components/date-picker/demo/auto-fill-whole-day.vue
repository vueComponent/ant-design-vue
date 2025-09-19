<docs>
---
order: 7
title:
  zh-CN: 自动填充和整天模式
  en-US: Auto Fill and Whole Day Mode
---

## zh-CN

RangePicker 支持两个新功能：
1. `autoFill`：双击日期时自动设置为开始和结束日期
2. `isWholeDay`：在 showTime 模式下，自动设置开始时间为 00:00:00，结束时间为 23:59:59

## en-US

RangePicker supports two new features:
1. `autoFill`: Double-click a date to automatically set it as both start and end date
2. `isWholeDay`: In showTime mode, automatically set start time to 00:00:00 and end time to 23:59:59

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <div>
      <h4>Auto Fill 功能</h4>
      <p>双击日期会自动设置为开始和结束日期</p>
      <a-range-picker :auto-fill="true" @change="onAutoFillChange" />
    </div>

    <div>
      <h4>Whole Day 功能</h4>
      <p>在 showTime 模式下，自动设置整天时间</p>
      <a-range-picker
        show-time
        :is-whole-day="true"
        format="YYYY/MM/DD HH:mm:ss"
        @change="onWholeDayChange"
      />
    </div>

    <div>
      <h4>组合使用</h4>
      <p>同时启用 autoFill 和 isWholeDay</p>
      <a-range-picker
        show-time
        :auto-fill="true"
        :is-whole-day="true"
        format="YYYY/MM/DD HH:mm:ss"
        @change="onCombinedChange"
      />
    </div>
  </a-space>
</template>

<script lang="ts" setup>
import { Dayjs } from 'dayjs';

type RangeValue = [Dayjs, Dayjs];

const onAutoFillChange = (
  values: RangeValue,
  dateStrings: [string, string],
  currentPreset?: any,
) => {
  if (values) {
    console.log(
      'Auto Fill - From: ',
      values[0].format('YYYY-MM-DD'),
      ', to: ',
      values[1].format('YYYY-MM-DD'),
    );
    console.log('Auto Fill - From: ', dateStrings[0], ', to: ', dateStrings[1]);
    if (currentPreset) {
      console.log('Auto Fill - Selected preset: ', currentPreset.label);
    }
  } else {
    console.log('Auto Fill - Clear');
  }
};

const onWholeDayChange = (
  values: RangeValue,
  dateStrings: [string, string],
  currentPreset?: any,
) => {
  if (values && values[0] && values[1]) {
    console.log(
      'Whole Day - From: ',
      values[0].format('YYYY-MM-DD HH:mm:ss'),
      ', to: ',
      values[1].format('YYYY-MM-DD HH:mm:ss'),
    );
    console.log('Whole Day - From: ', dateStrings[0], ', to: ', dateStrings[1]);
    if (currentPreset) {
      console.log('Whole Day - Selected preset: ', currentPreset.label);
    }
  } else {
    console.log('Whole Day - Clear');
  }
};

const onCombinedChange = (
  values: RangeValue,
  dateStrings: [string, string],
  currentPreset?: any,
) => {
  if (values && values[0] && values[1]) {
    console.log(
      'Combined - From: ',
      values[0].format('YYYY-MM-DD HH:mm:ss'),
      ', to: ',
      values[1].format('YYYY-MM-DD HH:mm:ss'),
    );
    console.log('Combined - From: ', dateStrings[0], ', to: ', dateStrings[1]);
    if (currentPreset) {
      console.log('Combined - Selected preset: ', currentPreset.label);
    }
  } else {
    console.log('Combined - Clear');
  }
};
</script>
