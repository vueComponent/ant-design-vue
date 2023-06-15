<docs>
---
order: 2
title:
  zh-CN: 12 小时制
  en-US: 12 hours
---

## zh-CN

12 小时制的时间选择器，默认的 format 为 `h:mm:ss a`。

## en-US

TimePicker of 12 hours format, with default format `h:mm:ss a`.

</docs>

<template>
  <a-space direction="vertical">
    <a-time-picker v-model:value="value" use12-hours />
    <a-time-picker v-model:value="value" use12-hours format="h:mm:ss A" style="width: 140px" />
    <a-time-picker v-model:value="value" use12-hours format="h:mm a" />
  </a-space>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Dayjs } from 'dayjs';
const value = ref<Dayjs>();
</script>
