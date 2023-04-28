<docs>
---
order: 1
title:
  zh-CN: 范围选择器
  en-US: Range Picker
---

## zh-CN

通过设置 `picker` 属性，指定范围选择器类型。

## en-US

Set range picker type by `picker` prop.

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <a-range-picker v-model:value="value1" />
    <a-range-picker v-model:value="value2" show-time />
    <a-range-picker v-model:value="value3" picker="week" />
    <a-range-picker v-model:value="value4" picker="month" />
    <a-range-picker v-model:value="value5" picker="year" />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';
type RangeValue = [Dayjs, Dayjs];
const value1 = ref<RangeValue>();
const value2 = ref<RangeValue>();
const value3 = ref<RangeValue>();
const value4 = ref<RangeValue>();
const value5 = ref<RangeValue>();
</script>
