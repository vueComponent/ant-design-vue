<docs>
---
order: 3
title:
  zh-CN: 禁用
  en-US: Disabled
---

## zh-CN

禁用时间选择。

## en-US

A disabled state of the `TimePicker`.

</docs>

<template>
  <a-time-picker :value="dayjs('12:08:23', 'HH:mm:ss')" disabled />
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
</script>
