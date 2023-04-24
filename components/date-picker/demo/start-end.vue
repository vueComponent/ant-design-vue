<docs>
---
order: 11
title:
  zh-CN: 自定义日期范围选择
  en-US: Customized Range Picker
---

## zh-CN

当 `RangePicker` 无法满足业务需求时，可以使用两个 `DatePicker` 实现类似的功能。
> - 通过设置 `disabledDate` 方法，来约束开始和结束日期。
> - 通过 `open` `openChange` 来优化交互。

## en-US

When `RangePicker` does not satisfied your requirements, try to implement similar functionality with two `DatePicker`.
> - Use the `disabledDate` property to limit the start and end dates.
> - Improve user experience with `open` and `openChange`.

</docs>

<template>
  <a-space direction="vertical">
    <a-date-picker
      v-model:value="startValue"
      :disabled-date="disabledStartDate"
      show-time
      format="YYYY-MM-DD HH:mm:ss"
      placeholder="Start"
      @openChange="handleStartOpenChange"
    />
    <a-date-picker
      v-model:value="endValue"
      :disabled-date="disabledEndDate"
      show-time
      format="YYYY-MM-DD HH:mm:ss"
      placeholder="End"
      :open="endOpen"
      @openChange="handleEndOpenChange"
    />
  </a-space>
</template>
<script lang="ts" setup>
import { Dayjs } from 'dayjs';
import { ref, watch } from 'vue';
const startValue = ref<Dayjs>();
const endValue = ref<Dayjs>();
const endOpen = ref<boolean>(false);

const disabledStartDate = (startValue: Dayjs) => {
  if (!startValue || !endValue.value) {
    return false;
  }

  return startValue.valueOf() > endValue.value.valueOf();
};

const disabledEndDate = (endValue: Dayjs) => {
  if (!endValue || !startValue.value) {
    return false;
  }

  return startValue.value.valueOf() >= endValue.valueOf();
};

const handleStartOpenChange = (open: boolean) => {
  if (!open) {
    endOpen.value = true;
  }
};

const handleEndOpenChange = (open: boolean) => {
  endOpen.value = open;
};

watch(startValue, () => {
  console.log('startValue', startValue.value);
});

watch(endValue, () => {
  console.log('endValue', endValue.value);
});
</script>
