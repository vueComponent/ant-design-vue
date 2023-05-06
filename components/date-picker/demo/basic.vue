<docs>
---
order: 0
title:
  zh-CN: 基本用法
  en-US: Basic Usage
---

## zh-CN

最简单的用法，在浮层中可以选择或者输入日期。

## en-US

Basic use case. Users can select or input a date in panel.

</docs>

<template>
  <a-space direction="vertical" :size="12">
    <a-date-picker v-model:value="value1" />
    <a-date-picker v-model:value="value2" picker="week" />
    <a-date-picker v-model:value="value3" picker="month" />
    <a-date-picker v-model:value="value4" picker="quarter" />
    <a-date-picker v-model:value="value5" picker="year" />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';
const value1 = ref<Dayjs>();
const value2 = ref<Dayjs>();
const value3 = ref<Dayjs>();
const value4 = ref<Dayjs>();
const value5 = ref<Dayjs>();
</script>
