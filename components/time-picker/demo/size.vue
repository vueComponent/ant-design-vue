<docs>
---
order: 6
title:
  zh-CN: 三种大小
  en-US: Three Sizes
---

## zh-CN

三种大小的输入框，大的用在表单中，中的为默认。

## en-US

The input box comes in three sizes. large is used in the form, while the medium size is the default.

</docs>

<template>
  <a-space direction="vertical">
    <a-time-picker v-model:value="value1" size="large" />
    <a-time-picker v-model:value="value2" />
    <a-time-picker v-model:value="value3" size="small" />
  </a-space>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { ref } from 'vue';
const value1 = ref(dayjs('12:08:23', 'HH:mm'));
const value2 = ref(dayjs('12:08:23', 'HH:mm'));
const value3 = ref(dayjs('12:08:23', 'HH:mm'));
</script>
