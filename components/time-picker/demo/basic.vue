<docs>
---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

点击 TimePicker，然后可以在浮层中选择或者输入某一时间。

## en-US

Click `TimePicker`, and then we could select or input a time in panel.

</docs>

<template>
  <a-space direction="vertical">
    <a-time-picker v-model:value="value" />
    <a-time-picker v-model:value="strValue" value-format="HH:mm:ss" />
  </a-space>
</template>
<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';
import { ref, watch } from 'vue';
const value = ref<Dayjs>(dayjs('08:00:00', 'HH:mm:ss'));
const strValue = ref<string>('09:00:00');

watch(value, () => {
  console.log(value.value);
});
watch(strValue, () => {
  console.log(strValue.value);
});
</script>
